import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InstructorLayout from '@/layouts/instructor-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Ban, BookOpen, Calendar, CheckCircle, Clock, History, MessageCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TodaysSession {
    id: string;
    student_name: string;
    student_slug: string;
    scheduled_time: string;
    status: string;
    notes: string | null;
}

interface DashboardStats {
    totalSessionsThisMonth: number;
    pendingSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    missedSessions: number;
    todaysSessionsCount: number;
}

interface Props {
    todaysSessions: TodaysSession[];
    dashboardStats: DashboardStats;
}

const InstructorDashboard = ({ todaysSessions, dashboardStats }: Props) => {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'complete' | 'missed' | 'cancel' | null>(null);
    const [notes, setNotes] = useState('');

    const handleCompleteSession = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setActionType('complete');
        setIsDialogOpen(true);
    };

    const handleMissedSession = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setActionType('missed');
        setIsDialogOpen(true);
    };

    const handleCancelSession = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setActionType('cancel');
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (selectedSessionId) {
            let routeName = '';
            switch (actionType) {
                case 'complete':
                    routeName = 'instructor.dashboard.session.complete';
                    break;
                case 'missed':
                    routeName = 'instructor.dashboard.session.missed';
                    break;
                case 'cancel':
                    routeName = 'instructor.dashboard.session.cancel';
                    break;
            }

            router.post(
                route(routeName, selectedSessionId),
                { notes },
                {
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setSelectedSessionId(null);
                        setNotes('');
                    },
                },
            );
        }
    };

    return (
        <InstructorLayout title="Dashboard">
            <Head title="Instructor Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-2 text-gray-600">Overview of your students and today's lessons</p>
                    </div>
                    <Link
                        href={route('instructor.chat')}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                        })}
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat with Students
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="mb-8">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    Monthly Overview - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>

                {/* Main Stats Grid */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-blue-900">This Month</CardTitle>
                            <div className="rounded-full bg-blue-200 p-2">
                                <BookOpen className="h-4 w-4 text-blue-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900">{dashboardStats.totalSessionsThisMonth}</div>
                            <p className="text-sm text-blue-700">Total Sessions This Month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-purple-900">Today</CardTitle>
                            <div className="rounded-full bg-purple-200 p-2">
                                <Calendar className="h-4 w-4 text-purple-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-900">{dashboardStats.todaysSessionsCount}</div>
                            <p className="text-sm text-purple-700">
                                {todaysSessions.filter((session) => session.status === 'pending').length} pending
                            </p>
                            <p className="text-sm text-purple-700">Today's Sessions</p>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-orange-900">Pending</CardTitle>
                            <div className="rounded-full bg-orange-200 p-2">
                                <Clock className="h-4 w-4 text-orange-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-900">{dashboardStats.pendingSessions}</div>
                            <p className="text-sm text-orange-700">Pending Sessions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Session Status Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-emerald-900">Completed</CardTitle>
                            <div className="rounded-full bg-emerald-200 p-2">
                                <CheckCircle className="h-4 w-4 text-emerald-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-900">{dashboardStats.completedSessions}</div>
                            <p className="text-sm text-emerald-700">Completed Sessions</p>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-red-900">Missed</CardTitle>
                            <div className="rounded-full bg-red-200 p-2">
                                <AlertTriangle className="h-4 w-4 text-red-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-900">{dashboardStats.missedSessions}</div>
                            <p className="text-sm text-red-700">Missed Sessions</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-amber-900">Cancelled</CardTitle>
                            <div className="rounded-full bg-amber-200 p-2">
                                <XCircle className="h-4 w-4 text-amber-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-900">{dashboardStats.cancelledSessions}</div>
                            <p className="text-sm text-amber-700">Cancelled Sessions</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Today's Sessions */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Today's Sessions</CardTitle>
                    <CardDescription>Manage your sessions for today</CardDescription>
                </CardHeader>
                <CardContent>
                    {todaysSessions.length > 0 ? (
                        <div className="space-y-4">
                            {todaysSessions.map((session) => (
                                <Card key={session.id} className="overflow-hidden">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>{session.student_name}</CardTitle>
                                                <CardDescription>Scheduled for {session.scheduled_time}</CardDescription>
                                            </div>
                                            <Badge
                                                className={cn(
                                                    'ml-2',
                                                    session.status === 'completed' && 'bg-green-500',
                                                    session.status === 'pending' && 'bg-yellow-500',
                                                    session.status === 'cancelled' && 'bg-red-500',
                                                    session.status === 'missed' && 'bg-gray-500',
                                                )}
                                            >
                                                {session.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {session.notes && <p className="mb-4 text-sm text-gray-600">{session.notes}</p>}
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCompleteSession(session.id)}
                                                disabled={session.status !== 'pending'}
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Complete
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleMissedSession(session.id)}
                                                disabled={session.status !== 'pending'}
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Missed
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCancelSession(session.id)}
                                                disabled={session.status !== 'pending'}
                                            >
                                                <Ban className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                            <Link
                                                href={route('instructor.student.sessions', session.student_slug)}
                                                className={buttonVariants({
                                                    variant: 'outline',
                                                    size: 'sm',
                                                })}
                                            >
                                                <History className="mr-2 h-4 w-4" />
                                                History
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={Calendar} title="No Sessions Today" description="You have no sessions scheduled for today." />
                    )}
                </CardContent>
            </Card>

            {/* Session Action Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'complete'
                                ? 'Mark Session as Completed'
                                : actionType === 'missed'
                                  ? 'Mark Session as Missed'
                                  : 'Cancel Session'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'complete'
                                ? 'Add any notes about the completed session.'
                                : actionType === 'missed'
                                  ? 'Please provide a reason for marking this session as missed.'
                                  : 'Please provide a reason for cancelling this session.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={
                                    actionType === 'complete'
                                        ? 'Enter session notes...'
                                        : actionType === 'missed'
                                          ? 'Enter reason for missed session...'
                                          : 'Enter reason for cancellation...'
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {actionType === 'complete' ? 'Complete Session' : actionType === 'missed' ? 'Mark as Missed' : 'Cancel Session'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </InstructorLayout>
    );
};

export default InstructorDashboard;
