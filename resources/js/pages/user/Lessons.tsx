import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Users,
    Crown,
    Target,
    Award,
    Zap,
    Star,
    AlertTriangle,
    Upload,
    ChevronLeft,
    ChevronRight,
    Music,
    Trophy,
    Sparkles
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
    selectedStudentId?: string;
    selectedMonth: string;
    availableMonths: string[];
}

const Lessons = () => {
    const { subscribePrice, students, selectedStudentData, selectedStudentId, selectedMonth, availableMonths } = usePage<LessonsSharedData>().props;
    const [loading, setLoading] = useState(false);

    const selectedStudent = selectedStudentData?.student;
    const numericSelectedStudentId = Number(selectedStudentId);
    const currentLessons = selectedStudentData?.lessons || [];
    const completedLessons = currentLessons.filter(lesson => lesson.status === 'completed');
    // const pendingLessons = currentLessons.filter(lesson => lesson.status === 'pending');
    const pendingHomework = currentLessons.filter(lesson =>
        lesson.hasHomework && lesson.homeworkStatus === 'pending'
    );

    // Handle student selection change using Inertia
    const handleStudentChange = (studentId: string) => {
        if (!studentId || studentId === selectedStudentId) return;

        setLoading(true);

        router.visit(`/lessons/student/${studentId}`, {
            method: 'get',
            data: { month: selectedMonth },
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setLoading(false);
            }
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

            router.visit(`/lessons/student/${selectedStudentId}`, {
                method: 'get',
                data: { month: availableMonths[newIndex] },
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    const subscriptionBenefits = [
        {
            icon: Crown,
            title: 'Fun 1-on-1 Lessons',
            description: 'Learn with your own friendly teacher! 🎵',
            color: 'bg-fun-pink'
        },
        {
            icon: Target,
            title: 'Cool Songs to Learn',
            description: 'Play your favorite songs and discover new ones! 🎶',
            color: 'bg-fun-blue'
        },
        {
            icon: Award,
            title: 'Awesome Teachers',
            description: 'Learn from super nice and patient teachers! 👩‍🏫',
            color: 'bg-fun-yellow'
        },
        {
            icon: Zap,
            title: 'Flexible Times',
            description: 'Choose lesson times that work for you! ⏰',
            color: 'bg-fun-green'
        },
        {
            icon: Star,
            title: 'Earn Stars & Badges',
            description: 'Get rewards for practicing and learning! ⭐',
            color: 'bg-fun-purple'
        },
        {
            icon: FileText,
            title: 'Fun Homework',
            description: 'Practice assignments that are actually fun! 📝',
            color: 'bg-fun-cyan'
        }
    ];

    const getHomeworkStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-fun-green text-white';
            case 'pending': return 'bg-fun-orange text-white';
            case 'overdue': return 'bg-fun-red text-white';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getHomeworkStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted': return <CheckCircle className="h-5 w-5" />;
            case 'pending': return <Clock className="h-5 w-5" />;
            case 'overdue': return <AlertTriangle className="h-5 w-5" />;
            default: return <Clock className="h-5 w-5" />;
        }
    };

    const handleSubmitHomework = (lessonId: string) => {
        // Redirect to homework page with student and lesson info
        router.visit(`/homework/${selectedStudent?.id}/${lessonId}`, {
            data: {
                studentName: selectedStudent?.name,
                lessonNumber: currentLessons.find(l => l.id === lessonId)?.lessonNumber
            }
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <Head title="Lessons" />

                {/* Header */}
                <div className="bg-rainbow-gradient px-6 py-12 relative overflow-hidden">
                    {/* Floating musical notes */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 left-10 text-3xl animate-bounce-gentle">🎵</div>
                        <div className="absolute top-20 right-20 text-2xl animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🎶</div>
                        <div className="absolute bottom-20 left-20 text-2xl animate-bounce-gentle" style={{animationDelay: '1s'}}>🎹</div>
                        <div className="absolute bottom-10 right-10 text-3xl animate-bounce-gentle" style={{animationDelay: '1.5s'}}>⭐</div>
                    </div>

                    <div className="container mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-3 font-fredoka text-4xl font-bold text-white md:text-5xl drop-shadow-lg">
                                    My Piano Lessons! 🎹
                                </h1>
                                <p className="text-xl font-comic text-white/90">
                                    Track your learning progress and have fun with homework!
                                </p>
                            </div>

                            {/* Student Selector - only show if there are students */}
                            {students.length > 0 && (
                                <div className="mt-6 md:mt-0">
                                    <Label className="text-lg font-comic text-white mb-3 block">Choose Your Student:</Label>
                                    <Select value={selectedStudentId? selectedStudent?.id : ''} onValueChange={handleStudentChange}>
                                        <SelectTrigger className="w-full md:w-72 bg-white/20 backdrop-blur-sm border-white/30 text-white font-comic text-lg rounded-2xl">
                                            <SelectValue placeholder="Pick a student!" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="font-comic text-lg">{student.name}</span>
                                                        {student.isSubscribed && (
                                                            <Badge className="bg-fun-green text-white text-sm font-comic">
                                                                ⭐ Subscribed
                                                            </Badge>
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
                        <div className="max-w-6xl mx-auto">
                            <Card className="border-fun-purple/20">
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fun-purple mx-auto mb-4"></div>
                                        <p className="text-muted-foreground font-comic text-lg">Loading lessons...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : students.length === 0 ? (
                        /* No Students - Prompt to Add Student */
                        <div className="max-w-4xl mx-auto">
                            <Card className="border-fun-pink/30 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10 rounded-3xl shadow-float">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fun-pink to-fun-purple">
                                        <Music className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle className="text-fun-purple font-fredoka text-4xl mb-4">
                                        Ready to Start Your Piano Journey! 🎹✨
                                    </CardTitle>
                                    <CardDescription className="text-fun-blue font-comic text-xl">
                                        Let's get you set up so you can start having amazing piano lessons!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center space-x-6 text-fun-purple">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-pink text-white font-fredoka text-xl font-bold">1</div>
                                                <span className="font-comic text-xl font-bold">Add Student</span>
                                            </div>
                                            <div className="h-1 w-12 bg-gradient-to-r from-fun-pink to-fun-blue rounded"></div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-blue text-white font-fredoka text-xl font-bold">2</div>
                                                <span className="font-comic text-xl font-bold">Subscribe</span>
                                            </div>
                                            <div className="h-1 w-12 bg-gradient-to-r from-fun-blue to-fun-green rounded"></div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-green text-white font-fredoka text-xl font-bold">3</div>
                                                <span className="font-comic text-xl font-bold">Start Learning</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                            <div className="text-center p-6 bg-white/80 rounded-3xl border-2 border-fun-pink/20 hover:shadow-float transition-all duration-300">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-pink text-white">
                                                    <Users className="h-8 w-8" />
                                                </div>
                                                <h3 className="font-fredoka text-2xl text-fun-purple mb-2">Add Student Profile</h3>
                                                <p className="font-comic text-lg text-fun-purple/80">Create a fun profile for your little pianist! 🎵</p>
                                            </div>
                                            <div className="text-center p-6 bg-white/80 rounded-3xl border-2 border-fun-blue/20 hover:shadow-float transition-all duration-300">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-blue text-white">
                                                    <Crown className="h-8 w-8" />
                                                </div>
                                                <h3 className="font-fredoka text-2xl text-fun-purple mb-2">Choose Your Plan</h3>
                                                <p className="font-comic text-lg text-fun-purple/80">Pick a subscription to unlock awesome lessons! 👑</p>
                                            </div>
                                            <div className="text-center p-6 bg-white/80 rounded-3xl border-2 border-fun-green/20 hover:shadow-float transition-all duration-300">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-green text-white">
                                                    <Trophy className="h-8 w-8" />
                                                </div>
                                                <h3 className="font-fredoka text-2xl text-fun-purple mb-2">Rock Your Lessons</h3>
                                                <p className="font-comic text-lg text-fun-purple/80">Start your amazing piano adventure! 🚀</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-fun-yellow/20 to-fun-orange/20 rounded-3xl p-6 border-2 border-fun-yellow/30">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                <div>
                                                    <div className="text-3xl mb-2">🎹</div>
                                                    <p className="font-comic text-lg text-fun-purple">1-on-1 Lessons</p>
                                                </div>
                                                <div>
                                                    <div className="text-3xl mb-2">🎵</div>
                                                    <p className="font-comic text-lg text-fun-purple">Fun Songs</p>
                                                </div>
                                                <div>
                                                    <div className="text-3xl mb-2">⭐</div>
                                                    <p className="font-comic text-lg text-fun-purple">Earn Rewards</p>
                                                </div>
                                                <div>
                                                    <div className="text-3xl mb-2">📝</div>
                                                    <p className="font-comic text-lg text-fun-purple">Fun Homework</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="bg-gradient-to-r from-fun-pink to-fun-purple hover:from-fun-pink-600 hover:to-fun-purple-600 text-white font-fredoka text-2xl px-12 py-4 rounded-full shadow-float animate-bounce-gentle"
                                        onClick={() => router.visit(route('student.index'))}
                                    >
                                        <Sparkles className="mr-3 h-6 w-6" />
                                        🎹 Add Your First Student!
                                    </Button>

                                    <div className="bg-white/60 rounded-2xl p-4 border border-fun-blue/20">
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
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Student Info */}
                            <Card className="border-fun-purple/20 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10 rounded-3xl shadow-float">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center font-fredoka text-3xl text-fun-purple">
                                                <Users className="text-fun-pink mr-3 h-8 w-8" />
                                                {selectedStudent.name}'s Lessons
                                            </CardTitle>
                                            <CardDescription className="font-comic text-lg text-gray-600">
                                                {selectedMonth} • {completedLessons.length}/{currentLessons.length} lessons completed! 🎉
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-fun-green text-white font-comic text-lg px-4 py-2">
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            ⭐ Subscribed
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Month Filter */}
                            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-float">
                                <CardHeader>
                                    <CardTitle className="flex items-center font-fredoka text-2xl text-fun-purple">
                                        <Calendar className="text-fun-blue mr-3 h-6 w-6" />
                                        Pick a Month! 📅
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleMonthChange('prev')}
                                            disabled={availableMonths.indexOf(selectedMonth) === 0}
                                            className="rounded-full bg-fun-pink/20 border-fun-pink text-fun-pink hover:bg-fun-pink hover:text-white font-comic text-lg px-6 py-3"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <div className="text-center">
                                            <h3 className="text-2xl font-fredoka text-fun-purple">{selectedMonth}</h3>
                                            <p className="text-lg font-comic text-gray-600">
                                                {currentLessons.length} lessons • {completedLessons.length} completed! 🎉
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleMonthChange('next')}
                                            disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}
                                            className="rounded-full bg-fun-blue/20 border-fun-blue text-fun-blue hover:bg-fun-blue hover:text-white font-comic text-lg px-6 py-3"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pending Homework Warning */}
                            {pendingHomework.length > 0 && (
                                <Card className="border-fun-orange/30 bg-gradient-to-r from-fun-orange/10 to-fun-yellow/10 rounded-3xl shadow-float">
                                    <CardHeader>
                                        <CardTitle className="text-fun-orange flex items-center font-fredoka text-2xl">
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
                                                <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl bg-fun-orange/20 border border-fun-orange/30">
                                                    <div>
                                                        <h4 className="font-fredoka text-xl text-fun-orange">Lesson {lesson.lessonNumber} Homework</h4>
                                                        <p className="font-comic text-lg text-fun-orange/80">
                                                            Due: {lesson.date}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        className="bg-fun-orange hover:bg-fun-orange-600 text-white font-comic text-lg px-6 py-3 rounded-full shadow-float"
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
                            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-float">
                                <CardHeader>
                                    <CardTitle className="flex items-center font-fredoka text-2xl text-fun-purple">
                                        <Calendar className="text-fun-blue mr-3 h-6 w-6" />
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
                                                <div key={lesson.id} className="border-2 border-fun-purple/20 rounded-3xl p-6 bg-gradient-to-r from-white to-fun-purple/5 hover:shadow-float transition-all duration-300">
                                                    <div className="flex items-center justify-between mb-4">
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
                                                                <h4 className="font-fredoka text-2xl text-fun-purple">Lesson {lesson.lessonNumber}</h4>
                                                                <p className="font-comic text-lg text-gray-600">
                                                                    {lesson.date} at {lesson.time} • {lesson.duration} • {lesson.instructor}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge className={`font-comic text-lg px-4 py-2 rounded-full ${
                                                                lesson.status === 'completed' ? 'bg-fun-green text-white' : 'bg-fun-blue text-white'
                                                            }`}>
                                                                {lesson.status === 'completed' ? '✅ Done!' : '⏰ Coming Soon!'}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Homework Section */}
                                                    {lesson.hasHomework && (
                                                        <div className="mt-4 p-4 bg-gradient-to-r from-fun-yellow/20 to-fun-orange/20 rounded-2xl border border-fun-yellow/30">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <FileText className="h-5 w-5 text-fun-orange" />
                                                                    <span className="font-comic text-lg font-medium text-fun-orange">📝 Homework Available!</span>
                                                                </div>
                                                                <Badge className={`font-comic text-lg px-3 py-1 rounded-full ${getHomeworkStatusColor(lesson.homeworkStatus || 'pending')}`}>
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
                                                                        className="bg-fun-orange hover:bg-fun-orange-600 text-white font-comic text-lg px-6 py-3 rounded-full shadow-float"
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
                                            <div className="text-center py-12">
                                                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                                <h3 className="text-2xl font-fredoka text-fun-purple mb-3">No lessons for {selectedMonth}</h3>
                                                <p className="font-comic text-lg text-gray-600 mb-6">
                                                    Pick a different month to see your lessons!
                                                </p>
                                                <div className="text-4xl">🎵</div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Subscription Benefits for Non-Subscribed Students */
                        <div className="max-w-4xl mx-auto">
                            <Card className="border-fun-orange/30 bg-gradient-to-r from-fun-orange/10 to-fun-yellow/10 rounded-3xl shadow-float">
                                <CardHeader>
                                    <CardTitle className="text-fun-orange flex items-center font-fredoka text-3xl">
                                        <Crown className="mr-3 h-8 w-8" />
                                        {selectedStudent?.name} needs a subscription! 👑
                                    </CardTitle>
                                    <CardDescription className="font-comic text-xl text-fun-orange/80">
                                        Subscribe to get fun piano lessons and cool homework!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {subscriptionBenefits.map((benefit, index) => (
                                            <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl">
                                                <div className={`p-3 rounded-full ${benefit.color} text-white`}>
                                                    <benefit.icon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-fredoka text-xl text-fun-purple">{benefit.title}</h4>
                                                    <p className="font-comic text-lg text-gray-700">{benefit.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center">
                                        <Button className="bg-fun-green hover:bg-fun-green-600 text-white font-comic text-2xl px-10 py-4 rounded-full shadow-float animate-bounce-gentle">
                                            <Crown className="mr-3 h-6 w-6" />
                                            🎹 Subscribe Now - ${subscribePrice}/month
                                        </Button>
                                        <p className="font-comic text-lg text-fun-orange mt-3">
                                            4 fun lessons per month • Cancel anytime! 😊
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Lessons;
