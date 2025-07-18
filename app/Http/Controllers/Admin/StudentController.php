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
        $subscription = $request->get('subscription', 'all');

        $query = Student::with(['user', 'instructor']);

        // Apply search filter
        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply subscription filter
        if ($subscription === 'subscribed') {
            $query->where('is_subscribed', true);
        } elseif ($subscription === 'unsubscribed') {
            $query->where('is_subscribed', false);
        }

        // Get paginated results
        $students = $query->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        // Transform the data
        $students->getCollection()->transform(function ($student) {
            return [
                'id' => $student->id,
                'slug' => $student->slug,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
                'is_subscribed' => $student->is_subscribed,
                'subscription_expires_at' => $student->subscription_expires_at?->format('M d, Y'),
                'instructor_id' => $student->instructor_id,
                'instructor_name' => $student->instructor?->name,
                'preferred_time' => $student->preferred_time?->format('H:i'),
                'created_at' => $student->created_at->format('M d, Y'),
            ];
        });

        // Get instructors for assignment
        $instructors = User::where('role', 'instructor')->where('is_active', true)->get(['id', 'name']);

        // Calculate stats
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
                'subscription' => $subscription,
                'per_page' => $perPage,
            ],
            'timezone' => config('app.timezone'),
        ]);
    }

    /**
     * Update student's sessions
     */
    public function updateSessions(Request $request, $slug): \Illuminate\Http\RedirectResponse
    {
        $student = Student::where('slug', $slug)->firstOrFail();

        $request->validate([
            'sessions' => 'required|integer|min:0',
        ]);

        $student->update(['sessions_remaining' => $request->sessions]);
        return redirect()->back()->with('success', 'Sessions updated successfully.');
    }

    /**
     * View student's sessions
     */
    public function viewSessions(Request $request, $slug): \Inertia\Response
    {
        $student = Student::with(['user', 'instructor', 'studentSessions'])->where('slug', $slug)->firstOrFail();

        // Get available months from sessions
        $availableMonths = $student->studentSessions()
            ->selectRaw("DISTINCT to_char(scheduled_at, 'YYYY-MM') as month")
            ->orderBy('month', 'desc')
            ->pluck('month')
            ->map(function ($month) {
                return \Carbon\Carbon::createFromFormat('Y-m', $month)->format('F Y');
            });

        // Build query with filters
        $sessionsQuery = $student->studentSessions()->with(['instructor']);

        // Apply month filter
        if ($month = $request->input('month')) {
            $sessionsQuery->whereMonth('scheduled_at', substr($month, -2));
            $sessionsQuery->whereYear('scheduled_at', substr($month, 0, 4));
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $sessionsQuery->where('status', $status);
            }
        }

        // Get paginated sessions
        $sessions = $sessionsQuery->orderBy('scheduled_at', 'desc')
            ->paginate($request->input('perPage', 10))
            ->through(function ($session) use ($student) {
                return [
                    'id' => $session->id,
                    'instructor_name' => $session->instructor->name,
                    'scheduled_at' => $session->scheduled_at,
                    'scheduled_date' => $session->scheduled_at->format('F j, Y'),
                    'scheduled_time' => $session->scheduled_at->format('h:i A'),
                    'completed_at' => $session->completed_at?->toDateTimeString(),
                    'status' => $session->status,
                    'notes' => $session->notes,
                    'screenshot_path' => $session->screenshot_path,
                ];
            });

        return Inertia::render('admin/StudentSessions', [
            'student' => [
                'id' => $student->id,
                'slug' => $student->slug,
                'name' => $student->name,
                'email' => $student->user->email,
                'age' => $student->age,
                'is_subscribed' => $student->is_subscribed,
                'sessions_remaining' => $student->sessions_remaining,
                'sessions_completed' => $student->studentSessions()->where('status', 'completed')->count(),
                'sessions_pending' => $student->studentSessions()->where('status', 'pending')->count(),
                'instructor' => $student->instructor ? [
                    'id' => $student->instructor->id,
                    'name' => $student->instructor->name,
                ] : null,
            ],
            'sessions' => $sessions,
            'availableMonths' => $availableMonths,
            'filters' => [
                'month' => $request->input('month'),
                'status' => $request->input('status'),
                'perPage' => $request->input('perPage', 10),
            ],
        ]);
    }

    public function changeInstructor(Request $request, $slug)
    {
        $student = Student::where('slug', $slug)->firstOrFail();
        $request->validate([
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        if ($request->instructor_id) {
            $instructor = User::findOrFail($request->instructor_id);
            if ($instructor->role !== 'instructor') {
                return redirect()->back()->with('error', 'Selected user is not an instructor.');
            }
        }

        $student->update(['instructor_id' => $request->instructor_id]);
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
            return [
                'id' => $student->id,
                'slug' => $student->slug,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
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

    public function assignInstructorToPending(Request $request, $slug)
    {
        $student = Student::where('slug', $slug)->firstOrFail();

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
