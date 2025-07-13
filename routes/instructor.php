<?php

use App\Http\Controllers\Instructor\DashboardController;
use App\Http\Controllers\Instructor\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'instructor', 'middleware' => ['auth', 'instructor']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('instructor.dashboard');
    Route::get('students', [StudentController::class, 'index'])->name('instructor.students');
    Route::get('students/{student:slug}/lessons', [StudentController::class, 'lessons'])->name('instructor.student.lessons');
    // Complete lesson from dashboard
    Route::post('dashboard/lessons/{lesson}/complete', [DashboardController::class, 'completeLesson'])->name('instructor.dashboard.lesson.complete');
    // Mark lesson as missed from dashboard
    Route::post('dashboard/lessons/{lesson}/missed', [DashboardController::class, 'markLessonAsMissed'])->name('instructor.dashboard.lesson.missed');
    // Cancel lesson from dashboard
    Route::post('dashboard/lessons/{lesson}/cancel', [DashboardController::class, 'cancelLesson'])->name('instructor.dashboard.lesson.cancel');
});
