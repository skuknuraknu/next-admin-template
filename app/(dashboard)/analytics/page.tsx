import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics",
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
                <p className="text-sm text-muted-foreground">
                    Detailed metrics on usage, traffic, and engagement trends.
                </p>
            </div>

            {/* Chart placeholders */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="h-4 w-32 rounded-md bg-muted animate-pulse mb-4" />
                        <div className="h-48 w-full rounded-xl bg-muted/40 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}
