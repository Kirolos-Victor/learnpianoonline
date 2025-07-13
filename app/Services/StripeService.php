<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeService
{
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
        $studentCount = count($studentIds);
        $amountInCents = $this->calculateSubscriptionAmount($studentCount, $subscriptionType);

        // Create subscription record (store amount in dollars)
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'amount' => $amountInCents / 100,
            'student_count' => $studentCount,
            'subscription_type' => $subscriptionType,
            'status' => 'pending',
            'student_ids' => $studentIds,
        ]);

        $planDescription = $subscriptionType === 'yearly'
            ? "Yearly subscription for {$studentCount} student(s) with progressive discounts"
            : "Monthly subscription for {$studentCount} student(s) with progressive discounts";

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

        return $session;
    }

    /**
     * Handle successful payment
     */
    public function handleSuccessfulPayment(string $sessionId): Subscription
    {
        $session = Session::retrieve($sessionId);

        $subscription = Subscription::where('stripe_session_id', $sessionId)->firstOrFail();

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
                    $subscriptionEndDate = $isYearly ? now()->addYear() : now()->addMonth();

                    // Update student subscription data
                    $student->update([
                        'is_subscribed' => true,
                        'subscription_expires_at' => $subscriptionEndDate,
                        'sessions_remaining' => $isYearly ? 48 : 4, // 48 sessions per year (4 per month) or 4 per month
                    ]);

                    // Attach student to subscription
                    $subscription->students()->attach($studentId);
                }
            }
        }

        return $subscription;
    }

    /**
     * Handle failed payment
     */
    public function handleFailedPayment(string $sessionId): Subscription
    {
        $subscription = Subscription::where('stripe_session_id', $sessionId)->firstOrFail();

        $subscription->update([
            'status' => 'failed',
        ]);

        return $subscription;
    }

    /**
     * Test method to verify pricing calculation
     * This can be removed in production
     */
    public function testPricingCalculation(): array
    {
        $results = [];
        $discountPercentage = (float) env('DISCOUNT_PERCENTAGE', 10);

        for ($i = 1; $i <= 5; $i++) {
            $results[] = [
                'student_count' => $i,
                'monthly_amount' => $this->calculateSubscriptionAmount($i, 'monthly'),
                'yearly_amount' => $this->calculateSubscriptionAmount($i, 'yearly'),
                'monthly_base_price' => env('MONTHLY_SUBSCRIBE_PRICE', env('SUBSCRIBE_PRICE', 29.99)),
                'yearly_base_price' => env('YEARLY_SUBSCRIBE_PRICE', 299.99),
                'discount_percentage' => $discountPercentage,
            ];
        }
        return $results;
    }
}
