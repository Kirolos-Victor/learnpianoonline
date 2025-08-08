<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(): \Inertia\Response
    {
        $instructor = auth()->user();

        $students = Student::with(['user', 'studentSessions'])
            ->where('instructor_id', $instructor->id)
            ->get()
            ->map(function ($student) {
                $studentTimezone = $student->user->timezone ?? 'UTC';
                $preferredTimezone = config('app.preferred_timezone', 'Africa/Cairo');

                // Build schedule/timezone conversion details if day/time set
                $timezoneConversion = null;
                $dayOfWeek = $student->day_of_week ? strtolower($student->day_of_week) : null;
                $preferredTimeDisplay = $student->preferred_time ? $student->preferred_time->format('g:i A') : null;

                if ($student->preferred_time && $dayOfWeek) {
                    try {
                        $dayOfWeekMap = [
                            'monday' => 1,
                            'tuesday' => 2,
                            'wednesday' => 3,
                            'thursday' => 4,
                            'friday' => 5,
                            'saturday' => 6,
                            'sunday' => 7,
                        ];

                        $dayNumber = $dayOfWeekMap[$dayOfWeek] ?? 1;

                        // Create base datetime in student's timezone for next occurrence
                        $studentDateTime = Carbon::now($studentTimezone)
                            ->next($dayNumber)
                            ->setTimeFromTimeString($student->preferred_time->format('H:i'));

                        $convertedDateTime = (clone $studentDateTime)->setTimezone($preferredTimezone);

                        $timezoneConversion = [
                            'student_original' => [
                                'day' => ucfirst($dayOfWeek),
                                'time' => $preferredTimeDisplay,
                                'timezone' => $studentTimezone,
                            ],
                            'instructor_converted' => [
                                'day' => strtolower($convertedDateTime->format('l')),
                                'time' => $convertedDateTime->format('g:i A'),
                                'timezone' => $preferredTimezone,
                                'full_datetime' => $convertedDateTime->format('l, F j, Y g:i A'),
                            ],
                        ];
                    } catch (\Exception $e) {
                        // Leave conversion as null on failure
                    }
                }

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'email' => $student->user->email,
                    'age' => $student->age,
                    'has_piano' => $student->has_piano,
                    'sessions_remaining' => $student->sessions_remaining,
                    // Align names with frontend expectations
                    'lessons_completed' => $student->completedStudentSessions()->count(),
                    'lessons_pending' => $student->pendingStudentSessions()->count(),
                    'last_lesson_date' => $student->completedStudentSessions()->latest('completed_at')->first()?->completed_at,
                    'next_lesson_date' => $student->pendingStudentSessions()->oldest('scheduled_at')->first()?->scheduled_at,
                    // Schedule and timezone fields
                    'day_of_week' => $dayOfWeek,
                    'preferred_time' => $preferredTimeDisplay,
                    'student_timezone' => $studentTimezone,
                    'converted_timezone' => $preferredTimezone,
                    'timezone_conversion' => $timezoneConversion,
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
        // Load the user relationship
        $student->load('user');

        // Check if the student is assigned to this instructor
        if ($student->instructor_id !== auth()->id()) {
            abort(403, 'Unauthorized access to student sessions');
        }

        // Get available months from sessions
        $availableMonths = $student->studentSessions()
            ->selectRaw('DISTINCT TO_CHAR(scheduled_at, \'YYYY-MM\') as month')
            ->orderBy('month', 'desc')
            ->pluck('month')
            ->map(function ($month) {
                return \Carbon\Carbon::createFromFormat('Y-m', $month)->format('F Y');
            });

        // Build query with filters
        $query = $student->studentSessions()->with(['instructor', 'student.instructor']);

        // Apply month filter
        if ($month = $request->input('month')) {
            $query->whereMonth('scheduled_at', substr($month, -2));
            $query->whereYear('scheduled_at', substr($month, 0, 4));
        }

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('instructor', function ($instructorQuery) use ($search) {
                    $instructorQuery->where('name', 'ilike', "%{$search}%");
                })
                    ->orWhere('notes', 'ilike', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Get paginated sessions
        $sessions = $query->orderBy('scheduled_at', 'desc')
            ->paginate($request->input('perPage', 10))
            ->withQueryString()
            ->through(function ($session) {
                return [
                    'id' => $session->id,
                    'instructor_name' => $session->instructor?->name ?? $session->student->instructor?->name ?? 'Not assigned',
                    'scheduled_date' => $session->scheduled_at->format('F j, Y'),
                    'scheduled_time' => $session->scheduled_at->format('h:i A'),
                    'completed_at' => $session->completed_at?->toDateTimeString(),
                    'status' => $session->status,
                    'notes' => $session->notes,
                ];
            });

        return Inertia::render('instructor/StudentSessions', [
            'student' => [
                'id' => $student->id,
                'slug' => $student->slug,
                'name' => $student->name,
                'email' => $student->user->email,
                'age' => $student->age,
                'is_subscribed' => $student->is_subscribed,
                'sessions_remaining' => $student->sessions_remaining,
                'day_of_week' => $student->day_of_week,
                'preferred_time' => $student->preferred_time,
            ],
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
        if (! $student->preferred_time || ! $student->day_of_week) {
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
