import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TablePagination } from '@/components/ui/table-pagination';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';

interface Student {
    id: string;
    slug: string;
    name: string;
    sessions_remaining: number;
    sessions_completed: number;
    sessions_pending: number;
}

interface StudentSession {
    id: string;
    instructor_name: string;
    scheduled_date: string;
    scheduled_time: string;
    completed_at: string | null;
    status: string;
    notes: string | null;
}

interface PaginatedSessions {
    data: StudentSession[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
}

interface Props {
    student: Student;
    sessions: PaginatedSessions;
    availableMonths: string[];
    filters: {
        month: string;
        status: string;
        perPage: number;
    };
}

const StudentSessions = ({ student, sessions, availableMonths, filters }: Props) => {
    const form = useForm({
        month: filters.month,
        status: filters.status,
        perPage: filters.perPage,
    });

    const handleFilterChange = (field: string, value: string | number) => {
        router.get(
            route('admin.students.sessions', student.slug),
            {
                [field]: value,
                month: form.data.month,
                status: form.data.status,
                perPage: form.data.perPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleMonthChange = (month: string) => {
        handleFilterChange('month', month);
    };

    const handleStatusChange = (status: string) => {
        handleFilterChange('status', status);
    };

    const handlePerPageChange = (perPage: number) => {
        handleFilterChange('perPage', perPage);
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
        <AdminLayout title={`${student.name} - Sessions`}>
            <Head title={`${student.name} - Sessions - Admin Panel`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href={route('admin.students')}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                        })}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Students
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sessions for {student.name}</h1>
                    <p className="mt-2 text-gray-600">View and manage session history for this student</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Overview</CardTitle>
                            <CardDescription>Quick stats for {student.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Sessions Remaining</p>
                                    <p className="font-medium text-blue-600">{student.sessions_remaining}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Sessions Completed</p>
                                    <p className="font-medium text-green-600">{student.sessions_completed}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Sessions Pending</p>
                                    <p className="font-medium text-yellow-600">{student.sessions_pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Filter Sessions</CardTitle>
                        <CardDescription>Filter sessions by month, status, and results per page</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="month">Month</Label>
                                <Select value={form.data.month} onValueChange={handleMonthChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Available Months</SelectLabel>
                                            {availableMonths.map((month) => (
                                                <SelectItem key={month} value={month}>
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={form.data.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Session Status</SelectLabel>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                            <SelectItem value="missed">Missed</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="perPage">Results per page</Label>
                                <Select value={form.data.perPage.toString()} onValueChange={(value) => handlePerPageChange(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select per page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Per Page</SelectLabel>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectGroup>
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
                        <CardDescription>
                            Showing {sessions.from} to {sessions.to} of {sessions.total} sessions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sessions.data.length === 0 ? (
                            <div className="py-8 text-center">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions found</h3>
                                <p className="mt-2 text-gray-500">
                                    {form.data.month || (form.data.status && form.data.status !== 'all')
                                        ? 'Try adjusting your filters'
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
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Instructor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Completed At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {sessions.data.map((session) => (
                                            <tr key={session.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{session.scheduled_date}</div>
                                                    <div className="text-sm text-gray-500">{session.instructor_name}</div>
                                                </td>
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

                        {sessions.last_page > 1 && (
                            <div className="mt-6">
                                <TablePagination
                                    data={{
                                        current_page: sessions.current_page,
                                        last_page: sessions.last_page,
                                        per_page: form.data.perPage,
                                        total: sessions.total,
                                        from: sessions.from,
                                        to: sessions.to,
                                        links: [],
                                    }}
                                    onPageChange={(page: number) => {
                                        if (page === sessions.current_page) return;

                                        const url = new URL(window.location.href);
                                        url.searchParams.set('page', page.toString());

                                        form.get(url.toString(), {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }}
                                    onPerPageChange={handlePerPageChange}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default StudentSessions;
