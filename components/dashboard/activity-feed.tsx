/**
 * @file components/dashboard/activity-feed.tsx
 *
 * `ActivityFeed` — A vertical timeline of recent workspace events.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { ActivityFeed } from "@/components/dashboard";
 *   import { RefreshCw } from "lucide-react";
 *
 *   <ActivityFeed activities={[
 *     {
 *       id: 1,
 *       user: "Sarah Jenkins",
 *       action: "deployed to",
 *       target: "Production",
 *       timestamp: "5m ago",
 *       icon: RefreshCw,
 *       iconBgColor: "bg-blue-500/10",
 *       iconColor: "text-blue-500",
 *     }
 *   ]} />
 *
 * @tip Use `formatRelativeTime` from "@/lib/format" to generate timestamps.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Optional object of the action, rendered bold, e.g. "Production". */
    target?: string;
    /** Human-readable elapsed time, e.g. "3h ago". Use `formatRelativeTime`. */
    timestamp: string;
    /** Lucide icon for the bubble — import from "lucide-react". */
    icon: LucideIcon;
    /** Tailwind bg class for the icon bubble, e.g. "bg-blue-500/10". */
    iconBgColor?: string;
    /** Tailwind text class for the icon colour, e.g. "text-blue-500". */
    iconColor?: string;
}

interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Ordered array of events; first item renders at the top. */
    activities: ActivityItem[];
}

export function ActivityFeed({ activities, className, ...props }: ActivityFeedProps) {
    return (
        <div className={cn("space-y-6", className)} {...props}>
            {activities.map((activity, index) => {
                const isLast = index === activities.length - 1;

                return (
                    <div key={activity.id} className="relative flex gap-4">
                        {/* The vertical timeline connector */}
                        {!isLast && (
                            <div
                                className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-border/50"
                                aria-hidden="true"
                            />
                        )}

                        {/* Icon Bubble */}
                        <div
                            className={cn(
                                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
                                activity.iconBgColor || "bg-muted"
                            )}
                        >
                            <activity.icon
                                className={cn("h-4 w-4", activity.iconColor || "text-muted-foreground")}
                                strokeWidth={2.5}
                            />
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col flex-1 pb-1 pt-1.5">
                            <p className="text-sm leading-tight text-foreground">
                                <span className="font-semibold tracking-tight">{activity.user}</span>{" "}
                                <span className="text-muted-foreground">{activity.action}</span>{" "}
                                {activity.target && (
                                    <span className="font-medium text-foreground">{activity.target}</span>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wide font-medium">
                                {activity.timestamp}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
