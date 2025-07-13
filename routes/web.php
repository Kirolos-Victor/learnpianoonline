<?php

use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\LessonsController;
use App\Http\Controllers\User\PricingController;
use App\Http\Controllers\User\StudentController;
use App\Http\Controllers\User\SessionsController;
use App\Http\Controllers\Parent\DashboardController as ParentDashboardController;
use App\Http\Controllers\Parent\StudentController as ParentStudentController;
use App\Http\Controllers\Parent\ContactController as ParentContactController;
use App\Http\Controllers\Parent\SubscriptionController as ParentSubscriptionController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\LessonController as StudentLessonController;
use App\Http\Controllers\Student\StudentSessionController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('', [HomeController::class, 'index'])->name('home.index');
Route::get('sessions', [SessionsController::class, 'index'])->name('sessions.index');
Route::get('pricing', [PricingController::class, 'index'])->name('pricing.index');
Route::get('contact', [ContactController::class, 'index'])->name('contact.index');

// Payment routes
Route::post('payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

// Test route for pricing calculation (remove in production)
Route::get('test-pricing', function (App\Services\StripeService $stripeService) {
    return response()->json($stripeService->testPricingCalculation());
});

// Parent routes (require authentication and parent role)
Route::middleware(['auth', 'parent'])->prefix('parent')->name('parent.')->group(function () {
    Route::get('', [ParentDashboardController::class, 'index'])->name('dashboard');
    Route::get('student/{student:slug}', [ParentDashboardController::class, 'selectStudent'])->name('student.select');
    Route::get('students', [ParentStudentController::class, 'index'])->name('students');
    Route::post('students', [ParentStudentController::class, 'store'])->name('students.store');
    Route::put('students/{student:slug}', [ParentStudentController::class, 'update'])->name('students.update');
    Route::delete('students/{student:slug}', [ParentStudentController::class, 'destroy'])->name('students.destroy');
    Route::get('subscription', [ParentSubscriptionController::class, 'index'])->name('subscription');
    Route::get('contact', [ParentContactController::class, 'index'])->name('contact');

    // Payment routes for parents
    Route::post('payment/create-session', [PaymentController::class, 'createCheckoutSession'])->name('payment.create-session');
    Route::get('payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('payment/failed', [PaymentController::class, 'failed'])->name('payment.failed');
});

// Student routes (require authentication and parent role)
Route::middleware(['auth', 'parent'])->prefix('student')->name('student.')->group(function () {
    Route::get('{student:slug}', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('{student:slug}/sessions', [StudentSessionController::class, 'index'])->name('student.sessions');
    Route::get('{student:slug}/homework/{sessionId}', [SessionsController::class, 'homework'])->name('homework');
});

// Legacy routes (for backward compatibility - redirect to appropriate parent/student routes)
Route::middleware(['auth', 'parent'])->group(function () {
    Route::get('home', function () {
        return redirect()->route('parent.dashboard');
    });
    Route::get('home/student/{student:slug}', function ($student) {
        return redirect()->route('student.dashboard', $student);
    });
    Route::get('sessions', function () {
        return redirect()->route('sessions.index');
    })->name('sessions');

    Route::get('sessions/student/{student:slug}', function ($student) {
        return redirect()->route('student.sessions', $student);
    })->name('sessions.student');
    Route::get('student', function () {
        return redirect()->route('parent.students');
    });
    Route::post('student', [StudentController::class, 'store'])->name('student.store');
    Route::put('student/{student}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('student/{student}', [StudentController::class, 'destroy'])->name('student.destroy');
    Route::get('homework/{student:slug}/{sessionId}', [SessionsController::class, 'homework'])->name('homework.submission');
    Route::get('subscription', function () {
        return redirect()->route('parent.subscription');
    });
});

require __DIR__ . '/auth.php';
require __DIR__ . '/instructor.php';
require __DIR__ . '/admin.php';
