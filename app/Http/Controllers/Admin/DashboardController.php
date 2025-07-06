<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Lesson;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        // Get date range filters
        $startDate = $request->get('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        // Parse dates
        $startDateTime = Carbon::parse($startDate)->startOfDay();
        $endDateTime = Carbon::parse($endDate)->endOfDay();

        // Get ALL statistics with date filtering applied
        $stats = [
            // Users (filtered by creation date or last activity in period)
            'total_users' => User::where('role', 'parent')
                ->orWhere('role', 'instructor')
                ->orWhere('role', 'admin')
                ->count(),
            'active_users' => User::where('role', 'parent')
                ->where('is_active', true)
                ->count(),
            'inactive_users' => User::where('role', 'parent')
                ->where('is_active', false)
                ->count(),

            // Instructors (filtered by creation date)
            'total_instructors' => User::where('role', 'instructor')
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),
            'active_instructors' => User::where('role', 'instructor')
                ->where('is_active', true)
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),
            'inactive_instructors' => User::where('role', 'instructor')
                ->where('is_active', false)
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),

            // Students (filtered by creation date)
            'total_students' => Student::whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),
            'subscribed_students' => Student::where('is_subscribed', true)
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),
            'total_sessions_remaining' => Student::whereBetween('created_at', [$startDateTime, $endDateTime])
                ->sum('sessions_remaining'),

            // Lessons (filtered by creation/update date)
            'total_lessons' => Lesson::whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),
            'completed_lessons' => Lesson::where('status', 'completed')
                ->whereBetween('updated_at', [$startDateTime, $endDateTime])
                ->count(),
            'pending_lessons' => Lesson::where('status', 'pending')
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),
        ];

        // Get subscription statistics (also date-filtered)
        $subscriptionStats = [
            // Total subscriptions in period
            'total_subscriptions' => Subscription::whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),

            // Completed subscriptions (paid) in period
            'completed_subscriptions' => Subscription::where('status', 'completed')
                ->whereBetween('paid_at', [$startDateTime, $endDateTime])
                ->count(),

            // Pending subscriptions in period
            'pending_subscriptions' => Subscription::where('status', 'pending')
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),

            // Failed subscriptions in period
            'failed_subscriptions' => Subscription::where('status', 'failed')
                ->whereBetween('created_at', [$startDateTime, $endDateTime])
                ->count(),

            // Revenue statistics in period
            'total_revenue' => Subscription::where('status', 'completed')
                ->whereBetween('paid_at', [$startDateTime, $endDateTime])
                ->sum('amount'),

            // Average subscription amount in period
            'average_subscription_amount' => Subscription::where('status', 'completed')
                ->whereBetween('paid_at', [$startDateTime, $endDateTime])
                ->avg('amount'),

            // Average students per subscription in period
            'average_students_per_subscription' => Subscription::where('status', 'completed')
                ->whereBetween('paid_at', [$startDateTime, $endDateTime])
                ->avg('student_count'),
        ];

        // Recent activities (last 10 activities in date range)
        $recentSubscriptions = Subscription::with('user')
            ->where('status', 'completed')
            ->whereBetween('paid_at', [$startDateTime, $endDateTime])
            ->orderBy('paid_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'user_name' => $subscription->user->name,
                    'user_email' => $subscription->user->email,
                    'amount' => $subscription->amount,
                    'student_count' => $subscription->student_count,
                    'paid_at' => $subscription->paid_at->format('M d, Y H:i'),
                    'paid_at_human' => $subscription->paid_at->diffForHumans(),
                ];
            });

        return Inertia::render('admin/Dashboard', [
            'stats' => array_merge($stats, $subscriptionStats),
            'recentSubscriptions' => $recentSubscriptions,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
