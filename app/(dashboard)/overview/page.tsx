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
} from "lucide-react";
import { PageHeader, StatCard, ActivityFeed, DataTable, PageTransition } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

// Weekly revenue data for the sparkline chart (Sun → Sat)
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
    {
        id: 1,
        user: "Sarah Jenkins",
        action: "deployed a new release to",
        target: "Production",
        timestamp: "4m ago",
        icon: RefreshCw,
        iconBgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
    },
    {
        id: 2,
        user: "Marcus Chen",
        action: "invited 3 users to",
        target: "Workspace Alpha",
        timestamp: "28m ago",
        icon: UserPlus,
        iconBgColor: "bg-purple-500/10",
        iconColor: "text-purple-500",
    },
    {
        id: 3,
        user: "System",
        action: "completed nightly database backup",
        timestamp: "1h ago",
        icon: Shield,
        iconBgColor: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
    },
    {
        id: 4,
        user: "Emily Watson",
        action: "raised a new alert on",
        target: "API Gateway",
        timestamp: "2h ago",
        icon: Bell,
        iconBgColor: "bg-amber-500/10",
        iconColor: "text-amber-500",
    },
    {
        id: 5,
        user: "Chloe Dumont",
        action: "completed order",
        target: "#ORD-9021",
        timestamp: "3h ago",
        icon: ShoppingCart,
        iconBgColor: "bg-rose-500/10",
        iconColor: "text-rose-500",
    },
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

// ─── Inline SVG Sparkline Chart ───────────────────────────────────────────────

function AnalyticsChart() {
    const W = 600;
    const H = 180;
    const PAD = { top: 20, right: 20, bottom: 36, left: 52 };

    const values = CHART_DATA.map((d) => d.revenue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const xStep = chartW / (CHART_DATA.length - 1);
    const toX = (i: number) => PAD.left + i * xStep;
    const toY = (v: number) => PAD.top + chartH - ((v - min) / range) * chartH;

    // Build SVG polyline points
    const points = CHART_DATA.map((d, i) => `${toX(i)},${toY(d.revenue)}`).join(" ");

    // Build the closed fill path (area under the curve)
    const fillPath =
        `M ${toX(0)},${toY(CHART_DATA[0].revenue)} ` +
        CHART_DATA.map((d, i) => `L ${toX(i)},${toY(d.revenue)}`).join(" ") +
        ` L ${toX(CHART_DATA.length - 1)},${H - PAD.bottom} L ${PAD.left},${H - PAD.bottom} Z`;

    // Y-axis guide values (3 levels)
    const yTicks = [min, (min + max) / 2, max].map((v) => ({
        value: `$${(v / 1000).toFixed(1)}k`,
        y: toY(v),
    }));

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
            aria-label="Weekly revenue analytics chart"
        >
            <defs>
                {/* The gradient fill under the line */}
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {yTicks.map((t) => (
                <g key={t.value}>
                    <line
                        x1={PAD.left}
                        y1={t.y}
                        x2={W - PAD.right}
                        y2={t.y}
                        stroke="var(--color-border)"
                        strokeDasharray="4 4"
                        strokeWidth={1}
                    />
                    <text
                        x={PAD.left - 8}
                        y={t.y + 4}
                        textAnchor="end"
                        fontSize={11}
                        fill="var(--color-muted-foreground)"
                        fontFamily="var(--font-sans)"
                    >
                        {t.value}
                    </text>
                </g>
            ))}

            {/* Area fill */}
            <path d={fillPath} fill="url(#area-gradient)" />

            {/* The main sparkline */}
            <polyline
                points={points}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* X-axis labels + data dots */}
            {CHART_DATA.map((d, i) => (
                <g key={d.day}>
                    {/* Dot */}
                    <circle
                        cx={toX(i)}
                        cy={toY(d.revenue)}
                        r={4}
                        fill="var(--color-primary)"
                        stroke="var(--color-card)"
                        strokeWidth={2}
                    />
                    {/* Day label */}
                    <text
                        x={toX(i)}
                        y={H - PAD.bottom + 20}
                        textAnchor="middle"
                        fontSize={11}
                        fill="var(--color-muted-foreground)"
                        fontFamily="var(--font-sans)"
                    >
                        {d.day}
                    </text>
                </g>
            ))}
        </svg>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Active: "bg-emerald-500/10 text-emerald-600",
        Invited: "bg-blue-500/10 text-blue-600",
        Suspended: "bg-muted text-muted-foreground",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.Suspended
                }`}
        >
            {status}
        </span>
    );
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
    const styles: Record<string, string> = {
        Business: "bg-purple-500/10 text-purple-600",
        Pro: "bg-amber-500/10 text-amber-600",
        Starter: "bg-sky-500/10 text-sky-600",
        Free: "bg-muted text-muted-foreground",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[plan] ?? styles.Free
                }`}
        >
            {plan}
        </span>
    );
}

