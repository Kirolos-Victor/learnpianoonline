<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Lesson;
use App\Models\Homework;
use Carbon\Carbon;

class DashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user (parent)
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'is_active' => true,
        ]);

        // Create an instructor
        $instructor = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@example.com',
            'password' => bcrypt('password'),
            'role' => 'instructor',
            'is_active' => true,
        ]);

        // Create students
        $student1 = Student::create([
            'user_id' => $user->id,
            'name' => 'Emma Johnson',
            'age' => 12,
            'is_subscribed' => true,
            'has_piano' => true,
            'lessons_remaining' => 8,
            'subscription_expires_at' => Carbon::now()->addMonths(2),
            'instructor_id' => $instructor->id,
        ]);

        $student2 = Student::create([
            'user_id' => $user->id,
            'name' => 'Michael Chen',
            'age' => 8,
            'is_subscribed' => false,
            'has_piano' => false,
            'lessons_remaining' => 0,
            'instructor_id' => null,
        ]);

        $student3 = Student::create([
            'user_id' => $user->id,
            'name' => 'Sarah Williams',
            'age' => 15,
            'is_subscribed' => true,
            'has_piano' => true,
            'lessons_remaining' => 12,
            'subscription_expires_at' => Carbon::now()->addYear(),
            'instructor_id' => $instructor->id,
        ]);

        // Create lessons for subscribed students
        $lesson1 = Lesson::create([
            'student_id' => $student1->id,
            'instructor_id' => $instructor->id,
            'scheduled_at' => Carbon::now()->addDays(2)->setTime(14, 0), // 2:00 PM in 2 days
            'status' => 'pending',
        ]);

        $lesson2 = Lesson::create([
            'student_id' => $student1->id,
            'instructor_id' => $instructor->id,
            'scheduled_at' => Carbon::now()->subDays(3)->setTime(15, 30), // 3:30 PM 3 days ago
            'completed_at' => Carbon::now()->subDays(3)->setTime(16, 30),
            'status' => 'completed',
        ]);

        $lesson3 = Lesson::create([
            'student_id' => $student3->id,
            'instructor_id' => $instructor->id,
            'scheduled_at' => Carbon::now()->addDays(3)->setTime(16, 0), // 4:00 PM in 3 days
            'status' => 'pending',
        ]);

        $lesson4 = Lesson::create([
            'student_id' => $student3->id,
            'instructor_id' => $instructor->id,
            'scheduled_at' => Carbon::now()->subDays(1)->setTime(14, 30), // 2:30 PM yesterday
            'completed_at' => Carbon::now()->subDays(1)->setTime(15, 30),
            'status' => 'completed',
        ]);

        // Create homework assignments
        Homework::create([
            'title' => 'Practice scales in C major',
            'description' => 'Practice C major scale with both hands, 2 octaves up and down',
            'due_date' => Carbon::now()->addDays(1),
            'lesson_id' => $lesson2->id,
            'student_id' => $student1->id,
            'is_submitted' => false,
        ]);

        Homework::create([
            'title' => 'Complete music theory exercises',
            'description' => 'Complete pages 15-20 in your theory workbook',
            'due_date' => Carbon::now()->subDays(1),
            'lesson_id' => $lesson4->id,
            'student_id' => $student3->id,
            'is_submitted' => true,
            'submitted_at' => Carbon::now()->subDays(2),
        ]);

        // Create some overdue homework
        Homework::create([
            'title' => 'Learn Beethoven Sonata No. 14',
            'description' => 'Practice the first movement, focus on dynamics',
            'due_date' => Carbon::now()->subDays(3),
            'lesson_id' => $lesson2->id,
            'student_id' => $student1->id,
            'is_submitted' => false,
        ]);

        // Create homework due soon
        Homework::create([
            'title' => 'Prepare for recital piece',
            'description' => 'Practice your recital piece with metronome at 120 BPM',
            'due_date' => Carbon::now()->addHours(6),
            'lesson_id' => $lesson3->id,
            'student_id' => $student3->id,
            'is_submitted' => false,
        ]);
    }
}
