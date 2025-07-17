<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $instructor = auth()->user();

        // Get today's sessions for the instructor
        $todaysSessions = StudentSession::with(['student'])
            ->where('instructor_id', $instructor->id)
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'student_name' => $session->student->name,
                    'student_slug' => $session->student->slug,
                    'scheduled_time' => $session->scheduled_at->format('h:i A'),
                    'status' => $session->status,
                    'notes' => $session->notes,
                ];
            });

        // Get total sessions this month
        $totalSessionsThisMonth = StudentSession::where('instructor_id', $instructor->id)
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        // Get pending sessions
        $pendingSessions = StudentSession::where('instructor_id', $instructor->id)
            ->where('status', 'pending')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        // Get completed sessions
        $completedSessions = StudentSession::where('instructor_id', $instructor->id)
            ->where('status', 'completed')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        // Get cancelled sessions
        $cancelledSessions = StudentSession::where('instructor_id', $instructor->id)
            ->where('status', 'cancelled')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        // Get missed sessions
        $missedSessions = StudentSession::where('instructor_id', $instructor->id)
            ->where('status', 'missed')
            ->whereMonth('scheduled_at', now()->month)
            ->whereYear('scheduled_at', now()->year)
            ->count();

        return Inertia::render('instructor/Dashboard', [
            'todaysSessions' => $todaysSessions,
            'dashboardStats' => [
                'totalSessionsThisMonth' => $totalSessionsThisMonth,
                'pendingSessions' => $pendingSessions,
                'completedSessions' => $completedSessions,
                'cancelledSessions' => $cancelledSessions,
                'missedSessions' => $missedSessions,
                'todaysSessionsCount' => $todaysSessions->count(),
            ],
        ]);
    }

    /**
     * Mark a session as completed
     */
    public function completeSession(Request $request, StudentSession $session): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $session);

        $session->markAsCompleted(null, $request->input('notes'));

        return redirect()->back()->with('success', 'Session marked as completed.');
    }

    /**
     * Mark a session as missed
     */
    public function markSessionAsMissed(Request $request, StudentSession $session): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $session);

        $session->markAsMissed($request->input('notes'));

        return redirect()->back()->with('success', 'Session marked as missed.');
    }

    /**
     * Cancel a session
     */
    public function cancelSession(Request $request, StudentSession $session): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $session);

        $session->markAsCancelled($request->input('notes'));

        return redirect()->back()->with('success', 'Session cancelled.');
    }
}
