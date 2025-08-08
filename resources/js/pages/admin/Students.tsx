import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TablePagination } from '@/components/ui/table-pagination';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, Edit, GraduationCap, Search, UserCheck, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Student {
    id: string;
    slug: string;
    user_id: string;
    name: string;
    email: string;
    sessions_remaining: number;
    is_subscribed: boolean;
    subscription_expires_at: string | null;
    instructor_id: string | null;
    instructor_name: string | null;
    preferred_time: string | null;
    day_of_week: string;
    user_timezone: string;
    timezone_conversion?: {
        student_original: {
            day: string;
            time: string;
            timezone: string;
        };
        instructor_converted: {
            day: string;
            time: string;
            timezone: string;
            full_datetime: string;
        };
    };
    created_at: string;
}

interface InstructorOption {
    id: string;
    name: string;
    availability?: string[];
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
    stats: Stats;
    filters: Filters;
}

const AdminStudents = ({ students, stats, filters }: Props) => {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [subscriptionFilter, setSubscriptionFilter] = useState(filters?.subscription || 'all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<{ sessions: string; instructor_id: string }>({ sessions: '', instructor_id: '' });
    const [processing, setProcessing] = useState(false);
    const [availableInstructors, setAvailableInstructors] = useState<InstructorOption[]>([]);
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [timezoneInfo, setTimezoneInfo] = useState<{
        convertedTime?: string;
        instructorTimezoneDay?: string;
        studentPreferredConverted?: {
            day: string;
            time: string;
            full_datetime: string;
        };
        originalStudentTime?: {
            day: string;
            time: string;
            timezone: string;
        };
        instructorTimezone?: string;
    }>({});

    const applyFilters = useCallback(() => {
        router.get(
            route('admin.students'),
            {
                search: searchTerm,
                subscription: subscriptionFilter,
                per_page: filters?.per_page || 10,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [searchTerm, subscriptionFilter, filters?.per_page]);

    // Debounced search effect
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== (filters?.search || '')) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm, filters?.search, applyFilters]);

    const handleSubscriptionFilterChange = (value: string) => {
        setSubscriptionFilter(value);
        router.get(
            route('admin.students'),
            {
                search: searchTerm,
                subscription: value,
                per_page: filters?.per_page || 10,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleOpenEditDialog = async (student: Student) => {
        setSelectedStudent(student);
        setEditData({
            sessions: student.sessions_remaining.toString(),
            instructor_id: student.instructor_id?.toString() || 'none',
        });
        setIsEditDialogOpen(true);
        setLoadingInstructors(true);

        // Fetch available instructors for this student
        try {
            const response = await axios.post(`/admin/students/${student.slug}/available-instructors`);

            setAvailableInstructors(response.data.instructors || []);
            setTimezoneInfo({
                convertedTime: response.data.converted_time,
                instructorTimezoneDay: response.data.instructor_timezone_day,
                studentPreferredConverted: response.data.student_preferred_converted,
                originalStudentTime: response.data.original_student_time,
                instructorTimezone: response.data.instructor_timezone,
            });
        } catch (error) {
            console.error('Error fetching available instructors:', error);
            setAvailableInstructors([]);
        } finally {
            setLoadingInstructors(false);
        }
    };

    const handleEditChange = (field: 'sessions' | 'instructor_id', value: string) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = () => {
        if (!selectedStudent) return;
        setProcessing(true);
        router.patch(
            route('admin.students.update-sessions', { slug: selectedStudent.slug }),
            {
                sessions: Number(editData.sessions),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const newInstructorId = editData.instructor_id === 'none' ? null : editData.instructor_id;
                    if (newInstructorId !== selectedStudent.instructor_id?.toString()) {
                        router.patch(
                            route('admin.students.change-instructor', { slug: selectedStudent.slug }),
                            {
                                instructor_id: newInstructorId,
                            },
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsEditDialogOpen(false);
                                    setSelectedStudent(null);
                                    setProcessing(false);
                                },
                                onError: () => setProcessing(false),
                            },
                        );
                    } else {
                        setIsEditDialogOpen(false);
                        setSelectedStudent(null);
                        setProcessing(false);
                    }
                },
                onError: () => setProcessing(false),
            },
        );
    };

    return (
        <AdminLayout title="Students Management">
            <Head title="Students Management" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
                <p className="mt-2 text-gray-600">Manage student sessions, subscriptions, and instructor assignments</p>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
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
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search by name or email</Label>
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
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
                    <CardTitle>All Students ({students?.total || 0})</CardTitle>
                    <CardDescription>Manage student sessions, subscriptions, and instructor assignments</CardDescription>
                </CardHeader>
                <CardContent>
                    {!students?.data || students.data.length === 0 ? (
                        <div className="py-8 text-center">
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
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Schedule & Timezone</th>
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
                                                        <div className="text-xs text-gray-500">Joined {student.created_at}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className="text-gray-700">{student.email}</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <Badge
                                                            className={
                                                                student.is_subscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                            }
                                                        >
                                                            {student.is_subscribed ? 'Subscribed' : 'Not Subscribed'}
                                                        </Badge>
                                                        {student.is_subscribed && student.subscription_expires_at && (
                                                            <div className="flex items-center text-xs text-gray-600">
                                                                <Calendar className="mr-1 h-3 w-3" />
                                                                Expires {student.subscription_expires_at}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        <span className="font-medium">{student.sessions_remaining}</span> sessions remaining
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {student.timezone_conversion ? (
                                                        <div className="space-y-1">
                                                            {/* Student's Original Time */}
                                                            <div className="flex items-center text-xs">
                                                                <Calendar className="mr-1 h-3 w-3 text-blue-500" />
                                                                <span className="text-blue-700">
                                                                    📍 {student.timezone_conversion.student_original.day} at{' '}
                                                                    {student.timezone_conversion.student_original.time}
                                                                </span>
                                                            </div>

                                                            {/* Converted Instructor Time */}
                                                            <div className="flex items-center text-xs">
                                                                <Calendar className="mr-1 h-3 w-3 text-green-500" />
                                                                <span className="text-green-700">
                                                                    🌍 {student.timezone_conversion.instructor_converted.full_datetime}
                                                                </span>
                                                            </div>

                                                            {/* Timezone Indicator */}
                                                            <div className="text-xs text-gray-500">
                                                                ↻ {student.user_timezone} →{' '}
                                                                {student.timezone_conversion.instructor_converted.timezone}
                                                            </div>
                                                        </div>
                                                    ) : student.preferred_time ? (
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                                            <span>{student.preferred_time}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not set</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {student.instructor_name || <span className="text-gray-400">None assigned</span>}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => handleOpenEditDialog(student)}>
                                                            <Edit className="h-4 w-4" /> Edit
                                                        </Button>
                                                        <Link href={route('admin.students.sessions', { slug: student.slug })}>
                                                            <Button size="sm" variant="outline">
                                                                <Calendar className="h-4 w-4" /> View Sessions
                                                            </Button>
                                                        </Link>
                                                    </div>
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
                                    onPageChange={(page) =>
                                        router.get(
                                            route('admin.students'),
                                            {
                                                search: searchTerm,
                                                subscription: subscriptionFilter,
                                                per_page: filters?.per_page || 10,
                                                page,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            },
                                        )
                                    }
                                    onPerPageChange={(perPage) =>
                                        router.get(
                                            route('admin.students'),
                                            {
                                                search: searchTerm,
                                                subscription: subscriptionFilter,
                                                per_page: perPage,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                                replace: true,
                                            },
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Student Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedStudent(null);
                        setEditData({ sessions: '', instructor_id: '' });
                    }
                    setIsEditDialogOpen(open);
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Student</DialogTitle>
                        <DialogDescription>Set the exact number of sessions and assign an instructor.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-sessions">Number of Sessions (Exact Value)</Label>
                            <Input
                                id="edit-sessions"
                                type="number"
                                min="0"
                                value={editData.sessions}
                                onChange={(e) => handleEditChange('sessions', e.target.value)}
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
                                    {loadingInstructors ? (
                                        <div className="p-2 text-center text-gray-500">Loading available instructors...</div>
                                    ) : (
                                        <>
                                            <SelectItem value="none">No instructor</SelectItem>
                                            {availableInstructors.length > 0 ? (
                                                <>
                                                    {availableInstructors.map((inst) => (
                                                        <SelectItem key={inst.id} value={inst.id.toString()}>
                                                            {inst.name}
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="p-2 text-center text-gray-500">
                                                    No instructors available for this student's preferred time
                                                </div>
                                            )}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Schedule Information */}
                        {selectedStudent && (
                            <div className="rounded-md bg-blue-50 p-3">
                                <h4 className="mb-2 font-medium text-blue-900">Schedule Information:</h4>

                                {/* Converted to Preferred Timezone */}
                                {timezoneInfo.studentPreferredConverted ? (
                                    <div className="mb-2 rounded bg-green-100 p-2">
                                        <p className="text-sm text-green-800">
                                            <strong>Converted to Preferred Timezone:</strong> {timezoneInfo.studentPreferredConverted.full_datetime}
                                        </p>
                                        <p className="text-xs text-green-600">🌍 Preferred Timezone: {timezoneInfo.instructorTimezone}</p>
                                        <p className="text-xs text-green-600">
                                            ↻ Converted from {selectedStudent.user_timezone} to {timezoneInfo.instructorTimezone}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mb-2 rounded bg-blue-100 p-2">
                                        <p className="text-sm text-blue-800">
                                            <strong>Student's Time:</strong> {selectedStudent.day_of_week} at{' '}
                                            {selectedStudent.preferred_time || 'No time set'}
                                        </p>
                                        <p className="text-xs text-blue-600">📍 Student Timezone: {selectedStudent.user_timezone}</p>
                                    </div>
                                )}

                                {availableInstructors.length === 0 && !loadingInstructors && (
                                    <div className="rounded-md bg-yellow-50 p-3">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Note:</strong> No instructors are available for this student's preferred time slot.
                                        </p>
                                        <ul className="mt-1 list-inside list-disc text-xs text-yellow-700">
                                            <li>
                                                No instructors work on {timezoneInfo.studentPreferredConverted?.day || selectedStudent.day_of_week}
                                            </li>
                                            <li>
                                                All instructors have conflicts at{' '}
                                                {timezoneInfo.studentPreferredConverted?.time || selectedStudent.preferred_time}
                                            </li>
                                            <li>Student has no preferred time set</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit} disabled={processing || loadingInstructors}>
                            {processing ? 'Updating...' : loadingInstructors ? 'Loading...' : 'Update Student'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminStudents;
