import StudentSelector from '@/components/StudentSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, Heart, Star, Upload, Users } from 'lucide-react';
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
                <Head title={'My Piano Home'}></Head>

                {/* Kid-friendly Header */}
                <div className="bg-rainbow-gradient relative overflow-hidden px-6 py-12">
                    {/* Decorative musical notes */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="animate-gentle-bounce absolute top-4 left-1/4 text-2xl text-white/20">♪</div>
                        <div className="animate-gentle-bounce absolute top-8 right-1/3 text-xl text-white/20" style={{ animationDelay: '0.5s' }}>
                            ♫
                        </div>
                        <div className="animate-gentle-bounce absolute bottom-4 left-1/3 text-2xl text-white/20" style={{ animationDelay: '1s' }}>
                            ♪
                        </div>
                        <div className="animate-gentle-bounce absolute right-1/4 bottom-8 text-xl text-white/20" style={{ animationDelay: '1.5s' }}>
                            ♫
                        </div>
                    </div>

                    <div className="relative container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="text-center md:text-left">
                                <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 Welcome back, {auth.user.name}!</h1>
                                <p className="mb-2 font-comic text-xl text-white/90">Ready to make beautiful music today? 🎵</p>
                                <div className="flex items-center justify-center space-x-2 text-white/80 md:justify-start">
                                    <Star className="h-5 w-5" />
                                    <span className="font-comic">Your Piano Learning Adventure</span>
                                    <Star className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Student Selector - only show if there are students */}
                            <StudentSelector
                                students={students}
                                selectedStudentId={selectedStudentId}
                                selectedStudent={selectedStudent}
                                onStudentChange={handleStudentChange}
                                label="Choose Your Student 🌟"
                                placeholder="Pick a piano star! ⭐"
                                showAvatar={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {loading ? (
                        <div className="mx-auto max-w-4xl">
                            <Card className="bg-fun-gradient rounded-3xl border-fun-purple/20">
                                <CardContent className="flex items-center justify-center py-16">
                                    <div className="text-center">
                                        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-fun-purple border-b-transparent"></div>
                                        <p className="font-comic text-lg text-fun-purple">Loading your piano world... 🎹</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : students.length === 0 ? (
                        /* No Students - Kid-friendly Prompt */
                        <div className="mx-auto max-w-3xl">
                            <Card className="shadow-fun rounded-3xl border-fun-pink/30 bg-gradient-to-br from-fun-pink/10 to-fun-purple/10">
                                <CardHeader className="pb-6 text-center">
                                    <div className="animate-gentle-bounce mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-pink">
                                        <Users className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle className="mb-3 font-fredoka text-3xl text-fun-purple">
                                        🎹 Let's Start Your Piano Adventure! 🌟
                                    </CardTitle>
                                    <CardDescription className="font-comic text-xl text-fun-purple/80">
                                        Time to add your young musician and begin their musical journey!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 text-center">
                                    <div className="space-y-6">
                                        <div className="flex flex-col items-center justify-center space-y-4 text-fun-purple md:flex-row md:space-y-0 md:space-x-6">
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="animate-gentle-bounce flex h-12 w-12 items-center justify-center rounded-full bg-fun-pink font-fredoka text-lg text-white">
                                                    1
                                                </div>
                                                <span className="font-comic font-bold">Add Student</span>
                                            </div>
                                            <div className="hidden h-px w-12 bg-fun-purple/30 md:block"></div>
                                            <div className="flex flex-col items-center space-y-2">
                                                <div
                                                    className="animate-gentle-bounce flex h-12 w-12 items-center justify-center rounded-full bg-fun-purple font-fredoka text-lg text-white"
                                                    style={{ animationDelay: '0.5s' }}
                                                >
                                                    2
                                                </div>
                                                <span className="font-comic font-bold">Choose Plan</span>
                                            </div>
                                            <div className="hidden h-px w-12 bg-fun-purple/30 md:block"></div>
                                            <div className="flex flex-col items-center space-y-2">
                                                <div
                                                    className="animate-gentle-bounce flex h-12 w-12 items-center justify-center rounded-full bg-fun-green font-fredoka text-lg text-white"
                                                    style={{ animationDelay: '1s' }}
                                                >
                                                    3
                                                </div>
                                                <span className="font-comic font-bold">Start Playing!</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                                            <div className="shadow-float rounded-2xl border-2 border-fun-pink/20 bg-white p-6 text-center transition-transform duration-200 hover:scale-105">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fun-pink/20">
                                                    <Users className="h-6 w-6 text-fun-pink" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-pink">Create Student Profile</h3>
                                                <p className="font-comic text-sm text-fun-purple/70">
                                                    Tell us about your young pianist - their age, name, and musical dreams! 🎵
                                                </p>
                                            </div>
                                            <div className="shadow-float rounded-2xl border-2 border-fun-purple/20 bg-white p-6 text-center transition-transform duration-200 hover:scale-105">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fun-purple/20">
                                                    <Star className="h-6 w-6 text-fun-purple" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-purple">Pick Your Plan</h3>
                                                <p className="font-comic text-sm text-fun-purple/70">
                                                    Choose the perfect plan for 1-on-1 lessons with expert teachers! ⭐
                                                </p>
                                            </div>
                                            <div className="shadow-float rounded-2xl border-2 border-fun-green/20 bg-white p-6 text-center transition-transform duration-200 hover:scale-105">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fun-green/20">
                                                    <Heart className="h-6 w-6 text-fun-green" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-green">Begin Learning!</h3>
                                                <p className="font-comic text-sm text-fun-purple/70">
                                                    Start your personalized piano journey with fun lessons! 🎹
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="shadow-float w-full rounded-2xl bg-fun-pink px-8 py-4 font-comic text-xl text-white transition-all duration-200 hover:scale-105 hover:bg-fun-pink/90 md:w-auto"
                                        onClick={() => router.visit(route('student.index'))}
                                    >
                                        <Users className="mr-3 h-6 w-6" />
                                        🌟 Add Your First Piano Student!
                                    </Button>

                                    <div className="rounded-2xl border-2 border-fun-yellow/30 bg-fun-yellow/20 p-6">
                                        <p className="font-comic text-lg leading-relaxed text-fun-purple">
                                            🎉 <strong>Perfect for kids aged 5+!</strong>
                                            <br />
                                            💡 Add multiple students and manage their lessons separately
                                            <br />
                                            🎁 <strong>Family Bonus:</strong> Save 10% for every additional student!
                                        </p>
                                    </div>
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
