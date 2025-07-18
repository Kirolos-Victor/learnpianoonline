import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentLayout from '@/layouts/student-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, CreditCard, Image, MessageSquare, Music4, User, XCircle } from 'lucide-react';

interface Instructor {
    id: string;
    name: string;
}

interface Student {
    id: string;
    name: string;
    slug: string;
    sessions_remaining: number;
    is_subscribed: boolean;
    instructor: Instructor | null;
    parent_timezone: string;
    preferred_time: string | null;
    day_of_week: string;
}

interface StudentSession {
    id: string;
    sessionNumber: number;
    instructor: Instructor | null;
    scheduled_at: string;
    scheduled_date: string;
    scheduled_time: string;
    scheduled_day: string;
    completed_at: string | null;
    completed_date: string | null;
    completed_time: string | null;
    duration: string;
    status: string;
    notes: string | null;
    screenshot_path: string | null;
    type: string;
    is_completed: boolean;
    is_pending: boolean;
    is_cancelled: boolean;
    is_missed: boolean;
}

interface SessionsSharedData extends Omit<SharedData, 'subscribePrice'> {
    student: Student;
    sessions: StudentSession[];
    selectedMonth: string;
    availableMonths: string[];
    subscribePrice?: number;
}

const Sessions = () => {
    const { student, sessions, selectedMonth, availableMonths, subscribePrice } = usePage<SessionsSharedData>().props;

    // Filter sessions by status
    const completedSessions = sessions.filter((session) => session.is_completed);
    const pendingSessions = sessions.filter((session) => session.is_pending);
    const cancelledSessions = sessions.filter((session) => session.is_cancelled);
    const missedSessions = sessions.filter((session) => session.is_missed);

    // Format month for display
    const formatMonthDisplay = (monthString: string) => {
        const [year, month] = monthString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });
    };

    // Get status icon and color
    const getStatusInfo = (session: StudentSession) => {
        if (session.is_completed) {
            return {
                icon: CheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-200',
                textColor: 'text-green-800',
            };
        }
        if (session.is_pending) {
            return {
                icon: Clock,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
            };
        }
        if (session.is_cancelled) {
            return {
                icon: XCircle,
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
            };
        }
        if (session.is_missed) {
            return {
                icon: AlertCircle,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-200',
                textColor: 'text-gray-800',
            };
        }
        return {
            icon: Clock,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            borderColor: 'border-gray-200',
            textColor: 'text-gray-800',
        };
    };

    // If student is not subscribed, show subscription prompt
    if (!student.is_subscribed) {
        return (
            <StudentLayout>
                <div className="min-h-screen bg-background">
                    <Head title={`${student.name}'s Sessions`} />

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
                                    <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 {student.name}'s Sessions</h1>
                                    <p className="mb-8 font-comic text-xl text-white/90">Track your piano learning journey and session history! 🎵</p>
                                </div>

                                {/* Back to Parent Dashboard Button */}
                                <Link
                                    href={route('parent.dashboard')}
                                    className="shadow-float mt-4 inline-flex items-center rounded-full bg-white/20 px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-fun-purple md:mt-0"
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    👨‍👩‍👧‍👦 Parent Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Required Message */}
                    <div className="container mx-auto px-4 py-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="shadow-float mb-8 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8">
                                <h2 className="mb-4 font-fredoka text-3xl font-bold text-amber-800">Subscribe to Access Your Sessions! 🎹</h2>
                                <p className="mb-6 font-comic text-lg text-amber-700">
                                    To view your piano sessions and track your progress, you need an active subscription. Here's what you'll get:
                                </p>
                                <ul className="mb-8 space-y-3 text-left font-comic text-lg text-amber-700">
                                    <li>✅ Access to all your session history</li>
                                    <li>✅ Track your progress and achievements</li>
                                    <li>✅ View upcoming sessions</li>
                                    <li>✅ Session notes and feedback</li>
                                </ul>
                                <Link
                                    href={route('parent.subscription')}
                                    className="inline-flex items-center rounded-full bg-amber-600 px-8 py-4 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-amber-700"
                                >
                                    <CreditCard className="mr-3 h-6 w-6" />
                                    Subscribe Now
                                </Link>
                            </div>

                            <div className="shadow-float rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
                                <h3 className="mb-6 font-fredoka text-2xl font-bold text-blue-800">Why Choose Our Piano Sessions? 🌟</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="shadow-float rounded-xl bg-white p-6">
                                        <Music4 className="mb-3 h-10 w-10 text-blue-600" />
                                        <h4 className="mb-3 font-fredoka text-lg font-bold text-blue-900">Expert Instruction</h4>
                                        <p className="font-comic text-blue-700">
                                            Learn from experienced instructors who tailor lessons to your needs.
                                        </p>
                                    </div>
                                    <div className="shadow-float rounded-xl bg-white p-6">
                                        <Calendar className="mb-3 h-10 w-10 text-blue-600" />
                                        <h4 className="mb-3 font-fredoka text-lg font-bold text-blue-900">Flexible Scheduling</h4>
                                        <p className="font-comic text-blue-700">Choose session times that work best for your schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // If student is subscribed, show sessions
    return (
        <StudentLayout>
            <div className="min-h-screen bg-background">
                <Head title={`${student.name}'s Sessions`} />

                {/* Header */}
                <section className="bg-rainbow-gradient relative overflow-hidden py-16 text-white">
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
                    <div className="relative container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="text-center md:text-left">
                                <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 {student.name}'s Sessions</h1>
                                <p className="mb-8 font-comic text-xl text-white/90">Track your piano learning journey and session history! 🎵</p>

                                {/* Student Info */}
                                <div className="flex flex-wrap gap-4 text-white/80">
                                    {student.instructor && (
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span className="font-comic">Instructor: {student.instructor.name}</span>
                                        </div>
                                    )}
                                    {student.preferred_time && (
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            <span className="font-comic">Preferred: {student.preferred_time}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span className="font-comic">Timezone: {student.parent_timezone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Back to Parent Dashboard Button */}
                            <Link
                                href={route('parent.dashboard')}
                                className="shadow-float mt-4 inline-flex items-center rounded-full bg-white/20 px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-fun-purple md:mt-0"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                👨‍👩‍👧‍👦 Parent Dashboard
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* No Sessions Warning */}
                    {sessions.length === 0 ? (
                        <div className="mx-auto max-w-4xl">
                            <div className="shadow-float mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
                                <h2 className="mb-4 font-fredoka text-3xl font-bold text-blue-800">No Sessions Yet! 🎹</h2>
                                <p className="mb-6 font-comic text-lg text-blue-700">
                                    You're all set up with your subscription! Your instructor will schedule your first session soon.
                                </p>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="shadow-float rounded-xl bg-white p-6">
                                        <Music4 className="mb-3 h-10 w-10 text-blue-600" />
                                        <h4 className="mb-3 font-fredoka text-lg font-bold text-blue-900">What's Next?</h4>
                                        <p className="font-comic text-blue-700">
                                            Your instructor will contact you to schedule your first piano session.
                                        </p>
                                    </div>
                                    <div className="shadow-float rounded-xl bg-white p-6">
                                        <Calendar className="mb-3 h-10 w-10 text-blue-600" />
                                        <h4 className="mb-3 font-fredoka text-lg font-bold text-blue-900">Sessions Remaining</h4>
                                        <p className="font-comic text-2xl font-bold text-blue-600">{student.sessions_remaining} sessions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Progress Overview */}
                            <Card className="shadow-float mb-8 rounded-2xl border-2 border-fun-purple/20">
                                <CardHeader className="rounded-t-2xl bg-gradient-to-r from-fun-purple to-fun-blue text-white">
                                    <CardTitle className="font-fredoka text-2xl">🎹 {student.name}'s Sessions</CardTitle>
                                    <CardDescription className="font-comic text-white/90">
                                        {formatMonthDisplay(selectedMonth)} • {completedSessions.length}/{sessions.length} sessions completed! 🎉
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        <div className="mb-2 flex justify-between font-comic text-sm">
                                            <span>Progress</span>
                                            <span>{Math.round((completedSessions.length / sessions.length) * 100)}%</span>
                                        </div>
                                        <Progress value={(completedSessions.length / sessions.length) * 100} className="h-3" />
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-4">
                                        <div className="text-center">
                                            <p className="font-comic text-sm text-gray-500">Sessions Remaining</p>
                                            <p className="font-fredoka text-3xl font-bold text-fun-purple">{student.sessions_remaining}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-comic text-sm text-gray-500">Completed</p>
                                            <p className="font-fredoka text-2xl font-bold text-green-600">{completedSessions.length} ✅</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-comic text-sm text-gray-500">Upcoming</p>
                                            <p className="font-fredoka text-2xl font-bold text-fun-green">{pendingSessions.length} ⏰</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-comic text-sm text-gray-500">This Month</p>
                                            <p className="font-fredoka text-2xl font-bold text-fun-blue">{sessions.length} total</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Month Selection */}
                            <div className="mb-8">
                                <Label htmlFor="month" className="font-comic text-lg font-bold text-gray-700">
                                    Select Month
                                </Label>
                                <Select
                                    value={selectedMonth}
                                    onValueChange={(value) =>
                                        router.get(route('student.sessions', student.slug), { month: value }, { preserveState: true })
                                    }
                                >
                                    <SelectTrigger className="mt-2 rounded-xl border-2 border-fun-purple/20">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableMonths.map((month) => (
                                            <SelectItem key={month} value={month}>
                                                {formatMonthDisplay(month)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Monthly Sessions */}
                            <div className="mb-8">
                                <h2 className="mb-6 font-fredoka text-3xl font-bold text-gray-900">
                                    {formatMonthDisplay(selectedMonth)} Sessions! 🎵
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {sessions.map((session) => {
                                        const statusInfo = getStatusInfo(session);
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <Card
                                                key={session.id}
                                                className="shadow-float overflow-hidden rounded-2xl border-2 border-fun-blue/20 transition-all duration-200 hover:scale-105"
                                            >
                                                <CardHeader className="bg-gradient-to-r from-fun-blue/10 to-fun-purple/10">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="font-fredoka text-xl">Session {session.sessionNumber}</CardTitle>
                                                        <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                                                    </div>
                                                    <CardDescription className="font-comic">
                                                        {session.scheduled_date} at {session.scheduled_time}
                                                    </CardDescription>
                                                    <div className="font-comic text-sm text-gray-600">{session.scheduled_day}</div>
                                                </CardHeader>
                                                <CardContent className="p-6">
                                                    <div className="mb-4">
                                                        <Badge
                                                            className={cn(
                                                                'font-comic text-sm',
                                                                statusInfo.bgColor,
                                                                statusInfo.textColor,
                                                                statusInfo.borderColor,
                                                            )}
                                                        >
                                                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {session.instructor && (
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <User className="mr-2 h-4 w-4" />
                                                                <span className="font-comic">{session.instructor.name}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            <span className="font-comic">{session.duration}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Music4 className="mr-2 h-4 w-4" />
                                                            <span className="font-comic">{session.type} session</span>
                                                        </div>

                                                        {/* Completion Info */}
                                                        {session.is_completed && session.completed_date && (
                                                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                                                                <div className="flex items-center text-sm text-green-700">
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    <span className="font-comic font-semibold">Completed</span>
                                                                </div>
                                                                <div className="mt-1 text-xs text-green-600">
                                                                    {session.completed_date} at {session.completed_time}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Notes */}
                                                        {session.notes && (
                                                            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                                                <div className="flex items-start text-sm text-blue-700">
                                                                    <MessageSquare className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                                                                    <div>
                                                                        <span className="font-comic font-semibold">Notes:</span>
                                                                        <p className="mt-1 font-comic">{session.notes}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Screenshot */}
                                                        {session.screenshot_path && (
                                                            <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
                                                                <div className="flex items-center text-sm text-purple-700">
                                                                    <Image className="mr-2 h-4 w-4" />
                                                                    <span className="font-comic font-semibold">Session Screenshot Available</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </StudentLayout>
    );
};

export default Sessions;
