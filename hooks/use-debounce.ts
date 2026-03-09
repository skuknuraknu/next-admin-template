"use client";

/**
 * @file hooks/use-debounce.ts
 *
 * `useDebounce<T>` — delays updating a value until `delay` ms have passed
 * since the last change. Prevents excessive re-renders and API calls on
 * rapidly-changing inputs like search fields.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   const [query, setQuery] = useState("");
 *   const debouncedQuery    = useDebounce(query, 400);
 *
 *   // Only fires after the user stops typing for 400ms
 *   useEffect(() => {
 *     if (debouncedQuery) fetchResults(debouncedQuery);
 *   }, [debouncedQuery]);
 *
 * ─── WITH CALLBACK FORM ──────────────────────────────────────────────────────
 *   const debouncedSearch = useDebouncedCallback((q: string) => {
 *     fetchResults(q);
 *   }, 400);
 *
 *   <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Debounces a value — returns the value only after `delay` ms of inactivity.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Returns a stable debounced callback. The callback will only execute after
 * `delay` ms of inactivity. Safe to pass to event handlers without useMemo.
 */
export function useDebouncedCallback<Args extends unknown[]>(
    fn: (...args: Args) => void,
    delay: number = 300
): (...args: Args) => void {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fnRef = useRef(fn);

    // Keep fnRef current so the callback always calls the latest version of fn.
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    return useCallback(
        (...args: Args) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => fnRef.current(...args), delay);
        },
        [delay]
    );
}
