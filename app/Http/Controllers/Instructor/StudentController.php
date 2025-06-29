<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(): \Inertia\Response
    {
        $instructor = Auth::user();

        // Get students assigned to this instructor
        $students = Student::with(['user', 'lessons'])
            ->where('instructor_id', $instructor->id)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->user->email,
                    'age' => $student->age,
                    'is_subscribed' => $student->is_subscribed,
                    'sessions_remaining' => $student->sessions_remaining,
                    'lessons_completed' => $student->completedLessons()->count(),
                    'lessons_pending' => $student->pendingLessons()->count(),
                    'last_lesson_date' => $student->completedLessons()->latest('completed_at')->first()?->completed_at,
                    'next_lesson_date' => $student->pendingLessons()->oldest('scheduled_at')->first()?->scheduled_at,
                ];
            });

        return Inertia::render('instructor/Students', [
            'students' => $students,
        ]);
    }
}
