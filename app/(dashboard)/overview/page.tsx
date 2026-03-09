"use client";

import {
    Users,
    DollarSign,
    Activity,
    TrendingUp,
    ShoppingCart,
    UserPlus,
    RefreshCw,
    Bell,
    Shield,
    ArrowUpRight,
} from "lucide-react";
import { PageHeader, StatCard, ActivityFeed, PageTransition } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS = [
    {
        title: "Total Revenue",
        value: "$84,320",
        icon: DollarSign,
        trend: { value: 12.5, label: "vs last month", isPositive: true },
    },
    {
        title: "New Users",
        value: "3,842",
        icon: Users,
        trend: { value: 8.2, label: "vs last month", isPositive: true },
    },
    {
        title: "Active Sessions",
        value: "1,293",
        icon: Activity,
        trend: { value: 3.1, label: "vs last hour", isPositive: false },
    },
    {
        title: "Conversion Rate",
        value: "4.6%",
        icon: TrendingUp,
        trend: { value: 1.4, label: "vs last week", isPositive: true },
    },
];

const CHART_DATA = [
    { day: "Sun", revenue: 4200 },
    { day: "Mon", revenue: 6800 },
    { day: "Tue", revenue: 5900 },
    { day: "Wed", revenue: 8700 },
    { day: "Thu", revenue: 7600 },
    { day: "Fri", revenue: 11200 },
    { day: "Sat", revenue: 9400 },
];

const RECENT_ACTIVITIES = [
    { id: 1, user: "Sarah Jenkins", action: "deployed a new release to", target: "Production", timestamp: "4 minutes ago", icon: RefreshCw },
    { id: 2, user: "Marcus Chen", action: "invited 3 users to", target: "Workspace Alpha", timestamp: "28 minutes ago", icon: UserPlus },
    { id: 3, user: "System", action: "completed nightly database backup", timestamp: "1 hour ago", icon: Shield },
    { id: 4, user: "Emily Watson", action: "raised a new alert on", target: "API Gateway", timestamp: "2 hours ago", icon: Bell },
    { id: 5, user: "Chloe Dumont", action: "completed order", target: "#ORD-9021", timestamp: "3 hours ago", icon: ShoppingCart },
];

const RECENT_USERS = [
    { id: "1", name: "Sarah Jenkins", email: "sarah@acme.com", plan: "Pro", joined: "Mar 7, 2026", status: "Active" },
    { id: "2", name: "Marcus Chen", email: "marcus@acme.com", plan: "Starter", joined: "Mar 7, 2026", status: "Active" },
    { id: "3", name: "Emily Watson", email: "emily@acme.com", plan: "Pro", joined: "Mar 6, 2026", status: "Active" },
    { id: "4", name: "James Thorne", email: "james@acme.com", plan: "Free", joined: "Mar 6, 2026", status: "Suspended" },
    { id: "5", name: "Lisa Wong", email: "lisa@acme.com", plan: "Business", joined: "Mar 5, 2026", status: "Active" },
    { id: "6", name: "Kevin Park", email: "kevin@acme.com", plan: "Starter", joined: "Mar 5, 2026", status: "Invited" },
    { id: "7", name: "Chloe Dumont", email: "chloe@acme.com", plan: "Pro", joined: "Mar 4, 2026", status: "Active" },
];

// ─── SVG Chart ────────────────────────────────────────────────────────────────

function AnalyticsChart() {
    const W = 600;
    const H = 160;
    const PAD = { top: 12, right: 12, bottom: 32, left: 44 };

    const values = CHART_DATA.map((d) => d.revenue);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.05;
    const range = max - min || 1;

    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const xStep = chartW / (CHART_DATA.length - 1);
    const toX = (i: number) => PAD.left + i * xStep;
    const toY = (v: number) => PAD.top + chartH - ((v - min) / range) * chartH;

    const points = CHART_DATA.map((d, i) => `${toX(i)},${toY(d.revenue)}`).join(" ");
    const fillPath =
        `M ${toX(0)},${toY(CHART_DATA[0].revenue)} ` +
        CHART_DATA.map((d, i) => `L ${toX(i)},${toY(d.revenue)}`).join(" ") +
        ` L ${toX(CHART_DATA.length - 1)},${H - PAD.bottom} L ${PAD.left},${H - PAD.bottom} Z`;

    const yTicks = [
        { value: `$${(min / 1000).toFixed(0)}k`, y: toY(min) },
        { value: `$${((min + max) / 2000).toFixed(1)}k`, y: toY((min + max) / 2) },
        { value: `$${(max / 1000).toFixed(0)}k`, y: toY(max) },
    ];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-label="Weekly revenue chart">
            <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
            </defs>
            {yTicks.map((t) => (
                <g key={t.value}>
                    <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y}
                        stroke="var(--color-border)" strokeDasharray="3 3" strokeWidth={0.75} strokeOpacity={0.6} />
                    <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize={10}
                        fill="var(--color-muted-foreground)" fontFamily="var(--font-sans)" opacity={0.7}>
                        {t.value}
                    </text>
                </g>
            ))}
            <path d={fillPath} fill="url(#ag)" />
            <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth={2}
                strokeLinejoin="round" strokeLinecap="round" />
            {CHART_DATA.map((d, i) => (
                <g key={d.day}>
                    <circle cx={toX(i)} cy={toY(d.revenue)} r={3.5} fill="var(--color-primary)"
                        stroke="var(--color-card)" strokeWidth={2} />
                    <text x={toX(i)} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={10}
                        fill="var(--color-muted-foreground)" fontFamily="var(--font-sans)" opacity={0.7}>
                        {d.day}
                    </text>
                </g>
            ))}
        </svg>
    );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span className={cn(
                "inline-block h-1.5 w-1.5 rounded-full shrink-0",
                status === "Active" && "bg-emerald-500",
                status === "Invited" && "bg-blue-400",
                status === "Suspended" && "bg-muted-foreground/40",
            )} />
            <span className={cn(
                "text-sm",
                status === "Active" && "text-foreground",
                status === "Invited" && "text-muted-foreground",
                status === "Suspended" && "text-muted-foreground/60",
            )}>
                {status}
            </span>
        </span>
    );
}

