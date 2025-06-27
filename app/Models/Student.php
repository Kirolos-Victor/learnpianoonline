<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'age',
        'is_subscribed',
        'has_piano',
        'instructor_id',
        'sessions_remaining',
        'subscription_expires_at',
    ];

    protected $casts = [
        'is_subscribed' => 'boolean',
        'has_piano' => 'boolean',
        'subscription_expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns this student profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the assigned instructor (User with role 'instructor')
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get all lessons for this student
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Get completed lessons
     */
    public function completedLessons()
    {
        return $this->lessons()->where('status', 'completed');
    }

    /**
     * Get pending lessons
     */
    public function pendingLessons()
    {
        return $this->lessons()->where('status', 'pending');
    }

    /**
     * Check if student has remaining sessions
     */
    public function hasRemainingSessions(): bool
    {
        return $this->sessions_remaining > 0;
    }

    /**
     * Add sessions to student's balance
     */
    public function addSessions(int $count): void
    {
        $this->increment('sessions_remaining', $count);
    }

    /**
     * Get all subscriptions for this student
     */
    public function subscriptions()
    {
        return $this->belongsToMany(Subscription::class);
    }

    /**
     * Get all homework assigned to this student
     */
    public function homework()
    {
        return $this->hasMany(Homework::class);
    }

    /**
     * Get pending homework for this student
     */
    public function pendingHomework()
    {
        return $this->homework()->where('is_submitted', false);
    }

    /**
     * Get submitted homework for this student
     */
    public function submittedHomework()
    {
        return $this->homework()->where('is_submitted', true);
    }
}
