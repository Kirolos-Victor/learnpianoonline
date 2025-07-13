import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, CreditCard, Music4 } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    slug: string;
    sessions_remaining: number;
}

interface Homework {
    id: string;
    title: string;
    is_submitted: boolean;
}

interface StudentSession {
    id: string;
    sessionNumber: number;
    scheduled_at: string;
    completed_at: string | null;
    status: string;
    notes: string | null;
    homework: Homework[];
}

interface SessionsSharedData extends Omit<SharedData, 'subscribePrice'> {
    student: Student;
    sessions: StudentSession[];
    selectedMonth: string;
    availableMonths: string[];
}

const Sessions = () => {
    const { student, sessions, selectedMonth, availableMonths, subscribePrice } = usePage<SessionsSharedData>().props;

    // Filter completed sessions
    const completedSessions = sessions.filter((session) => session.status === 'completed');

    return (
        <>
            <Head title={`${student.name}'s Sessions`} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] bg-center opacity-10" />
                <div className="relative container mx-auto px-4">
                    <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 {student.name}'s Sessions</h1>
                    <p className="mb-8 text-lg text-blue-100">Track your piano learning journey and access your homework assignments.</p>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* No Sessions Warning */}
                {sessions.length === 0 ? (
                    <>
                        <Head title={`${student.name}'s Sessions`} />
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-8 rounded-lg bg-amber-50 p-6">
                                <h2 className="mb-4 text-2xl font-bold text-amber-800">Welcome to Your Piano Journey! 🎹</h2>
                                <p className="mb-4 text-amber-700">
                                    You haven't had any sessions yet. To get started with your piano lessons, please:
                                </p>
                                <ol className="mb-6 list-decimal space-y-2 text-left text-amber-700">
                                    <li>Choose a subscription plan that suits your needs</li>
                                    <li>Complete the payment process</li>
                                    <li>Schedule your first session with your instructor</li>
                                </ol>
                                <Link
                                    href={route('pricing.index')}
                                    className="inline-flex items-center rounded-lg bg-amber-600 px-6 py-3 text-white transition hover:bg-amber-700"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    View Pricing Plans
                                </Link>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-6">
                                <h3 className="mb-4 text-xl font-bold text-blue-800">Why Choose Our Piano Sessions? 🌟</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <Music4 className="mb-2 h-8 w-8 text-blue-600" />
                                        <h4 className="mb-2 font-semibold text-blue-900">Expert Instruction</h4>
                                        <p className="text-blue-700">Learn from experienced instructors who tailor lessons to your needs.</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <Calendar className="mb-2 h-8 w-8 text-blue-600" />
                                        <h4 className="mb-2 font-semibold text-blue-900">Flexible Scheduling</h4>
                                        <p className="text-blue-700">Choose session times that work best for your schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Progress Overview */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>🎹 {student.name}'s Sessions</CardTitle>
                                <CardDescription>
                                    {selectedMonth} • {completedSessions.length}/{sessions.length} sessions completed! 🎉
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Progress value={(completedSessions.length / sessions.length) * 100} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Sessions Remaining</p>
                                        <p className="text-2xl font-bold text-gray-900">{student.sessions_remaining}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">This Month</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {sessions.length} sessions • {completedSessions.length} completed! 🎉
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Month Selection */}
                        <div className="mb-8">
                            <Label htmlFor="month">Select Month</Label>
                            <Select
                                value={selectedMonth}
                                onValueChange={(value) =>
                                    router.get(route('student.sessions', student.slug), { month: value }, { preserveState: true })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableMonths.map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Monthly Sessions */}
                        <div className="mb-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">{selectedMonth} Sessions! 🎵</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {sessions.map((session) => (
                                    <Card key={session.id} className="overflow-hidden">
                                        <CardHeader>
                                            <CardTitle>Session {session.sessionNumber}</CardTitle>
                                            <CardDescription>
                                                {new Date(session.scheduled_at).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-4">
                                                <Badge
                                                    className={cn(
                                                        session.status === 'completed' && 'bg-green-100 text-green-800',
                                                        session.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                                                        session.status === 'cancelled' && 'bg-red-100 text-red-800',
                                                        session.status === 'missed' && 'bg-gray-100 text-gray-800',
                                                    )}
                                                >
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </Badge>
                                            </div>

                                            {session.notes && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-600">{session.notes}</p>
                                                </div>
                                            )}

                                            {session.homework.length > 0 && (
                                                <div>
                                                    <h4 className="mb-2 font-medium text-gray-900">Homework</h4>
                                                    <ul className="space-y-2">
                                                        {session.homework.map((hw) => (
                                                            <li key={hw.id}>
                                                                <Link
                                                                    href={route('homework.submission', {
                                                                        student: student.slug,
                                                                        sessionId: session.id,
                                                                    })}
                                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                                    {hw.title}
                                                                    {hw.is_submitted && (
                                                                        <Badge className="ml-2 bg-green-100 text-green-800">Submitted</Badge>
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default Sessions;
