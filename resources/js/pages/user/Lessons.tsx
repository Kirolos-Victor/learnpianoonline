import StudentSelector from '@/components/StudentSelector';
import SubscriptionBenefits from '@/components/SubscriptionBenefits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Crown,
    FileText,
    Music,
    Sparkles,
    Trophy,
    Upload,
    Users,
} from 'lucide-react';
import { useState } from 'react';

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
    lessonNumber: number;
    instructor: string;
    date: string;
    time: string;
    duration: string;
    status: 'completed' | 'pending' | 'cancelled';
    type: 'private' | 'group';
    hasHomework: boolean;
    homeworkStatus?: 'submitted' | 'pending' | 'overdue' | 'none';
}

interface StudentData {
    student: Student;
    lessons: Lesson[];
}

interface LessonsSharedData extends SharedData {
    students: Student[];
    selectedStudentData: StudentData | null;
    selectedStudentSlug?: string;
    selectedMonth: string;
    availableMonths: string[];
}

const Lessons = () => {
    const { subscribePrice, students, selectedStudentData, selectedStudentSlug, selectedMonth, availableMonths } = usePage<LessonsSharedData>().props;
    const [loading, setLoading] = useState(false);

    const selectedStudent = selectedStudentData?.student;
    const currentLessons = selectedStudentData?.lessons || [];
    const completedLessons = currentLessons.filter((lesson) => lesson.status === 'completed');
    // const pendingLessons = currentLessons.filter(lesson => lesson.status === 'pending');
    const pendingHomework = currentLessons.filter((lesson) => lesson.hasHomework && lesson.homeworkStatus === 'pending');

    // Handle student selection change using Inertia
    const handleStudentChange = (studentSlug: string) => {
        if (!studentSlug || studentSlug === selectedStudentSlug) return;

        setLoading(true);

        router.visit(`/lessons/student/${studentSlug}`, {
            method: 'get',
            data: { month: selectedMonth },
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    // Handle month change
    const handleMonthChange = (direction: 'prev' | 'next') => {
        const currentIndex = availableMonths.indexOf(selectedMonth);
        let newIndex = currentIndex;

        if (direction === 'prev' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'next' && currentIndex < availableMonths.length - 1) {
            newIndex = currentIndex + 1;
        }

        if (newIndex !== currentIndex) {
            setLoading(true);

            router.visit(`/lessons/student/${selectedStudentSlug}`, {
                method: 'get',
                data: { month: availableMonths[newIndex] },
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                },
            });
        }
    };

    const getHomeworkStatusColor = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'bg-fun-green text-white';
            case 'pending':
                return 'bg-fun-orange text-white';
            case 'overdue':
                return 'bg-fun-red text-white';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getHomeworkStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted':
                return <CheckCircle className="h-5 w-5" />;
            case 'pending':
                return <Clock className="h-5 w-5" />;
            case 'overdue':
                return <AlertTriangle className="h-5 w-5" />;
            default:
                return <Clock className="h-5 w-5" />;
        }
    };

    const handleSubmitHomework = (lessonId: string) => {
        // Redirect to homework page with student and lesson info
        router.visit(`/homework/${selectedStudent?.slug}/${lessonId}`, {
            data: {
                studentName: selectedStudent?.name,
                lessonNumber: currentLessons.find((l) => l.id === lessonId)?.lessonNumber,
            },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <Head title="Lessons" />

                {/* Header */}
                <div className="bg-rainbow-gradient relative overflow-hidden px-6 py-12">
                    {/* Floating musical notes */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 left-10 animate-bounce-gentle text-3xl">🎵</div>
                        <div className="absolute top-20 right-20 animate-bounce-gentle text-2xl" style={{ animationDelay: '0.5s' }}>
                            🎶
                        </div>
                        <div className="absolute bottom-20 left-20 animate-bounce-gentle text-2xl" style={{ animationDelay: '1s' }}>
                            🎹
                        </div>
                        <div className="absolute right-10 bottom-10 animate-bounce-gentle text-3xl" style={{ animationDelay: '1.5s' }}>
                            ⭐
                        </div>
                    </div>

                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-3 font-fredoka text-4xl font-bold text-white drop-shadow-lg md:text-5xl">My Piano Lessons! 🎹</h1>
                                <p className="font-comic text-xl text-white/90">Track your learning progress and have fun with homework!</p>
                            </div>

                            {/* Student Selector - only show if there are students */}
                            <StudentSelector
                                students={students}
                                selectedStudentSlug={selectedStudentSlug}
                                selectedStudent={selectedStudent}
                                onStudentChange={handleStudentChange}
                                label="Choose Your Student:"
                                placeholder="Pick a student!"
                                showAvatar={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {loading ? (
                        <div className="mx-auto max-w-6xl">
                            <Card className="border-fun-purple/20">
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-fun-purple"></div>
                                        <p className="font-comic text-lg text-muted-foreground">Loading lessons...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : students.length === 0 ? (
                        /* No Students - Prompt to Add Student */
                        <div className="mx-auto max-w-4xl">
                            <Card className="shadow-float rounded-3xl border-fun-pink/30 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fun-pink to-fun-purple">
                                        <Music className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle className="mb-4 font-fredoka text-4xl text-fun-purple">
                                        Ready to Start Your Piano Journey! 🎹✨
                                    </CardTitle>
                                    <CardDescription className="font-comic text-xl text-fun-blue">
                                        Let's get you set up so you can start having amazing piano lessons!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 text-center">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center space-x-6 text-fun-purple">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-pink font-fredoka text-xl font-bold text-white">
                                                    1
                                                </div>
                                                <span className="font-comic text-xl font-bold">Add Student</span>
                                            </div>
                                            <div className="h-1 w-12 rounded bg-gradient-to-r from-fun-pink to-fun-blue"></div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-blue font-fredoka text-xl font-bold text-white">
                                                    2
                                                </div>
                                                <span className="font-comic text-xl font-bold">Subscribe</span>
                                            </div>
                                            <div className="h-1 w-12 rounded bg-gradient-to-r from-fun-blue to-fun-green"></div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-green font-fredoka text-xl font-bold text-white">
                                                    3
                                                </div>
                                                <span className="font-comic text-xl font-bold">Start Learning</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                                            <div className="hover:shadow-float rounded-3xl border-2 border-fun-pink/20 bg-white/80 p-6 text-center transition-all duration-300">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-pink text-white">
                                                    <Users className="h-8 w-8" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-2xl text-fun-purple">Add Student Profile</h3>
                                                <p className="font-comic text-lg text-fun-purple/80">
                                                    Create a fun profile for your little pianist! 🎵
                                                </p>
                                            </div>
                                            <div className="hover:shadow-float rounded-3xl border-2 border-fun-blue/20 bg-white/80 p-6 text-center transition-all duration-300">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-blue text-white">
                                                    <Crown className="h-8 w-8" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-2xl text-fun-purple">Choose Your Plan</h3>
                                                <p className="font-comic text-lg text-fun-purple/80">
                                                    Pick a subscription to unlock awesome lessons! 👑
                                                </p>
                                            </div>
                                            <div className="hover:shadow-float rounded-3xl border-2 border-fun-green/20 bg-white/80 p-6 text-center transition-all duration-300">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-green text-white">
                                                    <Trophy className="h-8 w-8" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-2xl text-fun-purple">Rock Your Lessons</h3>
                                                <p className="font-comic text-lg text-fun-purple/80">Start your amazing piano adventure! 🚀</p>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border-2 border-fun-yellow/30 bg-gradient-to-r from-fun-yellow/20 to-fun-orange/20 p-6">
                                            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                                                <div>
                                                    <div className="mb-2 text-3xl">🎹</div>
                                                    <p className="font-comic text-lg text-fun-purple">1-on-1 Lessons</p>
                                                </div>
                                                <div>
                                                    <div className="mb-2 text-3xl">🎵</div>
                                                    <p className="font-comic text-lg text-fun-purple">Fun Songs</p>
                                                </div>
                                                <div>
                                                    <div className="mb-2 text-3xl">⭐</div>
                                                    <p className="font-comic text-lg text-fun-purple">Earn Rewards</p>
                                                </div>
                                                <div>
                                                    <div className="mb-2 text-3xl">📝</div>
                                                    <p className="font-comic text-lg text-fun-purple">Fun Homework</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="shadow-float animate-bounce-gentle rounded-full bg-gradient-to-r from-fun-pink to-fun-purple px-12 py-4 font-fredoka text-2xl text-white hover:from-fun-pink-600 hover:to-fun-purple-600"
                                        onClick={() => router.visit(route('student.index'))}
                                    >
                                        <Sparkles className="mr-3 h-6 w-6" />
                                        🎹 Add Your First Student!
                                    </Button>

                                    <div className="rounded-2xl border border-fun-blue/20 bg-white/60 p-4">
                                        <p className="font-comic text-lg text-fun-purple">
                                            💡 You can add multiple students and manage their lessons separately
                                            <br />
                                            🎉 <strong>Bonus:</strong> Enjoy 10% discount for every extra student!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : selectedStudent?.isSubscribed ? (
                        <div className="mx-auto max-w-6xl space-y-8">
                            {/* Student Info */}
                            <Card className="shadow-float rounded-3xl border-fun-purple/20 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center font-fredoka text-3xl text-fun-purple">
                                                <Users className="mr-3 h-8 w-8 text-fun-pink" />
                                                {selectedStudent.name}'s Lessons
                                            </CardTitle>
                                            <CardDescription className="font-comic text-lg text-gray-600">
                                                {selectedMonth} • {completedLessons.length}/{currentLessons.length} lessons completed! 🎉
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-fun-green px-4 py-2 font-comic text-lg text-white">
                                            <CheckCircle className="mr-2 h-5 w-5" />⭐ Subscribed
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Month Filter */}
                            <Card className="shadow-float rounded-3xl bg-white/90 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center font-fredoka text-2xl text-fun-purple">
                                        <Calendar className="mr-3 h-6 w-6 text-fun-blue" />
                                        Pick a Month! 📅
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleMonthChange('prev')}
                                            disabled={availableMonths.indexOf(selectedMonth) === 0}
                                            className="rounded-full border-fun-pink bg-fun-pink/20 px-6 py-3 font-comic text-lg text-fun-pink hover:bg-fun-pink hover:text-white"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <div className="text-center">
                                            <h3 className="font-fredoka text-2xl text-fun-purple">{selectedMonth}</h3>
                                            <p className="font-comic text-lg text-gray-600">
                                                {currentLessons.length} lessons • {completedLessons.length} completed! 🎉
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleMonthChange('next')}
                                            disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}
                                            className="rounded-full border-fun-blue bg-fun-blue/20 px-6 py-3 font-comic text-lg text-fun-blue hover:bg-fun-blue hover:text-white"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pending Homework Warning */}
                            {pendingHomework.length > 0 && (
                                <Card className="shadow-float rounded-3xl border-fun-orange/30 bg-gradient-to-r from-fun-orange/10 to-fun-yellow/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center font-fredoka text-2xl text-fun-orange">
                                            <AlertTriangle className="mr-3 h-6 w-6" />
                                            📝 Homework Time! ({pendingHomework.length})
                                        </CardTitle>
                                        <CardDescription className="font-comic text-lg text-fun-orange">
                                            You have fun homework that needs to be done!
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {pendingHomework.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between rounded-2xl border border-fun-orange/30 bg-fun-orange/20 p-4"
                                                >
                                                    <div>
                                                        <h4 className="font-fredoka text-xl text-fun-orange">
                                                            Lesson {lesson.lessonNumber} Homework
                                                        </h4>
                                                        <p className="font-comic text-lg text-fun-orange/80">Due: {lesson.date}</p>
                                                    </div>
                                                    <Button
                                                        className="shadow-float rounded-full bg-fun-orange px-6 py-3 font-comic text-lg text-white hover:bg-fun-orange-600"
                                                        onClick={() => handleSubmitHomework(lesson.id)}
                                                    >
                                                        <Upload className="mr-2 h-5 w-5" />
                                                        📝 Do Homework!
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Monthly Lessons */}
                            <Card className="shadow-float rounded-3xl bg-white/90 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center font-fredoka text-2xl text-fun-purple">
                                        <Calendar className="mr-3 h-6 w-6 text-fun-blue" />
                                        {selectedMonth} Lessons! 🎵
                                    </CardTitle>
                                    <CardDescription className="font-comic text-lg text-gray-600">
                                        Your monthly lesson schedule and progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {currentLessons.length > 0 ? (
                                            currentLessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="hover:shadow-float rounded-3xl border-2 border-fun-purple/20 bg-gradient-to-r from-white to-fun-purple/5 p-6 transition-all duration-300"
                                                >
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            {lesson.status === 'completed' ? (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-green text-white">
                                                                    <CheckCircle className="h-6 w-6" />
                                                                </div>
                                                            ) : (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-blue text-white">
                                                                    <Clock className="h-6 w-6" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h4 className="font-fredoka text-2xl text-fun-purple">
                                                                    Lesson {lesson.lessonNumber}
                                                                </h4>
                                                                <p className="font-comic text-lg text-gray-600">
                                                                    {lesson.date} at {lesson.time} • {lesson.duration} • {lesson.instructor}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge
                                                                className={`rounded-full px-4 py-2 font-comic text-lg ${
                                                                    lesson.status === 'completed'
                                                                        ? 'bg-fun-green text-white'
                                                                        : 'bg-fun-blue text-white'
                                                                }`}
                                                            >
                                                                {lesson.status === 'completed' ? '✅ Done!' : '⏰ Coming Soon!'}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Homework Section */}
                                                    {lesson.hasHomework && (
                                                        <div className="mt-4 rounded-2xl border border-fun-yellow/30 bg-gradient-to-r from-fun-yellow/20 to-fun-orange/20 p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <FileText className="h-5 w-5 text-fun-orange" />
                                                                    <span className="font-comic text-lg font-medium text-fun-orange">
                                                                        📝 Homework Available!
                                                                    </span>
                                                                </div>
                                                                <Badge
                                                                    className={`rounded-full px-3 py-1 font-comic text-lg ${getHomeworkStatusColor(lesson.homeworkStatus || 'pending')}`}
                                                                >
                                                                    {getHomeworkStatusIcon(lesson.homeworkStatus || 'pending')}
                                                                    <span className="ml-2">{lesson.homeworkStatus}</span>
                                                                </Badge>
                                                            </div>
                                                            {lesson.homeworkStatus === 'pending' && (
                                                                <div className="mt-3 flex items-center justify-between">
                                                                    <p className="font-comic text-lg text-fun-orange/80">
                                                                        Click the button to do your homework!
                                                                    </p>
                                                                    <Button
                                                                        size="lg"
                                                                        className="shadow-float rounded-full bg-fun-orange px-6 py-3 font-comic text-lg text-white hover:bg-fun-orange-600"
                                                                        onClick={() => handleSubmitHomework(lesson.id)}
                                                                    >
                                                                        <Upload className="mr-2 h-5 w-5" />
                                                                        📝 Do Homework!
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                                <h3 className="mb-3 font-fredoka text-2xl text-fun-purple">No lessons for {selectedMonth}</h3>
                                                <p className="mb-6 font-comic text-lg text-gray-600">Pick a different month to see your lessons!</p>
                                                <div className="text-4xl">🎵</div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Subscription Benefits for Non-Subscribed Students */
                        <SubscriptionBenefits
                            studentName={selectedStudent?.name || 'Student'}
                            subscribePrice={Number(subscribePrice)}
                            studentSlug={selectedStudent?.slug || ''}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Lessons;
