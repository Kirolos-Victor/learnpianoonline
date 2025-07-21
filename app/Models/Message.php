<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_type', // 'instructor', 'user', or 'student'
        'sender_id',   // user_id or student_id
        'receiver_type', // 'instructor', 'user', or 'student'
        'receiver_id',   // user_id or student_id
        'message',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the sender (User or Student)
     */
    public function sender()
    {
        if ($this->sender_type === 'student') {
            return $this->belongsTo(Student::class, 'sender_id');
        }
        // Both 'user' and 'instructor' types refer to User model
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the receiver (User or Student)
     */
    public function receiver()
    {
        if ($this->receiver_type === 'student') {
            return $this->belongsTo(Student::class, 'receiver_id');
        }
        // Both 'user' and 'instructor' types refer to User model
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Get the sender name for display
     */
    public function getSenderNameAttribute(): string
    {
        if ($this->sender_type === 'student') {
            return $this->sender->name ?? 'Student';
        }
        if ($this->sender_type === 'instructor') {
            return $this->sender->name ?? 'Instructor';
        }
        return $this->sender->name ?? 'User';
    }

    /**
     * Get the receiver name for display
     */
    public function getReceiverNameAttribute(): string
    {
        if ($this->receiver_type === 'student') {
            return $this->receiver->name ?? 'Student';
        }
        if ($this->receiver_type === 'instructor') {
            return $this->receiver->name ?? 'Instructor';
        }
        return $this->receiver->name ?? 'User';
    }

    /**
     * Scope to get messages between a user and a student
     */
    public function scopeBetweenUserAndStudent($query, $userId, $studentId)
    {
        return $query->where(function ($q) use ($userId, $studentId) {
            // User/Instructor -> Student
            $q->whereIn('sender_type', ['user', 'instructor'])
                ->where('sender_id', $userId)
                ->where('receiver_type', 'student')
                ->where('receiver_id', $studentId);
        })->orWhere(function ($q) use ($userId, $studentId) {
            // Student -> User/Instructor (through parent)
            $q->where('sender_type', 'student')
                ->where('sender_id', $studentId)
                ->whereIn('receiver_type', ['user', 'instructor'])
                ->where('receiver_id', $userId);
        });
    }

    /**
     * Scope to get messages for a student (with their instructor)
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where(function ($q) use ($studentId) {
            $q->where('sender_type', 'student')
                ->where('sender_id', $studentId);
        })->orWhere(function ($q) use ($studentId) {
            $q->where('receiver_type', 'student')
                ->where('receiver_id', $studentId);
        });
    }
}
