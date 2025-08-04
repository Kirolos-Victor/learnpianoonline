<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $studentSlug = $request->query('selectedStudentSlug');
        $studentSlugs = $request->query('selectedStudentSlugs'); // For bulk selection

        // Get all students for this user
        $allStudents = $user->students()->get();

        // Separate unsubscribed and subscribed students for display purposes
        $unsubscribedStudents = $allStudents->where('is_subscribed', false);
        $subscribedStudents = $allStudents->where('is_subscribed', true);

        // Only show unsubscribed students for new subscriptions
        $availableStudents = $unsubscribedStudents;
        $isSingleStudent = false;

        // Handle single student selection
        $selectedStudent = null;
        if ($studentSlug) {
            $selectedStudent = \App\Models\Student::findBySlugForUser($studentSlug, $user->id);

            if (!$selectedStudent) {
                return redirect()->route('parent.students')->with('error', 'Student not found or access denied');
            }

            // Allow subscription extension - no need to check if already subscribed
        }

        // Handle multiple student selection (bulk)
        $selectedStudentSlugs = null;
        if ($studentSlugs) {
            $slugsArray = explode(',', $studentSlugs);
            $selectedStudents = $allStudents->whereIn('slug', $slugsArray);

            if ($selectedStudents->isEmpty()) {
                return redirect()->route('parent.students')->with('error', 'No valid students found');
            }

            $selectedStudentSlugs = $studentSlugs; // Pass the original comma-separated string
        }

        // Generate pricing data for all possible combinations (1 to 5 students)
        $pricingData = [];
        $maxStudents = min(count($availableStudents), 5);
        $maxStudents = max($maxStudents, 1); // Ensure at least 1 for demo purposes

        for ($i = 1; $i <= $maxStudents; $i++) {
            try {
                $monthlyAmount = $this->stripeService->calculateSubscriptionAmount($i, 'monthly');
                $yearlyAmount = $this->stripeService->calculateSubscriptionAmount($i, 'yearly');

                // Convert from cents to dollars for display
                $monthlyAmount = $monthlyAmount / 100;
                $yearlyAmount = $yearlyAmount / 100;
            } catch (\Exception $e) {
                // Fallback pricing if calculation fails
                $baseMonthly = 29.99; // $29.99
                $baseYearly = 299.99; // $299.99
                $discount = 0.10; // 10%

                $monthlyAmount = $baseMonthly * $i * (1 - ($i > 1 ? $discount : 0));
                $yearlyAmount = $baseYearly * $i * (1 - ($i > 1 ? $discount : 0));
            }

            $pricingData[] = [
                'student_count' => $i,
                'monthly_amount' => $monthlyAmount,
                'yearly_amount' => $yearlyAmount,
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
            })->values(),
            'subscribedStudents' => $subscribedStudents->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'age' => $student->age,
                    'is_subscribed' => $student->is_subscribed,
                    'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                    'sessions_remaining' => $student->sessions_remaining,
                ];
            })->values(),
            'isSingleStudent' => $isSingleStudent,
            'selectedStudentSlug' => $studentSlug,
            'selectedStudentSlugs' => $selectedStudentSlugs,
        ]);
    }
}
