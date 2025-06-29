<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Lesson;
use App\Models\Homework;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $instructor = Auth::user();

        // Get students assigned to this instructor
        $students = Student::with(['user', 'lessons', 'homework'])
            ->where('instructor_id', $instructor->id)
            ->where('is_subscribed', true)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->user->email,
                    'subscriptionStatus' => $student->is_subscribed ? 'subscribed' : 'unsubscribed',
                    'lastLessonDate' => $student->completedLessons()->latest('completed_at')->first()?->completed_at?->format('Y-m-d'),
                    'nextLessonDate' => $student->pendingLessons()->oldest('scheduled_at')->first()?->scheduled_at?->format('Y-m-d') ?? 'N/A',
                    'lessonsCompleted' => $student->completedLessons()->count(),
                    'lessonsThisMonth' => $student->completedLessons()
                        ->whereMonth('completed_at', now()->month)
                        ->whereYear('completed_at', now()->year)
                        ->count(),
                    'pendingHomework' => $student->pendingHomework()->count(),
                ];
            });

        // Calculate dashboard stats
        $totalStudents = $students->count();
        $activeStudents = $students->where('subscriptionStatus', 'active')->count();
        $totalLessonsThisMonth = $students->sum('lessonsThisMonth');
        $totalPendingHomework = $students->sum('pendingHomework');

        // Get next upcoming lesson
        $nextLesson = Lesson::with('student')
            ->where('instructor_id', $instructor->id)
            ->where('status', 'pending')
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at')
            ->first();

        // Get recent activity (completed lessons, submitted homework)
        $recentCompletedLessons = Lesson::with('student')
            ->where('instructor_id', $instructor->id)
            ->where('status', 'completed')
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->limit(3)
            ->get();

        $recentSubmittedHomework = Homework::with(['student'])
            ->whereHas('student', function ($query) use ($instructor) {
                $query->where('instructor_id', $instructor->id);
            })
            ->where('is_submitted', true)
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at', 'desc')
            ->limit(3)
            ->get();

        // Combine and sort recent activities
        $recentActivities = collect();

        foreach ($recentCompletedLessons as $lesson) {
            $recentActivities->push([
                'type' => 'lesson_completed',
                'title' => 'Lesson Completed',
                'student_name' => $lesson->student->name,
                'date' => $lesson->completed_at->format('M j, Y'),
                'timestamp' => $lesson->completed_at,
            ]);
        }

        foreach ($recentSubmittedHomework as $homework) {
            $recentActivities->push([
                'type' => 'homework_submitted',
                'title' => 'Homework Submitted',
                'student_name' => $homework->student->name,
                'date' => $homework->submitted_at->format('M j, Y'),
                'timestamp' => $homework->submitted_at,
            ]);
        }

        $recentActivities = $recentActivities->sortByDesc('timestamp')->take(3)->values();

        return Inertia::render('instructor/Dashboard', [
            'students' => $students,
            'dashboardStats' => [
                'totalStudents' => $totalStudents,
                'activeStudents' => $activeStudents,
                'totalLessonsThisMonth' => $totalLessonsThisMonth,
                'totalPendingHomework' => $totalPendingHomework,
                'nextLesson' => $nextLesson ? [
                    'student_name' => $nextLesson->student->name,
                    'scheduled_at' => $nextLesson->scheduled_at->format('Y-m-d H:i:s'),
                    'formatted_date' => $nextLesson->scheduled_at->format('M j'),
                    'formatted_time' => $nextLesson->scheduled_at->format('g:i A'),
                ] : null,
            ],
            'recentActivities' => $recentActivities,
        ]);
    }
}
