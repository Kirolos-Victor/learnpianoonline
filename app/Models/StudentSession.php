<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentSession extends Model
{
    use HasFactory;

    protected $table = 'student_sessions';

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
     * Get the student for this session
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the instructor (User with role 'instructor') for this session
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Check if session is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Mark session as completed
     */
    public function markAsCompleted(?string $screenshotPath = null, ?string $notes = null): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'screenshot_path' => $screenshotPath,
            'notes' => $notes,
        ]);

        // Decrement student's remaining sessions
        $this->student->decrement('sessions_remaining');
    }

    /**
     * Mark session as missed
     */
    public function markAsMissed(?string $notes = null): void
    {
        $this->update([
            'status' => 'missed',
            'completed_at' => now(),
            'notes' => $notes,
        ]);

        // Reduce student's session balance (missed sessions still count)
        if ($this->student) {
            $this->student->decrement('sessions_remaining');
        }
    }

    /**
     * Mark session as cancelled by instructor
     */
    public function markAsCancelled(string $notes): void
    {
        $this->update([
            'status' => 'cancelled',
            'completed_at' => now(),
            'notes' => $notes,
        ]);

        // Decrement student's remaining sessions if it was a no-show
        $this->student->decrement('sessions_remaining');

        // Create replacement session one week after the latest scheduled session
        $this->scheduleReplacementSession();
    }

    /**
     * Check if session has an instructor assigned
     */
    public function hasInstructor(): bool
    {
        return ! is_null($this->instructor_id);
    }

    /**
     * Assign an instructor to this session
     */
    public function assignInstructor(int $instructorId): void
    {
        $this->update([
            'instructor_id' => $instructorId,
            'notes' => $this->notes ? $this->notes.' - Instructor assigned' : 'Instructor assigned',
        ]);
    }

    /**
     * Schedule a replacement session one week after the latest scheduled session
     */
    private function scheduleReplacementSession(): void
    {
        if (! $this->student) {
            return;
        }

        // Find the latest scheduled session for this student
        $latestSession = StudentSession::where('student_id', $this->student->id)
            ->orderBy('scheduled_at', 'desc')
            ->first();

        // Schedule replacement session one week after the latest session
        $replacementDateTime = $latestSession
            ? $latestSession->scheduled_at->addWeek()
            : $this->scheduled_at->addWeek();

        StudentSession::create([
            'student_id' => $this->student->id,
            'instructor_id' => $this->instructor_id, // Can be null
            'scheduled_at' => $replacementDateTime,
            'status' => 'pending',
            'notes' => 'Replacement session for cancelled session on '.$this->scheduled_at->format('Y-m-d'),
        ]);
    }
}
