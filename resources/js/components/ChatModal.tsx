import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Maximize2, MessageCircle, Minimize2, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import '../lib/echo';

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

    const connectWebSocket = () => {
        if (!user || !instructorId) return;

        // Student needs to listen to TWO channels:
        // 1. Instructor's channel (chat.{instructorId}) - for messages they send
        // 2. Their parent's channel (chat.{user.id}) - for messages they receive

        const instructorChannelName = `chat.${instructorId}`;
        const parentChannelName = `chat.${user.id}`;

        // Disconnect from any existing channels first
        try {
            window.Echo?.leave(instructorChannelName);
            window.Echo?.leave(parentChannelName);
        } catch (e) {
            console.log('No existing channels to leave');
        }

        // Connect to instructor's channel
        window.Echo?.private(instructorChannelName)
            .listen('MessageSent', (e: any) => {
                handleIncomingMessage(e);
            })
            .error((error: any) => {
                console.error('Student WebSocket connection error (instructor channel):', error);
            });

        // Connect to parent's channel (for receiving messages)
        window.Echo?.private(parentChannelName)
            .listen('MessageSent', (e: any) => {
                handleIncomingMessage(e);
            })
            .error((error: any) => {
                console.error('Student WebSocket connection error (parent channel):', error);
            });
    };

    const handleIncomingMessage = (e: any) => {
        if (!user) return;

        console.log('Current user.id:', user.id, 'Instructor ID:', instructorId);
        console.log('Message sender_id:', e.newMessage.sender_id, 'sender_type:', e.newMessage.sender_type);
        console.log('Message receiver_id:', e.newMessage.receiver_id, 'receiver_type:', e.newMessage.receiver_type);

        // Always add the message - let's see what happens
        setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some((msg) => msg.id === e.newMessage.id);
            if (messageExists) {
                console.log('Message already exists, skipping');
                return prev;
            }
            console.log('Adding message to UI:', e.newMessage);
            return [...prev, e.newMessage];
        });
        setTimeout(scrollToBottom, 0);
    };

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

    const getMessages = async () => {
        if (!currentStudentSlug || !user) return;

        try {
            setConversationLoading(true);
            setError(null);
            const response = await axios.get(`/chat/student/${currentStudentSlug}/messages`);
            setMessages(response.data.messages || []);
            setTimeout(scrollToBottom, 0);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No instructor assigned yet. You can start chatting once they are assigned.');
            } else {
                setError('Failed to load messages. Please try again.');
            }
            setMessages([]); // Ensure messages is always an array
        } finally {
            setConversationLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !user || !currentStudentSlug) return;

        try {
            const message = newMessage.trim();
            setNewMessage('');

            // Add message to UI immediately
            const tempMessage: Message = {
                id: Date.now(),
                message: message,
                sender_name: user.name,
                receiver_name: 'Instructor', // Will be updated from server response
                sender_type: 'user',
                sender_id: user.id,
                receiver_type: 'user',
                receiver_id: 0, // Will be updated from server response
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...(prev || []), tempMessage]);

            // Send to server
            const response = await axios.post(`/chat/student/${currentStudentSlug}/messages`, { message });
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

    useEffect(() => {
        if (isOpen && user && currentStudentSlug) {
            getConversation();
            getMessages();
        }
    }, [isOpen, user, currentStudentSlug]);

    useEffect(() => {
        if (instructorId && user) {
            connectWebSocket();
        }

        return () => {
            if (instructorId && user) {
                window.Echo?.leave(`chat.${instructorId}`);
                window.Echo?.leave(`chat.${user.id}`);
            }
        };
    }, [instructorId, user]);

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
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                                        message.sender_id === user?.id
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-foreground'
                                                    }`}
                                                >
                                                    <div className="mb-1 text-xs font-medium">{message.sender_name}</div>
                                                    <div>{message.message}</div>
                                                    <div className="mt-1 text-xs opacity-70">
                                                        {new Date(message.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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
