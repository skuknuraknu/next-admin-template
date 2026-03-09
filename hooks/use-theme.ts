"use client";

/**
 * @file hooks/use-theme.ts
 *
 * `useTheme` — thin consumer hook for ThemeContext.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   const { resolvedTheme, toggleTheme, setTheme } = useTheme();
 *
 *   // Read current effective theme
 *   const isDark = resolvedTheme === "dark";
 *
 *   // Toggle between light ↔ dark
 *   <button onClick={toggleTheme}>Toggle</button>
 *
 *   // Set explicitly
 *   setTheme("system");
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Must be rendered inside <ThemeProvider>.
 */

export { useTheme } from "@/context/theme-context";
