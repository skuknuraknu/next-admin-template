/**
 * @file components/dashboard/activity-feed.tsx
 *
 * `ActivityFeed` — Vertical timeline of recent workspace events.
 *
 * Design (Linear-inspired):
 *  • Minimal mono-color dots, no colored icon bubbles
 *  • Heavy information density avoided — generous line spacing
 *  • Timestamp is quiet and right-aligned, not uppercase-tracked
 *  • Actor name is the only bold element
 */

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/** A single event entry in the activity timeline. */
export interface ActivityItem {
    id: string | number;
    /** Display name of the actor (or "System" for automated events). */
    user: string;
    /** Verb phrase describing the action, e.g. "deployed to". */
    action: string;
    /** Optional object of the action, e.g. "Production". */
    target?: string;
    /** Human-readable elapsed time, e.g. "3h ago". */
    timestamp: string;
    /** Lucide icon — rendered as a tiny glyph inside a neutral bubble. */
    icon: LucideIcon;
    /** @deprecated no longer used — all dots are neutral */
    iconBgColor?: string;
    /** @deprecated no longer used */
    iconColor?: string;
}

interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
    activities: ActivityItem[];
}

export function ActivityFeed({ activities, className, ...props }: ActivityFeedProps) {
    return (
        <div className={cn("space-y-0", className)} {...props}>
            {activities.map((activity, index) => {
                const isLast = index === activities.length - 1;
                const Icon = activity.icon;

                return (
                    <div key={activity.id} className="relative flex gap-4 group">

                        {/* ── Timeline track ── */}
                        <div className="flex flex-col items-center shrink-0">
                            {/* Dot */}
                            <div className={cn(
                                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                                "bg-muted border border-border/60",
                                "group-hover:border-border group-hover:bg-accent transition-colors",
                            )}>
                                <Icon className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.75} />
                            </div>
                            {/* Connector line */}
                            {!isLast && (
                                <div className="w-px flex-1 bg-border/40 mt-1 mb-1" style={{ minHeight: "20px" }} aria-hidden />
                            )}
                        </div>

                        {/* ── Content ── */}
                        <div className={cn(
                            "flex flex-col pb-5 pt-0.5 flex-1 min-w-0",
                            isLast && "pb-1",
                        )}>
                            <p className="text-sm leading-snug text-foreground">
                                <span className="font-semibold">{activity.user}</span>
                                {" "}
                                <span className="text-muted-foreground">
                                    {activity.action}
                                </span>
                                {activity.target && (
                                    <>
                                        {" "}
                                        <span className="font-medium text-foreground">
                                            {activity.target}
                                        </span>
                                    </>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                {activity.timestamp}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
