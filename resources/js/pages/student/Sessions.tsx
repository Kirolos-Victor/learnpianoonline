import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentLayout from '@/layouts/student-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, CreditCard, FileText, Music4 } from 'lucide-react';

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
    availableYears: number[];
    availableMonths: { value: string; label: string }[];
    subscribePrice?: number;
}

const Sessions = () => {
    const { student, sessions, selectedMonth, availableYears, availableMonths, subscribePrice } = usePage<SessionsSharedData>().props;

    // Parse selected month to get year and month
    const [selectedYear, selectedMonthNum] = selectedMonth.split('-');
    const currentYear = parseInt(selectedYear);
    const currentMonth = selectedMonthNum;

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

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'missed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status text
    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'pending':
                return 'Pending';
            case 'cancelled':
                return 'Cancelled';
            case 'missed':
                return 'Missed';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
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

    // If student is subscribed but not assigned an instructor
    if (student.is_subscribed && !student.instructor) {
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
                            <div
                                className="animate-gentle-bounce absolute right-1/4 bottom-8 text-xl text-white/20"
                                style={{ animationDelay: '1.5s' }}
                            >
                                ♫
                            </div>
                        </div>
                        <div className="relative container mx-auto px-4">
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
                    </section>

                    {/* Instructor Assignment Pending Message */}
                    <div className="container mx-auto px-4 py-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="shadow-float mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
                                <h2 className="mb-4 font-fredoka text-3xl font-bold text-blue-800">Great News! Your Subscription is Active! 🎉</h2>
                                <p className="mb-6 font-comic text-lg text-blue-700">
                                    You're all set up with your subscription! We're currently matching you with the perfect instructor for your piano
                                    learning journey.
                                </p>
                                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-100 p-4">
                                    <h3 className="mb-2 font-fredoka text-xl font-bold text-blue-800">What's Happening Next? ⏰</h3>
                                    <p className="font-comic text-blue-700">
                                        Within the next 24-48 hours, you'll be assigned a qualified instructor who will:
                                    </p>
                                    <ul className="mt-3 space-y-2 font-comic text-blue-700">
                                        <li>• Review your learning preferences and goals</li>
                                        <li>• Schedule your first piano session</li>
                                        <li>• Create a personalized learning plan</li>
                                        <li>• Begin your musical journey together</li>
                                    </ul>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="shadow-float rounded-xl bg-white p-6">
                                        <Music4 className="mb-3 h-10 w-10 text-blue-600" />
                                        <h4 className="mb-3 font-fredoka text-lg font-bold text-blue-900">Sessions Remaining</h4>
                                        <p className="font-comic text-2xl font-bold text-blue-600">{student.sessions_remaining} sessions</p>
                                    </div>
                                    <div className="shadow-float rounded-xl bg-white p-6">
                                        <Calendar className="mb-3 h-10 w-10 text-blue-600" />
                                        <h4 className="mb-3 font-fredoka text-lg font-bold text-blue-900">Ready to Start</h4>
                                        <p className="font-comic text-blue-700">
                                            Your instructor will contact you soon to schedule your first session!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // If student is subscribed and has an instructor, show sessions
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
                    {/* Progress Overview */}
                    <Card className="shadow-float mb-8 rounded-2xl border-2 border-fun-purple/20">
                        <CardHeader className="rounded-t-2xl bg-gradient-to-r from-fun-purple to-fun-blue text-white">
                            <CardTitle className="font-fredoka text-2xl">🎹 {student.name}'s Sessions</CardTitle>
                            <CardDescription className="font-comic text-white/90">
                                {formatMonthDisplay(selectedMonth)} • {completedSessions.length}/{sessions.length} sessions completed! 🎉
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
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

                    {/* Year and Month Selection */}
                    <div className="mb-8 grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="year" className="font-comic text-lg font-bold text-gray-700">
                                Select Year
                            </Label>
                            <Select
                                value={currentYear.toString()}
                                onValueChange={(value) => {
                                    const newMonth = `${value}-${currentMonth}`;
                                    router.get(route('student.sessions', student.slug), { month: newMonth }, { preserveScroll: true });
                                }}
                            >
                                <SelectTrigger className="mt-2 rounded-xl border-2 border-fun-purple/20">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYears.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="month" className="font-comic text-lg font-bold text-gray-700">
                                Select Month
                            </Label>
                            <Select
                                value={currentMonth}
                                onValueChange={(value) => {
                                    const newMonth = `${currentYear}-${value}`;
                                    router.get(route('student.sessions', student.slug), { month: newMonth }, { preserveScroll: true });
                                }}
                            >
                                <SelectTrigger className="mt-2 rounded-xl border-2 border-fun-purple/20">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableMonths.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Sessions Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions ({sessions.length})</CardTitle>
                            <CardDescription>All sessions for {formatMonthDisplay(selectedMonth)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sessions.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions found</h3>
                                    <p className="mt-2 text-gray-600">No sessions have been scheduled for this month yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Session #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Date & Time
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Instructor
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Completed At
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Notes & Homework
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {sessions.map((session) => (
                                                <tr key={session.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                                                        Session {session.sessionNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm">
                                                            <div className="font-medium">{session.scheduled_date}</div>
                                                            <div className="text-gray-500">
                                                                {session.scheduled_day} • {session.scheduled_time}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {session.instructor?.name || student.instructor?.name || '-'}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge className={getStatusBadgeColor(session.status)}>{getStatusText(session.status)}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {session.completed_at
                                                            ? new Date(session.completed_at).toLocaleDateString('en-US', {
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 w-10 border-blue-200 bg-blue-50 p-0 hover:bg-blue-100"
                                                                >
                                                                    <span className="sr-only">View notes and homework</span>
                                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Notes & Homework for Session {session.sessionNumber}</DialogTitle>
                                                                    <DialogDescription>
                                                                        {session.notes || 'No notes or homework available for this session.'}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </StudentLayout>
    );
};

export default Sessions;
