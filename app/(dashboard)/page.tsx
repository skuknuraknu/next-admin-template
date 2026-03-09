import { redirect } from "next/navigation";

/**
 * Root route inside the dashboard group.
 * Redirects to /overview — the canonical dashboard home.
 */
export default function DashboardRootPage() {
    redirect("/overview");
}
