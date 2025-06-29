<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\InstructorController;
use App\Http\Controllers\Admin\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'middleware' => ['auth', 'admin']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Users routes
    Route::get('users', [UserController::class, 'index'])->name('admin.users');
    Route::put('users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::put('users/{id}/admin-update', [UserController::class, 'adminUpdateUser'])->name('admin.users.admin-update');
    Route::patch('users/{id}/restrict', [UserController::class, 'restrictAccess'])->name('admin.users.restrict');
    Route::patch('users/{id}/activate', [UserController::class, 'activateUser'])->name('admin.users.activate');
    Route::post('users/assign-instructor', [UserController::class, 'assignInstructor'])->name('admin.users.assign-instructor');
    Route::patch('users/{id}/add-sessions', [UserController::class, 'addSessions'])->name('admin.users.add-sessions');
    Route::patch('users/{id}/change-instructor', [UserController::class, 'changeInstructor'])->name('admin.users.change-instructor');
    Route::delete('users/{id}/remove-student', [UserController::class, 'removeStudent'])->name('admin.users.remove-student');

    // Instructors routes
    Route::get('instructors', [InstructorController::class, 'index'])->name('admin.instructors');
    Route::put('instructors/{id}', [InstructorController::class, 'update'])->name('admin.instructors.update');
    Route::post('instructors/invite', [InstructorController::class, 'inviteInstructor'])->name('admin.instructors.invite');
    Route::patch('instructors/{id}/restrict', [InstructorController::class, 'restrictAccess'])->name('admin.instructors.restrict');
    Route::patch('instructors/{id}/activate', [InstructorController::class, 'activateInstructor'])->name('admin.instructors.activate');
    Route::get('instructors/{id}/students', [InstructorController::class, 'viewStudents'])->name('admin.instructors.students');

    // Students routes
    Route::get('students', [StudentController::class, 'index'])->name('admin.students');
    Route::get('pending-subscribers', [StudentController::class, 'pendingSubscribers'])->name('admin.pending-subscribers');
    Route::patch('students/{id}/sessions', [StudentController::class, 'updateSessions'])->name('admin.students.update-sessions');
    Route::patch('students/{id}/instructor', [StudentController::class, 'changeInstructor'])->name('admin.students.change-instructor');
    Route::patch('pending-subscribers/{id}/assign-instructor', [StudentController::class, 'assignInstructorToPending'])->name('admin.pending-subscribers.assign-instructor');
});
