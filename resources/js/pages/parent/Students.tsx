import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ParentLayout from '@/layouts/parent-layout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock, Edit2, Piano, PlusCircle, Trash2, User, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Student {
    id: number;
    name: string;
    slug: string;
    age: number;
    hasPiano: boolean;
    isSubscribed: boolean;
    subscriptionType: string | null;
    subscriptionEndDate: string | null;
    sessionsRemaining: number;
    dayOfWeek: string;
    preferredTime: string;
    instructor: {
        id: number;
        name: string;
    } | null;
    createdAt: string;
}

interface TimeSlot {
    value: string;
    label: string;
    preferredTime: string;
    userTime: string;
}

interface Props {
    students: Student[];
    availableTimeSlots: TimeSlot[];
    availableDays: string[] | string;
}

const formatTime = (timeString: string) => {
    if (!timeString) return '';

    try {
        if (timeString.includes('T')) {
            const date = new Date(timeString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return timeString;
    } catch (error) {
        return timeString;
    }
};

const parseAvailableDays = (days: string[] | string): string[] => {
    if (Array.isArray(days)) {
        return days;
    }

    if (typeof days === 'string') {
        try {
            const parsed = JSON.parse(days);
            return Array.isArray(parsed) ? parsed : [days];
        } catch {
            return days.split(',').map((day) => day.trim());
        }
    }

    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
};

export default function Students({ students, availableTimeSlots, availableDays }: Props) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        hasPiano: false,
        dayOfWeek: '',
        preferredTime: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const parsedAvailableDays = parseAvailableDays(availableDays);

    const handleSingleSubscribe = (studentSlug: string) => {
        router.visit(`/parent/subscription?selectedStudentSlug=${studentSlug}`);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setErrors({});
        setIsSubmitting(true);

        if (editingStudent) {
            router.put(`/parent/students/${editingStudent.slug}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    resetForm();
                    setIsSubmitting(false);
                },
                onError: (serverErrors) => {
                    setErrors(serverErrors);
                    setIsSubmitting(false);
                },
            });
        } else {
            router.post('/parent/students', formData, {
                preserveScroll: true,
                onSuccess: () => {
                    resetForm();
                    setIsSubmitting(false);
                },
                onError: (serverErrors) => {
                    setErrors(serverErrors);
                    setIsSubmitting(false);
                },
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            age: '',
            hasPiano: false,
            dayOfWeek: '',
            preferredTime: '',
        });
        setErrors({});
        setIsSubmitting(false);
        setShowAddForm(false);
        setEditingStudent(null);
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);

        let matchingTimeValue = '';

        const directMatch = availableTimeSlots.find((slot) => slot.value === student.preferredTime);
        if (directMatch) {
            matchingTimeValue = directMatch.value;
        } else {
            let timeToMatch = student.preferredTime;

            if (student.preferredTime.includes('T')) {
                try {
                    const date = new Date(student.preferredTime);
                    timeToMatch = date.toTimeString().slice(0, 5);
                } catch (error) {
                    timeToMatch = student.preferredTime;
                }
            }

            if (timeToMatch.includes(':')) {
                const timeParts = timeToMatch.split(':');
                if (timeParts.length >= 2) {
                    timeToMatch = `${timeParts[0]}:${timeParts[1]}`;
                }
            }

            const processedMatch = availableTimeSlots.find(
                (slot) => slot.value === timeToMatch || slot.userTime === timeToMatch || slot.preferredTime === timeToMatch,
            );

            if (processedMatch) {
                matchingTimeValue = processedMatch.value;
            } else {
                const formattedTimeMatch = availableTimeSlots.find((slot) => {
                    const slotFormatted = formatTime(slot.value);
                    const studentFormatted = formatTime(student.preferredTime);
                    return slotFormatted === studentFormatted;
                });

                if (formattedTimeMatch) {
                    matchingTimeValue = formattedTimeMatch.value;
                } else {
                    if (availableTimeSlots.length > 0) {
                        matchingTimeValue = availableTimeSlots[0].value;
                    }
                }
            }
        }

        const ageString = String(student.age);

        setFormData({
            name: student.name,
            age: ageString,
            hasPiano: student.hasPiano,
            dayOfWeek: student.dayOfWeek,
            preferredTime: matchingTimeValue,
        });

        setShowAddForm(true);
    };

    const handleDelete = (student: Student) => {
        if (confirm('Are you sure you want to delete this student?')) {
            router.delete(`/parent/students/${student.slug}`);
        }
    };

    const studentsWithoutAvailability = students.filter((s) => !s.dayOfWeek || !s.preferredTime);

    return (
        <ParentLayout>
            <Head title="Students" />

            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Students</h1>
                    <p className="mt-1 text-gray-600">Manage your children's piano learning journey</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold">{students.length}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Subscriptions</p>
                                    <p className="text-2xl font-bold">{students.filter((s) => s.isSubscribed).length}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Have Piano</p>
                                    <p className="text-2xl font-bold">{students.filter((s) => s.hasPiano).length}</p>
                                </div>
                                <Piano className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Missing Availability</p>
                                    <p className="text-2xl font-bold text-red-600">{studentsWithoutAvailability.length}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6">
                    <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Student
                    </Button>
                </div>

                {studentsWithoutAvailability.length > 0 && (
                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
                            <div>
                                <h3 className="font-medium text-amber-800">Lesson Availability Required</h3>
                                <p className="mt-1 text-sm text-amber-700">
                                    Some students are missing their preferred lesson day and time. Please update their availability to enable
                                    scheduling.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {showAddForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {Object.keys(errors).length > 0 && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                        <div className="flex items-center">
                                            <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                                            <div>
                                                <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
                                                <ul className="mt-2 list-inside list-disc text-red-700">
                                                    {Object.entries(errors).map(([field, message]) => (
                                                        <li key={field}>{message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                                        <User className="mr-2 h-5 w-5" />
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name">Student Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div>
                                            <Label htmlFor="age">Age *</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                min="5"
                                                max="100"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.age} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                                        <Piano className="mr-2 h-5 w-5" />
                                        Piano Access
                                    </h3>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="hasPiano"
                                                    checked={formData.hasPiano}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, hasPiano: checked as boolean })}
                                                    className="h-5 w-5"
                                                />
                                                <div>
                                                    <Label htmlFor="hasPiano" className="cursor-pointer text-base font-medium text-gray-900">
                                                        Has Piano at Home
                                                    </Label>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Check this if your child has access to a piano at home for practice
                                                    </p>
                                                </div>
                                            </div>
                                            <Piano className="h-8 w-8 text-purple-500" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Lesson Availability *
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="dayOfWeek">Preferred Day *</Label>
                                            <Select
                                                value={formData.dayOfWeek}
                                                onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {parsedAvailableDays.map((day) => (
                                                        <SelectItem key={day} value={day}>
                                                            {day.charAt(0).toUpperCase() + day.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.dayOfWeek} />
                                        </div>
                                        <div>
                                            <Label htmlFor="preferredTime">Preferred Time *</Label>
                                            <Select
                                                value={formData.preferredTime}
                                                onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableTimeSlots.map((slot) => (
                                                        <SelectItem key={slot.value} value={slot.value}>
                                                            {slot.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.preferredTime} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                        <Card key={student.id} className="transition-shadow hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-lg">{student.name}</CardTitle>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(student)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="mr-2 h-4 w-4" />
                                    Age: {student.age}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <Piano className="mr-2 h-4 w-4" />
                                    {student.hasPiano ? 'Has Piano' : 'No Piano'}
                                </div>

                                {student.dayOfWeek && student.preferredTime ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {student.dayOfWeek.charAt(0).toUpperCase() + student.dayOfWeek.slice(1)}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="mr-2 h-4 w-4" />
                                            {formatTime(student.preferredTime)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-2">
                                        <div className="flex items-center text-sm text-red-700">
                                            <AlertCircle className="mr-2 h-4 w-4" />
                                            Missing availability
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`font-medium ${student.isSubscribed ? 'text-green-600' : 'text-gray-500'}`}>
                                            {student.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                                        </span>
                                    </div>

                                    {student.isSubscribed && (
                                        <>
                                            <div className="mt-1 flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Sessions:</span>
                                                <span className="font-medium">{student.sessionsRemaining}</span>
                                            </div>
                                            {student.subscriptionEndDate && (
                                                <div className="mt-1 flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Expires:</span>
                                                    <span className="font-medium text-blue-600">{student.subscriptionEndDate}</span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="mt-3">
                                        <Button
                                            onClick={() => handleSingleSubscribe(student.slug)}
                                            className={`inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                                                student.isSubscribed
                                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                            }`}
                                        >
                                            {student.isSubscribed ? 'Extend Subscription' : 'Subscribe Now'}
                                        </Button>
                                    </div>
                                </div>

                                {student.instructor && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="mr-2 h-4 w-4" />
                                        Instructor: {student.instructor.name}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {students.length === 0 && (
                    <div className="py-12 text-center">
                        <User className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">No students yet</h3>
                        <p className="mb-4 text-gray-600">Add your first student to get started with piano lessons</p>
                        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Your First Student
                        </Button>
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
