import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TablePagination, { PaginationData } from '@/components/ui/table-pagination';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, Search, Shield, UserCheck, UserPlus, Users, UserX } from 'lucide-react';
import { useState } from 'react';

interface Instructor {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    availability: string[];
    created_at: string;
}

interface Props {
    instructors: {
        data: Instructor[];
    } & PaginationData;
    filters: {
        search?: string;
        status?: string;
    };
}

const AdminInstructors = ({ instructors, filters }: Props) => {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

    const { data, setData, post, patch, processing, errors } = useForm({
        email: '',
    });

    const {
        data: availabilityData,
        setData: setAvailabilityData,
        patch: patchAvailability,
        processing: availabilityProcessing,
    } = useForm({
        availability: [] as string[],
    });

    const { data: filterData, setData: setFilterData } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
    });

    const handleFilterChange = (key: 'search' | 'status', value: string) => {
        // Update the form data first
        setFilterData(key, value);

        // Build the new filter state
        const newFilters = {
            search: key === 'search' ? value : filterData.search,
            status: key === 'status' ? value : filterData.status,
        };

        // Build URL parameters
        const params = new URLSearchParams();
        if (newFilters.search) {
            params.set('search', newFilters.search);
        }
        if (newFilters.status && newFilters.status !== 'all') {
            params.set('status', newFilters.status);
        }

        // Navigate with new parameters
        router.get('/admin/instructors', params.toString() ? Object.fromEntries(params) : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams();
        if (filterData.search) params.set('search', filterData.search);
        if (filterData.status && filterData.status !== 'all') params.set('status', filterData.status);
        params.set('page', page.toString());

        router.get('/admin/instructors', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePerPageChange = (perPage: number) => {
        const params = new URLSearchParams();
        if (filterData.search) params.set('search', filterData.search);
        if (filterData.status && filterData.status !== 'all') params.set('status', filterData.status);
        params.set('per_page', perPage.toString());

        router.get('/admin/instructors', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAddInstructor = () => {
        post('/admin/instructors/add', {
            preserveScroll: true,
            onSuccess: () => {
                setIsInviteDialogOpen(false);
                setData({ email: '' });
            },
        });
    };

    const handleRestrictAccess = (instructorId: string) => {
        if (confirm('Are you sure you want to deactivate this instructor?')) {
            console.log('Deactivating instructor:', instructorId);
            patch(`/admin/instructors/${instructorId}/restrict`, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Instructor deactivated successfully');
                    // Force a page refresh to get updated data
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error deactivating instructor:', errors);
                },
            });
        }
    };

    const handleActivateInstructor = (instructorId: string) => {
        if (confirm('Are you sure you want to activate this instructor?')) {
            console.log('Activating instructor:', instructorId);
            patch(`/admin/instructors/${instructorId}/activate`, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Instructor activated successfully');
                    // Force a page refresh to get updated data
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error activating instructor:', errors);
                },
            });
        }
    };

    const handleEditAvailability = (instructor: Instructor) => {
        setSelectedInstructor(instructor);
        setAvailabilityData('availability', instructor.availability || []);
        setIsAvailabilityDialogOpen(true);
    };

    const handleUpdateAvailability = () => {
        if (!selectedInstructor) return;

        patchAvailability(`/admin/instructors/${selectedInstructor.id}/availability`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAvailabilityDialogOpen(false);
                setSelectedInstructor(null);
                setAvailabilityData('availability', []);
                // Force a page refresh to get updated data
                window.location.reload();
            },
        });
    };

    const handleDayToggle = (day: string) => {
        const currentDays = availabilityData.availability;
        const updatedDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day];
        setAvailabilityData('availability', updatedDays);
    };

    const activeInstructors = instructors.data.filter((instructor) => instructor.is_active);
    const inactiveInstructors = instructors.data.filter((instructor) => !instructor.is_active);

    return (
        <AdminLayout title="Instructors Management">
            <Head title="Instructors Management" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Instructors Management</h1>
                        <p className="mt-2 text-gray-600">Manage instructors and their assigned students</p>
                    </div>
                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Instructor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Instructor</DialogTitle>
                                <DialogDescription>Add an existing parent as an instructor by entering their email address.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Parent Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="parent@example.com"
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddInstructor} disabled={processing}>
                                    {processing ? 'Adding...' : 'Add Instructor'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{instructors.data.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeInstructors.length} active, {inactiveInstructors.length} inactive
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeInstructors.length}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Instructors</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveInstructors.length}</div>
                        <p className="text-xs text-muted-foreground">Currently inactive</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Filter instructors by name, email, or status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or email..."
                                    value={filterData.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <Label htmlFor="status">Status</Label>
                            <Select value={filterData.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Instructors List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Instructors</CardTitle>
                    <CardDescription>Manage instructor access and view their performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {instructors.data.map((instructor) => (
                            <div key={instructor.id} className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Badge className="bg-blue-100 text-blue-800">
                                            <Shield className="mr-1 h-3 w-3" />
                                            Instructor
                                        </Badge>
                                        <Badge className={instructor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {instructor.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{instructor.name}</p>
                                        <p className="text-sm text-gray-600">{instructor.email}</p>
                                        <p className="text-xs text-gray-500">Joined: {new Date(instructor.created_at).toLocaleDateString()}</p>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {instructor.availability && instructor.availability.length > 0 ? (
                                                instructor.availability.map((day) => (
                                                    <Badge key={day} variant="secondary" className="text-xs capitalize">
                                                        {day.substring(0, 3)}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="outline" className="text-xs">
                                                    No availability set
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link href={`/admin/instructors/${instructor.id}/students`} className="cursor-pointer">
                                        <Button variant="outline" size="sm">
                                            <Users className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditAvailability(instructor)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                    {instructor.is_active ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRestrictAccess(instructor.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <UserX className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleActivateInstructor(instructor.id)}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            <UserCheck className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="mt-6">
                <TablePagination data={instructors} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
            </div>

            {/* Availability Dialog */}
            <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Instructor Availability</DialogTitle>
                        <DialogDescription>Select the days when {selectedInstructor?.name} is available to conduct lessons.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                                <div key={day} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={day}
                                        checked={availabilityData.availability.includes(day)}
                                        onCheckedChange={() => handleDayToggle(day)}
                                    />
                                    <Label htmlFor={day} className="cursor-pointer capitalize">
                                        {day}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAvailabilityDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateAvailability} disabled={availabilityProcessing}>
                            {availabilityProcessing ? 'Updating...' : 'Update Availability'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminInstructors;
