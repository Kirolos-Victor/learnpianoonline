import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    BookOpen,
    CheckCircle,
    Clock,
    Shield,
    TrendingUp,
    UserX,
    GraduationCap
} from 'lucide-react';

interface Stats {
    total_users: number;
    active_users: number;
    inactive_users: number;
    total_instructors: number;
    active_instructors: number;
    inactive_instructors: number;
    total_students: number;
    subscribed_students: number;
    total_lessons: number;
    completed_lessons: number;
    pending_lessons: number;
    total_sessions_remaining: number;
}

interface RecentLesson {
    id: string;
    student: {
        user: {
            name: string;
        };
    };
    instructor: {
        name: string;
    };
    status: string;
    scheduled_at: string;
    completed_at: string | null;
    screenshot_path: string | null;
}

interface Props {
    stats: Stats;
    recentLessons: RecentLesson[];
}

const AdminDashboard = ({ stats, recentLessons }: Props) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of platform statistics and recent activities</p>
            </div>

            {/* Users Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_users}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active_users} active, {stats.inactive_users} inactive
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Instructors</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_instructors}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active_instructors} active, {stats.inactive_instructors} inactive
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_students}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.subscribed_students} subscribed
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Lessons Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <span>Total Lessons</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.total_lessons}</div>
                        <p className="text-sm text-gray-600 mt-2">
                            All lessons created
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Completed Lessons</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.completed_lessons}</div>
                        <p className="text-sm text-gray-600 mt-2">
                            Lessons with uploaded screenshots
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span>Pending Lessons</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending_lessons}</div>
                        <p className="text-sm text-gray-600 mt-2">
                            Lessons awaiting completion
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Lessons</h2>
                    <Card>
                        <CardContent className="pt-6">
                            {recentLessons.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recent lessons</h3>
                                    <p className="text-gray-600">No lessons have been created yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentLessons.map((lesson) => (
                                        <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {lesson.student.user.name} → {lesson.instructor.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Scheduled: {new Date(lesson.scheduled_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Badge className={getStatusColor(lesson.status)}>
                                                    {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                                                </Badge>
                                                {lesson.screenshot_path && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        Screenshot ✓
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
