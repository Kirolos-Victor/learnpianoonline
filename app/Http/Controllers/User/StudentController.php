<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
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
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:5|max:100',
            'hasPiano' => 'boolean',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'age' => $validated['age'],
            'has_piano' => $validated['hasPiano'],
            'is_subscribed' => false, // Always start as not subscribed
            'sessions_remaining' => 0,
        ]);

        return back()->with('success', 'Student added successfully!');
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
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:5|max:100',
            'hasPiano' => 'boolean',
        ]);

        $student->update([
            'name' => $validated['name'],
            'age' => $validated['age'],
            'has_piano' => $validated['hasPiano'],
            // Note: is_subscribed is not updated here - it's managed through payments
        ]);

        return back()->with('success', 'Student updated successfully!');
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

        return back()->with('success', 'Student deleted successfully!');
    }
}
