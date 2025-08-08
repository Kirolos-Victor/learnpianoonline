import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { MessageCircle, Search, Send } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
// DISABLED: Laravel Reverb not available in Laravel Cloud
// import '../lib/echo';

interface Message {
    id: number;
    message: string;
    sender_name: string;
    receiver_name: string;
    sender_type: 'instructor' | 'user' | 'student';
    sender_id: number;
    receiver_type: 'instructor' | 'user' | 'student';
    receiver_id: number;
    created_at: string;
}

interface Conversation {
    student: {
        id: number;
        name: string;
        slug: string;
    };
    parent: {
        id: number;
        name: string;
    };
    last_message?: {
        message: string;
        sender_id: number;
        created_at: string;
    };
    last_message_at?: string;
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

export function InstructorChatDashboard() {
    const { auth } = usePage<ExtendedPageProps>().props;
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const user = auth.user;

    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // DISABLED: Laravel Reverb WebSocket - Using polling instead
    // const connectWebSocket = () => {
    //     if (!user) return;
    //     // WebSocket code commented out - using message polling for real-time updates
    // };

    const getMessages = useCallback(
        async (isPolling = false) => {
            if (!selectedConversation) return;

            try {
                if (!isPolling) setLoading(true);
                const response = await axios.get(`/instructor/chat/students/${selectedConversation.student.id}/messages`);
                const allMessages = response.data.messages || [];
                // Keep only the latest 5 messages for optimal performance
                const latestMessages = allMessages.slice(-5);
                setMessages(latestMessages);
            } catch {
                // Handle error silently
            } finally {
                if (!isPolling) setLoading(false);
            }
        },
        [selectedConversation],
    );

    const getConversations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/instructor/chat/conversations');
            setConversations(response.data);
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user) return;

        try {
            const message = newMessage.trim();
            setNewMessage('');

            // Send to server - polling will pick up the new message
            await axios.post(`/instructor/chat/students/${selectedConversation.student.id}/messages`, {
                message: message,
            });
            // Immediately refresh messages to show the sent message
            await getMessages(true);
        } catch (err: any) {
            console.error('Error sending message:', err);
            // Handle error silently
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Initial load effect
    useEffect(() => {
        getConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            getMessages();
        }
    }, [selectedConversation, getMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling effect for real-time updates
    useEffect(() => {
        if (!selectedConversation) return;

        // Set up polling for new messages every 5 seconds
        const pollInterval = setInterval(() => {
            getMessages(true); // Pass true to indicate this is polling
        }, 5000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [selectedConversation, getMessages]);

    const filteredConversations = conversations.filter((conv) => conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Conversations
                    </CardTitle>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[calc(100vh-300px)] space-y-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-muted-foreground">Loading...</div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No conversations found</div>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.student.id}
                                    className={cn(
                                        'cursor-pointer p-4 transition-colors hover:bg-muted/50',
                                        selectedConversation?.student.id === conversation.student.id && 'bg-muted',
                                    )}
                                    onClick={() => setSelectedConversation(conversation)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>
                                                {conversation.student.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="truncate font-medium">{conversation.student.name}</h4>
                                                {conversation.last_message && (
                                                    <div className="truncate text-sm text-muted-foreground">{conversation.last_message.message}</div>
                                                )}
                                                {conversation.last_message_at && (
                                                    <div className="text-xs text-muted-foreground">{formatDate(conversation.last_message_at)}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="flex flex-col lg:col-span-2">
                <CardHeader>
                    <CardTitle>{selectedConversation ? `Chat with ${selectedConversation.student.name}` : 'Select a conversation'}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-0">
                    {!selectedConversation ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <MessageCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p>Select a student to start chatting</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="messages-container flex-1 space-y-2 overflow-y-auto p-4">
                                {loading ? (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-muted-foreground">Loading...</div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-muted-foreground">No messages yet</div>
                                    </div>
                                ) : (
                                    messages.map((message) => {
                                        // Determine if this is the instructor's own message
                                        const isInstructorMessage = message.sender_type === 'instructor';

                                        return (
                                            <div key={message.id} className={cn('flex', isInstructorMessage ? 'justify-end' : 'justify-start')}>
                                                <div
                                                    className={cn(
                                                        'max-w-[70%] rounded-lg px-3 py-2 text-sm',
                                                        isInstructorMessage ? 'bg-primary text-primary-foreground' : 'bg-muted',
                                                    )}
                                                >
                                                    <div className="mb-1 text-xs font-medium">
                                                        {isInstructorMessage ? 'You' : selectedConversation?.student.name || 'Student'}
                                                    </div>
                                                    <div>{message.message}</div>
                                                    <div className="mt-1 text-xs opacity-70">{formatTime(message.created_at)}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
