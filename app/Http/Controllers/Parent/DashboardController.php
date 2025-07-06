<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $students = Auth::user()->students()->with('instructor')->get();

        return Inertia::render('parent/Home', [
            'students' => $students->map(function ($student) {
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
        ]);
    }

    public function selectStudent(Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        // Redirect to student dashboard
        return redirect()->route('student.dashboard', $student->slug);
    }
}
