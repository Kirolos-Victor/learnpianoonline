<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class StripeService
{
    /**
     * Note: This service uses cumulative subscription management:
     * - "Monthly" subscriptions = 30 days exactly
     * - "Yearly" subscriptions = 360 days exactly (12 * 30)
     * - Multiple subscriptions are cumulative (30 days + 30 days = 60 days total)
     * - Always creates new subscription records for full billing history
     * - Extends existing subscription time rather than replacing it
     * This ensures consistent billing and complete transaction history.
     */

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Calculate subscription amount with discounts
     */
    public function calculateSubscriptionAmount(int $studentCount, string $subscriptionType = 'monthly'): int
    {
        $basePrice = $subscriptionType === 'yearly'
            ? (float) env('YEARLY_SUBSCRIBE_PRICE', 299.99)
            : (float) env('MONTHLY_SUBSCRIBE_PRICE', env('SUBSCRIBE_PRICE', 29.99));

        $discountPercentage = (float) env('DISCOUNT_PERCENTAGE', 10);
        $totalAmount = 0;

        for ($i = 1; $i <= $studentCount; $i++) {
            if ($i === 1) {
                // First student pays full price
                $totalAmount += $basePrice;
            } else {
                // Additional students get fixed discount percentage
                $discountedPrice = $basePrice * (1 - ($discountPercentage / 100));
                $totalAmount += $discountedPrice;
            }
        }

        // Return amount in cents
        return round($totalAmount * 100);
    }

    /**
     * Calculate monthly subscription amount with discounts (legacy method)
     */
    public function calculateMonthlySubscriptionAmount(int $studentCount): float
    {
        return $this->calculateSubscriptionAmount($studentCount, 'monthly');
    }

    /**
     * Calculate yearly subscription amount with discounts
     */
    public function calculateYearlySubscriptionAmount(int $studentCount): float
    {
        return $this->calculateSubscriptionAmount($studentCount, 'yearly');
    }

    /**
     * Create Stripe checkout session
     */
    public function createCheckoutSession(User $user, array $studentIds, string $subscriptionType = 'monthly'): Session
    {
        try {
            // Validate student ownership (allow both subscribed and unsubscribed students)
            $validStudentIds = $user->students()
                ->whereIn('id', $studentIds)
                ->pluck('id')->toArray();

            if (count($validStudentIds) !== count($studentIds)) {
                throw new \Exception('Invalid student selection or students do not belong to this user');
            }

            $studentCount = count($validStudentIds);
            $amountInCents = $this->calculateSubscriptionAmount($studentCount, $subscriptionType);

            // Use database transaction to ensure data consistency
            return DB::transaction(function () use ($user, $validStudentIds, $subscriptionType, $studentCount, $amountInCents) {
                // Create subscription record (store amount in dollars)
                $subscription = Subscription::create([
                    'user_id' => $user->id,
                    'amount' => $amountInCents / 100,
                    'student_count' => $studentCount,
                    'subscription_type' => $subscriptionType,
                    'status' => 'pending',
                    'student_ids' => $validStudentIds,
                ]);

                $planDescription = $subscriptionType === 'yearly'
                    ? "360-day subscription for {$studentCount} student(s) with progressive discounts"
                    : "30-day subscription for {$studentCount} student(s) with progressive discounts";

                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [
                        [
                            'price_data' => [
                                'currency' => 'usd',
                                'product_data' => [
                                    'name' => "Piano Sessions " . ucfirst($subscriptionType) . " Subscription - {$studentCount} Student(s)",
                                    'description' => $planDescription,
                                ],
                                'unit_amount' => $amountInCents, // Already in cents
                            ],
                            'quantity' => 1,
                        ],
                    ],
                    'mode' => 'payment',
                    'success_url' => route('parent.payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => route('parent.payment.failed') . '?session_id={CHECKOUT_SESSION_ID}',
                    'metadata' => [
                        'subscription_id' => $subscription->id,
                        'user_id' => $user->id,
                        'student_count' => $studentCount,
                        'subscription_type' => $subscriptionType,
                    ],
                ]);

                // Update subscription with session ID
                $subscription->update([
                    'stripe_session_id' => $session->id,
                ]);

                Log::info('Stripe checkout session created', [
                    'subscription_id' => $subscription->id,
                    'session_id' => $session->id,
                    'user_id' => $user->id,
                    'student_count' => $studentCount,
                    'amount' => $amountInCents / 100,
                ]);

                return $session;
            });
        } catch (\Exception $e) {
            Log::error('Failed to create Stripe checkout session', [
                'user_id' => $user->id,
                'student_ids' => $studentIds,
                'subscription_type' => $subscriptionType,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Handle successful payment
     */
    public function handleSuccessfulPayment(string $sessionId): Subscription
    {
        try {
            $session = Session::retrieve($sessionId);

            $subscription = Subscription::where('stripe_session_id', $sessionId)->firstOrFail();

            // Check if already processed
            if ($subscription->status === 'completed') {
                Log::info('Payment already processed', ['session_id' => $sessionId]);
                return $subscription;
            }

            return DB::transaction(function () use ($subscription, $session, $sessionId) {
                $subscription->update([
                    'status' => 'completed',
                    'stripe_payment_intent_id' => $session->payment_intent,
                    'paid_at' => now(),
                ]);

                // Update students' subscription status
                if ($subscription->student_ids) {
                    foreach ($subscription->student_ids as $studentId) {
                        $student = \App\Models\Student::find($studentId);
                        if ($student) {
                            $isYearly = $subscription->subscription_type === 'yearly';
                            $daysToAdd = $isYearly ? 360 : 30;
                            $sessionsToAdd = $isYearly ? 48 : 4;

                            // Calculate cumulative subscription end date
                            $currentExpiration = $student->subscription_expires_at;
                            $baseDate = $currentExpiration && $currentExpiration->isFuture()
                                ? $currentExpiration
                                : now();

                            $newSubscriptionEndDate = $baseDate->copy()->addDays($daysToAdd);

                            // Update student subscription data (cumulative)
                            $student->update([
                                'is_subscribed' => true,
                                'subscription_expires_at' => $newSubscriptionEndDate,
                                'sessions_remaining' => $student->sessions_remaining + $sessionsToAdd,
                            ]);

                            // Create student sessions based on subscription type
                            $this->createStudentSessions($student, $sessionsToAdd, $subscription->subscription_type);

                            // Attach student to subscription with timestamp
                            $subscription->students()->attach($studentId, ['created_at' => now()]);

                            Log::info('Student subscription extended/activated', [
                                'student_id' => $studentId,
                                'student_name' => $student->name,
                                'subscription_id' => $subscription->id,
                                'sessions_added' => $sessionsToAdd,
                                'total_sessions_remaining' => $student->sessions_remaining,
                                'expires_at' => $newSubscriptionEndDate,
                                'previous_expiration' => $currentExpiration?->format('Y-m-d H:i:s'),
                                'is_extension' => $currentExpiration && $currentExpiration->isFuture(),
                            ]);
                        }
                    }
                }

                Log::info('Payment processed successfully', [
                    'subscription_id' => $subscription->id,
                    'session_id' => $sessionId,
                    'amount' => $subscription->amount,
                    'student_count' => $subscription->student_count,
                ]);

                return $subscription;
            });
        } catch (\Exception $e) {
            Log::error('Failed to handle successful payment', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Create student sessions for a newly subscribed student
     */
    private function createStudentSessions(\App\Models\Student $student, int $sessionCount, string $subscriptionType): void
    {
        try {
            $sessions = [];
            $startDate = now()->addWeek(); // Start sessions one week from now

            // Calculate session frequency based on subscription type
            if ($subscriptionType === 'yearly') {
                // 48 sessions per 360 days = ~1 session per week
                $intervalDays = 7;
            } else {
                // 4 sessions per 30 days = ~1 session per week
                $intervalDays = 7;
            }

            for ($i = 0; $i < $sessionCount; $i++) {
                $scheduledAt = $startDate->copy()->addDays($i * $intervalDays);

                // Schedule sessions on weekdays (Monday to Friday) between 9 AM and 6 PM
                $scheduledAt = $this->adjustToWeekday($scheduledAt);

                $sessions[] = [
                    'student_id' => $student->id,
                    'instructor_id' => null, // Will be assigned by admin later
                    'scheduled_at' => $scheduledAt,
                    'status' => 'pending',
                    'notes' => 'Session created from subscription - instructor to be assigned',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert all sessions in batches
            \App\Models\StudentSession::insert($sessions);

            Log::info('Student sessions created', [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'session_count' => $sessionCount,
                'subscription_type' => $subscriptionType,
                'first_session_date' => $startDate->format('Y-m-d'),
                'last_session_date' => $startDate->addDays(($sessionCount - 1) * $intervalDays)->format('Y-m-d'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create student sessions', [
                'student_id' => $student->id,
                'session_count' => $sessionCount,
                'subscription_type' => $subscriptionType,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Adjust date to fall on a weekday and within business hours
     */
    private function adjustToWeekday(\Carbon\Carbon $date): \Carbon\Carbon
    {
        // If it's weekend, move to next Monday
        if ($date->isWeekend()) {
            $date->next('Monday');
        }

        // Set time to a reasonable hour (2 PM as default)
        $date->setTime(14, 0, 0);

        return $date;
    }

    /**
     * Handle failed payment
     */
    public function handleFailedPayment(string $sessionId): Subscription
    {
        try {
            $subscription = Subscription::where('stripe_session_id', $sessionId)->firstOrFail();

            $subscription->update([
                'status' => 'failed',
            ]);

            Log::info('Payment marked as failed', [
                'subscription_id' => $subscription->id,
                'session_id' => $sessionId,
            ]);

            return $subscription;
        } catch (\Exception $e) {
            Log::error('Failed to handle failed payment', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
