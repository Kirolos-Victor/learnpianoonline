import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { useState } from 'react';

interface StudentSession {
    id: string;
    instructor_name: string;
    scheduled_date: string;
    scheduled_time: string;
    completed_at: string | null;
    status: string;
    notes: string | null;
}

interface Student {
    id: string;
    slug: string;
    name: string;
    email: string;
    age: number;
    is_subscribed: boolean;
    sessions_remaining: number;
    sessions_completed: number;
    sessions_pending: number;
    day_of_week: string | null;
    preferred_time: string | null;
    student_timezone: string;
    converted_timezone: string;
}

interface Props {
    student: Student;
    sessions: {
        data: StudentSession[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const InstructorStudentSessions = ({ student, sessions }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Handle search and filter changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        router.get(
            route('instructor.student.sessions', student.slug),
            { search: value, status: statusFilter },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            route('instructor.student.sessions', student.slug),
            { search: searchTerm, status: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('instructor.student.sessions', student.slug),
            {
                search: searchTerm,
                status: statusFilter,
                page: page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            route('instructor.student.sessions', student.slug),
            {
                search: searchTerm,
                status: statusFilter,
                perPage: perPage,
                page: 1, // Reset to first page when changing per page
            },
            { preserveState: true, preserveScroll: true },
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

    // Use the paginated sessions directly - filtering will be done server-side
    const sessionsList = sessions.data;

    return (
        <InstructorLayout title={`Sessions for ${student.name}`}>
            <Head title={`Sessions for ${student.name} - Instructor Panel`} />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Sessions for {student.name}</h1>
                <p className="mt-2 text-gray-600">View and manage session history for this student</p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                    <CardDescription>Find sessions by instructor or notes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search by instructor or notes</Label>
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Enter instructor name or notes..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-48">
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
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
                        <div className="w-32">
                            <Label htmlFor="per-page">Per Page</Label>
                            <Select value={sessions.per_page.toString()} onValueChange={(value) => handlePerPageChange(parseInt(value))}>
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
                    </div>
                </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Sessions ({sessions.total})</CardTitle>
                    <CardDescription>All sessions for this student</CardDescription>
                </CardHeader>
                <CardContent>
                    {sessions.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions found</h3>
                            <p className="mt-2 text-gray-600">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No sessions have been scheduled for this student yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Instructor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Completed At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {sessionsList.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{session.scheduled_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{session.scheduled_time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{session.instructor_name}</td>
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
                                                <div className="max-w-xs truncate text-sm text-gray-900" title={session.notes || ''}>
                                                    {session.notes || '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {sessions.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {(sessions.current_page - 1) * sessions.per_page + 1} to{' '}
                                {Math.min(sessions.current_page * sessions.per_page, sessions.total)} of {sessions.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* First Page */}
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={sessions.current_page === 1}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>

                                {/* Previous Page */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(sessions.current_page - 1)}
                                    disabled={sessions.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, sessions.last_page) }, (_, i) => {
                                        let pageNum;
                                        if (sessions.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (sessions.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (sessions.current_page >= sessions.last_page - 2) {
                                            pageNum = sessions.last_page - 4 + i;
                                        } else {
                                            pageNum = sessions.current_page - 2 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={sessions.current_page === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handlePageChange(pageNum)}
                                                className="h-8 w-8 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>

                                {/* Next Page */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(sessions.current_page + 1)}
                                    disabled={sessions.current_page === sessions.last_page}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>

                                {/* Last Page */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(sessions.last_page)}
                                    disabled={sessions.current_page === sessions.last_page}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="mt-8">
                <Link href={route('instructor.students')}>
                    <Button variant="outline">Back to Students</Button>
                </Link>
            </div>
        </InstructorLayout>
    );
};

export default InstructorStudentSessions;
