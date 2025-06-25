<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonsController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('user/Lessons');
    }

    public function homework(Request $request, string $studentId, string $lessonId): \Inertia\Response
    {
        // In a real app, you would fetch student and lesson data from the database
        // For now, we'll use mock data
        $studentName = $this->getStudentName($studentId);
        $lessonNumber = $this->getLessonNumber($lessonId);

        return Inertia::render('user/HomeworkSubmission', [
            'studentId' => $studentId,
            'lessonId' => $lessonId,
            'studentName' => $studentName,
            'lessonNumber' => $lessonNumber,
        ]);
    }

    private function getStudentName(string $studentId): string
    {
        // Mock student data - in real app, fetch from database
        $students = [
            '1' => 'Emma Johnson',
            '2' => 'Michael Chen',
            '3' => 'Sarah Williams',
        ];

        return $students[$studentId] ?? 'Unknown Student';
    }

    private function getLessonNumber(string $lessonId): int
    {
        // Mock lesson data - in real app, fetch from database
        $lessons = [
            '1' => 1, '2' => 2, '3' => 3, '4' => 4,
            '5' => 1, '6' => 2, '7' => 3, '8' => 4,
            '9' => 1, '10' => 2, '11' => 3, '12' => 4,
        ];

        return $lessons[$lessonId] ?? 1;
    }
}
