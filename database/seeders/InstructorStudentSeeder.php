<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Lesson;
use Illuminate\Support\Facades\Hash;

class InstructorStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create instructor
        $instructor = User::create([
            'name' => 'John Instructor',
            'email' => 'instructor@example.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
            'is_active' => true,
        ]);

        // Create students
        $student1 = User::create([
            'name' => 'Alice Student',
            'email' => 'alice@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
        ]);

        $student2 = User::create([
            'name' => 'Bob Student',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
        ]);

        // Create student profiles
        $studentProfile1 = Student::create([
            'user_id' => $student1->id,
            'name' => $student1->name,
            'age' => 25,
            'instructor_id' => $instructor->id,
            'sessions_remaining' => 10,
            'is_subscribed' => true,
        ]);

        $studentProfile2 = Student::create([
            'user_id' => $student2->id,
            'name' => $student2->name,
            'age' => 30,
            'instructor_id' => $instructor->id,
            'sessions_remaining' => 5,
            'is_subscribed' => false,
        ]);

        // Create lessons for each student
        for ($i = 1; $i <= 3; $i++) {
            $status = $i === 1 ? 'completed' : 'pending';
            $completedAt = $i === 1 ? now()->subDays($i) : null;

            \App\Models\Lesson::create([
                'student_id' => $studentProfile1->id,
                'instructor_id' => $instructor->id,
                'scheduled_at' => now()->addDays($i * 7),
                'completed_at' => $completedAt,
                'status' => $status,
                'notes' => $i === 1 ? 'Great progress with scales!' : null,
            ]);
        }

        for ($i = 1; $i <= 3; $i++) {
            $status = $i === 1 ? 'completed' : 'pending';
            $completedAt = $i === 1 ? now()->subDays($i) : null;

            \App\Models\Lesson::create([
                'student_id' => $studentProfile2->id,
                'instructor_id' => $instructor->id,
                'scheduled_at' => now()->addDays($i * 7),
                'completed_at' => $completedAt,
                'status' => $status,
                'notes' => $i === 1 ? 'Great progress with scales!' : null,
            ]);
        }
    }
}
