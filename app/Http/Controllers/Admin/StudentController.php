<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(): \Inertia\Response
    {
        $students = Student::with(['user', 'instructor'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'user_id' => $student->user_id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'is_active' => $student->user->is_active,
                    'sessions_remaining' => $student->sessions_remaining,
                    'is_subscribed' => $student->is_subscribed,
                    'instructor_id' => $student->instructor_id,
                    'instructor_name' => $student->instructor ? $student->instructor->name : null,
                ];
            });

        $instructors = User::where('role', 'instructor')->where('is_active', true)->get(['id', 'name']);

        return Inertia::render('admin/Students', [
            'students' => $students,
            'instructors' => $instructors,
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
}
