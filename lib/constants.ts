import {
  LayoutDashboard,
  BarChart2,
  Users,
  Settings,
  Bell,
  FileText,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── App metadata ────────────────────────────────────────────
export const APP_NAME = "AdminKit";
export const APP_DESCRIPTION = "Modern SaaS Admin Dashboard";
export const APP_VERSION = "1.0.0";

// ─── Navigation ──────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** If true, an exact path match is required to show as active */
  exact?: boolean;
  /** Optional badge count (e.g. notifications) */
  badge?: number;
}

export interface NavGroup {
  title?: string; // undefined = no group header, items render ungrouped
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        label: "Overview",
        href: "/overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: Users,
      },
      {
        label: "Reports",
        href: "/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: 3,
      },
      {
        label: "Permissions",
        href: "/permissions",
        icon: ShieldCheck,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

// ─── Layout constants ────────────────────────────────────────
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 72;
export const TOPBAR_HEIGHT = 64;
