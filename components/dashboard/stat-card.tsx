"use client";

/**
 * @file components/dashboard/stat-card.tsx
 *
 * StatCard — Stripe/Linear-style metric widget.
 *
 * Design philosophy:
 *  • Metric value is the largest element — clear visual hierarchy
 *  • Icon is tiny and subdued (not a colorful bubble)
 *  • Trend line sits quietly below — no heavy coloring
 *  • No border-radius overkill — cards feel part of the surface
 *  • Hover: only a very subtle shadow lift — no translateY
 */

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    className,
}: StatCardProps) {
    return (
        <motion.div
            whileHover={{ boxShadow: "0 4px 16px -2px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "group relative rounded-[var(--ios-radius-xl)] bg-card border border-border/60",
                "shadow-sm overflow-hidden cursor-default",
                className,
            )}
        >
            <div className="px-6 pt-6 pb-5 flex flex-col gap-3">
                {/* ── Top row: label + icon ── */}
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <Icon
                        className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors"
                        strokeWidth={1.75}
                    />
                </div>

                {/* ── Metric value ── */}
                <p className="text-[2rem] font-semibold tracking-tighter text-foreground leading-none tabular-nums">
                    {value}
                </p>

                {/* ── Trend ── */}
                {trend && (
                    <div className="flex items-center gap-1.5">
                        {trend.isPositive ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2} />
                        ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-400 shrink-0" strokeWidth={2} />
                        )}
                        <p className="text-xs text-muted-foreground">
                            <span className={cn(
                                "font-semibold tabular-nums mr-1",
                                trend.isPositive ? "text-emerald-500" : "text-red-400",
                            )}>
                                {trend.isPositive ? "+" : ""}{trend.value}%
                            </span>
                            {trend.label}
                        </p>
                    </div>
                )}
            </div>

            {/* Subtle accent bar at the very bottom — appears on hover */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px] bg-primary/0",
                "group-hover:bg-primary/30 transition-colors duration-300",
            )} />
        </motion.div>
    );
}
