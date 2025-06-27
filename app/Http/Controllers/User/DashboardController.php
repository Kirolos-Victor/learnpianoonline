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
        $selectedStudentId = $request->query('studentId');

        // Get only basic student information for the dropdown
        $students = Student::where('user_id', $user->id)
            ->with(['instructor'])
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
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
        $currentStudentId = null;

        if ($selectedStudentId && $students->where('id', $selectedStudentId)->count() > 0) {
            $currentStudentId = $selectedStudentId;
            $selectedStudentData = $this->getStudentData($selectedStudentId);
        } elseif ($students->count() > 0) {
            $firstStudent = $students->first();
            $currentStudentId = $firstStudent['id'];
            $selectedStudentData = $this->getStudentData($currentStudentId);
        }

        return Inertia::render('user/Dashboard', [
            'students' => $students,
            'selectedStudentData' => $selectedStudentData,
            'selectedStudentId' => $currentStudentId,
        ]);
    }

    /**
     * Get detailed data for a specific student
     */
    public function getStudentData(string $studentId)
    {
        $user = Auth::user();

        // Verify the student belongs to the authenticated user
        $student = Student::where('id', $studentId)
            ->where('user_id', $user->id)
            ->with(['instructor'])
            ->firstOrFail();

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
    public function fetchStudentData(Request $request, string $studentId)
    {
        $user = Auth::user();
        $selectedStudentData = $this->getStudentData($studentId);

        // Return the same page structure with updated student data
        return Inertia::render('user/Dashboard', [
            'students' => Student::where('user_id', $user->id)
                ->with(['instructor'])
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
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
            'selectedStudentId' => $studentId,
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
