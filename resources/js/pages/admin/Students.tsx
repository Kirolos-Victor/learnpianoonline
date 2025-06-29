import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { GraduationCap, UserCheck, Edit, Search, Users, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TablePagination } from '@/components/ui/table-pagination';

interface Student {
    id: string;
    user_id: string;
    name: string;
    email: string;
    sessions_remaining: number;
    is_subscribed: boolean;
    subscription_months: number;
    subscription_expires_at: string | null;
    instructor_id: string | null;
    instructor_name: string | null;
    created_at: string;
}

interface InstructorOption {
    id: string;
    name: string;
}

interface PaginationData {
    current_page: number;
    data: Student[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Stats {
    total: number;
    subscribed: number;
    unsubscribed: number;
}

interface Filters {
    search: string;
    subscription: string;
    per_page: number;
}

interface Props {
    students: PaginationData;
    instructors: InstructorOption[];
    stats: Stats;
    filters: Filters;
}

const AdminStudents = ({ students, instructors, stats, filters }: Props) => {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [subscriptionFilter, setSubscriptionFilter] = useState(filters.subscription);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<{ sessions: string; instructor_id: string }>({ sessions: '', instructor_id: '' });
    const [processing, setProcessing] = useState(false);

    // Debounced search effect
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== filters.search) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const applyFilters = () => {
        router.get('/admin/students', {
            search: searchTerm,
            subscription: subscriptionFilter,
            per_page: filters.per_page,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSubscriptionFilterChange = (value: string) => {
        setSubscriptionFilter(value);
        router.get('/admin/students', {
            search: searchTerm,
            subscription: value,
            per_page: filters.per_page,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleOpenEditDialog = (student: Student) => {
        setSelectedStudent(student);
        setEditData({
            sessions: student.sessions_remaining.toString(),
            instructor_id: student.instructor_id || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleEditChange = (field: 'sessions' | 'instructor_id', value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = () => {
        if (!selectedStudent) return;
        setProcessing(true);
        router.patch(`/admin/students/${selectedStudent.id}/sessions`, {
            sessions: Number(editData.sessions),
        }, {
            onSuccess: () => {
                router.patch(`/admin/students/${selectedStudent.id}/instructor`, {
                    instructor_id: editData.instructor_id,
                }, {
                    onSuccess: () => {
                        setIsEditDialogOpen(false);
                        setSelectedStudent(null);
                        setProcessing(false);
                    },
                    onFinish: () => setProcessing(false),
                });
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Students Management">
            <Head title="Students Management" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
                <p className="text-gray-600 mt-2">Manage student sessions, subscriptions, and instructor assignments</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All registered students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribed Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.subscribed}</div>
                        <p className="text-xs text-muted-foreground">Active subscriptions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unsubscribed Students</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.unsubscribed}</div>
                        <p className="text-xs text-muted-foreground">Without active subscription</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Search and filter students</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Label htmlFor="search">Search by name or email</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Enter student name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-64">
                            <Label htmlFor="subscription-filter">Subscription Status</Label>
                            <Select value={subscriptionFilter} onValueChange={handleSubscriptionFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Students" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Students</SelectItem>
                                    <SelectItem value="subscribed">Subscribed Only</SelectItem>
                                    <SelectItem value="unsubscribed">Unsubscribed Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Students ({students.total})</CardTitle>
                    <CardDescription>
                        Manage student sessions, subscriptions, and instructor assignments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {students.data.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm || subscriptionFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No students have been registered yet.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {students.data.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div>
                                                        <span className="font-medium text-gray-900">{student.name}</span>
                                                        <div className="text-xs text-gray-500">
                                                            Joined {student.created_at}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className="text-gray-700">{student.email}</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <Badge className={student.is_subscribed
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'}>
                                                            {student.is_subscribed ? 'Subscribed' : 'Not Subscribed'}
                                                        </Badge>
                                                        {student.is_subscribed && (
                                                            <div className="text-xs text-gray-600 flex items-center">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {student.subscription_months} months
                                                                {student.subscription_expires_at && (
                                                                    <span className="text-gray-500 ml-1">
                                                                        (until {student.subscription_expires_at})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className="font-medium">{student.sessions_remaining}</span>
                                                    <span className="text-xs text-gray-500 ml-1">remaining</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {student.instructor_name || <span className="text-gray-400">None assigned</span>}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <Button size="sm" variant="outline" onClick={() => handleOpenEditDialog(student)}>
                                                        <Edit className="h-4 w-4" /> Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6">
                                <TablePagination
                                    data={students}
                                    onPageChange={(page) => router.get(`/admin/students?page=${page}`, {
                                        search: searchTerm,
                                        subscription: subscriptionFilter,
                                        per_page: filters.per_page,
                                    }, { preserveState: true, replace: true })}
                                    onPerPageChange={(perPage) => router.get('/admin/students', {
                                        search: searchTerm,
                                        subscription: subscriptionFilter,
                                        per_page: perPage,
                                    }, { preserveState: true, replace: true })}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Student Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Student</DialogTitle>
                        <DialogDescription>
                            Set the exact number of sessions and assign an instructor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-sessions">Number of Sessions (Exact Value)</Label>
                            <Input
                                id="edit-sessions"
                                type="number"
                                min="0"
                                value={editData.sessions}
                                onChange={e => handleEditChange('sessions', e.target.value)}
                                placeholder="Enter exact number of sessions"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-instructor">Assigned Instructor</Label>
                            <Select value={editData.instructor_id} onValueChange={(value) => handleEditChange('instructor_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an instructor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">No instructor</SelectItem>
                                    {instructors.map(inst => (
                                        <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit} disabled={processing}>
                            {processing ? 'Updating...' : 'Update Student'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminStudents;
