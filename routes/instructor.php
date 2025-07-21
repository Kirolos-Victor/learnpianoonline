<?php

use App\Http\Controllers\Instructor\DashboardController;
use App\Http\Controllers\Instructor\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'instructor', 'middleware' => ['auth', 'instructor']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('instructor.dashboard');
    Route::get('chat', function () {
        return inertia('instructor/Chat');
    })->name('instructor.chat');
    Route::get('students', [StudentController::class, 'index'])->name('instructor.students');
    Route::get('students/{student:slug}/sessions', [StudentController::class, 'sessions'])->name('instructor.student.sessions');
    // Complete session from dashboard
    Route::post('dashboard/sessions/{session}/complete', [DashboardController::class, 'completeSession'])->name('instructor.dashboard.session.complete');
    // Mark session as missed from dashboard
    Route::post('dashboard/sessions/{session}/missed', [DashboardController::class, 'markSessionAsMissed'])->name('instructor.dashboard.session.missed');
    // Cancel session from dashboard
    Route::post('dashboard/sessions/{session}/cancel', [DashboardController::class, 'cancelSession'])->name('instructor.dashboard.session.cancel');
});

// Instructor chat routes
Route::middleware(['auth', 'instructor'])->prefix('instructor/chat')->name('instructor.chat.')->group(function () {
    Route::get('conversations', [App\Http\Controllers\Instructor\ChatController::class, 'getConversations'])->name('conversations');
    Route::get('students/{studentId}/messages', [App\Http\Controllers\Instructor\ChatController::class, 'getMessages'])->name('messages');
    Route::post('students/{studentId}/messages', [App\Http\Controllers\Instructor\ChatController::class, 'sendMessage'])->name('send-message');
});
