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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->enum('sender_type', ['user', 'instructor', 'student']);
            $table->unsignedBigInteger('sender_id');
            $table->enum('receiver_type', ['user', 'instructor', 'student']);
            $table->unsignedBigInteger('receiver_id');
            $table->text('message');
            $table->timestamps();

            // Indexes for better performance
            $table->index(['sender_type', 'sender_id']);
            $table->index(['receiver_type', 'receiver_id']);
            $table->index(['sender_type', 'sender_id', 'receiver_type', 'receiver_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
