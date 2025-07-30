<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $newMessage;
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
        $this->newMessage = [
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
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];

        // Add sender's channel
        if ($this->message->sender_type === 'user' || $this->message->sender_type === 'instructor') {
            $channels[] = new PrivateChannel('chat.' . $this->message->sender_id);
        } elseif ($this->message->sender_type === 'student') {
            // For students, broadcast to their parent's channel
            $student = $this->message->sender;
            if ($student && $student->user_id) {
                $channels[] = new PrivateChannel('chat.' . $student->user_id);
            }
        }

        // Add receiver's channel
        if ($this->message->receiver_type === 'user') {
            $channels[] = new PrivateChannel('chat.' . $this->message->receiver_id);
        } elseif ($this->message->receiver_type === 'student') {
            // For students, broadcast to their parent's channel
            $student = $this->message->receiver;
            if ($student && $student->user_id) {
                $channels[] = new PrivateChannel('chat.' . $student->user_id);
            }
        }

        return $channels;
    }
}
