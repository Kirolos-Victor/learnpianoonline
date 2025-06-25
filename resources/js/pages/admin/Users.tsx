import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Users, UserX, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    users: User[];
}

const AdminUsers = ({ users }: Props) => {
    const [processing, setProcessing] = useState(false);

    const handleRestrictAccess = (userId: string) => {
        if (confirm('Are you sure you want to deactivate this user?')) {
            setProcessing(true);
            fetch(`/admin/users/${userId}/restrict`, {
                method: 'PATCH',
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
            }).finally(() => setProcessing(false));
        }
    };

    const handleActivateUser = (userId: string) => {
        if (confirm('Are you sure you want to activate this user?')) {
            setProcessing(true);
            fetch(`/admin/users/${userId}/activate`, {
                method: 'PATCH',
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
            }).finally(() => setProcessing(false));
        }
    };

    const activeUsers = users.filter(user => user.is_active);
    const inactiveUsers = users.filter(user => !user.is_active);

    return (
        <AdminLayout title="Users Management">
            <Head title="Users Management" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600 mt-2">Manage users. You can only deactivate or reactivate users from login here.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeUsers.length} active, {inactiveUsers.length} inactive
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        Activate or deactivate user accounts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-2">
                                <div className="flex items-center space-x-4">
                                    <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                                    {user.is_active ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRestrictAccess(user.id)}
                                            className="text-red-600 hover:text-red-700"
                                            disabled={processing}
                                        >
                                            <UserX className="h-4 w-4" />
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
                                            <UserCheck className="h-4 w-4" />
                                            Activate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default AdminUsers;
