<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search', '');
        $subscription = $request->get('subscription', 'all');

        $query = Student::with(['user', 'instructor']);

        // Apply search filter
        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply subscription filter
        if ($subscription === 'subscribed') {
            $query->where('is_subscribed', true);
        } elseif ($subscription === 'unsubscribed') {
            $query->where('is_subscribed', false);
        }

        // Get paginated results
        $students = $query->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        // Transform the data
        $students->getCollection()->transform(function ($student) {
            $instructorTimezone = config('app.preferred_timezone', 'UTC');
            $studentTimezone = $student->user->timezone ?? 'UTC';

            // Convert student's preferred time to instructor's timezone if available
            $timezoneConversion = null;
            if ($student->day_of_week && $student->preferred_time) {
                try {
                    $convertedDateTime = $this->convertStudentTimeToInstructorTime(
                        $student->day_of_week,
                        $student->preferred_time,
                        $studentTimezone,
                        $instructorTimezone
                    );

                    $timezoneConversion = [
                        'student_original' => [
                            'day' => $student->day_of_week,
                            'time' => Carbon::parse($student->preferred_time)->format('g:i A'),
                            'timezone' => $studentTimezone,
                        ],
                        'instructor_converted' => [
                            'day' => strtolower($convertedDateTime->format('l')),
                            'time' => $convertedDateTime->format('g:i A'),
                            'timezone' => $instructorTimezone,
                            'full_datetime' => $convertedDateTime->format('l \a\t g:i A T'),
                        ],
                    ];
                } catch (\Exception $e) {
                    // If conversion fails, just use original data
                    $timezoneConversion = null;
                }
            }

            return [
                'id' => $student->id,
                'slug' => $student->slug,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
                'is_subscribed' => $student->is_subscribed,
                'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                'instructor_id' => $student->instructor_id,
                'instructor_name' => $student->instructor?->name,
                'preferred_time' => $student->preferred_time ? Carbon::parse($student->preferred_time)->format('g:i A') : null,
                'day_of_week' => $student->day_of_week,
                'user_timezone' => $studentTimezone,
                'timezone_conversion' => $timezoneConversion,
                'created_at' => $student->created_at->format('M d, Y'),
            ];
        });

        // Get instructors for assignment
        $instructors = User::where('role', 'instructor')->where('is_active', true)->get(['id', 'name']);

        // Calculate stats
        $stats = [
            'total' => Student::count(),
            'subscribed' => Student::where('is_subscribed', true)->count(),
            'unsubscribed' => Student::where('is_subscribed', false)->count(),
        ];

        return Inertia::render('admin/Students', [
            'students' => $students,
            'instructors' => $instructors,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'subscription' => $subscription,
                'per_page' => $perPage,
            ],
            'timezone' => config('app.timezone'),
        ]);
    }

    /**
     * Update student's sessions
     */
    public function updateSessions(Request $request, $slug): \Illuminate\Http\RedirectResponse
    {
        $student = Student::where('slug', $slug)->firstOrFail();

        $request->validate([
            'sessions' => 'required|integer|min:0',
        ]);

        $student->update(['sessions_remaining' => $request->sessions]);
        return redirect()->back()->with('success', 'Sessions updated successfully.');
    }

    /**
     * View student's sessions
     */
    public function viewSessions(Request $request, $slug): \Inertia\Response
    {
        $student = Student::with(['user', 'instructor', 'studentSessions'])->where('slug', $slug)->firstOrFail();

        // Get available months from sessions
        $availableMonths = $student->studentSessions()
            ->selectRaw("DISTINCT to_char(scheduled_at, 'YYYY-MM') as month")
            ->orderBy('month', 'desc')
            ->pluck('month')
            ->map(function ($month) {
                return \Carbon\Carbon::createFromFormat('Y-m', $month)->format('F Y');
            });

        // Build query with filters
        $sessionsQuery = $student->studentSessions()->with(['instructor']);

        // Apply month filter
        if ($month = $request->input('month')) {
            $sessionsQuery->whereMonth('scheduled_at', substr($month, -2));
            $sessionsQuery->whereYear('scheduled_at', substr($month, 0, 4));
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $sessionsQuery->where('status', $status);
            }
        }

        // Get paginated sessions
        $sessions = $sessionsQuery->orderBy('scheduled_at', 'desc')
            ->paginate($request->input('perPage', 10))
            ->through(function ($session) use ($student) {
                return [
                    'id' => $session->id,
                    'instructor_name' => $session->instructor->name,
                    'scheduled_at' => $session->scheduled_at,
                    'scheduled_date' => $session->scheduled_at->format('F j, Y'),
                    'scheduled_time' => $session->scheduled_at->format('h:i A'),
                    'completed_at' => $session->completed_at?->toDateTimeString(),
                    'status' => $session->status,
                    'notes' => $session->notes,
                    'screenshot_path' => $session->screenshot_path,
                ];
            });

        return Inertia::render('admin/StudentSessions', [
            'student' => [
                'id' => $student->id,
                'slug' => $student->slug,
                'name' => $student->name,
                'email' => $student->user->email,
                'age' => $student->age,
                'is_subscribed' => $student->is_subscribed,
                'sessions_remaining' => $student->sessions_remaining,
                'sessions_completed' => $student->studentSessions()->where('status', 'completed')->count(),
                'sessions_pending' => $student->studentSessions()->where('status', 'pending')->count(),
                'instructor' => $student->instructor ? [
                    'id' => $student->instructor->id,
                    'name' => $student->instructor->name,
                ] : null,
            ],
            'sessions' => $sessions,
            'availableMonths' => $availableMonths,
            'filters' => [
                'month' => $request->input('month'),
                'status' => $request->input('status'),
                'perPage' => $request->input('perPage', 10),
            ],
        ]);
    }

    public function changeInstructor(Request $request, $slug)
    {
        $student = Student::where('slug', $slug)->firstOrFail();
        $request->validate([
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        if ($request->instructor_id) {
            $instructor = User::findOrFail($request->instructor_id);
            if ($instructor->role !== 'instructor') {
                return redirect()->back()->with('error', 'Selected user is not an instructor.');
            }
        }

        $student->update(['instructor_id' => $request->instructor_id]);
        return redirect()->back()->with('success', 'Instructor changed successfully.');
    }

    public function pendingSubscribers(Request $request): \Inertia\Response
    {
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search', '');

        $query = Student::with(['user', 'instructor'])
            ->where('is_subscribed', true)
            ->whereNull('instructor_id');

        // Apply search filter
        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Get paginated results
        $students = $query->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        // Transform the data
        $students->getCollection()->transform(function ($student) {
            $instructorTimezone = config('app.preferred_timezone', 'UTC');
            $studentTimezone = $student->user->timezone ?? 'UTC';

            // Convert student's preferred time to instructor's timezone if available
            $timezoneConversion = null;
            if ($student->day_of_week && $student->preferred_time) {
                try {
                    $convertedDateTime = $this->convertStudentTimeToInstructorTime(
                        $student->day_of_week,
                        $student->preferred_time,
                        $studentTimezone,
                        $instructorTimezone
                    );

                    $timezoneConversion = [
                        'student_original' => [
                            'day' => $student->day_of_week,
                            'time' => Carbon::parse($student->preferred_time)->format('g:i A'),
                            'timezone' => $studentTimezone,
                        ],
                        'instructor_converted' => [
                            'day' => strtolower($convertedDateTime->format('l')),
                            'time' => $convertedDateTime->format('g:i A'),
                            'timezone' => $instructorTimezone,
                            'full_datetime' => $convertedDateTime->format('l \a\t g:i A T'),
                        ],
                    ];
                } catch (\Exception $e) {
                    // If conversion fails, just use original data
                    $timezoneConversion = null;
                }
            }

            return [
                'id' => $student->id,
                'slug' => $student->slug,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
                'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                'created_at' => $student->created_at->format('M d, Y'),
                'day_of_week' => $student->day_of_week,
                'preferred_time' => $student->preferred_time ? Carbon::parse($student->preferred_time)->format('g:i A') : null,
                'user_timezone' => $studentTimezone,
                'timezone_conversion' => $timezoneConversion,
            ];
        });

        // Get all instructors (filtering will be done on frontend when assigning)
        $instructors = User::where('role', 'instructor')
            ->where('is_active', true)
            ->get(['id', 'name', 'availability']);

        return Inertia::render('admin/PendingSubscribers', [
            'students' => $students,
            'instructors' => $instructors,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function assignInstructorToPending(Request $request, $slug)
    {
        $student = Student::where('slug', $slug)->firstOrFail();

        // Verify the student is subscribed and has no instructor
        if (!$student->is_subscribed || $student->instructor_id) {
            return redirect()->back()->with('error', 'This student is not eligible for instructor assignment.');
        }

        $request->validate([
            'instructor_id' => 'required|exists:users,id',
        ]);

        $instructor = User::findOrFail($request->instructor_id);
        if ($instructor->role !== 'instructor') {
            return redirect()->back()->with('error', 'Selected user is not an instructor.');
        }

        $student->update(['instructor_id' => $instructor->id]);

        return redirect()->back()->with('success', 'Instructor assigned successfully. Student has been moved to the main students list.');
    }

    /**
     * Get available instructors for a specific student based on their preferred time and day
     */
    public function getAvailableInstructors(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'student_slug' => 'required|string',
        ]);

        $student = Student::with('user')->where('slug', $request->student_slug)->firstOrFail();

        if (!$student->day_of_week || !$student->preferred_time) {
            return response()->json([
                'instructors' => [],
                'message' => 'Student has no preferred day or time set.',
            ]);
        }

        // Get instructor's timezone (from .env)
        $instructorTimezone = config('app.preferred_timezone', 'UTC');
        $studentTimezone = $student->user->timezone ?? 'UTC';

        // Convert student's preferred time to instructor's timezone
        $studentPreferredDateTime = $this->convertStudentTimeToInstructorTime(
            $student->day_of_week,
            $student->preferred_time,
            $studentTimezone,
            $instructorTimezone
        );

        // Get the day in instructor's timezone
        $instructorTimezoneDay = strtolower($studentPreferredDateTime->format('l'));

        // Get instructors available on that day
        $availableInstructors = User::where('role', 'instructor')
            ->where('is_active', true)
            ->whereJsonContains('availability', $instructorTimezoneDay)
            ->get(['id', 'name', 'availability']);

        // Filter out instructors who have conflicts at that time
        $filteredInstructors = $availableInstructors->filter(function ($instructor) use ($studentPreferredDateTime) {
            return !$this->hasScheduleConflict($instructor->id, $studentPreferredDateTime);
        });

        return response()->json([
            'instructors' => $filteredInstructors->values(),
            'converted_time' => $studentPreferredDateTime->format('Y-m-d g:i A T'),
            'instructor_timezone_day' => $instructorTimezoneDay,
            'student_preferred_converted' => [
                'day' => $instructorTimezoneDay,
                'time' => $studentPreferredDateTime->format('g:i A'),
                'full_datetime' => $studentPreferredDateTime->format('l \a\t g:i A T'),
            ],
            'original_student_time' => [
                'day' => $student->day_of_week,
                'time' => Carbon::parse($student->preferred_time)->format('g:i A'),
                'timezone' => $studentTimezone,
            ],
            'instructor_timezone' => $instructorTimezone,
        ]);
    }

    /**
     * Convert student's preferred time to instructor's timezone
     */
    private function convertStudentTimeToInstructorTime(string $dayOfWeek, string $preferredTime, string $studentTimezone, string $instructorTimezone): Carbon
    {
        // Create a datetime for the next occurrence of the student's preferred day/time in their timezone
        $now = Carbon::now($studentTimezone);
        $daysOfWeek = [
            'sunday' => 0,
            'monday' => 1,
            'tuesday' => 2,
            'wednesday' => 3,
            'thursday' => 4,
            'friday' => 5,
            'saturday' => 6,
            'satureday' => 6  // Handle misspelled Saturday
        ];

        $targetDayNumber = $daysOfWeek[strtolower($dayOfWeek)];
        $currentDayNumber = $now->dayOfWeek;

        // Calculate days to add to get to the target day
        $daysToAdd = ($targetDayNumber - $currentDayNumber + 7) % 7;
        if ($daysToAdd === 0) {
            $daysToAdd = 7; // If it's the same day, get next week's occurrence
        }

        // Handle time format - could be full datetime or just time
        $timeString = $preferredTime;
        if (strpos($preferredTime, ' ') !== false) {
            // If it's a full datetime, extract just the time part
            $timeString = Carbon::parse($preferredTime)->format('H:i:s');
        }

        // Create the student's preferred datetime in their timezone
        $studentDateTime = $now->copy()
            ->addDays($daysToAdd)
            ->setTimeFromTimeString($timeString);

        // Convert to instructor's timezone
        return $studentDateTime->setTimezone($instructorTimezone);
    }

    /**
     * Check if instructor has a schedule conflict at the given time
     */
    private function hasScheduleConflict(int $instructorId, Carbon $dateTime): bool
    {
        // Check for existing sessions within 1 hour of the proposed time
        $startTime = $dateTime->copy()->subMinutes(30);
        $endTime = $dateTime->copy()->addMinutes(30);

        return StudentSession::where('instructor_id', $instructorId)
            ->where('status', '=', 'pending')
            ->whereBetween('scheduled_at', [$startTime, $endTime])
            ->exists();
    }
}
