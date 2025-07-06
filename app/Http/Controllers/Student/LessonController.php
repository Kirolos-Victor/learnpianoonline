<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class LessonController extends Controller
{
    public function index(Student $student, Request $request)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        $selectedMonth = $request->query('month', Carbon::now()->format('F Y'));

        // Load relationships
        $student->load(['instructor', 'lessons.instructor', 'lessons.homework']);

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

        // Get lessons data for this specific student
        $lessonsData = $this->getStudentLessonsData($student, $selectedMonth);

        // Generate available months (last 6 months and next 2 months)
        $availableMonths = $this->generateAvailableMonths();

        return Inertia::render('student/Lessons', [
            'student' => $formattedStudent,
            'lessons' => $lessonsData,
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $availableMonths,
            'subscribePrice' => (float) env('MONTHLY_SUBSCRIBE_PRICE', 29.99),
        ]);
    }

    /**
     * Get lessons data for a specific student and month
     */
    private function getStudentLessonsData(Student $student, string $month): array
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
                    'instructor' => $lesson->instructor->name ?? 'Not assigned',
                    'date' => $lesson->scheduled_at->format('F j, Y'),
                    'time' => $lesson->scheduled_at->format('g:i A'),
                    'duration' => '60 min', // Assuming all lessons are 60 minutes
                    'status' => $lesson->status,
                    'type' => 'private', // Assuming all lessons are private
                    'hasHomework' => $lesson->homework->count() > 0,
                    'homeworkStatus' => $this->getHomeworkStatus($lesson),
                ];
            });

        return $lessons->toArray();
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
