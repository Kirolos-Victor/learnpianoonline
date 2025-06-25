import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { LogOut, Users, BookOpen, Calendar, Settings, Shield, GraduationCap } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
    const { auth } = usePage<SharedData>().props;
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    const navigationItems = [
        { name: 'admin.dashboard', label: 'Dashboard', icon: Shield, href: route('admin.dashboard') },
        { name: 'admin.users', label: 'Users', icon: Users, href: route('admin.users') },
        { name: 'admin.students', label: 'Students', icon: GraduationCap, href: route('admin.students') },
        { name: 'admin.instructors', label: 'Instructors', icon: Shield, href: route('admin.instructors') },
    ];

    const isActive = (path: string) => route().current() === path;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title} />

            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {auth.user.name}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive(item.name)
                                            ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
