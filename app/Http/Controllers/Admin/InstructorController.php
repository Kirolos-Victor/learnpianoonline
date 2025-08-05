<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $query = User::where('role', 'instructor');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $instructors = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10))
            ->through(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'is_active' => $instructor->is_active,
                    'availability' => $instructor->availability ?? [],
                    'created_at' => $instructor->created_at,
                ];
            });

        return Inertia::render('admin/Instructors', [
            'instructors' => $instructors,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function addInstructor(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and is a parent
        if (!$user) {
            return redirect()->back()->withErrors(['email' => 'User with this email does not exist.']);
        }

        if ($user->role !== 'parent') {
            return redirect()->back()->withErrors(['email' => 'This email belongs to a user who is not a parent. Only parents can be added as instructors.']);
        }

        if ($user->role === 'instructor') {
            return redirect()->back()->withErrors(['email' => 'This user is already an instructor.']);
        }

        // Check if parent has students - prevent if they do
        $studentsCount = $user->students()->count();
        if ($studentsCount > 0) {
            return redirect()->back()->withErrors([
                'email' => "Cannot add {$user->name} as instructor because they currently have {$studentsCount} student" . ($studentsCount > 1 ? 's' : '') . ". Parents with active students cannot be converted to instructors.",
            ]);
        }

        // Update user role to instructor
        $user->update([
            'role' => 'instructor',
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Parent successfully added as instructor: ' . $user->name);
    }

    public function restrictAccess($id): \Illuminate\Http\RedirectResponse
    {
        $instructor = User::where('role', 'instructor')->findOrFail($id);

        // Soft deactivation - set is_active to false
        $instructor->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Instructor access restricted successfully.');
    }

    public function activateInstructor($id): \Illuminate\Http\RedirectResponse
    {
        $instructor = User::where('role', 'instructor')->findOrFail($id);

        // Reactivate instructor - set is_active to true
        $instructor->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Instructor activated successfully.');
    }

    public function updateAvailability(Request $request, $id): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'availability' => 'required|array',
            'availability.*' => 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
        ]);

        $instructor = User::where('role', 'instructor')->findOrFail($id);

        $instructor->update([
            'availability' => $request->availability,
        ]);

        return redirect()->back()->with('success', 'Instructor availability updated successfully.');
    }

    public function viewStudents($id): \Inertia\Response
    {
        $instructor = User::with(['assignedStudents.user', 'assignedStudents.studentSessions'])
            ->where('role', 'instructor')
            ->findOrFail($id);

        $students = $instructor->assignedStudents->map(function ($student) {
            return [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'sessions_remaining' => $student->sessions_remaining,
                'is_subscribed' => $student->is_subscribed,
                'lessons_count' => $student->studentSessions->count(),
                'completed_lessons' => $student->studentSessions->where('status', 'completed')->count(),
                'is_active' => $student->user->is_active,
            ];
        });

        return Inertia::render('admin/InstructorStudents', [
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
            ],
            'students' => $students,
        ]);
    }
}
