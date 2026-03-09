/**
 * Dashboard Shell Layout
 * ─────────────────────────────────────────────────────────────
 * This is the persistent layout for all protected dashboard routes.
 * It will eventually contain:
 *   - <Sidebar />   — left navigation panel
 *   - <Topbar />    — top navigation bar with breadcrumbs / user menu
 *   - <main>        — scrollable content area
 *
 * The actual sidebar and topbar components will be composed in a
 * later step. For now, the layout provides the correct structural
 * skeleton so all child pages render inside the right grid.
 */

import { Sidebar, Topbar } from "@/components/dashboard";

/**
 * Dashboard Shell Layout
 * ─────────────────────────────────────────────────────────────
 * The persistent layout for all protected dashboard routes.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* ── Sidebar slot ── */}
            <Sidebar />

            {/* ── Main area ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Topbar slot */}
                <Topbar />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
