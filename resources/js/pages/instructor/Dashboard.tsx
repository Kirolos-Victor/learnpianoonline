import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Calendar, CheckCircle, Clock, Eye, Plus, Users } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    email: string;
    subscriptionStatus: 'active' | 'inactive' | 'expired';
    lastLessonDate: string | null;
    nextLessonDate: string;
    lessonsCompleted: number;
    lessonsThisMonth: number;
    pendingHomework: number;
}

interface DashboardStats {
    totalStudents: number;
    activeStudents: number;
    totalLessonsThisMonth: number;
    totalPendingHomework: number;
    nextLesson: {
        student_name: string;
        scheduled_at: string;
        formatted_date: string;
        formatted_time: string;
    } | null;
}

interface RecentActivity {
    type: 'lesson_completed' | 'homework_submitted';
    title: string;
    student_name: string;
    date: string;
    timestamp: string;
}

interface Props {
    students: Student[];
    dashboardStats: DashboardStats;
    recentActivities: RecentActivity[];
}

const InstructorDashboard = ({ students, dashboardStats, recentActivities }: Props) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <InstructorLayout title="Dashboard">
            <Head title="Instructor Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Overview of your students and upcoming activities</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">{dashboardStats.activeStudents} active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lessons This Month</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalLessonsThisMonth}</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalPendingHomework}</div>
                        <p className="text-xs text-muted-foreground">Needs review</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardStats.nextLesson ? dashboardStats.nextLesson.formatted_date : 'No upcoming lessons'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dashboardStats.nextLesson
                                ? `${dashboardStats.nextLesson.student_name} - ${dashboardStats.nextLesson.formatted_time}`
                                : 'Schedule a lesson'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Students List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Your Students</CardTitle>
                            <CardDescription>Manage your assigned students and their progress</CardDescription>
                        </div>
                        <Button className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Student</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                        <p className="text-sm text-gray-600">{student.email}</p>
                                        <div className="mt-1 flex items-center space-x-4">
                                            <Badge className={getStatusColor(student.subscriptionStatus)}>{student.subscriptionStatus}</Badge>
                                            <span className="text-sm text-gray-500">{student.lessonsCompleted} lessons completed</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Next lesson</p>
                                        <p className="font-medium text-gray-900">
                                            {student.nextLessonDate === 'N/A'
                                                ? 'No upcoming lessons'
                                                : new Date(student.nextLessonDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {student.pendingHomework > 0 && (
                                            <Badge variant="destructive" className="flex items-center space-x-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                <span>{student.pendingHomework} homework</span>
                                            </Badge>
                                        )}

                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </Button>

                                        <Button size="sm">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Assign Homework
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule New Lesson
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Create Homework Assignment
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Lessons Complete
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <Users className="mr-2 h-4 w-4" />
                            View All Students
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates and notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center space-x-3 rounded-lg p-2 ${
                                        activity.type === 'lesson_completed' ? 'bg-green-50' : 'bg-blue-50'
                                    }`}
                                >
                                    {activity.type === 'lesson_completed' ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                    )}
                                    <div>
                                        <p
                                            className={`text-sm font-medium ${
                                                activity.type === 'lesson_completed' ? 'text-green-900' : 'text-blue-900'
                                            }`}
                                        >
                                            {activity.title}
                                        </p>
                                        <p className={`text-xs ${activity.type === 'lesson_completed' ? 'text-green-700' : 'text-blue-700'}`}>
                                            {activity.student_name} - {activity.date}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-center">
                                <p className="text-sm text-gray-500">No recent activity</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </InstructorLayout>
    );
};

export default InstructorDashboard;
