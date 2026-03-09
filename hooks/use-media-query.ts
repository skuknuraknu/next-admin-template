"use client";

/**
 * @file hooks/use-media-query.ts
 *
 * `useMediaQuery` — reactively tracks a CSS media query.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   const isMobile  = useMediaQuery("(max-width: 1023px)");
 *   const isDark    = useMediaQuery("(prefers-color-scheme: dark)");
 *   const isTablet  = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
 *
 *   // Use in a component
 *   useEffect(() => {
 *     if (isMobile) sidebar.close();
 *   }, [isMobile]);
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Notes:
 *  - Returns `false` on SSR (window is unavailable).
 *  - Cleans up the `MediaQueryList` listener on unmount.
 */

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mql = window.matchMedia(query);
        // Set initial value immediately after mount.
        setMatches(mql.matches);

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [query]);

    return matches;
}

// ─── Convenience variants ─────────────────────────────────────────────────────

/** `true` when the viewport is narrower than the `lg` breakpoint (< 1024px). */
export function useIsMobile(): boolean {
    return useMediaQuery("(max-width: 1023px)");
}

/** `true` when the viewport is between `md` and `lg` (768px – 1023px). */
export function useIsTablet(): boolean {
    return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

/** `true` when the OS/browser prefers the dark colour scheme. */
export function usePrefersDark(): boolean {
    return useMediaQuery("(prefers-color-scheme: dark)");
}
