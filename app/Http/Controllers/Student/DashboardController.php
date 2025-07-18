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
        $student->load(['instructor', 'studentSessions.instructor']);

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

        // Format sessions data
        $sessions = $student->studentSessions()
            ->with('instructor')
            ->orderBy('scheduled_at', 'asc') // Order by ascending to get the next session first
            ->take(10)
            ->get()
            ->map(function ($session, $index) {
                return [
                    'id' => $session->id,
                    'title' => 'Piano Session #' . ($index + 1),
                    'instructor' => $session->instructor->name ?? 'Not assigned',
                    'date' => $session->scheduled_at->format('F j, Y'), // Changed to full month name format
                    'time' => $session->scheduled_at->format('g:i A'),
                    'status' => $session->status,
                    'type' => 'private', // Default type
                    'scheduledAt' => $session->scheduled_at->toISOString(),
                ];
            });

        // Student data structure
        $studentData = [
            'student' => $formattedStudent,
            'sessions' => $sessions,
        ];

        return Inertia::render('student/Home', [
            'student' => $formattedStudent,
            'studentData' => $studentData,
            'subscribePrice' => (float) env('MONTHLY_SUBSCRIBE_PRICE', 29.99),
        ]);
    }
}
