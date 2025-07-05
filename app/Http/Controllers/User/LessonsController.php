<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Lesson;
use App\Models\Homework;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class LessonsController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $user = Auth::user();
        $selectedStudentSlug = $request->query('studentSlug');
        $selectedMonth = $request->query('month', Carbon::now()->format('F Y'));

        // Get students for the current user
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
            $selectedStudentData = $this->getStudentLessonsDataBySlug($selectedStudentSlug, $selectedMonth);
        } elseif ($students->count() > 0) {
            $firstStudent = $students->first();
            $currentStudentSlug = $firstStudent['slug'];
            $selectedStudentData = $this->getStudentLessonsDataBySlug($currentStudentSlug, $selectedMonth);
        }

        // Generate available months (last 6 months and next 2 months)
        $availableMonths = $this->generateAvailableMonths();

        return Inertia::render('user/Lessons', [
            'students' => $students,
            'selectedStudentData' => $selectedStudentData,
            'selectedStudentSlug' => $currentStudentSlug,
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $availableMonths,
        ]);
    }

    /**
     * Get lessons data for a specific student and month by slug
     */
    public function getStudentLessonsDataBySlug(string $studentSlug, string $month): array
    {
        $user = Auth::user();

        // Verify the student belongs to the authenticated user
        $student = Student::where('slug', $studentSlug)
            ->where('user_id', $user->id)
            ->with(['instructor'])
            ->firstOrFail();

        return $this->getStudentLessonsData($student, $month);
    }

    /**
     * Get lessons data for a specific student and month
     */
    public function getStudentLessonsData(Student $student, string $month): array
    {
        // Parse the month string to get start and end dates
        $monthDate = Carbon::createFromFormat('F Y', $month);
        $startOfMonth = $monthDate->copy()->startOfMonth();
        $endOfMonth = $monthDate->copy()->endOfMonth();

        // Get lessons for this student in the specified month
        $lessons = Lesson::where('student_id', $student->id)
            ->whereBetween('scheduled_at', [$startOfMonth, $endOfMonth])
            ->with(['instructor', 'homework'])
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($lesson, $index) {
                return [
                    'id' => $lesson->id,
                    'lessonNumber' => $index + 1, // Sequential lesson number for the month
                    'instructor' => $lesson->instructor->name,
                    'date' => $lesson->scheduled_at->format('F j, Y'),
                    'time' => $lesson->scheduled_at->format('g:i A'),
                    'duration' => '60 min', // Assuming all lessons are 60 minutes
                    'status' => $lesson->status,
                    'type' => 'private', // Assuming all lessons are private
                    'hasHomework' => $lesson->homework->count() > 0,
                    'homeworkStatus' => $this->getHomeworkStatus($lesson),
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
            'lessons' => $lessons,
        ];
    }

    /**
     * Handle student data requests via Inertia
     */
    public function fetchStudentLessons(Request $request, Student $student)
    {
        $user = Auth::user();

        // Verify the student belongs to the authenticated user
        if ($student->user_id !== $user->id) {
            abort(403, 'Unauthorized access to student data');
        }

        $selectedMonth = $request->query('month', Carbon::now()->format('F Y'));
        $selectedStudentData = $this->getStudentLessonsData($student, $selectedMonth);

        // Return the same page structure with updated student data
        return Inertia::render('user/Lessons', [
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
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $this->generateAvailableMonths(),
        ]);
    }

    public function homework(Request $request, Student $student, string $lessonId): \Inertia\Response
    {
        // Verify the student belongs to the authenticated user
        if ($student->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to student data');
        }

        $lesson = Lesson::where('id', $lessonId)
            ->where('student_id', $student->id)
            ->firstOrFail();

        return Inertia::render('user/HomeworkSubmission', [
            'studentId' => $student->id,
            'lessonId' => $lessonId,
            'studentName' => $student->name,
            'lessonNumber' => $lesson->id, // Using lesson ID as lesson number
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

    /**
     * Get homework status for a lesson
     */
    private function getHomeworkStatus(Lesson $lesson): string
    {
        $homework = $lesson->homework->first();

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
