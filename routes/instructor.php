<?php

use App\Http\Controllers\Instructor\DashboardController;
use App\Http\Controllers\Instructor\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'instructor', 'middleware' => ['auth', 'instructor']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('instructor.dashboard');
    Route::get('students', [StudentController::class, 'index'])->name('instructor.students');
    Route::get('students/{student:slug}/sessions', [StudentController::class, 'sessions'])->name('instructor.student.sessions');
    // Complete session from dashboard
    Route::post('dashboard/sessions/{session}/complete', [DashboardController::class, 'completeSession'])->name('instructor.dashboard.session.complete');
    // Mark session as missed from dashboard
    Route::post('dashboard/sessions/{session}/missed', [DashboardController::class, 'markSessionAsMissed'])->name('instructor.dashboard.session.missed');
    // Cancel session from dashboard
    Route::post('dashboard/sessions/{session}/cancel', [DashboardController::class, 'cancelSession'])->name('instructor.dashboard.session.cancel');
});
