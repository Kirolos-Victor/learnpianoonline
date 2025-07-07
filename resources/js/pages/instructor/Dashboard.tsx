import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Calendar, CheckCircle, Clock, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TodaysLesson {
    id: string;
    scheduled_at: string;
    formatted_time: string;
    status: 'pending' | 'completed' | 'cancelled' | 'missed';
    notes: string | null;
    screenshot_path: string | null;
    completed_at: string | null;
    formatted_completed_time: string | null;
    student: {
        id: string;
        name: string;
        email: string;
        age: number;
        has_piano: boolean;
        sessions_remaining: number;
    };
    homework: Array<{
        id: string;
        title: string;
        description: string;
        is_submitted: boolean;
        due_date: string | null;
    }>;
}

interface DashboardStats {
    totalLessonsThisMonth: number;
    pendingLessons: number;
    completedLessons: number;
    cancelledLessons: number;
    missedLessons: number;
    totalPendingHomework: number;
    todaysLessonsCount: number;
}

interface Props {
    todaysLessons: TodaysLesson[];
    dashboardStats: DashboardStats;
}

const InstructorDashboard = ({ todaysLessons, dashboardStats }: Props) => {
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'complete' | 'missed' | 'cancel'>('complete');

    const { data, setData, post, processing, errors, reset } = useForm({
        screenshot: null as File | null,
        notes: '',
    });

    const handleCompleteLesson = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setDialogType('complete');
        setDialogOpen(true);
    };

    const handleMissedLesson = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setDialogType('missed');
        setDialogOpen(true);
    };

    const handleCancelLesson = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setDialogType('cancel');
        setDialogOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedLessonId) {
            const routeName =
                dialogType === 'complete'
                    ? 'instructor.dashboard.lesson.complete'
                    : dialogType === 'missed'
                      ? 'instructor.dashboard.lesson.missed'
                      : 'instructor.dashboard.lesson.cancel';

            post(route(routeName, selectedLessonId), {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                    setSelectedLessonId(null);
                },
            });
        }
    };

    return (
        <InstructorLayout title="Dashboard">
            <Head title="Instructor Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Overview of your students and today's lessons</p>
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
                            <div className="text-3xl font-bold text-blue-900">{dashboardStats.totalLessonsThisMonth}</div>
                            <p className="text-sm text-blue-700">Total lessons</p>
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
                            <div className="text-3xl font-bold text-purple-900">{dashboardStats.todaysLessonsCount}</div>
                            <p className="text-sm text-purple-700">{todaysLessons.filter((lesson) => lesson.status === 'pending').length} pending</p>
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
                            <div className="text-3xl font-bold text-orange-900">{dashboardStats.pendingLessons}</div>
                            <p className="text-sm text-orange-700">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-green-900">Homework</CardTitle>
                            <div className="rounded-full bg-green-200 p-2">
                                <Users className="h-4 w-4 text-green-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900">{dashboardStats.totalPendingHomework}</div>
                            <p className="text-sm text-green-700">This month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Lesson Status Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-emerald-900">Completed</CardTitle>
                            <div className="rounded-full bg-emerald-200 p-2">
                                <CheckCircle className="h-4 w-4 text-emerald-700" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-900">{dashboardStats.completedLessons}</div>
                            <p className="text-sm text-emerald-700">This month</p>
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
                            <div className="text-3xl font-bold text-red-900">{dashboardStats.missedLessons}</div>
                            <p className="text-sm text-red-700">This month</p>
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
                            <div className="text-3xl font-bold text-amber-900">{dashboardStats.cancelledLessons}</div>
                            <p className="text-sm text-amber-700">This month</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Today's Lessons */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Today's Lessons</CardTitle>
                    <CardDescription>Your scheduled lessons for today</CardDescription>
                </CardHeader>
                <CardContent>
                    {todaysLessons.length > 0 ? (
                        <div className="space-y-4">
                            {todaysLessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{lesson.student.name}</h3>
                                            <p className="text-sm text-gray-600">{lesson.student.email}</p>
                                            <div className="mt-1 flex items-center space-x-4">
                                                <Badge
                                                    variant={
                                                        lesson.status === 'completed'
                                                            ? 'default'
                                                            : lesson.status === 'missed'
                                                              ? 'destructive'
                                                              : lesson.status === 'cancelled'
                                                                ? 'outline'
                                                                : 'secondary'
                                                    }
                                                >
                                                    {lesson.status}
                                                </Badge>
                                                <span className="text-sm text-gray-500">
                                                    Age: {lesson.student.age} • Sessions: {lesson.student.sessions_remaining}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Time</p>
                                            <p className="font-medium text-gray-900">{lesson.formatted_time}</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {lesson.homework.some((hw) => hw.is_submitted) && (
                                                <Badge variant="outline" className="flex items-center space-x-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>Homework Done</span>
                                                </Badge>
                                            )}

                                            {lesson.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        onClick={() => handleCompleteLesson(lesson.id)}
                                                        size="sm"
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Complete</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleMissedLesson(lesson.id)}
                                                        size="sm"
                                                        variant="destructive"
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Clock className="h-4 w-4" />
                                                        <span>Missed</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleCancelLesson(lesson.id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex items-center space-x-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                                                    >
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Cancel</span>
                                                    </Button>
                                                </div>
                                            )}

                                            {lesson.status === 'completed' && (
                                                <div className="flex flex-col items-end space-y-1">
                                                    <Badge variant="default" className="flex items-center space-x-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Completed</span>
                                                    </Badge>
                                                    <p className="text-xs text-gray-500">at {lesson.formatted_completed_time}</p>
                                                </div>
                                            )}

                                            {lesson.status === 'missed' && (
                                                <div className="flex flex-col items-end space-y-1">
                                                    <Badge variant="destructive" className="flex items-center space-x-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Missed</span>
                                                    </Badge>
                                                    <p className="text-xs text-gray-500">at {lesson.formatted_completed_time}</p>
                                                </div>
                                            )}

                                            {lesson.status === 'cancelled' && (
                                                <div className="flex flex-col items-end space-y-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="flex items-center space-x-1 border-orange-500 text-orange-600"
                                                    >
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Cancelled</span>
                                                    </Badge>
                                                    <p className="text-xs text-gray-500">at {lesson.formatted_completed_time}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-500">No lessons scheduled for today</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Lesson Action Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === 'complete'
                                ? 'Mark Lesson as Completed'
                                : dialogType === 'missed'
                                  ? 'Mark Lesson as Missed'
                                  : 'Cancel Lesson'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {dialogType === 'complete' && (
                            <div>
                                <Label htmlFor="screenshot" className="text-sm font-medium">
                                    Upload Screenshot *
                                </Label>
                                <Input
                                    id="screenshot"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('screenshot', e.target.files?.[0] || null)}
                                    className="mt-1"
                                    required
                                />
                                {errors.screenshot && <p className="mt-1 text-sm text-red-600">{errors.screenshot}</p>}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="notes" className="text-sm font-medium">
                                Notes {dialogType === 'cancel' ? '(required)' : '(optional)'}
                            </Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder={
                                    dialogType === 'complete'
                                        ? 'Add any notes about the lesson...'
                                        : dialogType === 'missed'
                                          ? 'Add reason for missed lesson...'
                                          : 'Explain why you need to cancel this lesson...'
                                }
                                className="mt-1"
                                rows={3}
                                required={dialogType === 'cancel'}
                            />
                            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : dialogType === 'complete'
                                      ? 'Mark Complete'
                                      : dialogType === 'missed'
                                        ? 'Mark Missed'
                                        : 'Cancel Lesson'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </InstructorLayout>
    );
};

export default InstructorDashboard;
