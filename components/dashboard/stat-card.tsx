"use client";

/**
 * StatCard
 * ─────────────────────────────────────────────────────────────────────────────
 * iOS-style metric widget.
 *
 * Micro-interactions:
 *  • Card lifts 2px on hover (translateY) with a deeper shadow — via Framer Motion
 *  • Icon bubble scales up gently on card hover
 *  • Trend number uses a fast Tailwind transition when its value changes
 */

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
    ...props
}: StatCardProps) {
    return (
        <motion.div
            // Subtle lift on hover — no scale (avoids layout shift in a grid)
            whileHover={{ y: -3, boxShadow: "0 8px 24px -4px oklch(0 0 0 / 0.10)" }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="cursor-default"
        >
            <Card className={cn("overflow-hidden", className)} {...props}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>

                    {/* Icon bubble — scales slightly on card hover via CSS group */}
                    <motion.div
                        className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                        whileHover={{ scale: 1.12 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        <Icon className="h-4 w-4 text-primary" strokeWidth={2.5} />
                    </motion.div>
                </CardHeader>

                <CardContent>
                    <div className="text-2xl font-semibold text-foreground tracking-tight">
                        {value}
                    </div>
                    {trend && (
                        <p className="mt-2 text-xs flex items-center gap-1.5 transition-all duration-300">
                            <span
                                className={cn(
                                    "font-medium tracking-wide tabular-nums",
                                    trend.isPositive
                                        ? "text-[var(--ios-green)]"
                                        : "text-[var(--ios-red)]"
                                )}
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}%
                            </span>
                            <span className="text-muted-foreground">{trend.label}</span>
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
