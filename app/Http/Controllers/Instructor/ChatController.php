<?php

namespace App\Http\Controllers\Instructor;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Get conversations for the instructor
     */
    public function getConversations(Request $request): JsonResponse
    {
        $instructor = $request->user();

        // Get all students assigned to this instructor
        $students = Student::where('instructor_id', $instructor->id)
            ->with('user')
            ->get();

        $conversations = $students->map(function ($student) use ($instructor) {
            // Get last message between instructor and student
            $lastMessage = Message::betweenUserAndStudent($instructor->id, $student->id)
                ->latest()
                ->first();

            return [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'slug' => $student->slug,
                ],
                'parent' => [
                    'id' => $student->user->id,
                    'name' => $student->user->name,
                ],
                'last_message' => $lastMessage ? [
                    'message' => $lastMessage->message,
                    'sender_type' => $lastMessage->sender_type,
                    'sender_id' => $lastMessage->sender_id,
                    'created_at' => $lastMessage->created_at->toISOString(),
                ] : null,
                'last_message_at' => $lastMessage ? $lastMessage->created_at->toISOString() : null,
            ];
        })
            ->sortByDesc('last_message_at')
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get messages between instructor and student
     */
    public function getMessages(Request $request, int $studentId): JsonResponse
    {
        $instructor = $request->user();

        Log::info('Getting messages for instructor', [
            'instructor_id' => $instructor->id,
            'student_id' => $studentId
        ]);

        // Find the student and ensure they're assigned to this instructor
        $student = Student::where('id', $studentId)
            ->where('instructor_id', $instructor->id)
            ->with('user')
            ->first();

        if (!$student) {
            Log::warning('Student not found or not assigned to instructor', [
                'instructor_id' => $instructor->id,
                'student_id' => $studentId
            ]);
            return response()->json(['error' => 'Student not found or not assigned to you'], 404);
        }

        // Get only the latest 5 messages between instructor and student for performance
        $messages = Message::betweenUserAndStudent($instructor->id, $student->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->reverse() // Reverse to show oldest first
            ->map(function ($message) {
                // Safely get sender and receiver names without problematic eager loading
                $senderName = 'Unknown';
                $receiverName = 'Unknown';

                if ($message->sender_type === 'student') {
                    $sender = Student::find($message->sender_id);
                    $senderName = $sender ? $sender->name : 'Student';
                } else {
                    $sender = User::find($message->sender_id);
                    $senderName = $sender ? $sender->name : 'Instructor';
                }

                if ($message->receiver_type === 'student') {
                    $receiver = Student::find($message->receiver_id);
                    $receiverName = $receiver ? $receiver->name : 'Student';
                } else {
                    $receiver = User::find($message->receiver_id);
                    $receiverName = $receiver ? $receiver->name : 'Instructor';
                }

                return [
                    'id' => $message->id,
                    'sender_type' => $message->sender_type,
                    'sender_id' => $message->sender_id,
                    'receiver_type' => $message->receiver_type,
                    'receiver_id' => $message->receiver_id,
                    'sender_name' => $senderName,
                    'receiver_name' => $receiverName,
                    'message' => $message->message,
                    'created_at' => $message->created_at->toISOString(),
                ];
            });

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'slug' => $student->slug,
            ],
            'parent' => [
                'id' => $student->user->id,
                'name' => $student->user->name,
            ],
            'messages' => $messages->values()->toArray(),
        ]);
    }

    /**
     * Send a message from instructor to student
     */
    public function sendMessage(Request $request, int $studentId): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ], [
            'message.required' => 'Message content is required.',
            'message.string' => 'Message must be valid text.',
            'message.max' => 'Message cannot exceed 1000 characters.',
        ]);

        $instructor = $request->user();

        // Find the student and ensure they're assigned to this instructor
        $student = Student::where('id', $studentId)
            ->where('instructor_id', $instructor->id)
            ->first();

        if (!$student) {
            return response()->json(['error' => 'Student not found or not assigned to you'], 404);
        }

        // Save message to DB
        $message = Message::create([
            'sender_type' => 'instructor',
            'sender_id' => $instructor->id,
            'receiver_type' => 'student',
            'receiver_id' => $student->id,
            'message' => $request->message,
        ]);

        // DISABLED: Laravel Reverb broadcasting not available in Laravel Cloud
        // broadcast(new MessageSent($message))->toOthers();

        return response()->json(['status' => 'Message sent!']);
    }
}
