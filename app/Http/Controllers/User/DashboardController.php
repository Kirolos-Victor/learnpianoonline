<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $user = Auth::user();
        $selectedStudentSlug = $request->query('studentSlug');

        // Get only basic student information for the dropdown
        $students = Student::where('user_id', $user->id)
            ->with(['instructor'])
            ->get()
            ->map(function ($student) {
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
            });

        // Get data for selected student or first student
        $selectedStudentData = null;
        $currentStudentSlug = null;

        if ($selectedStudentSlug && $students->where('slug', $selectedStudentSlug)->count() > 0) {
            $currentStudentSlug = $selectedStudentSlug;
            $selectedStudentData = $this->getStudentDataBySlug($selectedStudentSlug);
        } elseif ($students->count() > 0) {
            $firstStudent = $students->first();
            $currentStudentSlug = $firstStudent['slug'];
            $selectedStudentData = $this->getStudentDataBySlug($currentStudentSlug);
        }

        return Inertia::render('parent/Home', [
            'students' => $students,
            'selectedStudentData' => $selectedStudentData,
            'selectedStudentSlug' => $currentStudentSlug,
        ]);
    }

    /**
     * Get detailed data for a specific student by slug
     */
    public function getStudentDataBySlug(string $studentSlug)
    {
        $user = Auth::user();

        // Verify the student belongs to the authenticated user
        $student = Student::where('slug', $studentSlug)
            ->where('user_id', $user->id)
            ->with(['instructor'])
            ->firstOrFail();

        return $this->getStudentData($student);
    }

    /**
     * Get detailed data for a specific student
     */
    public function getStudentData(Student $student)
    {
        // Get sessions for this student
        $sessions = StudentSession::where('student_id', $student->id)
            ->with(['instructor'])
            ->orderBy('scheduled_at', 'desc')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => $this->generateSessionTitle($session),
                    'instructor' => $session->instructor->name,
                    'date' => $session->scheduled_at->format('F j, Y'),
                    'time' => $session->scheduled_at->format('g:i A'),
                    'status' => $session->status,
                    'type' => 'private', // Assuming all sessions are private for now
                    'scheduledAt' => $session->scheduled_at->toISOString(),
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
     * Handle student data requests via Inertia
     */
    public function fetchStudentData(Request $request, Student $student)
    {
        $user = Auth::user();

        // Verify the student belongs to the authenticated user
        if ($student->user_id !== $user->id) {
            abort(403, 'Unauthorized access to student data');
        }

        $selectedStudentData = $this->getStudentData($student);

        // Return the same page structure with updated student data
        return Inertia::render('parent/Home', [
            'students' => Student::where('user_id', $user->id)
                ->with(['instructor'])
                ->get()
                ->map(function ($student) {
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
            'selectedStudentData' => $selectedStudentData,
            'selectedStudentSlug' => $student->slug,
        ]);
    }

    /**
     * Generate a session title based on session data
     */
    private function generateSessionTitle(StudentSession $session): string
    {
        // Generate session title based on session number
        $sessionNumber = $session->id;
        return "Session #{$sessionNumber}";
    }
}
