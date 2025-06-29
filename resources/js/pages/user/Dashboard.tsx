import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, CalendarDays, CheckCircle, Clock, Upload, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
    age: number;
    hasPiano: boolean;
    isSubscribed: boolean;
    subscriptionType?: 'monthly' | 'yearly';
    subscriptionEndDate?: string;
    sessionsRemaining: number;
    instructor?: {
        id: string;
        name: string;
    };
}

interface Lesson {
    id: string;
    title: string;
    instructor: string;
    date: string;
    time: string;
    status: 'completed' | 'pending' | 'cancelled';
    type: 'private' | 'group';
    scheduledAt: string;
}

interface Homework {
    id: string;
    title: string;
    dueDate: string;
    isSubmitted: boolean;
    lessonTitle: string;
    description?: string;
    isOverdue: boolean;
    isDueSoon: boolean;
}

interface StudentData {
    student: Student;
    lessons: Lesson[];
    homework: Homework[];
}

interface DashboardSharedData extends SharedData {
    students: Student[];
    selectedStudentData: StudentData | null;
    selectedStudentId?: string;
}

const Dashboard = () => {
    const { auth, subscribePrice, students, selectedStudentData, selectedStudentId } = usePage<DashboardSharedData>().props;
    const [loading, setLoading] = useState(false);

    // Handle student selection change using Inertia
    const handleStudentChange = (studentId: string) => {
        setLoading(true);
        console.log(selectedStudent, selectedStudentId);

        router.visit(`/home/student/${studentId}`, {
            method: 'get',
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const selectedStudent = selectedStudentData?.student;
    const currentLessons = selectedStudentData?.lessons || [];
    const upcomingLesson = currentLessons.find((lesson) => lesson.status === 'pending');
    const pendingHomework = selectedStudentData?.homework?.filter((hw) => !hw.isSubmitted) || [];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <Head title={'Dashboard'}></Head>

                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="font-playfair mb-2 text-3xl font-bold text-primary md:text-4xl">Welcome back, {auth.user.name}! 🎹</h1>
                            </div>

                            {/* Student Selector - only show if there are students */}
                            {students.length > 0 && (
                                <div className="mt-4 md:mt-0">
                                    <Label className="mb-2 block text-sm font-medium text-primary">Select Student</Label>
                                    <Select value={selectedStudentId ? selectedStudent?.id : ''} onValueChange={handleStudentChange}>
                                        <SelectTrigger className="w-full md:w-64">
                                            <SelectValue placeholder="Choose a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{student.name}</span>
                                                        {student.isSubscribed && (
                                                            <Badge className="bg-green-100 text-xs text-green-800">Subscribed</Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {loading ? (
                        <div className="mx-auto max-w-4xl">
                            <Card className="border-gold/20">
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="border-gold mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                                        <p className="text-muted-foreground">Loading student data...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : students.length === 0 ? (
                        /* No Students - Prompt to Add Student */
                        <div className="mx-auto max-w-2xl">
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-2xl text-blue-800">Welcome to Your Piano Journey! 🎹</CardTitle>
                                    <CardDescription className="text-lg text-blue-600">
                                        Let's get started by adding your first student
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 text-center">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-4 text-blue-700">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold text-blue-800">
                                                    1
                                                </div>
                                                <span>Add Student</span>
                                            </div>
                                            <div className="h-px w-8 bg-blue-300"></div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold text-blue-800">
                                                    2
                                                </div>
                                                <span>Subscribe</span>
                                            </div>
                                            <div className="h-px w-8 bg-blue-300"></div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold text-blue-800">
                                                    3
                                                </div>
                                                <span>Start Learning</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="rounded-lg border border-blue-200 bg-white p-4 text-center">
                                                <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                                                <h3 className="font-semibold text-blue-800">Add Student Profile</h3>
                                                <p className="mt-1 text-sm text-blue-600">
                                                    Create a profile for the student who will be learning piano
                                                </p>
                                            </div>
                                            <div className="rounded-lg border border-blue-200 bg-white p-4 text-center">
                                                <CalendarDays className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                                                <h3 className="font-semibold text-blue-800">Choose Subscription</h3>
                                                <p className="mt-1 text-sm text-blue-600">Select a plan to unlock private lessons</p>
                                            </div>
                                            <div className="rounded-lg border border-blue-200 bg-white p-4 text-center">
                                                <CheckCircle className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                                                <h3 className="font-semibold text-blue-800">Start Learning</h3>
                                                <p className="mt-1 text-sm text-blue-600">Begin your personalized piano journey</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700"
                                        onClick={() => router.visit(route('student.index'))}
                                    >
                                        <Users className="mr-2 h-5 w-5" />
                                        Add Your First Student
                                    </Button>

                                    <p className="text-sm text-blue-600">
                                        💡 You can add multiple students and manage their lessons separately
                                        <br />
                                        🎉 <strong>Bonus:</strong> Enjoy 10% discount for every extra student!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : selectedStudent?.isSubscribed ? (
                        <div className="mx-auto max-w-4xl space-y-6">
                            {/* Student Info */}
                            <Card className="border-gold/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center">
                                                <Users className="text-gold mr-2 h-5 w-5" />
                                                {selectedStudent.name}'s Dashboard
                                            </CardTitle>
                                            <CardDescription>
                                                {selectedStudent.age} years old • {selectedStudent.hasPiano ? 'Has Piano' : 'No Piano Access'} •{' '}
                                                {selectedStudent.sessionsRemaining} sessions remaining
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Subscribed
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Next Lesson */}
                            {upcomingLesson && (
                                <Card className="border-gold/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Clock className="text-gold mr-2 h-5 w-5" />
                                            Next Lesson
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-semibold">{upcomingLesson.title}</p>
                                                <p className="text-muted-foreground">
                                                    {upcomingLesson.date} at {upcomingLesson.time} with {upcomingLesson.instructor}
                                                </p>
                                                <Badge className="mt-2 bg-blue-100 text-blue-800">{upcomingLesson.type} lesson</Badge>
                                            </div>
                                            <Button className="bg-gold hover:bg-gold/90 text-warm-brown">Join Lesson</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Homework Warning */}
                            {pendingHomework.length > 0 && (
                                <Card className="border-orange-200 bg-orange-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-orange-800">
                                            <AlertTriangle className="mr-2 h-5 w-5" />
                                            Pending Homework
                                        </CardTitle>
                                        <CardDescription className="text-orange-600">You have homework that needs to be submitted</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {pendingHomework.map((homework) => (
                                                <div
                                                    key={homework.id}
                                                    className={`flex items-center justify-between rounded-lg border p-4 ${
                                                        homework.isOverdue
                                                            ? 'border-red-200 bg-red-100'
                                                            : homework.isDueSoon
                                                              ? 'border-yellow-200 bg-yellow-100'
                                                              : 'border-orange-200 bg-orange-100'
                                                    }`}
                                                >
                                                    <div>
                                                        <h4
                                                            className={`font-semibold ${
                                                                homework.isOverdue
                                                                    ? 'text-red-800'
                                                                    : homework.isDueSoon
                                                                      ? 'text-yellow-800'
                                                                      : 'text-orange-800'
                                                            }`}
                                                        >
                                                            {homework.title}
                                                        </h4>
                                                        <p
                                                            className={`text-sm ${
                                                                homework.isOverdue
                                                                    ? 'text-red-700'
                                                                    : homework.isDueSoon
                                                                      ? 'text-yellow-700'
                                                                      : 'text-orange-700'
                                                            }`}
                                                        >
                                                            From: {homework.lessonTitle}
                                                        </p>
                                                        <p
                                                            className={`text-sm ${
                                                                homework.isOverdue
                                                                    ? 'text-red-600'
                                                                    : homework.isDueSoon
                                                                      ? 'text-yellow-600'
                                                                      : 'text-orange-600'
                                                            }`}
                                                        >
                                                            Due: {homework.dueDate}
                                                            {homework.isOverdue && ' (Overdue)'}
                                                            {homework.isDueSoon && !homework.isOverdue && ' (Due Soon)'}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        className={`${
                                                            homework.isOverdue
                                                                ? 'bg-red-600 hover:bg-red-700'
                                                                : homework.isDueSoon
                                                                  ? 'bg-yellow-600 hover:bg-yellow-700'
                                                                  : 'bg-orange-600 hover:bg-orange-700'
                                                        } text-white`}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Submit Homework
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* No Pending Homework Message */}
                            {pendingHomework.length === 0 && (
                                <Card className="border-green-200 bg-green-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-green-800">
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            All Caught Up!
                                        </CardTitle>
                                        <CardDescription className="text-green-600">No pending homework to submit</CardDescription>
                                    </CardHeader>
                                </Card>
                            )}
                        </div>
                    ) : (
                        /* Simple Subscription Prompt for Non-Subscribed Students */
                        <div className="mx-auto max-w-2xl">
                            <Card className="border-orange-200 bg-orange-50">
                                <CardHeader>
                                    <CardTitle className="text-orange-800">{selectedStudent?.name} needs a subscription</CardTitle>
                                    <CardDescription className="text-orange-600">
                                        Subscribe to access private piano lessons and homework assignments
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full bg-orange-600 text-white hover:bg-orange-700">
                                        Subscribe Now - ${subscribePrice}/month
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
