<?php

use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\LessonsController;
use App\Http\Controllers\User\PricingController;
use App\Http\Controllers\User\StudentController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('', [HomeController::class, 'index'])->name('home.index');
Route::get('lessons', [LessonsController::class, 'index'])->name('lessons.index');
Route::get('pricing', [PricingController::class, 'index'])->name('pricing.index');
Route::get('contact', [ContactController::class, 'index'])->name('contact.index');

// Payment routes
Route::post('payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

// Test route for pricing calculation (remove in production)
Route::get('test-pricing', function (App\Services\StripeService $stripeService) {
    return response()->json($stripeService->testPricingCalculation());
});

// Student-only routes (require authentication and student role)
Route::middleware(['auth','user'])->group(function () {
    Route::get('home', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('home/student/{studentId}', [DashboardController::class, 'fetchStudentData'])->name('dashboard.student-data');
    Route::get('lessons', [LessonsController::class, 'index'])->name('lessons.index');
    Route::get('lessons/student/{studentId}', [LessonsController::class, 'fetchStudentLessons'])->name('lessons.student-data');
    Route::get('student', [StudentController::class, 'index'])->name('student.index');
    Route::post('student', [StudentController::class, 'store'])->name('student.store');
    Route::put('student/{student}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('student/{student}', [StudentController::class, 'destroy'])->name('student.destroy');
    Route::get('homework/{studentId}/{lessonId}', [LessonsController::class, 'homework'])->name('homework.submission');

    // Payment routes for authenticated users
    Route::get('subscription', [PaymentController::class, 'showSubscription'])->name('user.subscription');
    Route::post('payment/create-session', [PaymentController::class, 'createCheckoutSession'])->name('payment.create-session');
    Route::get('payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('payment/failed', [PaymentController::class, 'failed'])->name('payment.failed');
});

require __DIR__.'/auth.php';
require __DIR__.'/instructor.php';
require __DIR__.'/admin.php';
