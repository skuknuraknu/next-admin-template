/**
 * @/components/dashboard — barrel export
 *
 * Dashboard-specific compound components live here.
 * As components are created, re-export them from this file so
 * all consumers can import from a single path:
 *
 *   import { SomeDashboardComponent } from "@/components/dashboard"
 *
 * Example (uncomment once files exist):
 *   export { Sidebar }    from "./sidebar";
 *   export { Topbar }     from "./topbar";
 *   export { StatCard }   from "./stat-card";
 *   export { NavItem }    from "./nav-item";
 */

export { Sidebar } from "./sidebar";
export { Topbar } from "./topbar";
export { PageHeader } from "./page-header";
export { StatCard } from "./stat-card";
export { ActivityFeed } from "./activity-feed";
export { DataTable } from "./data-table";
export { SearchInput } from "./search-input";
export { FilterDropdown } from "./filter-dropdown";
export { SettingsForm } from "./settings-form";
export { PageTransition } from "./page-transition";
export { ThemeToggle } from "./theme-toggle";
