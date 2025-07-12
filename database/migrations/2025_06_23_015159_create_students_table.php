<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('age');
            $table->boolean('is_subscribed')->default(false);
            $table->boolean('has_piano')->default(false);
            $table->integer('sessions_remaining')->default(0);
            $table->dateTime('subscription_expires_at')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('instructor_id')->nullable()->constrained('users');
            $table->string('day_of_week');
            $table->time('preferred_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
