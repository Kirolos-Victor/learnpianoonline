import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { GraduationCap, UserCheck, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Student {
    id: string;
    user_id: string;
    name: string;
    email: string;
    is_active: boolean;
    sessions_remaining: number;
    is_subscribed: boolean;
    instructor_id: string | null;
    instructor_name: string | null;
}

interface InstructorOption {
    id: string;
    name: string;
}

interface Props {
    students: Student[];
    instructors: InstructorOption[];
}

const AdminStudents = ({ students, instructors }: Props) => {
    const [sessionsToSet, setSessionsToSet] = useState<{ [studentId: string]: string }>({});
    const [instructorToAssign, setInstructorToAssign] = useState<{ [studentId: string]: string }>({});
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<{ sessions: string; instructor_id: string }>({ sessions: '', instructor_id: '' });
    const [processing, setProcessing] = useState(false);

    const handleSetSessions = (studentId: string) => {
        if (!sessionsToSet[studentId] || isNaN(Number(sessionsToSet[studentId])) || Number(sessionsToSet[studentId]) < 0) return;
        router.patch(`/admin/students/${studentId}/sessions`, {
            sessions: Number(sessionsToSet[studentId]),
        }, {
            onSuccess: () => setSessionsToSet((prev) => ({ ...prev, [studentId]: '' })),
        });
    };

    const handleChangeInstructor = (studentId: string) => {
        if (!instructorToAssign[studentId]) return;
        router.patch(`/admin/students/${studentId}/instructor`, {
            instructor_id: instructorToAssign[studentId],
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
                <p className="text-gray-600 mt-2">Manage student sessions and instructor assignments</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>
                        Set sessions and assign instructors for each student
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">{student.name}</span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <span className="text-gray-700">{student.email}</span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <Badge className={student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                {student.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {student.sessions_remaining}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {student.instructor_name || <span className="text-gray-400">None</span>}
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
                            <select
                                id="edit-instructor"
                                className="border rounded px-2 py-1 w-full"
                                value={editData.instructor_id}
                                onChange={e => handleEditChange('instructor_id', e.target.value)}
                            >
                                <option value="">Select an instructor</option>
                                {instructors.map(inst => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                            </select>
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
