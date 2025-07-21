import SubscriptionBenefits from '@/components/SubscriptionBenefits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StudentLayout from '@/layouts/student-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CheckCircle, Music, Star, User } from 'lucide-react';

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

interface Session {
    id: string;
    title: string;
    instructor: string;
    date: string;
    time: string;
    status: string;
}

interface StudentData {
    student: Student;
    sessions: Session[];
}

interface StudentHomeSharedData extends Omit<SharedData, 'subscribePrice'> {
    student: Student;
    studentData: StudentData;
    subscribePrice: number;
}

const StudentHome = () => {
    const { auth, student, studentData, subscribePrice } = usePage<StudentHomeSharedData>().props;

    const currentSessions = studentData?.sessions || [];
    const upcomingSession = currentSessions.find((session) => session.status === 'pending');

    // If student is not subscribed, show subscription benefits
    if (!student.isSubscribed) {
        return (
            <StudentLayout currentStudentSlug={student.slug} isSubscribed={student.isSubscribed}>
                <div className="min-h-screen bg-background">
                    <Head title={`${student.name}'s Piano Journey`}></Head>

                    {/* Fun Header */}
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
        <StudentLayout currentStudentSlug={student.slug} isSubscribed={student.isSubscribed}>
            <div className="min-h-screen bg-background">
                <Head title={`${student.name}'s Piano Dashboard`}></Head>

                {/* Fun Header */}
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
                        {/* Fun Stats */}
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
                                    <User className="mx-auto mb-4 h-12 w-12 text-fun-green" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-green">Instructor</h3>
                                    <p className="font-comic text-sm font-bold text-fun-green">{student.instructor?.name || 'Not assigned'}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-float rounded-2xl border-2 border-fun-blue/20 bg-white">
                                <CardContent className="p-6 text-center">
                                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-fun-blue" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-blue">Status</h3>
                                    <p className="font-comic text-sm font-bold text-fun-blue">Active</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Instructor Assignment Notice */}
                        {!student.instructor && (
                            <Card className="mb-6 bg-gradient-to-r from-fun-yellow to-fun-orange text-white">
                                <CardHeader>
                                    <CardTitle className="font-fredoka text-2xl text-fun-yellow">🎹 Waiting for Your Instructor! 🌟</CardTitle>
                                    <CardDescription className="text-white/80">
                                        We're working on assigning you the perfect piano instructor!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-comic text-fun-yellow/90">
                                        Don't worry! We'll assign you an instructor soon and you'll be able to see your upcoming sessions here. Your
                                        parent will be notified once your instructor is assigned.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Next Session */}
                        {upcomingSession && (
                            <Card className="mb-6 bg-gradient-to-r from-fun-purple to-fun-blue text-white">
                                <CardHeader>
                                    <CardTitle className="font-fredoka text-2xl text-white">🎹 Your Next Session! 🌟</CardTitle>
                                    <CardDescription className="text-white/90">Get ready for your upcoming piano session!</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <Badge className="bg-white font-bold text-fun-purple">📅 {upcomingSession.date}</Badge>
                                        <Badge className="bg-white font-bold text-fun-blue">🕐 {upcomingSession.time}</Badge>
                                    </div>
                                    <h3 className="font-fredoka text-xl font-bold text-white">{upcomingSession.title}</h3>
                                    <p className="font-comic text-white/90">
                                        with{' '}
                                        {upcomingSession.instructor !== 'Not assigned'
                                            ? upcomingSession.instructor
                                            : student.instructor?.name || 'Instructor to be assigned'}
                                    </p>
                                    {!student.instructor && (
                                        <p className="mt-2 font-comic font-bold text-yellow-300">⚠️ Instructor will be assigned soon</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <div className="flex justify-center">
                            <Card className="shadow-float max-w-md rounded-2xl border-2 border-fun-blue/20 bg-white transition-all duration-200 hover:scale-105">
                                <CardContent className="p-6 text-center">
                                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-fun-blue" />
                                    <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-blue">View All Sessions</h3>
                                    <p className="mb-4 font-comic text-sm text-fun-purple/70">Check out your session history and upcoming sessions</p>
                                    <Button
                                        onClick={() => router.visit(route('student.sessions', student.slug))}
                                        className="rounded-full bg-fun-blue px-6 py-3 font-comic text-white hover:bg-fun-blue/90"
                                    >
                                        View Sessions
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
