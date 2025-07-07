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

        // Get today's lessons for the instructor
        $todaysLessons = Lesson::with(['student', 'homework'])
            ->where('instructor_id', $instructor->id)
            ->whereBetween('scheduled_at', [
                now()->startOfDay(),
                now()->endOfDay()
            ])
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'scheduled_at' => $lesson->scheduled_at->format('Y-m-d H:i:s'),
                    'formatted_time' => $lesson->scheduled_at->format('g:i A'),
                    'status' => $lesson->status,
                    'notes' => $lesson->notes,
                    'screenshot_path' => $lesson->screenshot_path,
                    'completed_at' => $lesson->completed_at?->format('Y-m-d H:i:s'),
                    'formatted_completed_time' => $lesson->completed_at?->format('g:i A'),
                    'student' => [
                        'id' => $lesson->student->id,
                        'name' => $lesson->student->name,
                        'email' => $lesson->student->user->email,
                        'age' => $lesson->student->age,
                        'has_piano' => $lesson->student->has_piano,
                        'sessions_remaining' => $lesson->student->sessions_remaining,
                    ],
                    'homework' => $lesson->homework->map(function ($hw) {
                        return [
                            'id' => $hw->id,
                            'title' => $hw->title,
                            'description' => $hw->description,
                            'is_submitted' => $hw->is_submitted,
                            'due_date' => $hw->due_date?->format('Y-m-d'),
                        ];
                    }),
                ];
            });

        // Calculate dashboard stats
        $totalLessonsThisMonth = Lesson::where('instructor_id', $instructor->id)
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        $pendingLessons = Lesson::where('instructor_id', $instructor->id)
            ->where('status', 'pending')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        $completedLessons = Lesson::where('instructor_id', $instructor->id)
            ->where('status', 'completed')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        $cancelledLessons = Lesson::where('instructor_id', $instructor->id)
            ->where('status', 'cancelled')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        $missedLessons = Lesson::where('instructor_id', $instructor->id)
            ->where('status', 'missed')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        $totalPendingHomework = Homework::whereHas('student', function ($query) use ($instructor) {
            $query->where('instructor_id', $instructor->id);
        })
            ->where('is_submitted', false)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return Inertia::render('instructor/Dashboard', [
            'todaysLessons' => $todaysLessons,
            'dashboardStats' => [
                'totalLessonsThisMonth' => $totalLessonsThisMonth,
                'pendingLessons' => $pendingLessons,
                'completedLessons' => $completedLessons,
                'cancelledLessons' => $cancelledLessons,
                'missedLessons' => $missedLessons,
                'totalPendingHomework' => $totalPendingHomework,
                'todaysLessonsCount' => $todaysLessons->count(),
            ],
        ]);
    }

    public function completeLesson(Request $request, $lessonId)
    {
        $instructor = Auth::user();

        $lesson = Lesson::where('id', $lessonId)
            ->where('instructor_id', $instructor->id)
            ->firstOrFail();

        $request->validate([
            'screenshot' => 'required|image|max:4096',
            'notes' => 'nullable|string',
        ]);

        $screenshotPath = $request->file('screenshot')->store('lesson_screenshots', 'public');

        $lesson->markAsCompleted($screenshotPath, $request->input('notes'));

        return redirect()->back()->with('success', 'Lesson marked as completed successfully.');
    }

    public function markLessonAsMissed(Request $request, $lessonId)
    {
        $instructor = Auth::user();

        $lesson = Lesson::where('id', $lessonId)
            ->where('instructor_id', $instructor->id)
            ->firstOrFail();

        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $lesson->markAsMissed($request->input('notes'));

        return redirect()->back()->with('success', 'Lesson marked as missed successfully.');
    }

    public function cancelLesson(Request $request, $lessonId)
    {
        $instructor = Auth::user();

        $lesson = Lesson::where('id', $lessonId)
            ->where('instructor_id', $instructor->id)
            ->firstOrFail();

        $request->validate([
            'notes' => 'required|string|min:10',
        ], [
            'notes.required' => 'Please provide a reason for cancelling the lesson.',
            'notes.min' => 'Please provide a detailed reason (at least 10 characters).',
        ]);

        $lesson->markAsCancelled($request->input('notes'));

        return redirect()->back()->with('success', 'Lesson cancelled successfully. A replacement lesson has been scheduled for the student.');
    }
}
