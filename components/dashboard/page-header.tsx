/**
 * @file components/dashboard/page-header.tsx
 *
 * `PageHeader` — Consistent title/description/actions header for every page.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { PageHeader } from "@/components/dashboard";
 *
 *   <PageHeader
 *     title="Users"
 *     description="Manage team members and their permissions."
 *     actions={<Button>Add User</Button>}
 *   />
 *
 *   // Minimal (heading only)
 *   <PageHeader title="Settings" />
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Primary page title — rendered as an `<h1>`. */
    title: string;
    /** Optional subtitle rendered below the title in muted text. */
    description?: string;
    /** Slot for action buttons shown in the trailing corner. */
    actions?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    actions,
    className,
    ...props
}: PageHeaderProps) {
    return (
        <div
            className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8", className)}
            {...props}
        >
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}
