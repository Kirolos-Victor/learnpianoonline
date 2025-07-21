<?php

namespace App\Http\Controllers\Student;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    /**
     * Get conversation info for student
     */
    public function getConversation(Request $request, string $studentSlug): JsonResponse
    {
        // Find the student by slug
        $student = Student::where('slug', $studentSlug)->first();
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Check if student has an assigned instructor
        if (!$student->instructor_id) {
            return response()->json([
                'error' => 'No instructor assigned',
                'message' => 'Your instructor will be assigned soon. You can start chatting once they are assigned.'
            ], 404);
        }

        $instructor = User::find($student->instructor_id);

        return response()->json([
            'instructor_id' => $instructor->id,
            'instructor_name' => $instructor->name,
            'student_id' => $student->id,
            'student_name' => $student->name,
        ]);
    }

    /**
     * Get messages between student and instructor
     */
    public function getMessages(Request $request, string $studentSlug): JsonResponse
    {
        // Find the student by slug
        $student = Student::where('slug', $studentSlug)->first();
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Check if student has an assigned instructor
        if (!$student->instructor_id) {
            return response()->json([
                'error' => 'No instructor assigned',
                'message' => 'Your instructor will be assigned soon. You can start chatting once they are assigned.'
            ], 404);
        }

        $instructor = User::find($student->instructor_id);

        // Get messages between student and instructor
        $messages = Message::betweenUserAndStudent($instructor->id, $student->id)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'sender_type' => $message->sender_type,
                    'sender_id' => $message->sender_id,
                    'receiver_type' => $message->receiver_type,
                    'receiver_id' => $message->receiver_id,
                    'sender_name' => $message->sender_name,
                    'receiver_name' => $message->receiver_name,
                    'message' => $message->message,
                    'created_at' => $message->created_at->toISOString(),
                ];
            });

        return response()->json([
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
            ],
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'slug' => $student->slug,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message from student to instructor
     */
    public function sendMessage(Request $request, string $studentSlug): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        // Find the student by slug
        $student = Student::where('slug', $studentSlug)->first();
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Check if student has an assigned instructor
        if (!$student->instructor_id) {
            return response()->json(['error' => 'No instructor assigned'], 404);
        }

        // Save message to DB
        $message = Message::create([
            'sender_type' => 'student',
            'sender_id' => $student->id,
            'receiver_type' => 'user',
            'receiver_id' => $student->instructor_id,
            'message' => $request->message,
        ]);

        // Fire the message event
        broadcast(new MessageSent($message->load(['sender', 'receiver'])))->toOthers();

        return response()->json(['status' => 'Message sent!']);
    }

    /**
     * Get conversations for the authenticated user
     */
    public function conversations(Request $request): JsonResponse
    {
        $user = $request->user();

        // Get conversations for user's students
        $conversations = $user->students()
            ->with('instructor')
            ->get()
            ->map(function ($student) use ($user) {
                if (!$student->instructor_id) {
                    return null;
                }

                // Get last message between student and instructor
                $lastMessage = Message::betweenUserAndStudent($student->instructor_id, $student->id)
                    ->latest()
                    ->first();

                return [
                    'student' => [
                        'id' => $student->id,
                        'name' => $student->name,
                        'slug' => $student->slug,
                    ],
                    'instructor' => [
                        'id' => $student->instructor->id,
                        'name' => $student->instructor->name,
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
            ->filter()
            ->sortByDesc('last_message_at')
            ->values();

        return response()->json($conversations);
    }
}