function PlanTag({ plan }: { plan: string }) {
    const styles: Record<string, string> = {
        Business: "text-purple-600 dark:text-purple-400",
        Pro: "text-amber-600 dark:text-amber-400",
        Starter: "text-sky-600 dark:text-sky-400",
        Free: "text-muted-foreground",
    };
    return (
        <span className={cn("text-sm font-medium", styles[plan] ?? "text-muted-foreground")}>
            {plan}
        </span>
    );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SectionCard({
    title,
    subtitle,
    action,
    children,
    className,
    noPadding,
}: {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}) {
    return (
        <div className={cn(
            "rounded-[var(--ios-radius-xl)] border border-border/60 bg-card shadow-sm overflow-hidden",
            className,
        )}>
            {(title || subtitle) && (
                <div className={cn(
                    "flex items-start justify-between",
                    noPadding ? "px-6 pt-5 pb-4" : "px-6 pt-5 pb-4",
                )}>
                    <div className="space-y-0.5">
                        {title && (
                            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                        )}
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
    return (
        <PageTransition className="space-y-8">

            {/* ── Page Header ── */}
            <PageHeader
                title="Dashboard"
                description="Here's what's happening in your workspace today."
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[var(--ios-radius-full)] gap-1.5 text-sm font-medium"
                    >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Export
                    </Button>
                }
            />

            {/* ── Stats ── */}
            <section aria-label="Stats overview">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {STATS.map((stat) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            trend={stat.trend}
                        />
                    ))}
                </div>
            </section>

            {/* ── Chart + Activity ── */}
            <section
                aria-label="Analytics and activity"
                className="grid grid-cols-1 gap-4 lg:grid-cols-3"
            >
                {/* Revenue chart — spans 2/3 */}
                <SectionCard
                    className="lg:col-span-2"
                    action={
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-semibold tracking-tighter text-foreground tabular-nums">$53,900</span>
                            <span className="text-xs text-emerald-500 font-semibold">+14.2%</span>
                        </div>
                    }
                    title="Revenue"
                    subtitle="Weekly · current week"
                >
                    <div className="px-4 pb-4 h-44">
                        <AnalyticsChart />
                    </div>
                </SectionCard>

                {/* Activity — spans 1/3 */}
                <SectionCard title="Activity" subtitle="Recent workspace events">
                    <div className="px-5 pb-5">
                        <ActivityFeed activities={RECENT_ACTIVITIES} />
                    </div>
                </SectionCard>
            </section>

            {/* ── Recent Users ── */}
            <section aria-label="Recent users">
                <SectionCard
                    title="Recent Users"
                    subtitle="Newly joined accounts"
                    noPadding
                    action={
                        <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs text-muted-foreground rounded-[var(--ios-radius-md)]">
                            View all →
                        </Button>
                    }
                >
                    {/* Table */}
                    <div className="border-t border-border/40">
                        {/* Header row */}
                        <div className="grid grid-cols-[1fr_100px_120px_100px_60px] px-6 py-2.5 border-b border-border/40">
                            {["User", "Plan", "Joined", "Status", ""].map((h) => (
                                <span key={h} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                                    {h}
                                </span>
                            ))}
                        </div>
                        {/* Data rows */}
                        {RECENT_USERS.map((user) => (
                            <div
                                key={user.id}
                                className="grid grid-cols-[1fr_100px_120px_100px_60px] px-6 py-3.5 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors group"
                            >
                                {/* User */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                                            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col leading-snug min-w-0">
                                        <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                    </div>
                                </div>
                                {/* Plan */}
                                <div className="flex items-center">
                                    <PlanTag plan={user.plan} />
                                </div>
                                {/* Joined */}
                                <div className="flex items-center">
                                    <span className="text-sm text-muted-foreground tabular-nums">{user.joined}</span>
                                </div>
                                {/* Status */}
                                <div className="flex items-center">
                                    <StatusDot status={user.status} />
                                </div>
                                {/* Action */}
                                <div className="flex items-center justify-end">
                                    <button className="text-xs text-muted-foreground/40 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                                        View →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </section>

        </PageTransition>
    );
}
