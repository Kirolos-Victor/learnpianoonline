<?php

namespace App\Http\Controllers;

use App\Services\StripeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Show subscription page with pricing calculation
     */
    public function showSubscription(Request $request)
    {
        $user = $request->user();
        $studentSlug = $request->query('student');

        // Get all students for this user (not assigned students for instructors)
        $allStudents = $user->students()->get();

        // Separate unsubscribed and subscribed students
        $unsubscribedStudents = $allStudents->where('is_subscribed', false);
        $subscribedStudents = $allStudents->where('is_subscribed', true);

        // Always show all unsubscribed students for bulk subscription capability
        $availableStudents = $unsubscribedStudents;
        $isSingleStudent = false;

        // If student slug is provided, verify the student exists, belongs to user, and is unsubscribed
        $selectedStudent = null;
        if ($studentSlug) {
            $selectedStudent = \App\Models\Student::findBySlugForUser($studentSlug, $user->id);

            if (!$selectedStudent) {
                return redirect()->route('parent.students')->with('error', 'Student not found or access denied');
            }

            if ($selectedStudent->is_subscribed) {
                return redirect()->route('parent.students')->with('error', 'Student is already subscribed');
            }
        }

        // Generate pricing data for all possible combinations (1 to 5 students)
        $pricingData = [];
        for ($i = 1; $i <= min(count($availableStudents), 5); $i++) {
            $pricingData[] = [
                'student_count' => $i,
                'monthly_amount' => $this->stripeService->calculateSubscriptionAmount($i, 'monthly') / 100,
                'yearly_amount' => $this->stripeService->calculateSubscriptionAmount($i, 'yearly') / 100,
                'students' => $availableStudents->take($i)->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                    ];
                }),
            ];
        }

        return Inertia::render('parent/Subscription', [
            'pricingData' => $pricingData,
            'availableStudents' => $availableStudents->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'age' => $student->age,
                    'is_subscribed' => $student->is_subscribed,
                ];
            }),
            'subscribedStudents' => $subscribedStudents->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'age' => $student->age,
                    'is_subscribed' => $student->is_subscribed,
                    'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                    'sessions_remaining' => $student->sessions_remaining,
                ];
            }),
            'isSingleStudent' => $isSingleStudent,
            'selectedStudentSlug' => $studentSlug,
        ]);
    }

    /**
     * Create Stripe checkout session
     */
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'exists:students,id',
            'subscription_type' => 'required|string|in:monthly,yearly',
        ]);

        $user = $request->user();

        // Verify that all students belong to this user
        $studentIds = $request->input('student_ids');
        $subscriptionType = $request->input('subscription_type', 'monthly');
        $userStudents = $user->students()->whereIn('id', $studentIds)->pluck('id')->toArray();

        if (count($userStudents) !== count($studentIds)) {
            return response()->json(['error' => 'Invalid student selection'], 400);
        }

        try {
            $session = $this->stripeService->createCheckoutSession($user, $studentIds, $subscriptionType);

            return response()->json([
                'session_id' => $session->id,
                'checkout_url' => $session->url,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create checkout session'], 500);
        }
    }

    /**
     * Handle successful payment
     */
    public function success(Request $request)
    {
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return redirect()->route('parent.dashboard')->with('error', 'Invalid payment session');
        }

        try {
            $subscription = $this->stripeService->handleSuccessfulPayment($sessionId);

            return Inertia::render('parent/PaymentSuccess', [
                'subscription' => [
                    'id' => $subscription->id,
                    'amount' => $subscription->amount,
                    'student_count' => $subscription->student_count,
                    'paid_at' => $subscription->paid_at,
                ],
            ]);
        } catch (\Exception $e) {
            return redirect()->route('parent.dashboard')->with('error', 'Payment verification failed');
        }
    }

    /**
     * Handle failed payment
     */
    public function failed(Request $request)
    {
        $sessionId = $request->query('session_id');

        if ($sessionId) {
            try {
                $this->stripeService->handleFailedPayment($sessionId);
            } catch (\Exception $e) {
                // Log error but don't fail the request
            }
        }

        return Inertia::render('parent/PaymentFailed');
    }

    /**
     * Webhook to handle Stripe events
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->stripeService->handleSuccessfulPayment($session->id);
                break;

            case 'checkout.session.expired':
                $session = $event->data->object;
                $this->stripeService->handleFailedPayment($session->id);
                break;
        }

        return response()->json(['status' => 'success']);
    }
}
