"use client";

/**
 * @file components/dashboard/topbar.tsx
 *
 * Topbar — elevated iOS-style glass navigation header.
 *
 * Design:
 *  • 76px fixed height — spacious, readable, premium feel
 *  • Frosted glass: bg-background/80 + backdrop-blur-2xl
 *  • Layered border + shadow gives a "floating" material effect
 *  • Sticky at top-0, z-20 so it floats above content on scroll
 *
 * Elements (left → right):
 *  • Logo mark (mobile) / Hamburger (mobile) + Breadcrumb
 *  • Centered search input (desktop only)
 *  • Theme toggle · Notifications · User avatar dropdown
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Search, Bell, Settings, Menu, LogOut, User,
    ChevronRight, LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { APP_NAME, NAV_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark({ className }: { className?: string }) {
    return (
        <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-[var(--ios-radius-md)]",
            "bg-primary text-primary-foreground font-bold text-sm select-none shadow-sm",
            className,
        )}>
            A
        </div>
    );
}

// ─── Breadcrumb builder ───────────────────────────────────────────────────────

function DynamicBreadcrumb({ segments }: { segments: string[] }) {
    if (segments.length === 0) {
        return (
            <div className="flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
            </div>
        );
    }

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1">
            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                return (
                    <React.Fragment key={href}>
                        {index > 0 && (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                        {isLast ? (
                            <span className="text-sm font-semibold text-foreground">
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}

// ─── Notification button ──────────────────────────────────────────────────────

function NotificationButton() {
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className={cn(
                "relative h-9 w-9 rounded-[var(--ios-radius-full)]",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                "transition-colors",
            )}
        >
            <Bell size={19} strokeWidth={2} />
            {/* Unread dot with subtle pulse */}
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ios-red)] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ios-red)]" />
            </span>
        </Button>
    );
}

// ─── User avatar dropdown ─────────────────────────────────────────────────────

function UserDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="User menu"
                    className={cn(
                        "flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-[var(--ios-radius-full)]",
                        "hover:bg-accent transition-colors outline-none",
                        "focus-visible:ring-2 focus-visible:ring-primary/50",
                    )}
                >
                    <Avatar className="h-8 w-8 border-2 border-border/60 shadow-sm">
                        <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            AD
                        </AvatarFallback>
                    </Avatar>
                    {/* Name — visible on md+ */}
                    <div className="hidden md:flex flex-col items-start leading-none">
                        <span className="text-sm font-semibold text-foreground">Admin User</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">admin@acme.com</span>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className={cn(
                    "w-60 rounded-[var(--ios-radius-xl)] shadow-xl border-border/50",
                    "bg-card/95 backdrop-blur-xl",
                )}
            >
                {/* Header */}
                <DropdownMenuLabel className="font-normal px-3 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">AD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@acme.com</p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="mx-2" />

                <div className="px-1 py-1">
                    <DropdownMenuItem className="rounded-[var(--ios-radius-md)] cursor-pointer gap-2.5 px-3 py-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[var(--ios-radius-md)] cursor-pointer gap-2.5 px-3 py-2 text-sm">
                        <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                        Settings
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="mx-2" />

                <div className="px-1 py-1">
                    <DropdownMenuItem className="rounded-[var(--ios-radius-md)] cursor-pointer gap-2.5 px-3 py-2 text-sm text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 shrink-0" />
                        Sign out
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Topbar() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <header
            className={cn(
                // Layout & sticky positioning
                "flex-shrink-0 sticky top-0 z-20",
                "flex items-center justify-between",
                "h-[76px] px-4 lg:px-6 gap-4",
                // Glass background — layered for depth
                "bg-background/80 backdrop-blur-2xl",
                // Subtle inner border (bottom only) + floating shadow
                "border-b border-border/60",
                "shadow-[0_1px_0_0_hsl(var(--border)/0.5),0_4px_20px_-4px_hsl(0_0%_0%/0.08)]",
                "dark:shadow-[0_1px_0_0_hsl(var(--border)/0.4),0_4px_24px_-4px_hsl(0_0%_0%/0.35)]",
            )}
        >
            {/* ══════════════════════════════════════════════════════════════
                LEFT — Mobile hamburger · Logo · Breadcrumb
            ══════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-3 flex-1 min-w-0">

                {/* Mobile sheet trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden shrink-0 h-9 w-9 rounded-[var(--ios-radius-md)] text-muted-foreground hover:text-foreground hover:bg-accent"
                            aria-label="Open navigation menu"
                        >
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>

                    {/* Mobile drawer */}
                    <SheetContent side="left" className="w-[80vw] sm:w-[300px] p-0 flex flex-col bg-sidebar border-r border-border/50">
                        <SheetHeader className="px-5 py-4 border-b border-border/50 text-left">
                            <SheetTitle className="flex items-center gap-2.5">
                                <LogoMark />
                                <span className="font-semibold text-base tracking-tight truncate">
                                    {APP_NAME}
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex-1 overflow-y-auto w-full px-3 py-4 space-y-6" aria-label="Mobile navigation">
                            {NAV_GROUPS.map((group, groupIdx) => (
                                <div key={groupIdx} className="space-y-1">
                                    {group.title && (
                                        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 mt-2">
                                            {group.title}
                                        </p>
                                    )}
                                    {group.items.map((item) => {
                                        const isActive = item.exact
                                            ? pathname === item.href
                                            : pathname.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-[var(--ios-radius-md)] text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-sidebar-primary/10 text-sidebar-primary"
                                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                                )}
                                            >
                                                <item.icon
                                                    size={18}
                                                    className={cn("shrink-0", isActive ? "text-sidebar-primary" : "text-muted-foreground")}
                                                    strokeWidth={isActive ? 2.5 : 2}
                                                />
                                                <span className="truncate">{item.label}</span>
                                                {item.badge !== undefined && (
                                                    <span className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Logo mark — shown on mobile (sidebar hidden) */}
                <Link
                    href="/overview"
                    className="lg:hidden flex items-center gap-2 shrink-0"
                    aria-label={APP_NAME}
                >
                    <LogoMark />
                </Link>

                {/* Vertical divider (desktop only, between logo-area in sidebar and breadcrumb) */}
                <div className="hidden lg:block h-5 w-px bg-border/60 shrink-0" />

                {/* Breadcrumb */}
                <div className="hidden sm:block min-w-0">
                    <DynamicBreadcrumb segments={segments} />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                CENTER — Search input (desktop only)
            ══════════════════════════════════════════════════════════════ */}
            <div className="flex-1 max-w-[360px] hidden lg:block">
                <div className="relative w-full group">
                    <Search className={cn(
                        "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none",
                        "text-muted-foreground/60 group-focus-within:text-primary",
                        "transition-colors duration-200",
                    )} />
                    <Input
                        placeholder="Search anything…"
                        className={cn(
                            "w-full h-9 pl-10 pr-4 text-sm",
                            "bg-muted/50 border-border/50 rounded-[var(--ios-radius-full)]",
                            "placeholder:text-muted-foreground/50",
                            "focus-visible:bg-background focus-visible:border-primary/40",
                            "focus-visible:ring-2 focus-visible:ring-primary/20",
                            "transition-all duration-200",
                        )}
                    />
                    {/* Keyboard shortcut hint */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-0.5 pointer-events-none">
                        <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/50 bg-muted rounded border border-border/50">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/50 bg-muted rounded border border-border/50">K</kbd>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                RIGHT — Icons + User
            ══════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-1 shrink-0">

                {/* Mobile search icon */}
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Search"
                    className="lg:hidden h-9 w-9 rounded-[var(--ios-radius-full)] text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                    <Search size={19} strokeWidth={2} />
                </Button>

                {/* Theme toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <NotificationButton />

                {/* Divider */}
                <div className="h-6 w-px bg-border/60 mx-1 shrink-0" />

                {/* User avatar / dropdown */}
                <UserDropdown />
            </div>
        </header>
    );
}
