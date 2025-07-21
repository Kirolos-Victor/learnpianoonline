<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'age',
        'is_subscribed',
        'has_piano',
        'instructor_id',
        'sessions_remaining',
        'subscription_expires_at',
        'day_of_week',
        'preferred_time',
    ];

    protected $casts = [
        'is_subscribed' => 'boolean',
        'has_piano' => 'boolean',
        'subscription_expires_at' => 'datetime',
        'preferred_time' => 'datetime:H:i',
    ];

    /**
     * Boot the model to generate slug on creation
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($student) {
            if (empty($student->slug)) {
                $student->slug = $student->generateUniqueSlug($student->name);
            }
        });

        static::updating(function ($student) {
            if ($student->isDirty('name') && empty($student->slug)) {
                $student->slug = $student->generateUniqueSlug($student->name);
            }
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Generate a unique slug for the student
     */
    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $count = 1;
        $originalSlug = $slug;

        while (static::where('slug', $slug)->where('id', '!=', $this->id ?? 0)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    /**
     * Find student by slug and ensure it belongs to the given user
     */
    public static function findBySlugForUser(string $slug, int $userId): ?self
    {
        return static::where('slug', $slug)->where('user_id', $userId)->first();
    }

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
     * Get all sessions for this student
     */
    public function studentSessions()
    {
        return $this->hasMany(StudentSession::class);
    }

    /**
     * Get completed sessions
     */
    public function completedStudentSessions()
    {
        return $this->studentSessions()->where('status', 'completed');
    }

    /**
     * Get pending sessions
     */
    public function pendingStudentSessions()
    {
        return $this->studentSessions()->where('status', 'pending');
    }

    /**
     * Check if student has remaining sessions
     */
    public function hasAvailableSessions(): bool
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
     * Get messages sent by this student
     */
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id')->where('sender_type', 'student');
    }

    /**
     * Get messages received by this student
     */
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id')->where('receiver_type', 'student');
    }

    /**
     * Get all messages for this student (sent and received)
     */
    public function messages()
    {
        return Message::where(function ($query) {
            $query->where('sender_type', 'student')->where('sender_id', $this->id);
        })->orWhere(function ($query) {
            $query->where('receiver_type', 'student')->where('receiver_id', $this->id);
        })->orderBy('created_at', 'asc');
    }
}
