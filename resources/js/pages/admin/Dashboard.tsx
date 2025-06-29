import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Activity, BookOpen, Calendar, CheckCircle, Clock, CreditCard, DollarSign, Filter, GraduationCap, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface Stats {
    // All stats are now date-filtered based on selected date range
    total_users: number;
    active_users: number;
    inactive_users: number;
    total_instructors: number;
    active_instructors: number;
    inactive_instructors: number;
    total_students: number;
    subscribed_students: number;
    total_lessons: number;
    completed_lessons: number;
    pending_lessons: number;
    total_sessions_remaining: number;

    // Subscription stats (also date-filtered)
    total_subscriptions: number;
    completed_subscriptions: number;
    pending_subscriptions: number;
    failed_subscriptions: number;
    total_revenue: number;
    average_subscription_amount: number;
    average_students_per_subscription: number;
}

interface RecentSubscription {
    id: number;
    user_name: string;
    user_email: string;
    amount: number;
    student_count: number;
    paid_at: string;
    paid_at_human: string;
}

interface Filters {
    start_date: string;
    end_date: string;
}

interface Props {
    stats: Stats;
    recentSubscriptions: RecentSubscription[];
    filters: Filters;
}

const AdminDashboard = ({ stats, recentSubscriptions, filters }: Props) => {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleDateFilterChange = () => {
        router.visit(route('admin.dashboard'), {
            data: {
                start_date: startDate,
                end_date: endDate,
            },
            preserveState: true,
            replace: true,
        });
    };

    const resetDateFilter = () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const today = new Date();

        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);

        router.visit(route('admin.dashboard'), {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Overview of platform statistics and recent activities for the selected date range</p>
            </div>

            {/* Date Filter */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="mr-2 h-5 w-5" />
                        Date Range Filter
                    </CardTitle>
                    <CardDescription>Filter statistics by date range. ALL metrics below show data only for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-end gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="end-date">End Date</Label>
                            <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleDateFilterChange}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Apply Filter
                            </Button>
                            <Button variant="outline" onClick={resetDateFilter}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_users}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active_users} active, {stats.inactive_users} inactive
                        </p>
                        <p className="mt-2 text-xs text-blue-600">📅 In selected date range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Instructors</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_instructors}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active_instructors} active, {stats.inactive_instructors} inactive
                        </p>
                        <p className="mt-2 text-xs text-blue-600">📅 In selected date range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_students}</div>
                        <p className="text-xs text-muted-foreground">{stats.subscribed_students} subscribed</p>
                        <p className="mt-2 text-xs text-blue-600">📅 In selected date range</p>
                    </CardContent>
                </Card>
            </div>

            {/* Lessons Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <span>Total Lessons</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.total_lessons}</div>
                        <p className="mt-2 text-sm text-gray-600">Lessons created in date range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Completed Lessons</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.completed_lessons}</div>
                        <p className="mt-2 text-sm text-gray-600">Lessons completed in date range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span>Pending Lessons</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending_lessons}</div>
                        <p className="mt-2 text-sm text-gray-600">Pending lessons in date range</p>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription & Revenue Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                            <span>Total Subscriptions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats.total_subscriptions}</div>
                        <p className="mt-2 text-sm text-gray-600">
                            {stats.completed_subscriptions} completed, {stats.pending_subscriptions} pending
                        </p>
                        <p className="mt-2 text-xs text-blue-600">📅 In selected date range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span>Total Revenue</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">${stats.total_revenue?.toFixed(2) || '0.00'}</div>
                        <p className="mt-2 text-sm text-gray-600">Revenue in selected date range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span>Avg Students/Sub</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.average_students_per_subscription?.toFixed(1) || '0.0'}</div>
                        <p className="mt-2 text-sm text-gray-600">Avg students per subscription in period</p>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Avg amount: ${stats.average_subscription_amount?.toFixed(2) || '0.00'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Conversion Rate</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {stats.total_subscriptions > 0 ? ((stats.completed_subscriptions / stats.total_subscriptions) * 100).toFixed(1) : '0.0'}%
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Success rate in date range</p>
                        <div className="mt-2 text-sm text-red-600">{stats.failed_subscriptions} failed payments</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Subscription Activity */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Recent Subscription Activity
                    </CardTitle>
                    <CardDescription>Latest successful subscriptions in the selected date range</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentSubscriptions.length === 0 ? (
                        <div className="py-8 text-center">
                            <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No recent subscriptions</h3>
                            <p className="text-gray-600">No subscription activity found in the selected date range.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentSubscriptions.map((subscription) => (
                                <div key={subscription.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                <CreditCard className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{subscription.user_name}</p>
                                            <p className="text-sm text-gray-600">{subscription.user_email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="font-semibold text-green-600">${subscription.amount.toFixed(2)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {subscription.student_count} student{subscription.student_count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">{subscription.paid_at}</p>
                                                <p className="text-xs text-gray-500">{subscription.paid_at_human}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminDashboard;
