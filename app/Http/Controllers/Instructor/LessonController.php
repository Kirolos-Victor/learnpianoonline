<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LessonController extends Controller
{
    // List all lessons for a given student
    public function index($studentId)
    {
        $student = Student::with(['lessons' => function($q) {
            $q->orderBy('scheduled_at', 'desc');
        }])->findOrFail($studentId);
        return Inertia::render('instructor/Lessons', [
            'student' => $student,
            'lessons' => $student->lessons,
        ]);
    }

    // Mark a lesson as completed and upload screenshot
    public function complete(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $request->validate([
            'screenshot' => 'required|image|max:4096',
            'notes' => 'nullable|string',
        ]);
        $path = $request->file('screenshot')->store('lesson_screenshots', 'public');
        $lesson->markAsCompleted($path, $request->input('notes'));
        return redirect()->back()->with('success', 'Lesson marked as completed and screenshot uploaded.');
    }
}
