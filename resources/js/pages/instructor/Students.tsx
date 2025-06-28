import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    Plus,
    Eye,
    Search,
    Filter,
    Mail,
    Phone
} from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
    email: string;
    age: number;
    is_subscribed: boolean;
    sessions_remaining: number;
    lessons_completed: number;
    lessons_pending: number;
    last_lesson_date: string | null;
    next_lesson_date: string | null;
}

interface Props {
    students: Student[];
}

const InstructorStudents = ({ students }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusColor = (isSubscribed: boolean) => {
        return isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getProgressColor = (completed: number, total: number) => {
        const progress = total > 0 ? (completed / total) * 100 : 0;
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 60) return 'bg-blue-500';
        if (progress >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
                            (statusFilter === 'active' && student.is_subscribed) ||
                            (statusFilter === 'inactive' && !student.is_subscribed);
        return matchesSearch && matchesStatus;
    });

    const activeStudents = students.filter(s => s.is_subscribed);
    const inactiveStudents = students.filter(s => !s.is_subscribed);

    return (
        <InstructorLayout title="Students">
            <Head title="Students - Instructor Panel" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="text-gray-600 mt-2">Manage your assigned students and track their progress</p>
            </div>

            {/* Stats Overview */}
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
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStudents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently enrolled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Lessons</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {students.reduce((sum, student) => sum + student.lessons_pending, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lessons to conduct
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {students.reduce((sum, student) => sum + student.lessons_completed, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total completed
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{student.name}</CardTitle>
                                    <CardDescription>{student.email}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Status and Sessions */}
                                <div className="flex items-center justify-between">
                                    <Badge className={getStatusColor(student.is_subscribed)}>
                                        {student.is_subscribed ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <div className="text-sm text-gray-600">
                                        {student.sessions_remaining} sessions left
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{student.lessons_completed} completed</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getProgressColor(student.lessons_completed, student.lessons_completed + student.lessons_pending)}`}
                                            style={{
                                                width: `${student.lessons_completed + student.lessons_pending > 0 ? (student.lessons_completed / (student.lessons_completed + student.lessons_pending)) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Lesson Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pending Lessons:</span>
                                        <span className="font-medium">{student.lessons_pending}</span>
                                    </div>
                                    {student.last_lesson_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Last Lesson:</span>
                                            <span className="font-medium">
                                                {new Date(student.last_lesson_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {student.next_lesson_date && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Next Lesson:</span>
                                            <span className="font-medium">
                                                {new Date(student.next_lesson_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2 pt-2">
                                    <Button asChild className="flex-1">
                                        <Link href={`/instructor/students/${student.id}/lessons`} className="cursor-pointer">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Lessons
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </InstructorLayout>
    );
};

export default InstructorStudents;
