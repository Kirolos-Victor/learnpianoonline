import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Shield,
    Edit,
    UserX,
    UserCheck,
    UserPlus,
    GraduationCap,
    BookOpen,
    CheckCircle,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface Instructor {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    students_count: number;
    lessons_count: number;
    completed_lessons: number;
    assigned_students: {
        id: string;
        user_name: string;
        sessions_remaining: number;
        is_subscribed: boolean;
    }[];
}

interface Props {
    instructors: Instructor[];
}

const AdminInstructors = ({ instructors }: Props) => {
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    const { data, setData, put, post, patch, processing, errors } = useForm({
        name: '',
        email: '',
    });

    const handleEditInstructor = (instructor: Instructor) => {
        setSelectedInstructor(instructor);
        setData({
            name: instructor.name,
            email: instructor.email,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateInstructor = () => {
        if (selectedInstructor) {
            put(`/admin/instructors/${selectedInstructor.id}`, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedInstructor(null);
                },
            });
        }
    };

    const handleInviteInstructor = () => {
        post('/admin/instructors/invite', {
            onSuccess: () => {
                setIsInviteDialogOpen(false);
                setData({ name: '', email: '' });
            },
        });
    };

    const handleRestrictAccess = (instructorId: string) => {
        if (confirm('Are you sure you want to deactivate this instructor?')) {
            patch(`/admin/instructors/${instructorId}/restrict`);
        }
    };

    const handleActivateInstructor = (instructorId: string) => {
        if (confirm('Are you sure you want to activate this instructor?')) {
            patch(`/admin/instructors/${instructorId}/activate`);
        }
    };

    const activeInstructors = instructors.filter(instructor => instructor.is_active);
    const inactiveInstructors = instructors.filter(instructor => !instructor.is_active);
    const totalStudents = instructors.reduce((sum, instructor) => sum + instructor.students_count, 0);
    const totalLessons = instructors.reduce((sum, instructor) => sum + instructor.lessons_count, 0);

    return (
        <AdminLayout title="Instructors Management">
            <Head title="Instructors Management" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Instructors Management</h1>
                        <p className="text-gray-600 mt-2">Manage instructors and their assigned students</p>
                    </div>
                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Invite Instructor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite Instructor</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to a new instructor.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Instructor name"
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="instructor@example.com"
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleInviteInstructor} disabled={processing}>
                                    {processing ? 'Inviting...' : 'Send Invitation'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{instructors.length}</div>
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
                        <p className="text-xs text-muted-foreground">
                            Currently active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            Assigned to instructors
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
                            Conducted by instructors
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Instructors List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Instructors</CardTitle>
                    <CardDescription>
                        Manage instructor access and view their performance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {instructors.map((instructor) => (
                            <div key={instructor.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Badge className="bg-blue-100 text-blue-800">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Instructor
                                        </Badge>
                                        <Badge className={instructor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {instructor.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{instructor.name}</p>
                                        <p className="text-sm text-gray-600">{instructor.email}</p>
                                        <div className="mt-1 flex items-center space-x-4">
                                            <p className="text-xs text-gray-500">
                                                Students: {instructor.students_count}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Lessons: {instructor.lessons_count}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Completed: {instructor.completed_lessons}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link href={`/admin/instructors/${instructor.id}/students`}>
                                        <Button variant="outline" size="sm">
                                            <Users className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditInstructor(instructor)}
                                    >
                                        <Edit className="h-4 w-4" />
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

            {/* Edit Instructor Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Instructor</DialogTitle>
                        <DialogDescription>
                            Update instructor information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateInstructor} disabled={processing}>
                            {processing ? 'Updating...' : 'Update Instructor'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminInstructors;
