<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get students for the current user
        $students = Student::where('user_id', $user->id)
            ->with(['instructor'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($student) {
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
                    'createdAt' => $student->created_at->format('M j, Y'),
                ];
            });

        return Inertia::render('user/Student', [
            'students' => $students,
        ]);
    }

    /**
     * Store a new student
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user has reached the limit of 10 students
        $studentCount = Student::where('user_id', $user->id)->count();
        if ($studentCount >= 10) {
            return back()->withErrors(['limit' => 'You can only add up to 10 students.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|min:2',
            'age' => 'required|integer|min:5|max:100',
            'hasPiano' => 'boolean',
        ], [
            'name.required' => 'Student name is required.',
            'name.string' => 'Student name must be a valid text.',
            'name.max' => 'Student name cannot exceed 255 characters.',
            'name.min' => 'Student name must be at least 2 characters.',
            'age.required' => 'Student age is required.',
            'age.integer' => 'Student age must be a valid number.',
            'age.min' => 'Student age must be at least 5 years old.',
            'age.max' => 'Student age cannot exceed 100 years old.',
            'hasPiano.boolean' => 'Piano access must be yes or no.',
        ]);

        // Additional validation for duplicate names
        $existingStudent = Student::where('user_id', $user->id)
            ->where('name', trim($validated['name']))
            ->first();

        if ($existingStudent) {
            return redirect()->route('student.index')->withErrors(['name' => 'A student with this name already exists.']);
        }

        $student = Student::create([
            'user_id' => $user->id,
            'name' => trim($validated['name']),
            'age' => $validated['age'],
            'has_piano' => $validated['hasPiano'] ?? false,
            'is_subscribed' => false, // Always start as not subscribed
            'sessions_remaining' => 0,
        ]);

        // Return updated students list via Inertia
        return redirect()->route('student.index');
    }

    /**
     * Update an existing student
     */
    public function update(Request $request, Student $student)
    {
        // Verify the student belongs to the authenticated user
        if ($student->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|min:2',
            'age' => 'required|integer|min:5|max:100',
            'hasPiano' => 'boolean',
        ], [
            'name.required' => 'Student name is required.',
            'name.string' => 'Student name must be a valid text.',
            'name.max' => 'Student name cannot exceed 255 characters.',
            'name.min' => 'Student name must be at least 2 characters.',
            'age.required' => 'Student age is required.',
            'age.integer' => 'Student age must be a valid number.',
            'age.min' => 'Student age must be at least 5 years old.',
            'age.max' => 'Student age cannot exceed 100 years old.',
            'hasPiano.boolean' => 'Piano access must be yes or no.',
        ]);

        // Additional validation for duplicate names (excluding current student)
        $existingStudent = Student::where('user_id', Auth::id())
            ->where('name', trim($validated['name']))
            ->where('id', '!=', $student->id)
            ->first();

        if ($existingStudent) {
            return redirect()->route('student.index')->withErrors(['name' => 'A student with this name already exists.']);
        }

        $student->update([
            'name' => trim($validated['name']),
            'age' => $validated['age'],
            'has_piano' => $validated['hasPiano'] ?? false,
            // Note: is_subscribed is not updated here - it's managed through payments
        ]);

        // Return updated students list via Inertia
        return redirect()->route('student.index');
    }

    /**
     * Delete a student
     */
    public function destroy(Student $student)
    {
        // Verify the student belongs to the authenticated user
        if ($student->user_id !== Auth::id()) {
            abort(403);
        }

        $student->delete();

        // Return updated students list via Inertia
        return redirect()->route('student.index');
    }
}
