import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    Plus,
    Eye
} from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    subscriptionStatus: 'active' | 'inactive' | 'expired';
    lastLessonDate: string;
    nextLessonDate: string;
    lessonsCompleted: number;
    lessonsThisMonth: number;
    pendingHomework: number;
    totalStudents: number;
}

const InstructorDashboard = () => {
    // Mock data - in real app this would come from the backend
    const [students] = useState<Student[]>([
        {
            id: '1',
            name: 'Emma Johnson',
            email: 'emma.johnson@email.com',
            subscriptionStatus: 'active',
            lastLessonDate: '2024-03-20',
            nextLessonDate: '2024-03-27',
            lessonsCompleted: 12,
            lessonsThisMonth: 3,
            pendingHomework: 2,
            totalStudents: 8
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            subscriptionStatus: 'active',
            lastLessonDate: '2024-03-19',
            nextLessonDate: '2024-03-26',
            lessonsCompleted: 8,
            lessonsThisMonth: 2,
            pendingHomework: 1,
            totalStudents: 8
        },
        {
            id: '3',
            name: 'Sarah Williams',
            email: 'sarah.williams@email.com',
            subscriptionStatus: 'active',
            lastLessonDate: '2024-03-18',
            nextLessonDate: '2024-03-25',
            lessonsCompleted: 15,
            lessonsThisMonth: 4,
            pendingHomework: 0,
            totalStudents: 8
        },
        {
            id: '4',
            name: 'David Brown',
            email: 'david.brown@email.com',
            subscriptionStatus: 'inactive',
            lastLessonDate: '2024-02-15',
            nextLessonDate: 'N/A',
            lessonsCompleted: 6,
            lessonsThisMonth: 0,
            pendingHomework: 3,
            totalStudents: 8
        }
    ]);

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
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const activeStudents = students.filter(s => s.subscriptionStatus === 'active');
    const totalPendingHomework = students.reduce((sum, s) => sum + s.pendingHomework, 0);
    const totalLessonsThisMonth = students.reduce((sum, s) => sum + s.lessonsThisMonth, 0);

    return (
        <InstructorLayout title="Dashboard">
            <Head title="Instructor Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your students and upcoming activities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeStudents.length} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lessons This Month</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLessonsThisMonth}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPendingHomework}</div>
                        <p className="text-xs text-muted-foreground">
                            Needs review
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Tomorrow</div>
                        <p className="text-xs text-muted-foreground">
                            Emma Johnson - 2:00 PM
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
                            <CardDescription>
                                Manage your assigned students and their progress
                            </CardDescription>
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
                            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarFallback>
                                            {getInitials(student.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                        <p className="text-sm text-gray-600">{student.email}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <Badge className={getStatusColor(student.subscriptionStatus)}>
                                                {student.subscriptionStatus}
                                            </Badge>
                                            <span className="text-sm text-gray-500">
                                                {student.lessonsCompleted} lessons completed
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Next lesson</p>
                                        <p className="font-medium text-gray-900">
                                            {student.nextLessonDate === 'N/A'
                                                ? 'No upcoming lessons'
                                                : new Date(student.nextLessonDate).toLocaleDateString()
                                            }
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
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>

                                        <Button size="sm">
                                            <BookOpen className="h-4 w-4 mr-2" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule New Lesson
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Create Homework Assignment
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Lessons Complete
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <Users className="h-4 w-4 mr-2" />
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
                        <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-900">Lesson Completed</p>
                                <p className="text-xs text-green-700">Emma Johnson - March 20, 2024</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Homework Submitted</p>
                                <p className="text-xs text-blue-700">Michael Chen - March 19, 2024</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-yellow-900">Lesson Rescheduled</p>
                                <p className="text-xs text-yellow-700">Sarah Williams - March 18, 2024</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </InstructorLayout>
    );
};

export default InstructorDashboard;
