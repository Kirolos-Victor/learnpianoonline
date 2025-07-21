import { InstructorChatDashboard } from '@/components/InstructorChatDashboard';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head } from '@inertiajs/react';

export default function InstructorChat() {
    return (
        <InstructorLayout title="Chat">
            <Head title="Instructor Chat" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
                <p className="mt-2 text-gray-600">Communicate with your students in real-time</p>
            </div>

            {/* Chat Dashboard */}
            <InstructorChatDashboard />
        </InstructorLayout>
    );
}
