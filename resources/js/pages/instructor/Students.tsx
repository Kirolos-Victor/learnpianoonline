import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InstructorLayout from '@/layouts/instructor-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, Eye, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
    slug: string;
    email: string;
    age: number;
    is_subscribed: boolean;
    sessions_remaining: number;
    lessons_completed: number;
    lessons_pending: number;
    last_lesson_date: string | null;
    next_lesson_date: string | null;
    day_of_week: string | null;
    preferred_time: string | null;
    student_timezone: string;
    converted_timezone: string;
}

interface Props {
    students: Student[];
}

const InstructorStudents = ({ students }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dayFilter, setDayFilter] = useState('all');

    const getDayLabel = (day: string | null) => {
        if (!day) return 'Not set';
        const days = {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday',
        };
        return days[day as keyof typeof days] || day;
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDay = dayFilter === 'all' || student.day_of_week === dayFilter;
        return matchesSearch && matchesDay;
    });

    return (
        <InstructorLayout title="Students">
            <Head title="Students - Instructor Panel" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
                <p className="mt-2 text-gray-600">View and manage your assigned students</p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                    <CardDescription>Find students by name or lesson day</CardDescription>
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
                            <Label htmlFor="day-filter">Filter by Day</Label>
                            <Select value={dayFilter} onValueChange={setDayFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Days" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Days</SelectItem>
                                    <SelectItem value="monday">Monday</SelectItem>
                                    <SelectItem value="tuesday">Tuesday</SelectItem>
                                    <SelectItem value="wednesday">Wednesday</SelectItem>
                                    <SelectItem value="thursday">Thursday</SelectItem>
                                    <SelectItem value="friday">Friday</SelectItem>
                                    <SelectItem value="saturday">Saturday</SelectItem>
                                    <SelectItem value="sunday">Sunday</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Students ({filteredStudents.length})</CardTitle>
                    <CardDescription>All subscribed students assigned to you</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredStudents.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No students found</h3>
                            <p className="mt-2 text-gray-600">
                                {searchTerm || dayFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'You have no students assigned yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Schedule
                                            <div className="text-xs font-normal text-gray-400 normal-case">
                                                (Converted to {students.length > 0 ? students[0].converted_timezone : 'your timezone'})
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Sessions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {student.name
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500">Age: {student.age}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.email}</div>
                                                <div className="text-sm text-gray-500">
                                                    <Badge className="bg-green-100 text-green-800">Subscribed</Badge>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{getDayLabel(student.day_of_week)}</div>
                                                <div className="text-sm text-gray-500">
                                                    <Clock className="mr-1 inline h-4 w-4" />
                                                    {student.preferred_time || 'Not set'}
                                                </div>
                                                {student.student_timezone !== student.converted_timezone && (
                                                    <div
                                                        className="mt-1 text-xs text-blue-600"
                                                        title={`Converted from ${student.student_timezone} to ${student.converted_timezone}`}
                                                    >
                                                        ⓘ Converted from {student.student_timezone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{student.sessions_remaining} remaining</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <span className="font-medium text-green-600">{student.lessons_completed}</span> completed
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-medium text-orange-600">{student.lessons_pending}</span> pending
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={route('instructor.student.sessions', student.slug)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Sessions
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </InstructorLayout>
    );
};

export default InstructorStudents;
