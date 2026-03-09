/**
 * @file lib/format.ts
 * Display formatting utilities for the AdminKit template.
 *
 * All functions are pure (no side-effects) and SSR-safe.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/format";
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Currency & Numbers ──────────────────────────────────────────────────────

/**
 * Formats a number as a currency string.
 * @example formatCurrency(84320)        // "$84,320.00"
 * @example formatCurrency(1234, "EUR")  // "€1,234.00"
 */
export function formatCurrency(
    value: number,
    currency: string = "USD",
    locale: string = "en-US"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Formats a large number with compact notation.
 * @example formatCompact(84320)  // "84.3K"
 * @example formatCompact(1e6)    // "1M"
 */
export function formatCompact(value: number, locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

/**
 * Formats a plain number with locale-aware thousands separators.
 * @example formatNumber(3842)  // "3,842"
 */
export function formatNumber(value: number, locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a decimal as a percentage string with optional sign.
 * @example formatPercent(12.5)   // "+12.5%"
 * @example formatPercent(-3.2)   // "-3.2%"
 * @example formatPercent(8, false) // "8.0%"
 */
export function formatPercent(value: number, showSign: boolean = true): string {
    const sign = showSign && value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
}

// ─── Dates & Time ─────────────────────────────────────────────────────────────

/**
 * Formats a date as a human-readable absolute string.
 * @example formatDate(new Date())            // "Mar 9, 2026"
 * @example formatDate(new Date(), "long")    // "March 9, 2026"
 * @example formatDate(new Date(), "numeric") // "3/9/2026"
 */
export function formatDate(
    date: Date | string,
    format: "short" | "long" | "numeric" = "short",
    locale: string = "en-US"
): string {
    const d = typeof date === "string" ? new Date(date) : date;

    const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
        short: { month: "short", day: "numeric", year: "numeric" },
        long: { month: "long", day: "numeric", year: "numeric" },
        numeric: { month: "numeric", day: "numeric", year: "numeric" },
    };
    const options = optionsMap[format];

    return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Returns a relative time string from the given date to now.
 * @example formatRelativeTime(new Date(Date.now() - 60_000))  // "1m ago"
 * @example formatRelativeTime(new Date(Date.now() - 3600_000)) // "1h ago"
 * @example formatRelativeTime(new Date(Date.now() - 30_000))  // "just now"
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 30) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return "yesterday";
    return formatDate(d, "short");
}

// ─── Strings ─────────────────────────────────────────────────────────────────

/**
 * Extracts initials from a full name (up to 2 characters).
 * @example getInitials("Sarah Jenkins")  // "SJ"
 * @example getInitials("Marcus")         // "M"
 */
export function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");
}

/**
 * Truncates a string to the given max length, appending "…".
 * @example truncate("A very long description", 20)  // "A very long descript…"
 */
export function truncate(str: string, max: number): string {
    if (str.length <= max) return str;
    return str.slice(0, max - 1) + "…";
}

/**
 * Converts a kebab-case or snake_case string to Title Case.
 * @example toTitleCase("user-settings")  // "User Settings"
 * @example toTitleCase("api_key")        // "Api Key"
 */
export function toTitleCase(str: string): string {
    return str
        .replace(/[-_]/g, " ")
        .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Generates a URL-safe slug from a string.
 * @example slugify("Hello World!")  // "hello-world"
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/**
 * Pluralises a word based on a count.
 * @example pluralize(1, "user")          // "1 user"
 * @example pluralize(5, "user")          // "5 users"
 * @example pluralize(5, "ox", "oxen")    // "5 oxen"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
    const pluralForm = plural ?? `${singular}s`;
    return `${formatNumber(count)} ${count === 1 ? singular : pluralForm}`;
}
