<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'whatsapp_number',
        'role',
        'is_active',
        'city',
        'state_province',
        'country',
        'timezone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is a parent
     */
    public function isParent(): bool
    {
        return $this->role === 'parent';
    }

    /**
     * Check if user is an instructor
     */
    public function isInstructor(): bool
    {
        return $this->role === 'instructor';
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Scope to get only active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the student profile for this user
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Get all students owned by this user
     */
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Get assigned students (for instructors)
     */
    public function assignedStudents()
    {
        return $this->hasMany(Student::class, 'instructor_id');
    }

    /**
     * Get sessions conducted by this instructor
     */
    public function conductedStudentSessions()
    {
        return $this->hasMany(\App\Models\StudentSession::class, 'instructor_id');
    }

    /**
     * Get sessions for this student
     */
    public function studentSessions()
    {
        return $this->hasMany(\App\Models\StudentSession::class, 'student_id');
    }

    /**
     * Get all subscriptions for this user
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get active subscription for this user
     */
    public function activeSubscription()
    {
        return $this->subscriptions()->where('status', 'completed')->latest();
    }

    /**
     * Get user's current time in their timezone
     */
    public function getCurrentTimeInTimezone(): \Carbon\Carbon
    {
        $timezone = $this->timezone ?? 'UTC';
        return now()->setTimezone($timezone);
    }

    /**
     * Convert a UTC time to user's timezone
     */
    public function convertToUserTimezone(\Carbon\Carbon $utcTime): \Carbon\Carbon
    {
        $timezone = $this->timezone ?? 'UTC';
        return $utcTime->setTimezone($timezone);
    }

    /**
     * Get user's full location string
     */
    public function getFullLocationAttribute(): string
    {
        $parts = array_filter([
            $this->city,
            $this->state_province,
            $this->country,
        ]);

        return implode(', ', $parts);
    }
}
