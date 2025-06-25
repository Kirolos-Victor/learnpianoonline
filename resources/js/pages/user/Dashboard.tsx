import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
    Clock,
    Upload,
    Users,
    CheckCircle,
    AlertTriangle,
    CalendarDays
} from 'lucide-react';
import { useState } from 'react';
import { SharedData } from '@/types';

interface Student {
    id: string;
    name: string;
    age: number;
    hasPiano: boolean;
    isSubscribed: boolean;
    subscriptionType?: 'monthly' | 'yearly';
    subscriptionEndDate?: string;
}

interface Lesson {
    id: string;
    title: string;
    instructor: string;
    date: string;
    time: string;
    status: 'completed' | 'pending' | 'cancelled';
    type: 'private' | 'group';
}

interface Homework {
    id: string;
    title: string;
    dueDate: string;
    isSubmitted: boolean;
    lessonTitle: string;
}

const Dashboard = () => {
    const { subscribePrice } = usePage<SharedData>().props;

    // Mock data - in real app this would come from the backend
    const [students, setStudents] = useState<Student[]>([
        {
            id: '1',
            name: 'Emma Johnson',
            age: 12,
            hasPiano: true,
            isSubscribed: true,
            subscriptionType: 'monthly',
            subscriptionEndDate: '2024-04-15'
        },
        {
            id: '2',
            name: 'Michael Chen',
            age: 8,
            hasPiano: false,
            isSubscribed: false
        },
        {
            id: '3',
            name: 'Sarah Williams',
            age: 15,
            hasPiano: true,
            isSubscribed: true,
            subscriptionType: 'yearly',
            subscriptionEndDate: '2024-12-31'
        }
    ]);

    const [selectedStudentId, setSelectedStudentId] = useState<string>('1');
    const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

    // Mock lesson data for subscribed students
    const studentLessons: Record<string, Lesson[]> = {
        '1': [
            {
                id: '1',
                title: 'Advanced Chord Progressions',
                instructor: 'Sarah Johnson',
                date: 'March 25, 2024',
                time: '2:00 PM',
                status: 'pending',
                type: 'private'
            },
            {
                id: '2',
                title: 'Classical Piano Techniques',
                instructor: 'David Smith',
                date: 'March 20, 2024',
                time: '3:30 PM',
                status: 'completed',
                type: 'private'
            }
        ],
        '3': [
            {
                id: '4',
                title: 'Piano Fundamentals',
                instructor: 'Sarah Johnson',
                date: 'March 26, 2024',
                time: '4:00 PM',
                status: 'pending',
                type: 'private'
            },
            {
                id: '5',
                title: 'Music Theory Basics',
                instructor: 'David Smith',
                date: 'March 22, 2024',
                time: '2:30 PM',
                status: 'completed',
                type: 'private'
            }
        ]
    };

    // Mock homework data
    const studentHomework: Record<string, Homework[]> = {
        '1': [
            {
                id: '1',
                title: 'Practice scales in C major',
                dueDate: 'March 24, 2024',
                isSubmitted: false,
                lessonTitle: 'Classical Piano Techniques'
            }
        ],
        '3': [
            {
                id: '2',
                title: 'Complete music theory exercises',
                dueDate: 'March 25, 2024',
                isSubmitted: true,
                lessonTitle: 'Music Theory Basics'
            }
        ]
    };

    const currentLessons = studentLessons[selectedStudent.id] || [];
    const upcomingLesson = currentLessons.find(lesson => lesson.status === 'pending');
    const pendingHomework = studentHomework[selectedStudent.id]?.filter(hw => !hw.isSubmitted) || [];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <Head title={'Dashboard'}></Head>

                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">
                                    Welcome back, John! 🎹
                                </h1>
                            </div>

                            {/* Student Selector */}
                            <div className="mt-4 md:mt-0">
                                <Label className="text-sm font-medium text-primary mb-2 block">Select Student</Label>
                                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                    <SelectTrigger className="w-full md:w-64">
                                        <SelectValue placeholder="Choose a student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                <div className="flex items-center space-x-2">
                                                    <span>{student.name}</span>
                                                    {student.isSubscribed && (
                                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                                            Subscribed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {selectedStudent.isSubscribed ? (
                        <div className="max-w-4xl mx-auto space-y-6">
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
                                                {selectedStudent.age} years old • {selectedStudent.hasPiano ? 'Has Piano' : 'No Piano Access'}
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
                                                <Badge className="mt-2 bg-blue-100 text-blue-800">
                                                    {upcomingLesson.type} lesson
                                                </Badge>
                                            </div>
                                            <Button className="bg-gold hover:bg-gold/90 text-warm-brown">
                                                Join Lesson
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Homework Warning */}
                            {pendingHomework.length > 0 && (
                                <Card className="border-orange-200 bg-orange-50">
                                    <CardHeader>
                                        <CardTitle className="text-orange-800 flex items-center">
                                            <AlertTriangle className="mr-2 h-5 w-5" />
                                            Pending Homework
                                        </CardTitle>
                                        <CardDescription className="text-orange-600">
                                            You have homework that needs to be submitted
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {pendingHomework.map((homework) => (
                                                <div key={homework.id} className="flex items-center justify-between p-4 rounded-lg bg-orange-100 border border-orange-200">
                                                    <div>
                                                        <h4 className="font-semibold text-orange-800">{homework.title}</h4>
                                                        <p className="text-sm text-orange-700">
                                                            From: {homework.lessonTitle}
                                                        </p>
                                                        <p className="text-sm text-orange-600">
                                                            Due: {homework.dueDate}
                                                        </p>
                                                    </div>
                                                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
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
                                        <CardTitle className="text-green-800 flex items-center">
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            All Caught Up!
                                        </CardTitle>
                                        <CardDescription className="text-green-600">
                                            No pending homework to submit
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            )}
                        </div>
                    ) : (
                        /* Simple Subscription Prompt for Non-Subscribed Students */
                        <div className="max-w-2xl mx-auto">
                            <Card className="border-orange-200 bg-orange-50">
                                <CardHeader>
                                    <CardTitle className="text-orange-800">
                                        {selectedStudent.name} needs a subscription
                                    </CardTitle>
                                    <CardDescription className="text-orange-600">
                                        Subscribe to access private piano lessons and homework assignments
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full">
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
