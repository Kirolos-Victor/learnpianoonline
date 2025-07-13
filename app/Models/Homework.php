<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Homework extends Model
{
    use HasFactory;

    protected $table = 'homework';

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'session_id',
        'student_id',
        'is_submitted',
        'submission_notes',
        'submission_file_path',
        'submitted_at',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'submitted_at' => 'datetime',
        'is_submitted' => 'boolean',
    ];

    /**
     * Get the session this homework is for
     */
    public function session()
    {
        return $this->belongsTo(StudentSession::class);
    }

    /**
     * Get the student this homework is assigned to
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Check if homework is overdue
     */
    public function isOverdue(): bool
    {
        return !$this->is_submitted && $this->due_date->isPast();
    }

    /**
     * Check if homework is due soon (within 24 hours)
     */
    public function isDueSoon(): bool
    {
        return !$this->is_submitted && $this->due_date->diffInHours(now()) <= 24;
    }

    /**
     * Mark homework as submitted
     */
    public function markAsSubmitted(string $notes = null, string $filePath = null): void
    {
        $this->update([
            'is_submitted' => true,
            'submission_notes' => $notes,
            'submission_file_path' => $filePath,
            'submitted_at' => now(),
        ]);
    }
}
