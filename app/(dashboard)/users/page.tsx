import type { Metadata } from "next";
import { PageHeader, DataTable, SearchInput, FilterDropdown } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
    title: "Users",
};

const DUMMY_USERS = [
    { id: "1", name: "Sarah Jenkins", email: "sarah@example.com", role: "Admin", status: "Active" },
    { id: "2", name: "Marcus Chen", email: "marcus@example.com", role: "Editor", status: "Active" },
    { id: "3", name: "Emily Watson", email: "emily@example.com", role: "Viewer", status: "Invited" },
    { id: "4", name: "James Thorne", email: "james@example.com", role: "Editor", status: "Suspended" },
    { id: "5", name: "Lisa Wong", email: "lisa@example.com", role: "Admin", status: "Active" },
];

export default function UsersPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Users"
                description="Manage your team members and their account permissions here."
                actions={
                    <Button className="rounded-[var(--ios-radius-full)] shadow-sm gap-2">
                        <Plus className="w-4 h-4" />
                        Add User
                    </Button>
                }
            />

            <div className="space-y-4">
                {/* Table Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <SearchInput placeholder="Search users..." className="max-w-xs bg-card" />
                    <div className="flex gap-4 w-full sm:w-auto">
                        <FilterDropdown
                            placeholder="All Roles"
                            value="all"
                            options={[
                                { label: "All Roles", value: "all" },
                                { label: "Admin", value: "admin" },
                                { label: "Editor", value: "editor" },
                                { label: "Viewer", value: "viewer" },
                            ]}
                        />
                    </div>
                </div>

                {/* The Data Table */}
                <DataTable
                    data={DUMMY_USERS}
                    keyExtractor={(u) => u.id}
                    columns={[
                        {
                            header: "User",
                            accessorKey: "name",
                            cell: (user) => (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-medium text-foreground">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            )
                        },
                        {
                            header: "Role",
                            accessorKey: "role",
                        },
                        {
                            header: "Status",
                            accessorKey: "status",
                            cell: (user) => (
                                <span className={`inline-flex items-center rounded-[var(--ios-radius-sm)] px-2 py-0.5 text-xs font-medium ${user.status === 'Active' ? 'bg-[var(--ios-green)]/10 text-[var(--ios-green)]' :
                                        user.status === 'Invited' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-muted text-muted-foreground'
                                    }`}>
                                    {user.status}
                                </span>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
}
