import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head, useForm } from '@inertiajs/react';
import { BookOpen, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { useState } from 'react';

interface TodaysLesson {
    id: string;
    scheduled_at: string;
    formatted_time: string;
    status: 'pending' | 'completed' | 'cancelled';
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
    totalStudents: number;
    activeStudents: number;
    totalLessonsThisMonth: number;
    totalPendingHomework: number;
    todaysLessonsCount: number;
    nextLesson: {
        student_name: string;
        scheduled_at: string;
        formatted_date: string;
        formatted_time: string;
    } | null;
}

interface Props {
    todaysLessons: TodaysLesson[];
    dashboardStats: DashboardStats;
}

const InstructorDashboard = ({ todaysLessons, dashboardStats }: Props) => {
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        screenshot: null as File | null,
        notes: '',
    });

    const handleCompleteLesson = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setDialogOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedLessonId) {
            post(route('instructor.dashboard.lesson.complete', selectedLessonId), {
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

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">{dashboardStats.activeStudents} active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Lessons</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.todaysLessonsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {todaysLessons.filter((lesson) => lesson.status === 'pending').length} pending
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lessons This Month</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalLessonsThisMonth}</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalPendingHomework}</div>
                        <p className="text-xs text-muted-foreground">Needs review</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardStats.nextLesson ? dashboardStats.nextLesson.formatted_date : 'No upcoming lessons'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dashboardStats.nextLesson
                                ? `${dashboardStats.nextLesson.student_name} - ${dashboardStats.nextLesson.formatted_time}`
                                : 'Schedule a lesson'}
                        </p>
                    </CardContent>
                </Card>
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
                                                <Badge variant={lesson.status === 'completed' ? 'default' : 'secondary'}>{lesson.status}</Badge>
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
                                                <Button
                                                    onClick={() => handleCompleteLesson(lesson.id)}
                                                    size="sm"
                                                    className="flex items-center space-x-2"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Mark Complete</span>
                                                </Button>
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

            {/* Complete Lesson Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Mark Lesson as Completed</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
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

                        <div>
                            <Label htmlFor="notes" className="text-sm font-medium">
                                Notes (optional)
                            </Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Add any notes about the lesson..."
                                className="mt-1"
                                rows={3}
                            />
                            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Mark Complete'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </InstructorLayout>
    );
};

export default InstructorDashboard;
