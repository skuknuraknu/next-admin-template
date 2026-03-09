/**
 * Skeleton
 * ─────────────────────────────────────────────────────────────────────────────
 * A pulsing placeholder used during loading states.
 * Uses a CSS shimmer animation defined in globals.css via tw-animate-css.
 */

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "rounded-md bg-muted animate-pulse",
                className
            )}
            {...props}
        />
    );
}

/**
 * SkeletonCard
 * A pre-composed card skeleton that mirrors the StatCard layout.
 */
export function SkeletonCard() {
    return (
        <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-40" />
        </div>
    );
}

/**
 * SkeletonRow
 * A single table row placeholder for loading tables.
 */
export function SkeletonRow({ cols = 4 }: { cols?: number }) {
    return (
        <div className="flex items-center gap-4 px-6 py-4 border-b border-border/50 last:border-0">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
            {Array.from({ length: cols - 2 }).map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-16" />
            ))}
        </div>
    );
}

/**
 * SkeletonDashboard
 * Full-page dashboard loading placeholder.
 */
export function SkeletonDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-80" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Chart + Activity row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-[var(--ios-radius-xl)] border border-border bg-card p-6 shadow-sm space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-[180px] w-full rounded-[var(--ios-radius-lg)]" />
                </div>
                <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card p-6 shadow-sm space-y-4">
                    <Skeleton className="h-5 w-32" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="flex-1 space-y-1.5 pt-0.5">
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border/50">
                    <Skeleton className="h-5 w-32" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} cols={5} />
                ))}
            </div>
        </div>
    );
}
