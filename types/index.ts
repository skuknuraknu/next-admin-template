/**
 * @file types/index.ts
 * Global shared TypeScript types for the AdminKit template.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 * Import directly from `@/types`:
 *   import type { User, ApiResponse } from "@/types";
 *
 * ─── EXTENDING ───────────────────────────────────────────────────────────────
 * Add new types to this file as your SaaS product grows.
 * Group related types with a comment header (e.g. // ─── Billing ───).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── User & Auth ─────────────────────────────────────────────────────────────

/** Subscription tier available in the product. */
export type Plan = "free" | "starter" | "pro" | "business";

/** Access level of a user within a workspace. */
export type Role = "admin" | "editor" | "viewer";

/** Lifecycle status of a user account. */
export type UserStatus = "active" | "invited" | "suspended";

/** Core user entity used throughout the dashboard. */
export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    plan: Plan;
    /** Absolute URL or undefined (fall back to initials avatar). */
    avatarUrl?: string;
    /** ISO 8601 date string. */
    createdAt: string;
}

// ─── Metrics / Stats ─────────────────────────────────────────────────────────

/** A trend delta shown beneath a stat value. */
export interface TrendInfo {
    /** Numeric delta, e.g. 12.5 (meaning 12.5%). */
    value: number;
    /** Human label, e.g. "vs last month". */
    label: string;
    /** Determines green vs red colouring. */
    isPositive: boolean;
}

/** A single key metric displayed in a StatCard. */
export interface StatMetric {
    title: string;
    value: string | number;
    trend?: TrendInfo;
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

/** Severity / category of an activity event. */
export type ActivityType = "info" | "success" | "warning" | "error";

/** A single entry in the activity timeline. */
export interface ActivityEvent {
    id: string | number;
    /** Display name of the actor (user or "System"). */
    user: string;
    /** Verb phrase, e.g. "deployed a new version to". */
    action: string;
    /** Optional object of the action, e.g. "Production". */
    target?: string;
    /** Human-readable elapsed time, e.g. "3h ago". */
    timestamp: string;
    type?: ActivityType;
}

// ─── Data Tables ──────────────────────────────────────────────────────────────

/**
 * Column definition for `<DataTable>`.
 * @template TData - The row data shape.
 */
export interface TableColumn<TData> {
    header: string;
    accessorKey: keyof TData;
    /** Custom renderer. Receives the full row object. */
    cell?: (item: TData) => React.ReactNode;
    /** Extra Tailwind classes on the `<td>`, e.g. "text-right". */
    className?: string;
}

// ─── API / Data Fetching ──────────────────────────────────────────────────────

/**
 * Standard envelope for all API responses.
 * @template T - Shape of the success payload.
 */
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    /** HTTP status code. */
    status: number;
}

/**
 * Paginated list response.
 * @template T - Shape of each list item.
 */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    /** Total number of pages, derived: Math.ceil(total / perPage). */
    totalPages: number;
}

/** Shape returned by `useAsync`. */
export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

/** Re-export so consumers have a single import path. */
export type { NavItem, NavGroup } from "@/lib/constants";

// ─── UI Primitives ────────────────────────────────────────────────────────────

/** A key/value option for `<FilterDropdown>` and `<Select>`. */
export interface SelectOption {
    label: string;
    value: string;
}

/** Generic key/value record for forms and filters. */
export type FilterMap = Record<string, string | undefined>;
