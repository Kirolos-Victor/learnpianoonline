import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationData, TablePagination } from '@/components/ui/table-pagination';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { Search, UserCheck, Users, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

interface UsersPaginatedData extends PaginationData {
    data: User[];
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface Filters {
    search: string;
    status: string;
    per_page: number;
}

interface Props {
    users: UsersPaginatedData;
    stats: Stats;
    filters: Filters;
}

const AdminUsers = ({ users, stats, filters }: Props) => {
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);

    // Debounce search
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== filters.search) {
                updateFilters({ search: searchTerm, status: statusFilter, per_page: filters.per_page });
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const updateFilters = (newFilters: Partial<Filters>) => {
        const params = {
            ...filters,
            ...newFilters,
        };

        // Remove empty search
        if (!params.search) {
            delete (params as any).search;
        }

        router.visit(route('admin.parents'), {
            data: params,
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.visit(route('admin.parents'), {
            data: {
                ...filters,
                page,
            },
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (perPage: number) => {
        updateFilters({ per_page: perPage });
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        updateFilters({ status, per_page: filters.per_page });
    };

    const handleRestrictAccess = (userId: string) => {
        if (confirm('Are you sure you want to deactivate this parent?')) {
            setProcessing(true);
            router.patch(
                `/admin/parents/${userId}/restrict`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setProcessing(false),
                },
            );
        }
    };

    const handleActivateUser = (userId: string) => {
        if (confirm('Are you sure you want to activate this parent?')) {
            setProcessing(true);
            router.patch(
                `/admin/parents/${userId}/activate`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setProcessing(false),
                },
            );
        }
    };

    return (
        <AdminLayout title="Parents Management">
            <Head title="Parents Management" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Parents Management</h1>
                <p className="mt-2 text-gray-600">Manage parent accounts. You can only deactivate or reactivate parents from login here.</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active} active, {stats.inactive} inactive
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Parents</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Parents</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inactive}</div>
                        <p className="text-xs text-muted-foreground">Currently inactive</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                        placeholder="Search parents by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Parents</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Parents</CardTitle>
                    <CardDescription>Activate or deactivate parent accounts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.data.length === 0 ? (
                            <div className="py-8 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No parents found</h3>
                                <p className="text-gray-600">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'No parents have been registered yet.'}
                                </p>
                            </div>
                        ) : (
                            users.data.map((user: User) => (
                                <div key={user.id} className="flex flex-col justify-between gap-2 rounded-lg border p-4 md:flex-row md:items-center">
                                    <div className="flex items-center space-x-4">
                                        <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <p className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                                        {user.is_active ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRestrictAccess(user.id)}
                                                className="text-red-600 hover:text-red-700"
                                                disabled={processing}
                                            >
                                                <UserX className="mr-2 h-4 w-4" />
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleActivateUser(user.id)}
                                                className="text-green-600 hover:text-green-700"
                                                disabled={processing}
                                            >
                                                <UserCheck className="mr-2 h-4 w-4" />
                                                Activate
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {users.data.length > 0 && (
                        <div className="mt-6 border-t pt-6">
                            <TablePagination data={users} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminUsers;
