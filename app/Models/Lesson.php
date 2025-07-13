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
    public function markAsCompleted(?string $screenshotPath = null, ?string $notes = null): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'screenshot_path' => $screenshotPath,
            'notes' => $notes,
        ]);

        // Decrement student's remaining lessons
        $this->student->decrement('lessons_remaining');
    }

    /**
     * Mark lesson as missed
     */
    public function markAsMissed(?string $notes = null): void
    {
        $this->update([
            'status' => 'missed',
            'completed_at' => now(),
            'notes' => $notes,
        ]);

        // Reduce student's session balance (missed lessons still count)
        if ($this->student) {
            $this->student->decrement('sessions_remaining');
        }
    }

    /**
     * Mark lesson as cancelled by instructor
     */
    public function markAsCancelled(string $notes): void
    {
        $this->update([
            'status' => 'cancelled',
            'completed_at' => now(),
            'notes' => $notes,
        ]);

        // Decrement student's remaining lessons if it was a no-show
        $this->student->decrement('lessons_remaining');

        // Create replacement lesson one week after the latest scheduled lesson
        $this->scheduleReplacementLesson();
    }

    /**
     * Schedule a replacement lesson one week after the latest scheduled lesson
     */
    private function scheduleReplacementLesson(): void
    {
        if (!$this->student || !$this->instructor) {
            return;
        }

        // Find the latest scheduled lesson for this student
        $latestLesson = Lesson::where('student_id', $this->student->id)
            ->where('instructor_id', $this->instructor_id)
            ->orderBy('scheduled_at', 'desc')
            ->first();

        // Schedule replacement lesson one week after the latest lesson
        $replacementDateTime = $latestLesson
            ? $latestLesson->scheduled_at->addWeek()
            : $this->scheduled_at->addWeek();

        Lesson::create([
            'student_id' => $this->student->id,
            'instructor_id' => $this->instructor_id,
            'scheduled_at' => $replacementDateTime,
            'status' => 'pending',
            'notes' => 'Replacement lesson for cancelled lesson on ' . $this->scheduled_at->format('Y-m-d'),
        ]);
    }

    /**
     * Get homework assigned for this lesson
     */
    public function homework()
    {
        return $this->hasMany(Homework::class);
    }
}
