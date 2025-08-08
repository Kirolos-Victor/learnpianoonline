<?php

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private chat channel for users (instructors and parents)
Broadcast::channel('chat.{id}', function ($user, $id) {
    // Check if the user ID matches (for instructors and parents connecting to their own channel)
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

    // Check if the user is an instructor and the channel belongs to one of their students' parents
    if ($user->role === 'instructor') {
        $student = Student::where('user_id', $id)->where('instructor_id', $user->id)->first();
        if ($student) {
            return true;
        }
    }

    return false;
});
