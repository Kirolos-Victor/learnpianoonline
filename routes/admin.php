<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\InstructorController;
use App\Http\Controllers\Admin\StudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'middleware' => ['auth', 'admin']], function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Parents routes (formerly Users routes)
    Route::get('parents', [UserController::class, 'index'])->name('admin.parents');
    Route::put('parents/{id}', [UserController::class, 'update'])->name('admin.parents.update');
    Route::put('parents/{id}/admin-update', [UserController::class, 'adminUpdateUser'])->name('admin.parents.admin-update');
    Route::patch('parents/{id}/restrict', [UserController::class, 'restrictAccess'])->name('admin.parents.restrict');
    Route::patch('parents/{id}/activate', [UserController::class, 'activateUser'])->name('admin.parents.activate');
    Route::post('parents/assign-instructor', [UserController::class, 'assignInstructor'])->name('admin.parents.assign-instructor');
    Route::patch('parents/{id}/add-sessions', [UserController::class, 'addSessions'])->name('admin.parents.add-sessions');
    Route::patch('parents/{id}/change-instructor', [UserController::class, 'changeInstructor'])->name('admin.parents.change-instructor');
    Route::delete('parents/{id}/remove-student', [UserController::class, 'removeStudent'])->name('admin.parents.remove-student');

    // Instructors routes
    Route::get('instructors', [InstructorController::class, 'index'])->name('admin.instructors');
    Route::post('instructors/add', [InstructorController::class, 'addInstructor'])->name('admin.instructors.add');
    Route::patch('instructors/{id}/restrict', [InstructorController::class, 'restrictAccess'])->name('admin.instructors.restrict');
    Route::patch('instructors/{id}/activate', [InstructorController::class, 'activateInstructor'])->name('admin.instructors.activate');
    Route::patch('instructors/{id}/availability', [InstructorController::class, 'updateAvailability'])->name('admin.instructors.availability');
    Route::get('instructors/{id}/students', [InstructorController::class, 'viewStudents'])->name('admin.instructors.students');

    // Students routes
    Route::get('students', [StudentController::class, 'index'])->name('admin.students');
    Route::get('students/{slug}/sessions', [StudentController::class, 'viewSessions'])->name('admin.students.sessions');
    Route::get('pending-subscribers', [StudentController::class, 'pendingSubscribers'])->name('admin.pending-subscribers');
    Route::post('students/{slug}/available-instructors', [StudentController::class, 'getAvailableInstructors'])->name('admin.students.available-instructors');
    Route::patch('students/{slug}/sessions', [StudentController::class, 'updateSessions'])->name('admin.students.update-sessions');
    Route::patch('students/{slug}/instructor', [StudentController::class, 'changeInstructor'])->name('admin.students.change-instructor');
    Route::patch('pending-subscribers/{slug}/assign-instructor', [StudentController::class, 'assignInstructorToPending'])->name('admin.pending-subscribers.assign-instructor');
});
