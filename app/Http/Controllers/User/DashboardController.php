<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Lesson;
use App\Models\Homework;
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
        // Get lessons for this student
        $lessons = Lesson::where('student_id', $student->id)
            ->with(['instructor'])
            ->orderBy('scheduled_at', 'desc')
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $this->generateLessonTitle($lesson),
                    'instructor' => $lesson->instructor->name,
                    'date' => $lesson->scheduled_at->format('F j, Y'),
                    'time' => $lesson->scheduled_at->format('g:i A'),
                    'status' => $lesson->status,
                    'type' => 'private', // Assuming all lessons are private for now
                    'scheduledAt' => $lesson->scheduled_at->toISOString(),
                ];
            });

        // Get homework for this student
        $homework = Homework::where('student_id', $student->id)
            ->with(['lesson'])
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($hw) {
                return [
                    'id' => $hw->id,
                    'title' => $hw->title,
                    'dueDate' => $hw->due_date->format('F j, Y'),
                    'isSubmitted' => $hw->is_submitted,
                    'lessonTitle' => $hw->lesson ? $this->generateLessonTitle($hw->lesson) : 'Unknown Lesson',
                    'description' => $hw->description,
                    'isOverdue' => $hw->isOverdue(),
                    'isDueSoon' => $hw->isDueSoon(),
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
            'homework' => $homework,
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
     * Generate a lesson title based on lesson data
     */
    private function generateLessonTitle(Lesson $lesson): string
    {
        // Generate lesson title based on lesson number
        $lessonNumber = $lesson->id;
        return "Lesson #{$lessonNumber}";
    }
}
