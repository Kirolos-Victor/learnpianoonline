<?php

namespace App\Observers;

use App\Models\Student;

class StudentObserver
{
    /**
     * Handle the Student "updated" event.
     */
    public function updated(Student $student): void
    {
        // No longer need to create conversations automatically
        // Messages will be created when users actually send them
    }

    /**
     * Handle the Student "created" event.
     */
    public function created(Student $student): void
    {
        // No longer need to create conversations automatically
        // Messages will be created when users actually send them
    }
}
