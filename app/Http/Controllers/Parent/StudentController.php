<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Auth::user()->students()->with('instructor')->get();

        return Inertia::render('parent/Students', [
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
                    'createdAt' => $student->created_at->format('M j, Y'),
                ];
            }),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:100',
            'hasPiano' => 'required|boolean',
        ]);

        $student = Auth::user()->students()->create([
            'name' => $request->name,
            'age' => $request->age,
            'has_piano' => $request->hasPiano,
        ]);

        return redirect()->route('parent.students')->with('success', 'Student added successfully!');
    }

    public function update(Request $request, Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:100',
            'hasPiano' => 'required|boolean',
        ]);

        $student->update([
            'name' => $request->name,
            'age' => $request->age,
            'has_piano' => $request->hasPiano,
        ]);

        return redirect()->route('parent.students')->with('success', 'Student updated successfully!');
    }

    public function destroy(Student $student)
    {
        // Validate that the student belongs to the current user
        if ($student->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to student data');
        }

        $student->delete();

        return redirect()->route('parent.students')->with('success', 'Student deleted successfully!');
    }
}
