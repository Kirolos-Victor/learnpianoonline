import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Crown, Edit, Music, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
    age: number;
    hasPiano: boolean;
    isSubscribed: boolean;
    subscriptionType?: 'monthly' | 'yearly';
    subscriptionEndDate?: string;
    sessionsRemaining: number;
    instructor?: {
        id: string;
        name: string;
    };
    createdAt: string;
}

interface StudentSharedData extends SharedData {
    students: Student[];
}

const Student = () => {
    const { students } = usePage<StudentSharedData>().props;
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [editingStudent, setEditingStudent] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        hasPiano: false,
    });

    const handleAddStudent = () => {
        if (students.length >= 10) {
            alert('You can only add up to 10 students.');
            return;
        }

        if (!formData.name.trim() || !formData.age) {
            alert('Please fill in all required fields.');
            return;
        }

        const age = parseInt(formData.age);
        if (age < 5 || age > 100) {
            alert('Please enter a valid age between 5 and 100.');
            return;
        }

        router.post(
            '/student',
            {
                name: formData.name.trim(),
                age: age,
                hasPiano: formData.hasPiano,
            },
            {
                onSuccess: () => {
                    setFormData({ name: '', age: '', hasPiano: false });
                    setIsAddingStudent(false);
                },
            },
        );
    };

    const handleEditStudent = (studentId: string) => {
        const student = students.find((s) => s.id === studentId);
        if (student) {
            setFormData({
                name: student.name,
                age: student.age.toString(),
                hasPiano: student.hasPiano,
            });
            setEditingStudent(studentId);
            setIsAddingStudent(true);
        }
    };

    const handleUpdateStudent = () => {
        if (!editingStudent) return;

        if (!formData.name.trim() || !formData.age) {
            alert('Please fill in all required fields.');
            return;
        }

        const age = parseInt(formData.age);
        if (age < 5 || age > 100) {
            alert('Please enter a valid age between 5 and 100.');
            return;
        }

        router.put(
            `/student/${editingStudent}`,
            {
                name: formData.name.trim(),
                age: age,
                hasPiano: formData.hasPiano,
            },
            {
                onSuccess: () => {
                    setFormData({ name: '', age: '', hasPiano: false });
                    setEditingStudent(null);
                    setIsAddingStudent(false);
                },
            },
        );
    };

    const handleDeleteStudent = (studentId: string) => {
        if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            router.delete(`/student/${studentId}`);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', age: '', hasPiano: false });
        setEditingStudent(null);
        setIsAddingStudent(false);
    };

    const handleSubscribeStudent = (studentId: string) => {
        // Redirect to subscription page for this student
        router.visit(`/subscription?studentId=${studentId}`);
    };

    const getAgeGroup = (age: number) => {
        if (age < 6) return 'Kindergarten';
        if (age < 12) return 'Elementary';
        if (age < 18) return 'Teen';
        return 'Adult';
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <Head title="Student Management" />

                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <h1 className="font-playfair mb-2 text-3xl font-bold text-primary md:text-4xl">Student Management</h1>
                        <p className="text-muted-foreground">Manage your students and their piano learning journey</p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Add Student Form */}
                            <Card className="border-gold/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <UserPlus className="text-gold mr-2 h-5 w-5" />
                                        {editingStudent ? 'Edit Student' : 'Add New Student'}
                                    </CardTitle>
                                    <CardDescription>
                                        {editingStudent
                                            ? 'Update student information below'
                                            : `Add a new student to your account (${students.length}/10 students)`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!isAddingStudent && !editingStudent ? (
                                        <Button
                                            onClick={() => setIsAddingStudent(true)}
                                            className="bg-gold hover:bg-gold/90 text-warm-brown w-full"
                                            disabled={students.length >= 10}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Student
                                        </Button>
                                    ) : (
                                        <form className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="name">Student Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Enter student's full name"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="age">Age *</Label>
                                                    <Input
                                                        id="age"
                                                        type="number"
                                                        value={formData.age}
                                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                        placeholder="Enter age"
                                                        min="5"
                                                        max="100"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="hasPiano"
                                                    checked={formData.hasPiano}
                                                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasPiano: checked })}
                                                />
                                                <Label htmlFor="hasPiano">Student has access to a piano/keyboard</Label>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    type="button"
                                                    onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                                                    className="bg-gold hover:bg-gold/90 text-warm-brown flex-1"
                                                >
                                                    {editingStudent ? 'Update Student' : 'Add Student'}
                                                </Button>
                                                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Students List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Users className="text-gold mr-2 h-5 w-5" />
                                        Your Students ({students.length}/10)
                                    </CardTitle>
                                    <CardDescription>Manage your students and their learning progress</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {students.length === 0 ? (
                                        <div className="py-8 text-center">
                                            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-semibold">No students added yet</h3>
                                            <p className="mb-4 text-muted-foreground">
                                                Start by adding your first student to begin their piano learning journey.
                                            </p>
                                            <Button onClick={() => setIsAddingStudent(true)} className="bg-gold hover:bg-gold/90 text-warm-brown">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Your First Student
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {students.map((student) => (
                                                <div key={student.id} className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-gold flex h-10 w-10 items-center justify-center rounded-full">
                                                            <span className="text-warm-brown font-semibold">
                                                                {student.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-primary">{student.name}</h4>
                                                            <div className="mt-1 flex items-center space-x-2">
                                                                <Badge variant="secondary">{student.age} years old</Badge>
                                                                <Badge variant="outline">{getAgeGroup(student.age)}</Badge>
                                                                {student.hasPiano && (
                                                                    <Badge className="bg-green-100 text-green-800">
                                                                        <Music className="mr-1 h-3 w-3" />
                                                                        Has Piano
                                                                    </Badge>
                                                                )}
                                                                {student.isSubscribed ? (
                                                                    <Badge className="bg-blue-100 text-blue-800">
                                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                                        Subscribed
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-orange-100 text-orange-800">
                                                                        <Clock className="mr-1 h-3 w-3" />
                                                                        Not Subscribed
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="mt-1 text-sm text-muted-foreground">Added: {student.createdAt}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {!student.isSubscribed && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleSubscribeStudent(student.id)}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                <Crown className="mr-1 h-4 w-4" />
                                                                Subscribe
                                                            </Button>
                                                        )}
                                                        <Button variant="outline" size="sm" onClick={() => handleEditStudent(student.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteStudent(student.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Student Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Total Students</span>
                                            <span className="font-semibold">{students.length}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Subscribed</span>
                                            <span className="font-semibold text-green-600">{students.filter((s) => s.isSubscribed).length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">With Piano Access</span>
                                            <span className="font-semibold text-blue-600">{students.filter((s) => s.hasPiano).length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Average Age</span>
                                            <span className="font-semibold">
                                                {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.age, 0) / students.length) : 0}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subscription Notice */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-800">
                                        <Crown className="mr-2 h-5 w-5" />
                                        Subscription Required
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm text-blue-700">
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>Students need a paid subscription to access lessons</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>Subscriptions are managed through secure payments</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>Click "Subscribe" next to any student to get started</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="text-blue-800">Tips for Success</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm text-blue-700">
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>Students with piano access practice more effectively</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>Consider age-appropriate lesson scheduling</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>Regular practice leads to better progress</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Age Groups Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Age Groups</CardTitle>
                                    <CardDescription>Understanding learning stages</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span>Kindergarten (5-5)</span>
                                            <Badge variant="outline" className="text-xs">
                                                Basic
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Elementary (6-11)</span>
                                            <Badge variant="outline" className="text-xs">
                                                Foundation
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Teen (12-17)</span>
                                            <Badge variant="outline" className="text-xs">
                                                Intermediate
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Adult (18+)</span>
                                            <Badge variant="outline" className="text-xs">
                                                Advanced
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Student;
