<?php

use App\Http\Controllers\Instructor\DashboardController;
use App\Http\Controllers\Instructor\StudentController;
use App\Http\Controllers\Instructor\LessonController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'instructor', 'middleware' => ['auth', 'instructor']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('instructor.dashboard');
    Route::get('students', [StudentController::class, 'index'])->name('instructor.students');
    // List all lessons for a student
    Route::get('students/{student}/lessons', [LessonController::class, 'index'])->name('instructor.student.lessons');
    // Mark lesson as completed (with screenshot upload)
    Route::post('lessons/{lesson}/complete', [LessonController::class, 'complete'])->name('instructor.lesson.complete');
});
