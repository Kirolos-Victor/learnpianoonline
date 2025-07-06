<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        // Load relationships
        $student->load(['instructor', 'lessons.instructor', 'homework.lesson']);

        // Format student data
        $formattedStudent = [
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

        // Format lessons data
        $lessons = $student->lessons()
            ->with('instructor')
            ->orderBy('scheduled_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => 'Piano Lesson #' . $lesson->id,
                    'instructor' => $lesson->instructor->name ?? 'Not assigned',
                    'date' => $lesson->scheduled_at->format('M j, Y'),
                    'time' => $lesson->scheduled_at->format('g:i A'),
                    'status' => $lesson->status,
                    'type' => 'private', // Default type
                    'scheduledAt' => $lesson->scheduled_at->toISOString(),
                ];
            });

        // Format homework data
        $homework = $student->homework()
            ->with('lesson')
            ->orderBy('due_date', 'desc')
            ->take(10)
            ->get()
            ->map(function ($hw) {
                $dueDate = $hw->due_date;
                $now = now();

                return [
                    'id' => $hw->id,
                    'title' => $hw->title,
                    'dueDate' => $dueDate->format('M j, Y'),
                    'isSubmitted' => $hw->is_submitted,
                    'lessonTitle' => $hw->lesson->title ?? 'Piano Lesson #' . $hw->lesson_id,
                    'description' => $hw->description,
                    'isOverdue' => !$hw->is_submitted && $dueDate->isPast(),
                    'isDueSoon' => !$hw->is_submitted && $dueDate->diffInHours($now) <= 24 && $dueDate->isFuture(),
                ];
            });

        // Student data structure
        $studentData = [
            'student' => $formattedStudent,
            'lessons' => $lessons,
            'homework' => $homework,
        ];

        return Inertia::render('student/Home', [
            'student' => $formattedStudent,
            'studentData' => $studentData,
            'subscribePrice' => (float) env('MONTHLY_SUBSCRIBE_PRICE', 29.99),
        ]);
    }
}
