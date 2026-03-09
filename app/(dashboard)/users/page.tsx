"use client";

/**
 * @file app/(dashboard)/users/page.tsx
 *
 * Users page — demonstrates the new TanStack `<DataTable>` component.
 *
 * Features showcased:
 *  • Sorting (click any column header)
 *  • Global search + per-column status/role filters
 *  • Column visibility toggle
 *  • Row selection + bulk actions bar
 *  • Pagination with page-size selector
 *  • Loading state (toggle the checkbox to simulate it)
 */

import React, { useState } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard";
import { DataTable } from "@/components/table";
import type { DataTableColumn } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, UserX, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Viewer";
    status: "Active" | "Invited" | "Suspended";
    plan: "Free" | "Pro" | "Business";
    joined: string;
    avatarUrl?: string;
};

function generateUsers(count: number): User[] {
    const roles: User["role"][] = ["Admin", "Editor", "Viewer"];
    const statuses: User["status"][] = ["Active", "Invited", "Suspended"];
    const plans: User["plan"][] = ["Free", "Pro", "Business"];
    const firstNames = ["Sarah", "Marcus", "Emily", "James", "Lisa", "Daniel", "Priya", "Tom", "Chloe", "Ryan", "Anna", "Ben", "Zoe", "Chris", "Sofia"];
    const lastNames = ["Jenkins", "Chen", "Watson", "Thorne", "Wong", "Kim", "Patel", "Brown", "Dumont", "Lee", "García", "Smith", "Taylor", "Young", "Martin"];

    return Array.from({ length: count }, (_, i) => {
        const first = firstNames[i % firstNames.length];
        const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
        const name = `${first} ${last}`;
        return {
            id: String(i + 1),
            name,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@acme.com`,
            role: roles[i % roles.length],
            status: statuses[i % statuses.length],
            plan: plans[Math.floor(i / 3) % plans.length],
            joined: new Date(Date.now() - (i * 7 + 3) * 24 * 60 * 60 * 1000)
                .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            avatarUrl: `https://i.pravatar.cc/40?u=${encodeURIComponent(name)}`,
        };
    });
}

const USERS = generateUsers(80);

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: User["status"] }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-[var(--ios-radius-sm)] px-2 py-0.5 text-xs font-medium",
            status === "Active" && "bg-[var(--ios-green)]/10 text-[var(--ios-green)]",
            status === "Invited" && "bg-[var(--ios-blue)]/10 text-[var(--ios-blue)]",
            status === "Suspended" && "bg-muted text-muted-foreground",
        )}>
            {status}
        </span>
    );
}

// ─── Plan badge ───────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: User["plan"] }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-[var(--ios-radius-sm)] px-2 py-0.5 text-xs font-medium",
            plan === "Free" && "bg-muted text-muted-foreground",
            plan === "Pro" && "bg-[var(--ios-purple)]/10 text-[var(--ios-purple)]",
            plan === "Business" && "bg-[var(--ios-orange)]/10 text-[var(--ios-orange)]",
        )}>
            {plan}
        </span>
    );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns: DataTableColumn<User>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "User",
        enableSorting: true,
        enableHiding: false, // always visible
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight min-w-0">
                        <span className="font-medium text-foreground truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "role",
        accessorKey: "role",
        header: "Role",
        enableSorting: true,
        filterOptions: [
            { label: "Admin", value: "Admin" },
            { label: "Editor", value: "Editor" },
            { label: "Viewer", value: "Viewer" },
        ],
        cell: ({ getValue }) => (
            <span className="text-sm text-foreground">{getValue() as string}</span>
        ),
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        filterOptions: [
            { label: "Active", value: "Active" },
            { label: "Invited", value: "Invited" },
            { label: "Suspended", value: "Suspended" },
        ],
        cell: ({ getValue }) => <StatusBadge status={getValue() as User["status"]} />,
    },
    {
        id: "plan",
        accessorKey: "plan",
        header: "Plan",
        enableSorting: true,
        filterOptions: [
            { label: "Free", value: "Free" },
            { label: "Pro", value: "Pro" },
            { label: "Business", value: "Business" },
        ],
        cell: ({ getValue }) => <PlanBadge plan={getValue() as User["plan"]} />,
    },
    {
        id: "joined",
        accessorKey: "joined",
        header: "Joined",
        enableSorting: true,
        cell: ({ getValue }) => (
            <span className="text-sm text-muted-foreground tabular-nums">{getValue() as string}</span>
        ),
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
    const [isLoading, setIsLoading] = useState(false);

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1800);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="Users"
                description={`${USERS.length} team members · manage accounts and permissions`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={simulateLoading}
                            className="rounded-[var(--ios-radius-full)] gap-1.5 text-sm"
                        >
                            Simulate Loading
                        </Button>
                        <Button className="rounded-[var(--ios-radius-full)] shadow-sm gap-2">
                            <Plus className="w-4 h-4" />
                            Add User
                        </Button>
                    </div>
                }
            />

            <DataTable
                columns={columns}
                data={USERS}
                isLoading={isLoading}
                enableRowSelection
                searchPlaceholder="Search users..."
                rowLabel="users"
                defaultPageSize={10}
                renderBulkActions={(rows) => (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs rounded-[var(--ios-radius-md)] text-muted-foreground hover:text-foreground"
                        >
                            <Mail className="h-3.5 w-3.5" />
                            Email
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs rounded-[var(--ios-radius-md)] text-muted-foreground hover:text-foreground"
                        >
                            <UserX className="h-3.5 w-3.5" />
                            Suspend
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs rounded-[var(--ios-radius-md)] text-destructive hover:text-destructive/80"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete ({rows.length})
                        </Button>
                    </>
                )}
            />
        </div>
    );
}
