<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'instructor_id',
        'scheduled_at',
        'completed_at',
        'screenshot_path',
        'notes',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the student for this lesson
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the instructor (User with role 'instructor') for this lesson
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Check if lesson is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Mark lesson as completed
     */
    public function markAsCompleted(string $screenshotPath = null, string $notes = null): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'screenshot_path' => $screenshotPath,
            'notes' => $notes,
        ]);

        // Reduce student's session balance
        if ($this->student) {
            $this->student->decrement('sessions_remaining');
        }
    }
}
