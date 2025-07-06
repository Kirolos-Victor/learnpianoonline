import SubscriptionBenefits from '@/components/SubscriptionBenefits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StudentLayout from '@/layouts/student-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, Music, Star, Upload } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    slug: string;
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

interface StudentHomeSharedData extends Omit<SharedData, 'subscribePrice'> {
    student: Student;
    studentData: StudentData;
    subscribePrice: number;
}

const StudentHome = () => {
    const { auth, student, studentData, subscribePrice } = usePage<StudentHomeSharedData>().props;

    const currentLessons = studentData?.lessons || [];
    const upcomingLesson = currentLessons.find((lesson) => lesson.status === 'pending');
    const pendingHomework = studentData?.homework?.filter((hw) => !hw.isSubmitted) || [];
    const overdueHomework = pendingHomework.filter((hw) => hw.isOverdue);
    const dueSoonHomework = pendingHomework.filter((hw) => hw.isDueSoon && !hw.isOverdue);

    // If student is not subscribed, show subscription benefits
    if (!student.isSubscribed) {
        return (
            <StudentLayout>
                <div className="min-h-screen bg-background">
                    <Head title={`${student.name}'s Piano Journey`}></Head>

                    {/* Header */}
                    <div className="bg-rainbow-gradient relative overflow-hidden px-6 py-12">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="animate-gentle-bounce absolute top-4 left-1/4 text-2xl text-white/20">♪</div>
                            <div className="animate-gentle-bounce absolute top-8 right-1/3 text-xl text-white/20" style={{ animationDelay: '0.5s' }}>
                                ♫
                            </div>
                            <div className="animate-gentle-bounce absolute bottom-4 left-1/3 text-2xl text-white/20" style={{ animationDelay: '1s' }}>
                                ♪
                            </div>
                            <div
                                className="animate-gentle-bounce absolute right-1/4 bottom-8 text-xl text-white/20"
                                style={{ animationDelay: '1.5s' }}
                            >
                                ♫
                            </div>
                        </div>

                        <div className="relative container mx-auto">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="text-center md:text-left">
                                    <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 Hi {student.name}!</h1>
                                    <p className="mb-2 font-comic text-xl text-white/90">Ready to start your musical adventure? 🎵</p>
                                    <div className="flex items-center justify-center space-x-2 text-white/80 md:justify-start">
                                        <Star className="h-5 w-5" />
                                        <span className="font-comic">Let's unlock your piano superpowers!</span>
                                        <Star className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Back to Parent Dashboard Button */}
                                <Button
                                    className="shadow-float mt-4 rounded-full bg-white/20 px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-fun-purple md:mt-0"
                                    onClick={() => router.visit(route('parent.dashboard'))}
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    👨‍👩‍👧‍👦 Parent Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Benefits */}
                    <div className="container mx-auto px-6 py-8">
                        <SubscriptionBenefits studentName={student.name} subscribePrice={subscribePrice || 29.99} studentSlug={student.slug} />
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // If student is subscribed, show dashboard
    return (
        <StudentLayout>
            <div className="min-h-screen bg-background">
                <Head title={`${student.name}'s Piano Dashboard`}></Head>

                {/* Header */}
                <div className="bg-rainbow-gradient relative overflow-hidden px-6 py-12">
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
                                <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 Welcome back, {student.name}!</h1>
                                <p className="mb-2 font-comic text-xl text-white/90">Ready to make beautiful music today? 🎵</p>
                                <div className="flex items-center justify-center space-x-2 text-white/80 md:justify-start">
                                    <Star className="h-5 w-5" />
                                    <span className="font-comic">Your Piano Learning Journey</span>
                                    <Star className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Back to Parent Dashboard Button */}
                            <Button
                                className="shadow-float mt-4 rounded-full bg-white/20 px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-fun-purple md:mt-0"
                                onClick={() => router.visit(route('parent.dashboard'))}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                👨‍👩‍👧‍👦 Parent Dashboard
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {/* Dashboard Content */}
                    <div className="mx-auto max-w-6xl space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card className="shadow-float rounded-2xl border-2 border-fun-purple/20 bg-white">
                                <CardContent className="p-6 text-center">
                                    <Music className="mx-auto mb-4 h-12 w-12 text-fun-purple" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-purple">Sessions Left</h3>
                                    <p className="font-comic text-2xl font-bold text-fun-purple">{student.sessionsRemaining}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-float rounded-2xl border-2 border-fun-green/20 bg-white">
                                <CardContent className="p-6 text-center">
                                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-fun-green" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-green">Subscription</h3>
                                    <p className="font-comic text-sm font-bold text-fun-green">
                                        {student.subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-float rounded-2xl border-2 border-fun-blue/20 bg-white">
                                <CardContent className="p-6 text-center">
                                    <Star className="mx-auto mb-4 h-12 w-12 text-fun-blue" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-blue">Instructor</h3>
                                    <p className="font-comic text-sm font-bold text-fun-blue">{student.instructor?.name || 'Not assigned'}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Next Lesson */}
                        {upcomingLesson && (
                            <Card className="shadow-fun rounded-3xl border-fun-purple/20 bg-gradient-to-br from-fun-purple/10 to-fun-blue/10">
                                <CardHeader className="text-center">
                                    <div className="animate-gentle-bounce mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-purple">
                                        <Calendar className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="font-fredoka text-2xl text-fun-purple">🎹 Your Next Lesson! 🌟</CardTitle>
                                    <CardDescription className="font-comic text-lg text-fun-purple/80">
                                        Get ready for another amazing piano adventure!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 text-center">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-4">
                                            <Badge className="bg-fun-purple text-white">📅 {upcomingLesson.date}</Badge>
                                            <Badge className="bg-fun-blue text-white">🕐 {upcomingLesson.time}</Badge>
                                        </div>
                                        <h3 className="font-fredoka text-xl font-bold text-fun-purple">{upcomingLesson.title}</h3>
                                        <p className="font-comic text-fun-purple/80">with {upcomingLesson.instructor}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Homework Section */}
                        {pendingHomework.length > 0 && (
                            <Card className="shadow-fun rounded-3xl border-fun-orange/20 bg-gradient-to-br from-fun-orange/10 to-fun-pink/10">
                                <CardHeader className="text-center">
                                    <div className="animate-gentle-bounce mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-orange">
                                        <BookOpen className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="font-fredoka text-2xl text-fun-orange">📚 Your Piano Homework!</CardTitle>
                                    <CardDescription className="font-comic text-lg text-fun-orange/80">
                                        Time to practice and show off your skills!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {overdueHomework.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                                <span className="font-comic text-lg font-bold text-red-500">Overdue Homework</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {overdueHomework.map((homework) => (
                                                    <Card key={homework.id} className="border-red-200 bg-red-50">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-left">
                                                                    <h4 className="font-fredoka text-sm font-bold text-red-700">{homework.title}</h4>
                                                                    <p className="font-comic text-xs text-red-600">Due: {homework.dueDate}</p>
                                                                </div>
                                                                <Button
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            route('student.homework', {
                                                                                student: student.slug,
                                                                                lessonId: homework.id,
                                                                            }),
                                                                        )
                                                                    }
                                                                    size="sm"
                                                                    className="bg-red-500 text-white hover:bg-red-600"
                                                                >
                                                                    <Upload className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {dueSoonHomework.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Clock className="h-5 w-5 text-fun-orange" />
                                                <span className="font-comic text-lg font-bold text-fun-orange">Due Soon</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {dueSoonHomework.map((homework) => (
                                                    <Card key={homework.id} className="border-fun-orange/20 bg-fun-orange/10">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-left">
                                                                    <h4 className="font-fredoka text-sm font-bold text-fun-orange">
                                                                        {homework.title}
                                                                    </h4>
                                                                    <p className="font-comic text-xs text-fun-orange/80">Due: {homework.dueDate}</p>
                                                                </div>
                                                                <Button
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            route('student.homework', {
                                                                                student: student.slug,
                                                                                lessonId: homework.id,
                                                                            }),
                                                                        )
                                                                    }
                                                                    size="sm"
                                                                    className="bg-fun-orange text-white hover:bg-fun-orange/90"
                                                                >
                                                                    <Upload className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <div className="flex justify-center">
                            <Card className="shadow-float max-w-md rounded-2xl border-2 border-fun-blue/20 bg-white transition-all duration-200 hover:scale-105">
                                <CardContent className="p-6 text-center">
                                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-fun-blue" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-blue">View All Lessons</h3>
                                    <p className="mb-4 font-comic text-sm text-fun-purple/70">Check out your lesson history and upcoming sessions</p>
                                    <Button
                                        onClick={() => router.visit(route('student.lessons', student.slug))}
                                        className="rounded-full bg-fun-blue px-6 py-3 font-comic text-white hover:bg-fun-blue/90"
                                    >
                                        View Lessons
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentHome;
