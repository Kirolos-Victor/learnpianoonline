<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionsController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $user = auth()->user();
        $students = $user->students()->with(['instructor'])->get();

        if ($students->isEmpty()) {
            return Inertia::render('student/Sessions', [
                'students' => [],
                'selectedStudent' => null,
                'sessions' => [],
                'selectedMonth' => now()->format('Y-m'),
                'availableMonths' => [],
                'subscribePrice' => (float) env('MONTHLY_SUBSCRIBE_PRICE', 29.99),
            ]);
        }

        // Get selected student slug from request or default to first student
        $selectedStudentSlug = $request->input('student', $students->first()->slug);
        $selectedMonth = $request->input('month', now()->format('Y-m'));

        // Find the selected student
        $selectedStudent = $students->firstWhere('slug', $selectedStudentSlug);
        if (! $selectedStudent) {
            $selectedStudent = $students->first();
        }

        // Get current student's slug for navigation
        $currentStudentSlug = $request->input('current_student', $selectedStudent->slug);

        // Get sessions data for the selected student
        $selectedStudentData = $this->getStudentSessionsDataBySlug($selectedStudentSlug, $selectedMonth);

        // If no data for selected student, try current student
        if (empty($selectedStudentData)) {
            $selectedStudentData = $this->getStudentSessionsDataBySlug($currentStudentSlug, $selectedMonth);
        }

        return Inertia::render('student/Sessions', [
            'students' => $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'age' => $student->age,
                    'hasPiano' => $student->has_piano,
                    'isSubscribed' => $student->is_subscribed,
                    'subscriptionType' => $student->subscription_expires_at ?
                        ($student->subscription_expires_at->diffInDays(now()) > 30 ? 'yearly' : 'monthly') : null,
                    'subscriptionEndDate' => $student->subscription_expires_at?->format('Y-m-d'),
                    'sessionsRemaining' => $student->sessions_remaining,
                    'instructor' => $student->instructor ? [
                        'id' => $student->instructor->id,
                        'name' => $student->instructor->name,
                    ] : null,
                ];
            }),
            'selectedStudent' => $selectedStudent ? [
                'id' => $selectedStudent->id,
                'name' => $selectedStudent->name,
                'slug' => $selectedStudent->slug,
                'age' => $selectedStudent->age,
                'hasPiano' => $selectedStudent->has_piano,
                'isSubscribed' => $selectedStudent->is_subscribed,
                'subscriptionType' => $selectedStudent->subscription_expires_at ?
                    ($selectedStudent->subscription_expires_at->diffInDays(now()) > 30 ? 'yearly' : 'monthly') : null,
                'subscriptionEndDate' => $selectedStudent->subscription_expires_at?->format('Y-m-d'),
                'sessionsRemaining' => $selectedStudent->sessions_remaining,
                'instructor' => $selectedStudent->instructor ? [
                    'id' => $selectedStudent->instructor->id,
                    'name' => $selectedStudent->instructor->name,
                ] : null,
            ] : null,
            'sessions' => $selectedStudentData,
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $this->generateAvailableMonths(),
            'subscribePrice' => (float) env('MONTHLY_SUBSCRIBE_PRICE', 29.99),
        ]);
    }

    /**
     * Get sessions data for a specific student and month by slug
     */
    public function getStudentSessionsDataBySlug(string $studentSlug, string $month): array
    {
        $student = Student::where('slug', $studentSlug)
            ->where('user_id', auth()->id())
            ->first();

        if (! $student) {
            return [];
        }

        return $this->getStudentSessionsData($student, $month);
    }

    /**
     * Get sessions data for a specific student and month
     */
    public function getStudentSessionsData(Student $student, string $month): array
    {
        // Parse the month string to get start and end dates
        $monthDate = Carbon::createFromFormat('F Y', $month);
        $startOfMonth = $monthDate->copy()->startOfMonth();
        $endOfMonth = $monthDate->copy()->endOfMonth();

        // Get sessions for this student in the specified month
        $sessions = StudentSession::where('student_id', $student->id)
            ->whereBetween('scheduled_at', [$startOfMonth, $endOfMonth])
            ->with(['instructor'])
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($session, $index) {
                return [
                    'id' => $session->id,
                    'sessionNumber' => $index + 1, // Sequential session number for the month
                    'instructor' => $session->instructor->name,
                    'date' => $session->scheduled_at->format('F j, Y'),
                    'time' => $session->scheduled_at->format('g:i A'),
                    'duration' => '60 min', // Assuming all sessions are 60 minutes
                    'status' => $session->status,
                    'type' => 'private', // Assuming all sessions are private
                ];
            });

        return [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'slug' => $student->slug,
                'age' => $student->age,
                'hasPiano' => $student->has_piano,
                'isSubscribed' => $student->is_subscribed,
                'subscriptionType' => $student->subscription_expires_at ?
                    ($student->subscription_expires_at->diffInDays(now()) > 30 ? 'yearly' : 'monthly') : null,
                'subscriptionEndDate' => $student->subscription_expires_at?->format('Y-m-d'),
                'sessionsRemaining' => $student->sessions_remaining,
                'instructor' => $student->instructor ? [
                    'id' => $student->instructor->id,
                    'name' => $student->instructor->name,
                ] : null,
            ],
            'sessions' => $sessions,
        ];
    }

    /**
     * Fetch sessions for a specific student (AJAX endpoint)
     */
    public function fetchStudentSessions(Request $request, Student $student)
    {
        // Check if the student belongs to the authenticated user
        if ($student->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to student sessions');
        }

        $selectedMonth = $request->input('month', now()->format('F Y'));

        $selectedStudentData = $this->getStudentSessionsData($student, $selectedMonth);

        return Inertia::render('student/Sessions', [
            'student' => $selectedStudentData['student'],
            'sessions' => $selectedStudentData['sessions'],
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $this->generateAvailableMonths(),
            'subscribePrice' => (float) env('MONTHLY_SUBSCRIBE_PRICE', 29.99),
        ]);
    }

    /**
     * Generate available months for filtering
     */
    private function generateAvailableMonths(): array
    {
        $months = [];
        $currentDate = Carbon::now();

        // Add last 6 months
        for ($i = 6; $i >= 1; $i--) {
            $months[] = $currentDate->copy()->subMonths($i)->format('F Y');
        }

        // Add current month
        $months[] = $currentDate->format('F Y');

        // Add next 2 months
        for ($i = 1; $i <= 2; $i++) {
            $months[] = $currentDate->copy()->addMonths($i)->format('F Y');
        }

        return $months;
    }
}
