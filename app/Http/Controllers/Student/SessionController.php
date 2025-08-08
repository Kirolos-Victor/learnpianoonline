<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index(Request $request, Student $student): \Inertia\Response
    {
        // Check if the student belongs to the authenticated user
        if ($student->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to student sessions');
        }

        // Get selected month from request or default to current month
        $selectedMonth = $request->input('month', now()->format('Y-m'));

        // Load student with instructor, user (parent), and sessions
        $student->load(['instructor', 'user', 'studentSessions.instructor']);

        // Get sessions data for this specific student
        $sessionsData = $this->getStudentSessionsData($student, $selectedMonth);

        return Inertia::render('student/Sessions', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'slug' => $student->slug,
                'sessions_remaining' => $student->sessions_remaining,
                'is_subscribed' => $student->is_subscribed,
                'instructor' => $student->instructor ? [
                    'id' => $student->instructor->id,
                    'name' => $student->instructor->name,
                ] : null,
                'day_of_week' => $student->day_of_week,
            ],
            'sessions' => $sessionsData,
            'selectedMonth' => $selectedMonth,
            'availableYears' => $this->getAvailableYears($student),
            'availableMonths' => $this->getAvailableMonths(),
        ]);
    }

    /**
     * Get sessions data for a specific student and month
     */
    private function getStudentSessionsData(Student $student, string $month): array
    {
        // Parse month (format: YYYY-MM)
        $year = substr($month, 0, 4);
        $monthNum = substr($month, 5, 2);

        // Get parent's timezone for conversion
        $parentTimezone = $student->user->timezone ?? 'UTC';

        // Get sessions for this student in the specified month
        $sessions = StudentSession::where('student_id', $student->id)
            ->whereYear('scheduled_at', $year)
            ->whereMonth('scheduled_at', $monthNum)
            ->with(['instructor'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($session, $index) use ($parentTimezone) {
                // Convert scheduled time to parent's timezone
                $scheduledInParentTimezone = $session->scheduled_at->setTimezone($parentTimezone);

                // Convert completed time to parent's timezone if exists
                $completedInParentTimezone = $session->completed_at
                    ? $session->completed_at->setTimezone($parentTimezone)
                    : null;

                return [
                    'id' => $session->id,
                    'sessionNumber' => $index + 1, // Sequential session number for the month
                    'instructor' => $session->instructor ? [
                        'id' => $session->instructor->id,
                        'name' => $session->instructor->name,
                    ] : null,
                    'scheduled_at' => $session->scheduled_at->toISOString(),
                    'scheduled_date' => $scheduledInParentTimezone->format('F j, Y'),
                    'scheduled_time' => $scheduledInParentTimezone->format('g:i A'),
                    'scheduled_day' => $scheduledInParentTimezone->format('l'),
                    'completed_at' => $completedInParentTimezone ? $completedInParentTimezone->toISOString() : null,
                    'completed_date' => $completedInParentTimezone ? $completedInParentTimezone->format('F j, Y') : null,
                    'completed_time' => $completedInParentTimezone ? $completedInParentTimezone->format('g:i A') : null,
                    'duration' => '60 min', // Assuming all sessions are 60 minutes
                    'status' => $session->status,
                    'notes' => $session->notes,
                    'screenshot_path' => $session->screenshot_path,
                    'type' => 'private', // Assuming all sessions are private
                    'is_completed' => $session->status === 'completed',
                    'is_pending' => $session->status === 'pending',
                    'is_cancelled' => $session->status === 'cancelled',
                    'is_missed' => $session->status === 'missed',
                ];
            });

        return $sessions->toArray();
    }

    /**
     * Generate available years for filtering (from student creation to current year)
     */
    private function getAvailableYears(Student $student): array
    {
        $years = [];
        $currentYear = Carbon::now()->year;
        $studentCreatedYear = $student->created_at->year;

        // Start from student creation year, go to current year
        for ($year = $studentCreatedYear; $year <= $currentYear; $year++) {
            $years[] = $year;
        }

        return $years;
    }

    /**
     * Generate available months for filtering (all 12 months)
     */
    private function getAvailableMonths(): array
    {
        $months = [];

        // All 12 months
        for ($month = 1; $month <= 12; $month++) {
            $months[] = [
                'value' => str_pad($month, 2, '0', STR_PAD_LEFT),
                'label' => Carbon::create()->month($month)->format('F'),
            ];
        }

        return $months;
    }
}
