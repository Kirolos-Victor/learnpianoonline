import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ChatModal } from './ChatModal';

interface ChatButtonProps {
    currentStudentSlug?: string;
    isSubscribed?: boolean;
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

export function ChatButton({ currentStudentSlug, isSubscribed = false }: ChatButtonProps) {
    const { auth } = usePage<ExtendedPageProps>().props;
    const [isOpen, setIsOpen] = useState(isSubscribed);
    const [totalUnread, setTotalUnread] = useState(0);

    const user = auth.user;

    const getUnreadCount = useCallback(async () => {
        if (!user || !isSubscribed) return;

        try {
            const response = await axios.get('/chat/conversations');
            const total = response.data.reduce((sum: number, conv: any) => sum + (conv.unread_count || 0), 0);
            setTotalUnread(total);
        } catch {
            setTotalUnread(0);
        }
    }, [user, isSubscribed]);

    useEffect(() => {
        if (user && isSubscribed) {
            getUnreadCount();

            // Refresh unread count every 30 seconds
            const interval = setInterval(getUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user, isSubscribed, getUnreadCount]);

    // Only show chat for subscribed students who are authenticated
    if (!isSubscribed || !user) {
        return null;
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} size="lg" className="fixed right-4 bottom-4 z-40 h-14 w-14 rounded-full shadow-lg">
                <MessageCircle className="h-6 w-6" />
                {totalUnread > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs">
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </Badge>
                )}
            </Button>

            <ChatModal isOpen={isOpen} onToggle={() => setIsOpen(false)} currentStudentSlug={currentStudentSlug} />
        </>
    );
}
