import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Maximize2, MessageCircle, Minimize2, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
// DISABLED: Laravel Reverb not available in Laravel Cloud
// import '../lib/echo';

interface Message {
    id: number;
    message: string;
    sender_name: string;
    receiver_name: string;
    sender_type: 'user' | 'student';
    sender_id: number;
    receiver_type: 'user' | 'student';
    receiver_id: number;
    created_at: string;
}

interface ChatModalProps {
    isOpen: boolean;
    onToggle: () => void;
    currentStudentSlug?: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface ExtendedPageProps extends PageProps {
    auth: {
        user: AuthUser | null;
    };
}

export function ChatModal({ isOpen, onToggle, currentStudentSlug }: ChatModalProps) {
    const { auth } = usePage<ExtendedPageProps>().props;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationLoading, setConversationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [instructorId, setInstructorId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const user = auth.user;

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // DISABLED: Laravel Reverb WebSocket - Using polling instead
    // const connectWebSocket = () => {
    //     if (!user || !instructorId) return;
    //     // WebSocket code commented out - using message polling for real-time updates
    // };

    // DISABLED: WebSocket message handler - Using polling instead
    // const handleIncomingMessage = (e: any) => {
    //     // WebSocket message handling commented out
    // };

    const getConversation = async () => {
        if (!currentStudentSlug || !user) return;

        try {
            setConversationLoading(true);
            setError(null);
            const response = await axios.get(`/chat/student/${currentStudentSlug}/conversation`);
            setInstructorId(response.data.instructor_id);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No instructor assigned yet. You can start chatting once they are assigned.');
            } else {
                setError('Failed to load conversation. Please try again.');
            }
            setInstructorId(null);
        } finally {
            setConversationLoading(false);
        }
    };

    const getMessages = async (isPolling = false) => {
        if (!currentStudentSlug || !user) return;

        try {
            if (!isPolling) setConversationLoading(true);
            setError(null);
            const response = await axios.get(`/chat/student/${currentStudentSlug}/messages`);
            const allMessages = response.data.messages || [];
            // Keep only the latest 5 messages for optimal performance
            const latestMessages = allMessages.slice(-5);
            setMessages(latestMessages);
            setTimeout(scrollToBottom, 0);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No instructor assigned yet. You can start chatting once they are assigned.');
            } else {
                setError('Failed to load messages. Please try again.');
            }
            setMessages([]); // Ensure messages is always an array
        } finally {
            if (!isPolling) setConversationLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !user || !currentStudentSlug) return;

        try {
            const message = newMessage.trim();
            setNewMessage('');

            // Send to server - polling will pick up the new message
            const response = await axios.post(`/chat/student/${currentStudentSlug}/messages`, { message });
            // Immediately refresh messages to show the sent message
            await getMessages(true);
        } catch (err: any) {
            setError('Failed to send message');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Initial load effect
    useEffect(() => {
        if (isOpen && user && currentStudentSlug) {
            getConversation();
            getMessages();
        }
    }, [isOpen, user, currentStudentSlug]);

    // Polling effect for real-time updates
    useEffect(() => {
        if (!isOpen || !instructorId || !currentStudentSlug) return;

        // Set up polling for new messages every 2 seconds
        const pollInterval = setInterval(() => {
            getMessages(true); // Pass true to indicate this is polling
        }, 2000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [isOpen, instructorId, currentStudentSlug]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!isOpen) return null;

    if (!user) {
        return (
            <div className="fixed right-4 bottom-4 z-50">
                <Card className="w-80 shadow-lg">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Please log in to access chat</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed right-4 bottom-4 z-50">
            <Card className={`w-80 shadow-lg ${isMinimized ? 'h-16' : 'h-96'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <MessageCircle className="h-4 w-4" />
                        Chat with Instructor
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)}>
                            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onToggle}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="flex h-80 flex-col">
                        {error && (
                            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                                <p>{error}</p>
                            </div>
                        )}

                        {!error && (
                            <>
                                <div className="mb-4 flex-1 space-y-2 overflow-y-auto">
                                    {conversationLoading ? (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-muted-foreground">Connecting to chat...</p>
                                        </div>
                                    ) : loading ? (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-muted-foreground">Loading messages...</p>
                                        </div>
                                    ) : !messages || messages.length === 0 ? (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-muted-foreground">No messages yet</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            // Determine if this is the student's own message
                                            // Student messages have sender_type: 'student' and match the current student
                                            const isStudentMessage = message.sender_type === 'student';

                                            return (
                                                <div key={message.id} className={`flex ${isStudentMessage ? 'justify-end' : 'justify-start'}`}>
                                                    <div
                                                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                                            isStudentMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        <div className="mb-1 text-xs font-medium">{isStudentMessage ? 'You' : 'Instructor'}</div>
                                                        <div>{message.message}</div>
                                                        <div className="mt-1 text-xs opacity-70">
                                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={scrollRef} />
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button onClick={sendMessage} disabled={!newMessage.trim()} size="sm">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
