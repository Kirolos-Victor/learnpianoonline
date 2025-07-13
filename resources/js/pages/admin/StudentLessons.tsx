import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Eye, Filter, User } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    age: number;
    is_subscribed: boolean;
    lessons_remaining: number;
    lessons_completed: number;
    lessons_pending: number;
    instructor: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface Lesson {
    id: number;
    student_name: string;
    instructor_name: string;
    scheduled_at: string;
    scheduled_date: string;
    scheduled_time: string;
    completed_at: string | null;
    status: 'pending' | 'completed' | 'cancelled' | 'missed';
    notes: string | null;
    screenshot_path: string | null;
}

interface PaginatedLessons {
    data: Lesson[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Month {
    value: string;
    label: string;
}

interface Filters {
    month: string | null;
    status: string;
    per_page: number;
}

interface Props {
    student: Student;
    lessons: PaginatedLessons;
    availableMonths: Month[];
    filters: Filters;
}

const AdminStudentLessons = ({ student, lessons, availableMonths, filters }: Props) => {
    const [month, setMonth] = useState(filters.month || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const handleFilterChange = () => {
        router.get(
            route('admin.students.lessons', { id: student.id }),
            {
                month: month !== 'all' ? month : undefined,
                status: status !== 'all' ? status : undefined,
                per_page: perPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleResetFilters = () => {
        setMonth('all');
        setStatus('all');
        setPerPage(10);
        router.get(
            route('admin.students.lessons', { id: student.id }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

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
                return status;
        }
    };

    return (
        <AdminLayout title={`${student.name} - Lessons`}>
            <Head title={`${student.name} - Lessons - Admin Panel`} />

            {/* Header */}
            <div className="mb-8">
                <div className="mb-4 flex items-center gap-4">
                    <Link href={route('admin.students')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Students
                        </Button>
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Lessons for {student.name}</h1>
                <p className="mt-2 text-gray-600">View and manage lesson history for this student</p>
            </div>

            {/* Student Summary */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Student Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{student.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{student.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Age</p>
                            <p className="font-medium">{student.age} years</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Lessons Remaining</p>
                            <p className="font-medium">{student.lessons_remaining}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Lessons Completed</p>
                            <p className="font-medium text-green-600">{student.lessons_completed}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Lessons Pending</p>
                            <p className="font-medium text-yellow-600">{student.lessons_pending}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Subscription Status</p>
                            <Badge className={student.is_subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {student.is_subscribed ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Assigned Instructor</p>
                            {student.instructor ? (
                                <div>
                                    <p className="font-medium">{student.instructor.name}</p>
                                    <p className="text-sm text-gray-500">{student.instructor.email}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No instructor assigned</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                    <CardDescription>Filter lessons by month, status, and results per page</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Label htmlFor="month">Month</Label>
                            <Select value={month} onValueChange={setMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Months" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Months</SelectItem>
                                    {availableMonths.map((monthOption) => (
                                        <SelectItem key={monthOption.value} value={monthOption.value}>
                                            {monthOption.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="missed">Missed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="per_page">Results per page</Label>
                            <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={handleFilterChange} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={handleResetFilters}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lessons Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lessons ({lessons.total})</CardTitle>
                    <CardDescription>
                        Showing {lessons.from} to {lessons.to} of {lessons.total} lessons
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {lessons.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons found</h3>
                            <p className="mt-2 text-gray-600">
                                {month !== 'all' || status !== 'all'
                                    ? 'Try adjusting your filter criteria.'
                                    : 'No lessons have been scheduled for this student yet.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Scheduled Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Instructor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Completed At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Notes</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {lessons.data.map((lesson) => (
                                            <tr key={lesson.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{lesson.scheduled_date}</div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                {lesson.scheduled_time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{lesson.instructor_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={getStatusBadgeColor(lesson.status)}>{getStatusText(lesson.status)}</Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {lesson.completed_at
                                                            ? new Date(lesson.completed_at).toLocaleDateString('en-US', {
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs truncate text-sm text-gray-900" title={lesson.notes || ''}>
                                                        {lesson.notes || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Button variant="outline" size="sm" disabled>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {lessons.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {lessons.from} to {lessons.to} of {lessons.total} results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lessons.current_page > 1 && (
                                            <Link
                                                href={route('admin.students.lessons', { id: student.id })}
                                                data={{
                                                    ...Object.fromEntries(
                                                        Object.entries({
                                                            month: month !== 'all' ? month : undefined,
                                                            status: status !== 'all' ? status : undefined,
                                                            per_page: perPage,
                                                            page: lessons.current_page - 1,
                                                        }).filter(([_, value]) => value !== undefined),
                                                    ),
                                                }}
                                                preserveState
                                            >
                                                <Button variant="outline" size="sm">
                                                    Previous
                                                </Button>
                                            </Link>
                                        )}

                                        <span className="text-sm text-gray-700">
                                            Page {lessons.current_page} of {lessons.last_page}
                                        </span>

                                        {lessons.current_page < lessons.last_page && (
                                            <Link
                                                href={route('admin.students.lessons', { id: student.id })}
                                                data={{
                                                    ...Object.fromEntries(
                                                        Object.entries({
                                                            month: month !== 'all' ? month : undefined,
                                                            status: status !== 'all' ? status : undefined,
                                                            per_page: perPage,
                                                            page: lessons.current_page + 1,
                                                        }).filter(([_, value]) => value !== undefined),
                                                    ),
                                                }}
                                                preserveState
                                            >
                                                <Button variant="outline" size="sm">
                                                    Next
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminStudentLessons;
