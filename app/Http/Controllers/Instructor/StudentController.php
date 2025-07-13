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
        $instructor = Auth::user();

        // Get students assigned to this instructor
        $students = Student::with(['user', 'lessons'])
            ->where('instructor_id', $instructor->id)
            ->where('is_subscribed', true) // Only show subscribed students
            ->get()
            ->map(function ($student) {
                $convertedTimeData = $this->convertStudentTimeToPreferredTimezone($student);

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                    'email' => $student->user->email,
                    'age' => $student->age,
                    'is_subscribed' => $student->is_subscribed,
                    'sessions_remaining' => $student->sessions_remaining,
                    'lessons_completed' => $student->completedLessons()->count(),
                    'lessons_pending' => $student->pendingLessons()->count(),
                    'last_lesson_date' => $student->completedLessons()->latest('completed_at')->first()?->completed_at,
                    'next_lesson_date' => $student->pendingLessons()->oldest('scheduled_at')->first()?->scheduled_at,
                    'day_of_week' => $convertedTimeData['day_of_week'],
                    'preferred_time' => $convertedTimeData['preferred_time'],
                    'student_timezone' => $student->user->timezone ?? 'UTC',
                    'converted_timezone' => config('app.preferred_timezone', 'Africa/Cairo'),
                ];
            });

        return Inertia::render('instructor/Students', [
            'students' => $students,
        ]);
    }

    /**
     * Show lessons for a specific student
     */
    public function lessons(Request $request, Student $student): \Inertia\Response
    {
        $instructor = Auth::user();

        // Verify that the student is assigned to this instructor
        if ($student->instructor_id !== $instructor->id) {
            abort(403, 'Unauthorized access to student lessons');
        }

        // Get filter parameters
        $month = $request->query('month');
        $status = $request->query('status', 'all');
        $perPage = $request->query('per_page', 10);

        // Build the query
        $query = Lesson::where('student_id', $student->id)
            ->where('instructor_id', $instructor->id)
            ->with(['student', 'instructor']);

        // Apply month filter
        if ($month) {
            try {
                $monthDate = Carbon::createFromFormat('Y-m', $month);
                $startOfMonth = $monthDate->copy()->startOfMonth();
                $endOfMonth = $monthDate->copy()->endOfMonth();
                $query->whereBetween('scheduled_at', [$startOfMonth, $endOfMonth]);
            } catch (\Exception $e) {
                // If month format is invalid, ignore the filter
            }
        }

        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Get paginated results
        $lessons = $query->orderBy('scheduled_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Format the lessons data
        $formattedLessons = $lessons->through(function ($lesson) {
            return [
                'id' => $lesson->id,
                'student_name' => $lesson->student->name,
                'instructor_name' => $lesson->instructor->name,
                'scheduled_at' => $lesson->scheduled_at->format('Y-m-d H:i:s'),
                'scheduled_date' => $lesson->scheduled_at->format('F j, Y'),
                'scheduled_time' => $lesson->scheduled_at->format('g:i A'),
                'completed_at' => $lesson->completed_at?->format('Y-m-d H:i:s'),
                'status' => $lesson->status,
                'notes' => $lesson->notes,
                'screenshot_path' => $lesson->screenshot_path,
            ];
        });

        // Generate available months (last 12 months and next 3 months)
        $availableMonths = collect();
        $currentMonth = Carbon::now()->startOfMonth();

        // Add past months
        for ($i = 11; $i >= 0; $i--) {
            $month = $currentMonth->copy()->subMonths($i);
            $availableMonths->push([
                'value' => $month->format('Y-m'),
                'label' => $month->format('F Y'),
            ]);
        }

        // Add future months
        for ($i = 1; $i <= 3; $i++) {
            $month = $currentMonth->copy()->addMonths($i);
            $availableMonths->push([
                'value' => $month->format('Y-m'),
                'label' => $month->format('F Y'),
            ]);
        }

        // Student data
        $studentData = [
            'id' => $student->id,
            'name' => $student->name,
            'slug' => $student->slug,
            'email' => $student->user->email,
            'age' => $student->age,
            'is_subscribed' => $student->is_subscribed,
            'sessions_remaining' => $student->sessions_remaining,
            'lessons_completed' => $student->completedLessons()->count(),
            'lessons_pending' => $student->pendingLessons()->count(),
        ];

        return Inertia::render('instructor/StudentLessons', [
            'student' => $studentData,
            'lessons' => $formattedLessons,
            'availableMonths' => $availableMonths,
            'filters' => [
                'month' => $month,
                'status' => $status,
                'per_page' => $perPage,
            ],
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
