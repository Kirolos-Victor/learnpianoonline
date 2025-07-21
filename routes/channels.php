<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Models\Student;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private chat channel for users (instructors and parents)
Broadcast::channel('chat.{id}', function ($user, $id) {
    // Check if the user ID matches (for instructors and parents)
    if ((int) $user->id === (int) $id) {
        return true;
    }

    // Check if the user is a parent and has a student with this instructor
    if ($user->role === 'parent') {
        $student = Student::where('user_id', $user->id)->first();
        if ($student && $student->instructor_id == $id) {
            return true;
        }
    }

    return false;
});
