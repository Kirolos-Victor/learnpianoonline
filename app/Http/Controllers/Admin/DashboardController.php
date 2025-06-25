<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        // Get statistics for admin dashboard
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'active_users' => User::where('role', 'user')->where('is_active', true)->count(),
            'inactive_users' => User::where('role', 'user')->where('is_active', false)->count(),
            'total_instructors' => User::where('role', 'instructor')->count(),
            'active_instructors' => User::where('role', 'instructor')->where('is_active', true)->count(),
            'inactive_instructors' => User::where('role', 'instructor')->where('is_active', false)->count(),
            'total_students' => Student::count(),
            'subscribed_students' => Student::where('is_subscribed', true)->count(),
            'total_lessons' => Lesson::count(),
            'completed_lessons' => Lesson::where('status', 'completed')->count(),
            'pending_lessons' => Lesson::where('status', 'pending')->count(),
            'total_sessions_remaining' => Student::sum('sessions_remaining'),
        ];

        // Get recent activities
        $recentLessons = Lesson::with(['student.user', 'instructor'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats,
            'recentLessons' => $recentLessons,
        ]);
    }
}
