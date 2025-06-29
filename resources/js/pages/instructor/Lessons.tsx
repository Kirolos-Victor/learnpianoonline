import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Image } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
    id: string;
    scheduled_at: string;
    completed_at: string | null;
    status: 'pending' | 'completed' | 'cancelled';
    screenshot_path: string | null;
    notes: string | null;
}

interface Student {
    id: string;
    name: string;
    email: string;
    age: number;
    is_subscribed: boolean;
    sessions_remaining: number;
}

interface Props {
    student: Student;
    lessons: Lesson[];
}

const InstructorLessons = ({ student, lessons }: Props) => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        screenshot: null as File | null,
        notes: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('screenshot', e.target.files[0]);
        }
    };

    const handleSubmit = (lessonId: string) => {
        if (data.screenshot) {
            post(`/instructor/lessons/${lessonId}/complete`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSelectedLesson(null);
                    setData({ screenshot: null, notes: '' });
                },
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const pendingLessons = lessons.filter((lesson) => lesson.status === 'pending');
    const completedLessons = lessons.filter((lesson) => lesson.status === 'completed');

    return (
        <InstructorLayout title={`Lessons - ${student.name}`}>
            <Head title={`Lessons - ${student.name}`} />

            {/* Header */}
            <div className="mb-8">
                <div className="mb-4 flex items-center space-x-4">
                    <Button variant="outline" asChild>
                        <Link href="/instructor/students" className="cursor-pointer">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Students
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                        <p className="text-gray-600">{student.email}</p>
                        <div className="mt-2 flex items-center space-x-4">
                            <Badge className={student.is_subscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {student.is_subscribed ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-sm text-gray-600">{student.sessions_remaining} sessions remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lessons.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedLessons.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingLessons.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Lessons List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Lessons</h2>
                </div>

                {lessons.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No lessons found</h3>
                            <p className="text-gray-600">This student doesn't have any lessons scheduled yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {lessons.map((lesson) => (
                            <Card key={lesson.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <Calendar className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">
                                                    Lesson on {new Date(lesson.scheduled_at).toLocaleDateString()}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Scheduled for {new Date(lesson.scheduled_at).toLocaleTimeString()}
                                                </p>
                                                {lesson.completed_at && (
                                                    <p className="text-sm text-green-600">
                                                        Completed on {new Date(lesson.completed_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Badge className={getStatusColor(lesson.status)}>
                                                {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                                            </Badge>

                                            {lesson.status === 'pending' && (
                                                <Dialog
                                                    open={isDialogOpen && selectedLesson?.id === lesson.id}
                                                    onOpenChange={(open) => {
                                                        setIsDialogOpen(open);
                                                        if (open) {
                                                            setSelectedLesson(lesson);
                                                        } else {
                                                            setSelectedLesson(null);
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark Complete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Mark Lesson as Completed</DialogTitle>
                                                            <DialogDescription>
                                                                Upload a screenshot as proof the lesson was conducted and add any notes.
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label htmlFor="screenshot">Screenshot (Required)</Label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="file"
                                                                        id="screenshot"
                                                                        accept="image/*"
                                                                        onChange={handleFileChange}
                                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                                                    />
                                                                </div>
                                                                {errors.screenshot && (
                                                                    <p className="mt-1 text-sm text-red-600">{errors.screenshot}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label htmlFor="notes">Notes (Optional)</Label>
                                                                <Textarea
                                                                    id="notes"
                                                                    value={data.notes}
                                                                    onChange={(e) => setData('notes', e.target.value)}
                                                                    placeholder="Add any notes about the lesson..."
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                        </div>

                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button onClick={() => handleSubmit(lesson.id)} disabled={!data.screenshot || processing}>
                                                                {processing ? 'Marking Complete...' : 'Mark Complete'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}

                                            {lesson.status === 'completed' && lesson.screenshot_path && (
                                                <Button variant="outline" size="sm">
                                                    <Image className="mr-2 h-4 w-4" />
                                                    View Screenshot
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {lesson.notes && (
                                        <div className="mt-4 rounded-lg bg-gray-50 p-3">
                                            <div className="flex items-start space-x-2">
                                                <FileText className="mt-0.5 h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Notes:</p>
                                                    <p className="text-sm text-gray-600">{lesson.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
};

export default InstructorLessons;
