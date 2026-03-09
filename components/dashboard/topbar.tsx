"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Menu } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { APP_NAME, NAV_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Topbar() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <header className="flex-shrink-0 h-[var(--admin-topbar-height)] border-b border-border bg-card/70 backdrop-blur-xl shadow-glass sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 gap-4">

            {/* Mobile Hamburger & Breadcrumbs */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Navigation Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden shrink-0 rounded-[var(--ios-radius-md)] text-muted-foreground hover:text-foreground">
                            <Menu size={20} />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[80vw] sm:w-[300px] p-0 flex flex-col bg-sidebar border-r-0">
                        <SheetHeader className="p-4 border-b border-border text-left">
                            <SheetTitle className="font-semibold text-lg tracking-tight truncate">
                                {APP_NAME}
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex-1 overflow-y-auto w-full p-4" aria-label="Mobile navigation">
                            <div className="space-y-6">
                                {NAV_GROUPS.map((group, groupIdx) => (
                                    <div key={groupIdx} className="space-y-2">
                                        {group.title && (
                                            <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 mt-2">
                                                {group.title}
                                            </p>
                                        )}
                                        <div className="space-y-1">
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
                                                                : "text-sidebar-foreground/70 active:bg-sidebar-accent"
                                                        )}
                                                    >
                                                        <item.icon
                                                            size={20}
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
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Dynamic Breadcrumbs (Hidden on tiny screens) */}
                <div className="hidden sm:block">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {segments.length === 0 ? (
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Hello, Admin</BreadcrumbPage>
                                </BreadcrumbItem>
                            ) : (
                                segments.map((segment, index) => {
                                    const isLast = index === segments.length - 1;
                                    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
                                    const href = `/${segments.slice(0, index + 1).join("/")}`;

                                    return (
                                        <React.Fragment key={href}>
                                            <BreadcrumbItem>
                                                {isLast ? (
                                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && <BreadcrumbSeparator />}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            {/* Search Area */}
            <div className="flex-1 max-w-sm hidden lg:block">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                        placeholder="Search..."
                        className="w-full pl-9 bg-background/50 border-transparent focus-visible:bg-background focus-visible:ring-primary/20 transition-all rounded-[var(--ios-radius-full)]"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="icon" className="lg:hidden rounded-[var(--ios-radius-full)] text-muted-foreground hover:text-foreground">
                    <Search size={20} />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative rounded-[var(--ios-radius-full)] text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Bell size={20} />
                    {/* Unread indicator */}
                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--ios-red)] ring-2 ring-card shadow-sm" />
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1 sm:ml-2">
                            <Avatar className="h-9 w-9 border border-border/50 shadow-sm transition-opacity hover:opacity-80">
                                <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-[var(--ios-radius-lg)] shadow-lg" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal border-b border-border/50 pb-2 mb-1">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs leading-none text-muted-foreground">admin@acme.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer rounded-[var(--ios-radius-md)] flex items-center gap-2">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive rounded-[var(--ios-radius-md)]">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </header>
    );
}
