<?php

use App\Http\Controllers\Instructor\DashboardController;
use App\Http\Controllers\Instructor\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'instructor', 'middleware' => ['auth', 'instructor']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('instructor.dashboard');
    Route::get('students', [StudentController::class, 'index'])->name('instructor.students');
    // Complete lesson from dashboard
    Route::post('dashboard/lessons/{lesson}/complete', [DashboardController::class, 'completeLesson'])->name('instructor.dashboard.lesson.complete');
});
