import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    GraduationCap,
    BookOpen,
    CheckCircle,
    Users,
    UserCheck,
    UserX
} from 'lucide-react';

interface Instructor {
    id: string;
    name: string;
    email: string;
}

interface Student {
    id: string;
    user_id: string;
    name: string;
    email: string;
    sessions_remaining: number;
    is_subscribed: boolean;
    lessons_count: number;
    completed_lessons: number;
    is_active: boolean;
}

interface Props {
    instructor: Instructor;
    students: Student[];
}

const AdminInstructorStudents = ({ instructor, students }: Props) => {
    const activeStudents = students.filter(student => student.is_active);
    const inactiveStudents = students.filter(student => !student.is_active);
    const subscribedStudents = students.filter(student => student.is_subscribed);
    const totalLessons = students.reduce((sum, student) => sum + student.lessons_count, 0);
    const totalCompletedLessons = students.reduce((sum, student) => sum + student.completed_lessons, 0);

    return (
        <AdminLayout title={`${instructor.name} - Students`}>
            <Head title={`${instructor.name} - Students`} />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/instructors" className="text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{instructor.name}</h1>
                                <p className="text-gray-600 mt-2">Students assigned to this instructor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeStudents.length} active, {inactiveStudents.length} inactive
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStudents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribed</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscribedStudents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            With active subscriptions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLessons}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalCompletedLessons} completed
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Students List */}
            <Card>
                <CardHeader>
                    <CardTitle>Assigned Students</CardTitle>
                    <CardDescription>
                        View all students assigned to {instructor.name}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {students.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No students assigned</h3>
                            <p className="text-gray-600">This instructor doesn't have any students assigned yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-blue-100 text-blue-800">
                                                <GraduationCap className="h-3 w-3 mr-1" />
                                                Student
                                            </Badge>
                                            <Badge className={student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                {student.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                            {student.is_subscribed && (
                                                <Badge className="bg-purple-100 text-purple-800">
                                                    Subscribed
                                                </Badge>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-600">{student.email}</p>
                                            <div className="mt-1 flex items-center space-x-4">
                                                <p className="text-xs text-gray-500">
                                                    Sessions: {student.sessions_remaining}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Lessons: {student.lessons_count}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Completed: {student.completed_lessons}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link href={`/admin/users`}>
                                            <Badge variant="outline" className="cursor-pointer">
                                                View User
                                            </Badge>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminInstructorStudents;
