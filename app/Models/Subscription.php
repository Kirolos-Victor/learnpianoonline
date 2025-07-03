<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stripe_session_id',
        'stripe_payment_intent_id',
        'amount',
        'student_count',
        'subscription_type',
        'status',
        'student_ids',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'student_ids' => 'array',
        'paid_at' => 'datetime',
    ];

    /**
     * Get the user that owns this subscription
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the students included in this subscription
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'subscription_student');
    }

    /**
     * Check if subscription is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if subscription is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if subscription failed
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }
}
