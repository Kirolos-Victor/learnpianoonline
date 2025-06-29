import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LogOut, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface InstructorLayoutProps {
    children: ReactNode;
    title?: string;
}

const InstructorLayout = ({ children, title }: InstructorLayoutProps) => {
    const { auth } = usePage<SharedData>().props;
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    const navigationItems = [
        { name: 'instructor.dashboard', label: 'Dashboard', icon: Users, href: route('instructor.dashboard') },
        { name: 'instructor.students', label: 'Students', icon: Users, href: route('instructor.students') },
        // { name: 'instructor.lessons', label: 'Lessons', icon: BookOpen, href: route('instructor.lessons') },
        // { name: 'instructor.schedule', label: 'Schedule', icon: Calendar, href: route('instructor.schedule') },
        // { name: 'instructor.settings', label: 'Settings', icon: Settings, href: route('instructor.settings') },
    ];

    const isActive = (path: string) => route().current() === path;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title} />

            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Instructor Panel</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {auth.user.name}</span>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="min-h-screen w-64 border-r border-gray-200 bg-white">
                    <nav className="mt-8">
                        <div className="space-y-2 px-4">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive(item.name)
                                            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
};

export default InstructorLayout;
