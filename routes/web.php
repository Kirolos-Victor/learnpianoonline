<?php

use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\LessonsController;
use App\Http\Controllers\User\PricingController;
use App\Http\Controllers\User\StudentController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('', [HomeController::class, 'index'])->name('home.index');
Route::get('lessons', [LessonsController::class, 'index'])->name('lessons.index');
Route::get('pricing', [PricingController::class, 'index'])->name('pricing.index');
Route::get('contact', [ContactController::class, 'index'])->name('contact.index');

// Student-only routes (require authentication and student role)
Route::middleware(['auth', 'student'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('student', [StudentController::class, 'index'])->name('student.index');
    Route::get('homework/{studentId}/{lessonId}', [LessonsController::class, 'homework'])->name('homework.submission');
});

require __DIR__.'/auth.php';
require __DIR__.'/instructor.php';
require __DIR__.'/admin.php';
