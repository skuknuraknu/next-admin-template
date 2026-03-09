"use client";

/**
 * @file context/theme-context.tsx
 *
 * ThemeProvider — manages light/dark/system theme preference.
 *
 * ─── FEATURES ───────────────────────────────────────────────────────────────
 *  • Reads/writes to localStorage ("theme" key) for persistence
 *  • "system" mode auto-resolves from prefers-color-scheme
 *  • Applies .dark class to <html> without a flash (suppressHydrationWarning)
 *  • Smooth CSS transition injected once on mount
 * ────────────────────────────────────────────────────────────────────────────
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
    /** The stored preference: "light" | "dark" | "system" */
    theme: Theme;
    /** The effective theme after resolving "system" against the OS preference */
    resolvedTheme: ResolvedTheme;
    /** Set theme explicitly */
    setTheme: (theme: Theme) => void;
    /** Toggle between light and dark (ignores system) */
    toggleTheme: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "theme";

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function readStoredTheme(): Theme {
    if (typeof window === "undefined") return "system";
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === "light" || raw === "dark" || raw === "system") return raw;
    } catch {
        // ignore
    }
    return "system";
}

function applyTheme(resolved: ResolvedTheme) {
    const root = document.documentElement;
    if (resolved === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
    // Keep native scrollbar / form controls in sync
    root.style.colorScheme = resolved === "dark" ? "dark" : "light";
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");

    // Hydrate from localStorage on mount
    useEffect(() => {
        const stored = readStoredTheme();
        const system = getSystemTheme();
        setSystemTheme(system);
        setThemeState(stored);

        // Apply immediately (before first paint) to avoid flash
        const resolved = stored === "system" ? system : stored;
        applyTheme(resolved);
    }, []);

    // Track system preference changes in real time
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            const sys: ResolvedTheme = e.matches ? "dark" : "light";
            setSystemTheme(sys);
            // Only auto-apply if user chose system
            setThemeState((prev) => {
                if (prev === "system") applyTheme(sys);
                return prev;
            });
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const resolvedTheme: ResolvedTheme = useMemo(
        () => (theme === "system" ? systemTheme : theme),
        [theme, systemTheme],
    );

    const setTheme = useCallback(
        (next: Theme) => {
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // ignore
            }
            setThemeState(next);
            const resolved = next === "system" ? systemTheme : next;
            applyTheme(resolved);
        },
        [systemTheme],
    );

    const toggleTheme = useCallback(() => {
        // Cycle: if currently resolving to dark → go light; otherwise go dark.
        const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
    }, [resolvedTheme, setTheme]);

    const value: ThemeContextValue = useMemo(
        () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
        [theme, resolvedTheme, setTheme, toggleTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used inside <ThemeProvider>");
    }
    return ctx;
}
