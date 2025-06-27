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
    public function calculateSubscriptionAmount(int $studentCount): float
    {
        $basePrice = (float) env('SUBSCRIBE_PRICE', 100);
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

        return round($totalAmount, 2);
    }

    /**
     * Create Stripe checkout session
     */
    public function createCheckoutSession(User $user, array $studentIds): Session
    {
        $studentCount = count($studentIds);
        $amount = $this->calculateSubscriptionAmount($studentCount);

        // Create subscription record
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'student_count' => $studentCount,
            'status' => 'pending',
            'student_ids' => $studentIds,
        ]);

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => "Piano Lessons Subscription - {$studentCount} Student(s)",
                            'description' => "Subscription for {$studentCount} student(s) with progressive discounts",
                        ],
                        'unit_amount' => (int) ($amount * 100), // Convert to cents
                    ],
                    'quantity' => 1,
                ],
            ],
            'mode' => 'payment',
            'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('payment.failed') . '?session_id={CHECKOUT_SESSION_ID}',
            'metadata' => [
                'subscription_id' => $subscription->id,
                'user_id' => $user->id,
                'student_count' => $studentCount,
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
                    $student->update([
                        'is_subscribed' => true,
                        'subscription_expires_at' => now()->addYear(), // 1 year subscription
                        'sessions_remaining' => 12, // 12 sessions per year
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
                'amount' => $this->calculateSubscriptionAmount($i),
                'base_price' => env('SUBSCRIBE_PRICE', 100),
                'discount_percentage' => $discountPercentage,
            ];
        }
        return $results;
    }
}
