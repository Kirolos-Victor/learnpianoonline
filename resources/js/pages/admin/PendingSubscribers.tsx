import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TablePagination } from '@/components/ui/table-pagination';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, Search, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
    id: string;
    slug: string;
    user_id: string;
    name: string;
    email: string;
    sessions_remaining: number;
    subscription_expires_at: string | null;
    created_at: string;
    day_of_week: string;
    preferred_time: string | null;
    user_timezone: string;
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

interface Filters {
    search: string;
    per_page: number;
}

interface Props {
    students: PaginationData;
    instructors: InstructorOption[];
    filters: Filters;
}

const PendingSubscribers = ({ students, instructors, filters }: Props) => {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');
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
        router.get(
            '/admin/pending-subscribers',
            {
                search: searchTerm,
                per_page: filters.per_page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleOpenAssignDialog = async (student: Student) => {
        setSelectedStudent(student);
        setSelectedInstructorId('');
        setIsAssignDialogOpen(true);
        setLoadingInstructors(true);

        try {
            const response = await fetch('/admin/pending-subscribers/available-instructors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    student_slug: student.slug,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAvailableInstructors(data.instructors || []);
                setTimezoneInfo({
                    convertedTime: data.converted_time,
                    instructorTimezoneDay: data.instructor_timezone_day,
                    studentPreferredConverted: data.student_preferred_converted,
                    originalStudentTime: data.original_student_time,
                    instructorTimezone: data.instructor_timezone,
                });
            } else {
                console.error('Failed to fetch available instructors');
                setAvailableInstructors([]);
            }
        } catch (error) {
            console.error('Error fetching available instructors:', error);
            setAvailableInstructors([]);
        } finally {
            setLoadingInstructors(false);
        }
    };

    const handleAssignInstructor = () => {
        if (!selectedStudent || !selectedInstructorId) return;

        setProcessing(true);
        router.patch(
            route('admin.pending-subscribers.assign-instructor', { slug: selectedStudent.slug }),
            {
                instructor_id: selectedInstructorId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAssignDialogOpen(false);
                    setSelectedStudent(null);
                    setSelectedInstructorId('');
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <AdminLayout title="Pending Subscribers">
            <Head title="Pending Subscribers" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Pending Subscribers</h1>
                <p className="mt-2 text-gray-600">Subscribed students waiting for instructor assignment</p>
            </div>

            {/* Search Filter */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Search Students</CardTitle>
                    <CardDescription>Find specific pending subscribers</CardDescription>
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
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Subscribers ({students.total})</CardTitle>
                    <CardDescription>Subscribed students who need instructor assignment</CardDescription>
                </CardHeader>
                <CardContent>
                    {students.data.length === 0 ? (
                        <div className="py-8 text-center">
                            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending subscribers</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm
                                    ? 'No students match your search criteria.'
                                    : 'All subscribed students have been assigned to instructors.'}
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
                                                    <div>
                                                        <span className="text-gray-700">{student.email}</span>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            <div className="flex items-center">
                                                                <Calendar className="mr-1 h-3 w-3" />
                                                                {student.day_of_week} at {student.preferred_time || 'No time set'}
                                                            </div>
                                                            <div className="text-xs text-gray-400">Timezone: {student.user_timezone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <Badge className="bg-green-100 text-green-800">Subscribed</Badge>
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            Expires {student.subscription_expires_at || 'Unknown'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className="font-medium">{student.sessions_remaining}</span>
                                                    <span className="ml-1 text-xs text-gray-500">remaining</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleOpenAssignDialog(student)}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        Assign Instructor
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
                                    onPageChange={(page) =>
                                        router.get(
                                            `/admin/pending-subscribers?page=${page}`,
                                            {
                                                search: searchTerm,
                                                per_page: filters.per_page,
                                            },
                                            { preserveState: true, replace: true },
                                        )
                                    }
                                    onPerPageChange={(perPage) =>
                                        router.get(
                                            '/admin/pending-subscribers',
                                            {
                                                search: searchTerm,
                                                per_page: perPage,
                                            },
                                            { preserveState: true, replace: true },
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Assign Instructor Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Assign Instructor</DialogTitle>
                        <DialogDescription>
                            Select an instructor for {selectedStudent?.name}. Once assigned, this student will be moved to the main students list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="instructor-select">Select Instructor</Label>
                            <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an instructor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingInstructors ? (
                                        <div className="p-2 text-center text-gray-500">Loading available instructors...</div>
                                    ) : availableInstructors.length > 0 ? (
                                        <>
                                            {availableInstructors.map((instructor) => (
                                                <SelectItem key={instructor.id} value={instructor.id}>
                                                    {instructor.name}
                                                </SelectItem>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-2 text-center text-gray-500">
                                            No instructors available for this student's preferred time slot
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedStudent && (
                            <div className="space-y-3">
                                <div className="rounded-md bg-gray-50 p-3">
                                    <h4 className="mb-2 font-medium text-gray-900">Student Details:</h4>
                                    <p className="text-sm text-gray-600">
                                        <strong>Name:</strong> {selectedStudent.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Email:</strong> {selectedStudent.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Sessions Remaining:</strong> {selectedStudent.sessions_remaining}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Subscription:</strong> Expires {selectedStudent.subscription_expires_at || 'Unknown'}
                                    </p>
                                </div>

                                <div className="rounded-md bg-blue-50 p-3">
                                    <h4 className="mb-2 font-medium text-blue-900">Schedule Information:</h4>

                                    {/* Original Student Time */}
                                    <div className="mb-3 rounded bg-blue-100 p-2">
                                        <p className="text-sm text-blue-800">
                                            <strong>Student's Original:</strong> {selectedStudent.day_of_week} at{' '}
                                            {selectedStudent.preferred_time || 'No time set'}
                                        </p>
                                        <p className="text-xs text-blue-600">📍 Student Timezone: {selectedStudent.user_timezone}</p>
                                    </div>

                                    {/* Converted Instructor Time */}
                                    {timezoneInfo.studentPreferredConverted ? (
                                        <div className="mb-2 rounded bg-green-100 p-2">
                                            <p className="text-sm text-green-800">
                                                <strong>Converted to Instructor Time:</strong> {timezoneInfo.studentPreferredConverted.full_datetime}
                                            </p>
                                            <p className="text-xs text-green-600">🌍 Instructor Timezone: {timezoneInfo.instructorTimezone}</p>
                                            <p className="text-xs text-green-600">
                                                ↻ Converted from {selectedStudent.user_timezone} to {timezoneInfo.instructorTimezone}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>

                                {availableInstructors.length === 0 && !loadingInstructors && (
                                    <div className="rounded-md bg-yellow-50 p-3">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Note:</strong> No instructors are available for this student's preferred time slot. This could be
                                            because:
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
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignInstructor}
                            disabled={processing || !selectedInstructorId || loadingInstructors}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Assigning...' : loadingInstructors ? 'Loading...' : 'Assign Instructor'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default PendingSubscribers;
