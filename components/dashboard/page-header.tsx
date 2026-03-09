/**
 * @file components/dashboard/page-header.tsx
 *
 * `PageHeader` — Consistent title/description/actions header for every page.
 *
 * Design (Notion/Linear-style):
 *  • Title is the largest typographic element on the page
 *  • Subtitle is small and quiet — muted foreground
 *  • A hairline separator below grounds the header
 *  • Actions slot sits at the trailing edge
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
        <div className={cn("mb-8 md:mb-10", className)} {...props}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-border/50">
                <div className="space-y-1 min-w-0">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2 shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
