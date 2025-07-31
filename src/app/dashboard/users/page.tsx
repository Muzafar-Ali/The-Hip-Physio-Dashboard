'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';

import { UserWithAnalytics } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef, DataTable } from '@/components/common/DataTables';
import { PageHeader } from '@/components/common/PageHeader';

const columns: ColumnDef<UserWithAnalytics>[] = [
    { 
        accessorKey: 'username', 
        header: 'User', 
        // cell: (row) => <div className="font-medium">{row?.username}</div> 
        cell: ({ row }) => <div className="font-medium">{row.getValue('username')}</div>
    },
    { 
        accessorKey: 'email', 
        header: 'Email', 
        // cell: (row) => row?.email 
        cell: ({ row }) => row.getValue('email')
    },
    { 
        accessorKey: 'status', 
        header: 'Status', 
        // cell: (row) => <Badge variant={row?.status === 'Active' ? 'default' : 'destructive'}>{row?.status}</Badge>
        cell: ({ row }) => (
            <Badge variant={row.getValue('status') === 'Active' ? 'default' : 'destructive'}>
                {row.getValue('status')}
            </Badge>
        ) 
    },
    { 
        accessorKey: 'plan', 
        header: 'Plan', 
        // cell: (row) => row?.plan 
        cell: ({ row }) => row.getValue('plan')
    },
    { 
        accessorKey: 'analytics', 
        header: 'Compliance', 
        // cell: (row) => <div className="text-center">{`${row?.analytics.complianceRate}%`}</div> 
        cell: ({ row }) => {
            const analytics = row.getValue('analytics') as {
                complianceRate: number;
                averageIrritability: number;
            };
            return (
                <div className="text-center">
                    {`${analytics?.complianceRate ?? 0}%`}
                </div>
            );
        }
        
    },
    {
        accessorKey: 'actions', header: 'Actions', cell: (row) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>View Progress</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
];

export default function UsersPage() {
    const { users, loading, fetchUsers } = useUserStore();

    useEffect(() => {
        if (users.length === 0) fetchUsers();
    }, [users, fetchUsers]);

    return (
        <div className="space-y-4">
            <PageHeader title="User Management" actionButtonText="Add New User" onActionButtonClick={() => alert('Open Add User Modal')} />
            <DataTable
                columns={columns}
                data={users}
                searchKey="username"
                isLoading={loading}
            />
        </div>
    );
}
