"use client";

/**
 * @file hooks/use-local-storage.ts
 *
 * `useLocalStorage<T>` — typed, SSR-safe localStorage state.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
 *
 *   setTheme("dark");         // writes to localStorage + triggers re-render
 *   setTheme((prev) => ...);  // functional update form
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Notes:
 *  - Safely falls back to `initialValue` on SSR / when localStorage is absent.
 *  - Dispatches a custom `"local-storage"` window event so multiple components
 *    using the same key stay in sync within the same tab.
 */

import { useState, useEffect, useCallback } from "react";

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    // Read from localStorage lazily so SSR renders the initial value.
    const readStorage = useCallback((): T => {
        if (typeof window === "undefined") return initialValue;
        try {
            const raw = window.localStorage.getItem(key);
            return raw !== null ? (JSON.parse(raw) as T) : initialValue;
        } catch {
            return initialValue;
        }
    }, [key, initialValue]);

    const [storedValue, setStoredValue] = useState<T>(readStorage);

    // Hydrate on mount in case localStorage differs from the server-rendered value.
    useEffect(() => {
        setStoredValue(readStorage());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setValue: SetValue<T> = useCallback(
        (value) => {
            try {
                const next = value instanceof Function ? value(storedValue) : value;
                window.localStorage.setItem(key, JSON.stringify(next));
                setStoredValue(next);
                // Notify other hook instances using the same key.
                window.dispatchEvent(new Event("local-storage"));
            } catch (e) {
                console.warn(`useLocalStorage: could not write key "${key}":`, e);
            }
        },
        [key, storedValue]
    );

    // Keep in sync when another instance of the hook writes to the same key.
    useEffect(() => {
        const handleStorageEvent = () => setStoredValue(readStorage());
        window.addEventListener("local-storage", handleStorageEvent);
        window.addEventListener("storage", handleStorageEvent);
        return () => {
            window.removeEventListener("local-storage", handleStorageEvent);
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [readStorage]);

    return [storedValue, setValue];
}