// ─── Section Card Wrapper ─────────────────────────────────────────────────────
// A lightweight iOS-widget-style card wrapper used throughout the page

function Card({
    title,
    subtitle,
    children,
    className = "",
}: {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-[var(--ios-radius-xl)] border border-border bg-card shadow-sm overflow-hidden ${className}`}
        >
            {(title || subtitle) && (
                <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                    <div>
                        {title && (
                            <h2 className="text-base font-semibold tracking-tight text-foreground">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                        )}
                    </div>
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
                description="Good morning — here's what's happening with your workspace today."
                actions={
                    <Button className="rounded-[var(--ios-radius-full)] shadow-sm font-medium px-5">
                        Download Report
                    </Button>
                }
            />

            {/* ── Section 1: Stats Overview ── 4-column widget row */}
            <section aria-label="Stats overview" className="space-y-0">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

            {/* ── Section 2: Analytics Chart + Recent Activity ── 3-column grid */}
            <section
                aria-label="Analytics and activity"
                className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >

                {/* Analytics Chart — spans 2 columns on large screens */}
                <Card
                    title="Revenue Analytics"
                    subtitle="Weekly revenue · current week"
                    className="lg:col-span-2"
                >
                    {/* Chart Summary Row */}
                    <div className="px-6 pb-2 flex items-end gap-6 border-b border-border/50">
                        <div>
                            <p className="text-3xl font-bold tracking-tighter text-foreground">
                                $53,900
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">Total this week</p>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1 text-emerald-500 text-sm font-semibold">
                            <TrendingUp className="h-4 w-4" />
                            +14.2% vs last week
                        </div>
                    </div>

                    {/* SVG Chart Area */}
                    <div className="px-4 py-5">
                        <AnalyticsChart />
                    </div>
                </Card>

                {/* Recent Activity Feed — spans 1 column */}
                <Card title="Recent Activity" subtitle="Latest events across your workspace">
                    <div className="px-6 pb-6">
                        <ActivityFeed activities={RECENT_ACTIVITIES} />
                    </div>
                </Card>
            </section>

            {/* ── Section 3: Recent Users Table ── full width */}
            <section aria-label="Recent users">
                <Card title="Recent Users" subtitle="Newly registered accounts" className="card-hover">
                    <DataTable
                        data={RECENT_USERS}
                        keyExtractor={(u) => u.id}
                        className="border-0 shadow-none rounded-none"
                        columns={[
                            {
                                header: "User",
                                accessorKey: "name",
                                cell: (user) => (
                                    <div className="flex items-center gap-3 py-1">
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                {user.name
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-medium text-foreground text-sm">
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                header: "Plan",
                                accessorKey: "plan",
                                cell: (user) => <PlanBadge plan={user.plan} />,
                            },
                            {
                                header: "Joined",
                                accessorKey: "joined",
                                className: "text-muted-foreground",
                            },
                            {
                                header: "Status",
                                accessorKey: "status",
                                cell: (user) => <StatusBadge status={user.status} />,
                            },
                            {
                                header: "",
                                accessorKey: "id",
                                cell: () => (
                                    <button className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors font-medium pr-2">
                                        View →
                                    </button>
                                ),
                                className: "text-right",
                            },
                        ]}
                    />
                </Card>
            </section>

        </PageTransition>
    );
}
