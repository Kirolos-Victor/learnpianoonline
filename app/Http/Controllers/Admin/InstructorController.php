<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function index(): \Inertia\Response
    {
        $instructors = User::with(['assignedStudents', 'conductedLessons'])
            ->where('role', 'instructor')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'is_active' => $instructor->is_active,
                    'created_at' => $instructor->created_at,
                    'students_count' => $instructor->assignedStudents->count(),
                    'lessons_count' => $instructor->conductedLessons->count(),
                    'completed_lessons' => $instructor->conductedLessons->where('status', 'completed')->count(),
                    'assigned_students' => $instructor->assignedStudents->map(function ($student) {
                        return [
                            'id' => $student->id,
                            'user_name' => $student->user->name,
                            'sessions_remaining' => $student->sessions_remaining,
                            'is_subscribed' => $student->is_subscribed,
                        ];
                    }),
                ];
            });

        return Inertia::render('admin/Instructors', [
            'instructors' => $instructors,
        ]);
    }

    public function update(Request $request, $id): \Illuminate\Http\RedirectResponse
    {
        $instructor = User::where('role', 'instructor')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        $instructor->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return redirect()->back()->with('success', 'Instructor updated successfully.');
    }

    public function inviteInstructor(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        // Create instructor user with temporary password
        $tempPassword = 'temp_' . Str::random(8);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($tempPassword),
            'role' => 'instructor',
            'is_active' => true,
        ]);

        // TODO: Send invitation email with temporary password
        // For now, we'll just return success
        // Mail::to($user->email)->send(new InstructorInvitation($user, $tempPassword));

        return redirect()->back()->with('success', 'Instructor invited successfully. Temporary password: ' . $tempPassword);
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

    public function viewStudents($id): \Inertia\Response
    {
        $instructor = User::with(['assignedStudents.user', 'assignedStudents.lessons'])
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
                'lessons_count' => $student->lessons->count(),
                'completed_lessons' => $student->lessons->where('status', 'completed')->count(),
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
