<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search', '');
        $subscriptionFilter = $request->get('subscription', 'all'); // all, subscribed, unsubscribed

        $query = Student::with(['user', 'instructor']);

        // Apply search filter (search by student name or user email)
        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply subscription filter
        if ($subscriptionFilter === 'subscribed') {
            $query->where('is_subscribed', true);
        } elseif ($subscriptionFilter === 'unsubscribed') {
            $query->where('is_subscribed', false);
        }

        // Get paginated results
        $students = $query->orderByDesc('created_at')
                         ->paginate($perPage)
                         ->withQueryString();

        // Transform the data
        $students->getCollection()->transform(function ($student) {
            // Calculate subscription months
            $subscriptionMonths = 0;
            if ($student->is_subscribed && $student->subscription_expires_at) {
                $createdAt = $student->created_at;
                $expiresAt = $student->subscription_expires_at;
                $subscriptionMonths = $createdAt->diffInMonths($expiresAt);
            }

            return [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
                'is_subscribed' => $student->is_subscribed,
                'subscription_months' => $subscriptionMonths,
                'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                'instructor_id' => $student->instructor_id,
                'instructor_name' => $student->instructor ? $student->instructor->name : null,
                'created_at' => $student->created_at->format('M d, Y'),
            ];
        });

        $instructors = User::where('role', 'instructor')->where('is_active', true)->get(['id', 'name']);

        // Get summary statistics
        $stats = [
            'total' => Student::count(),
            'subscribed' => Student::where('is_subscribed', true)->count(),
            'unsubscribed' => Student::where('is_subscribed', false)->count(),
        ];

        return Inertia::render('admin/Students', [
            'students' => $students,
            'instructors' => $instructors,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'subscription' => $subscriptionFilter,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function updateSessions(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $request->validate([
            'sessions' => 'required|integer|min:0',
        ]);
        $student->update(['sessions_remaining' => $request->sessions]);
        return redirect()->back()->with('success', 'Sessions updated successfully.');
    }

    public function changeInstructor(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $request->validate([
            'instructor_id' => 'required|exists:users,id',
        ]);
        $instructor = User::findOrFail($request->instructor_id);
        if ($instructor->role !== 'instructor') {
            return redirect()->back()->with('error', 'Selected user is not an instructor.');
        }
        $student->update(['instructor_id' => $instructor->id]);
        return redirect()->back()->with('success', 'Instructor changed successfully.');
    }

    public function pendingSubscribers(Request $request): \Inertia\Response
    {
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search', '');

        $query = Student::with(['user', 'instructor'])
            ->where('is_subscribed', true)
            ->whereNull('instructor_id');

        // Apply search filter
        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Get paginated results
        $students = $query->orderByDesc('created_at')
                         ->paginate($perPage)
                         ->withQueryString();

        // Transform the data
        $students->getCollection()->transform(function ($student) {
            // Calculate subscription months
            $subscriptionMonths = 0;
            if ($student->is_subscribed && $student->subscription_expires_at) {
                $createdAt = $student->created_at;
                $expiresAt = $student->subscription_expires_at;
                $subscriptionMonths = $createdAt->diffInMonths($expiresAt);
            }

            return [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
                'subscription_months' => $subscriptionMonths,
                'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                'created_at' => $student->created_at->format('M d, Y'),
            ];
        });

        $instructors = User::where('role', 'instructor')->where('is_active', true)->get(['id', 'name']);

        return Inertia::render('admin/PendingSubscribers', [
            'students' => $students,
            'instructors' => $instructors,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function assignInstructorToPending(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        // Verify the student is subscribed and has no instructor
        if (!$student->is_subscribed || $student->instructor_id) {
            return redirect()->back()->with('error', 'This student is not eligible for instructor assignment.');
        }

        $request->validate([
            'instructor_id' => 'required|exists:users,id',
        ]);

        $instructor = User::findOrFail($request->instructor_id);
        if ($instructor->role !== 'instructor') {
            return redirect()->back()->with('error', 'Selected user is not an instructor.');
        }

        $student->update(['instructor_id' => $instructor->id]);

        return redirect()->back()->with('success', 'Instructor assigned successfully. Student has been moved to the main students list.');
    }
}
