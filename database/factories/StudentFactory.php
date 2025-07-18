<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'slug' => null, // Will be auto-generated
            'age' => fake()->numberBetween(5, 18),
            'is_subscribed' => false,
            'has_piano' => fake()->boolean(),
            'instructor_id' => null,
            'sessions_remaining' => 0,
            'subscription_expires_at' => null,
            'day_of_week' => fake()->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
            'preferred_time' => fake()->time('H:i'),
        ];
    }

    /**
     * Indicate that the student is subscribed.
     */
    public function subscribed(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_subscribed' => true,
            'sessions_remaining' => fake()->numberBetween(1, 10),
            'subscription_expires_at' => fake()->dateTimeBetween('now', '+1 year'),
        ]);
    }

    /**
     * Indicate that the student has an instructor assigned.
     */
    public function withInstructor(): static
    {
        return $this->state(fn(array $attributes) => [
            'instructor_id' => User::factory()->create(['role' => 'instructor']),
        ]);
    }
}
