<?php

namespace App\Jobs;

use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessExpiredSubscriptions implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get yesterday's date (one day after expiration)
        $yesterday = Carbon::yesterday()->toDateString();

        // Find all students whose subscription expired yesterday
        $expiredStudents = Student::where('is_subscribed', true)
            ->whereDate('subscription_expires_at', $yesterday)
            ->get();

        $processedCount = 0;

        foreach ($expiredStudents as $student) {
            // Mark student as unsubscribed
            $student->update([
                'is_subscribed' => false,
                'instructor_id' => null,
                'subscription_expires_at' => null,
            ]);

            $processedCount++;

            Log::info("Processed expired subscription for student: {$student->user->name} (ID: {$student->id})");
        }

        Log::info("ProcessExpiredSubscriptions job completed. Processed {$processedCount} expired subscriptions.");
    }
}
