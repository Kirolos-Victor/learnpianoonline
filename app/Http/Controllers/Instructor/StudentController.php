<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Lesson;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentController extends Controller
{
    public function index(): \Inertia\Response
    {
        $instructor = auth()->user();

        $students = Student::with(['user', 'studentSessions'])
            ->where('instructor_id', $instructor->id)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'email' => $student->user->email,
                    'age' => $student->age,
                    'has_piano' => $student->has_piano,
                    'sessions_remaining' => $student->sessions_remaining,
                    'sessions_completed' => $student->completedStudentSessions()->count(),
                    'sessions_pending' => $student->pendingStudentSessions()->count(),
                    'last_session_date' => $student->completedStudentSessions()->latest('completed_at')->first()?->completed_at,
                    'next_session_date' => $student->pendingStudentSessions()->oldest('scheduled_at')->first()?->scheduled_at,
                ];
            });

        return Inertia::render('instructor/Students', [
            'students' => $students,
        ]);
    }

    /**
     * Show sessions for a specific student
     */
    public function sessions(Request $request, Student $student): \Inertia\Response
    {
        // Check if the student is assigned to this instructor
        if ($student->instructor_id !== auth()->id()) {
            abort(403, 'Unauthorized access to student sessions');
        }

        // Get available months from sessions
        $availableMonths = $student->studentSessions()
            ->selectRaw('DISTINCT DATE_FORMAT(scheduled_at, "%Y-%m") as month')
            ->orderBy('month', 'desc')
            ->pluck('month')
            ->map(function ($month) {
                return \Carbon\Carbon::createFromFormat('Y-m', $month)->format('F Y');
            });

        // Build query with filters
        $query = $student->studentSessions()->with(['instructor']);

        // Apply month filter
        if ($month = $request->input('month')) {
            $query->whereMonth('scheduled_at', substr($month, -2));
            $query->whereYear('scheduled_at', substr($month, 0, 4));
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Get paginated sessions
        $sessions = $query->orderBy('scheduled_at', 'desc')
            ->paginate($request->input('perPage', 10))
            ->through(function ($session) {
                return [
                    'id' => $session->id,
                    'instructor_name' => $session->instructor->name,
                    'scheduled_date' => $session->scheduled_at->format('F j, Y'),
                    'scheduled_time' => $session->scheduled_at->format('h:i A'),
                    'completed_at' => $session->completed_at?->toDateTimeString(),
                    'status' => $session->status,
                    'notes' => $session->notes,
                ];
            });

        return Inertia::render('instructor/StudentSessions', [
            'sessions' => $sessions,
            'availableMonths' => $availableMonths,
        ]);
    }

    /**
     * Convert student's preferred time from their timezone to the app's preferred timezone
     */
    private function convertStudentTimeToPreferredTimezone(Student $student): array
    {
        $studentTimezone = $student->user->timezone ?? 'UTC';
        $preferredTimezone = config('app.preferred_timezone', 'Africa/Cairo');

        // If student doesn't have a preferred time or day set, return as-is
        if (!$student->preferred_time || !$student->day_of_week) {
            return [
                'day_of_week' => $student->day_of_week,
                'preferred_time' => $student->preferred_time?->format('g:i A'),
            ];
        }

        // If timezones are the same, no conversion needed
        if ($studentTimezone === $preferredTimezone) {
            return [
                'day_of_week' => $student->day_of_week,
                'preferred_time' => $student->preferred_time->format('g:i A'),
            ];
        }

        try {
            // Create a datetime for the student's preferred lesson time
            // We'll use next occurrence of their preferred day for conversion
            $dayOfWeekMap = [
                'monday' => 1,
                'tuesday' => 2,
                'wednesday' => 3,
                'thursday' => 4,
                'friday' => 5,
                'saturday' => 6,
                'sunday' => 7,
            ];

            $dayNumber = $dayOfWeekMap[strtolower($student->day_of_week)] ?? 1;

            // Create a datetime in the student's timezone
            $studentDateTime = Carbon::now($studentTimezone)
                ->next($dayNumber)
                ->setTimeFromTimeString($student->preferred_time->format('H:i'));

            // Convert to the preferred timezone
            $convertedDateTime = $studentDateTime->setTimezone($preferredTimezone);

            // Get the converted day and time
            $convertedDay = strtolower($convertedDateTime->format('l'));
            $convertedTime = $convertedDateTime->format('g:i A');

            return [
                'day_of_week' => $convertedDay,
                'preferred_time' => $convertedTime,
            ];
        } catch (\Exception $e) {
            // If conversion fails, return original values
            return [
                'day_of_week' => $student->day_of_week,
                'preferred_time' => $student->preferred_time?->format('g:i A'),
            ];
        }
    }
}
