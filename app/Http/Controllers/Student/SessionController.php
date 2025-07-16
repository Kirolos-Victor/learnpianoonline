<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentSessionController extends Controller
{
    public function index(Request $request, Student $student): \Inertia\Response
    {
        // Check if the student belongs to the authenticated user
        if ($student->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to student sessions');
        }

        // Get selected month from request or default to current month
        $selectedMonth = $request->input('month', now()->format('Y-m'));

        // Load student with instructor and sessions
        $student->load(['instructor', 'studentSessions.instructor', 'studentSessions.homework']);

        // Get sessions data for this specific student
        $sessionsData = $this->getStudentSessionsData($student, $selectedMonth);

        return Inertia::render('student/Sessions', [
            'student' => $student,
            'sessions' => $sessionsData,
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $this->getAvailableMonths($student),
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

        // Get sessions for this student in the specified month
        $sessions = StudentSession::where('student_id', $student->id)
            ->whereYear('scheduled_at', $year)
            ->whereMonth('scheduled_at', $monthNum)
            ->with(['instructor', 'homework'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($session, $index) {
                return [
                    'id' => $session->id,
                    'sessionNumber' => $index + 1, // Sequential session number for the month
                    'instructor' => $session->instructor->name ?? 'Not assigned',
                    'date' => $session->scheduled_at->format('F j, Y'),
                    'time' => $session->scheduled_at->format('g:i A'),
                    'duration' => '60 min', // Assuming all sessions are 60 minutes
                    'status' => $session->status,
                    'type' => 'private', // Assuming all sessions are private
                    'hasHomework' => $session->homework->count() > 0,
                    'homeworkStatus' => $this->getHomeworkStatus($session),
                ];
            });

        return $sessions->toArray();
    }

    /**
     * Generate available months for filtering
     */
    private function getAvailableMonths(Student $student): array
    {
        $months = [];
        $currentDate = Carbon::now();

        // Add last 6 months
        for ($i = 6; $i >= 1; $i--) {
            $months[] = $currentDate->copy()->subMonths($i)->format('Y-m');
        }

        // Add current month
        $months[] = $currentDate->format('Y-m');

        // Add next 2 months
        for ($i = 1; $i <= 2; $i++) {
            $months[] = $currentDate->copy()->addMonths($i)->format('Y-m');
        }

        return $months;
    }

    /**
     * Get homework status for a session
     */
    private function getHomeworkStatus(StudentSession $session): string
    {
        $homework = $session->homework->first();

        if (!$homework) {
            return 'none';
        }

        if ($homework->is_submitted) {
            return 'submitted';
        }

        if ($homework->isOverdue()) {
            return 'overdue';
        }

        return 'pending';
    }
}
