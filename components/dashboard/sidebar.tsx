"use client";

/**
 * Sidebar
 * ─────────────────────────────────────────────────────────────────────────────
 * Collapsible left navigation sidebar.
 *
 * Micro-interactions:
 *  • Width collapses via a spring-driven Framer Motion layout animation
 *  • Nav labels + badges AnimatePresence fade-and-slide when sidebar collapses
 *  • Active nav item animates a background "pill" indicator via `layoutId`
 *  • Toggle button rotates its icon smoothly
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { APP_NAME, NAV_GROUPS } from "@/lib/constants";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

// CSS variable values as JS constants so Framer can interpolate them
const SIDEBAR_OPEN_WIDTH = 240;
const SIDEBAR_CLOSED_WIDTH = 64;

export function Sidebar() {
    const pathname = usePathname();
    const { isOpen, toggle } = useSidebar();

    return (
        <motion.aside
            // Animate width via Framer for smooth spring collapse
            animate={{ width: isOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="flex-shrink-0 border-r border-border bg-sidebar hidden lg:flex flex-col overflow-hidden"
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-sidebar-accent/10 overflow-hidden">
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            key="app-name"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="font-semibold text-lg tracking-tight truncate select-none"
                        >
                            {APP_NAME}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle button — icon rotation handled via Framer */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent shrink-0 rounded-[var(--ios-radius-md)] transition-colors"
                    aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    <motion.span
                        animate={{ rotate: isOpen ? 0 : 180 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                    >
                        <PanelLeftClose size={20} />
                    </motion.span>
                </Button>
            </div>

            {/* ── Navigation ── */}
            <nav
                className="flex-1 overflow-y-auto overflow-x-hidden py-4 pb-20 w-full relative"
                aria-label="Main navigation"
            >
                <div className="px-3 space-y-6 w-full">
                    {NAV_GROUPS.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1">
                            {/* Group label — fades in when open */}
                            <AnimatePresence initial={false}>
                                {group.title && isOpen && (
                                    <motion.p
                                        key={`title-${groupIdx}`}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 mt-4 overflow-hidden"
                                    >
                                        {group.title}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Divider (collapsed mode) */}
                            {group.title && !isOpen && (
                                <div className="border-t border-border mt-4 mb-2 mx-2" />
                            )}

                            {/* Items */}
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = item.exact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--ios-radius-md)] text-sm font-medium group transition-colors duration-150",
                                                isActive
                                                    ? "text-sidebar-primary"
                                                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                                                !isOpen && "justify-center px-0"
                                            )}
                                            title={!isOpen ? item.label : undefined}
                                        >
                                            {/* Active pill — shared layoutId animates between links */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-active-pill"
                                                    className="absolute inset-0 rounded-[var(--ios-radius-md)] bg-sidebar-primary/10"
                                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                />
                                            )}

                                            {/* Icon */}
                                            <item.icon
                                                size={20}
                                                className={cn(
                                                    "shrink-0 relative z-10 transition-colors duration-150",
                                                    isActive
                                                        ? "text-sidebar-primary"
                                                        : "text-muted-foreground group-hover:text-sidebar-foreground"
                                                )}
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />

                                            {/* Label — fades in/out with sidebar */}
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.span
                                                        key={`label-${item.href}`}
                                                        initial={{ opacity: 0, x: -6 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -6 }}
                                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                                        className="truncate relative z-10"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>

                                            {/* Badge */}
                                            <AnimatePresence initial={false}>
                                                {isOpen && item.badge !== undefined && (
                                                    <motion.span
                                                        key={`badge-${item.href}`}
                                                        initial={{ opacity: 0, scale: 0.7 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.7 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold relative z-10"
                                                    >
                                                        {item.badge}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </motion.aside>
    );
}
