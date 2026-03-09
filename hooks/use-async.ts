"use client";

/**
 * @file hooks/use-async.ts
 *
 * `useAsync<T>` — runs an async function and tracks its loading / error / data
 * state. Designed to be the one-line bridge between mock data and real API
 * calls once you are ready to wire up a backend.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   // With a static async function
 *   const { data, loading, error } = useAsync(() => fetchUsers(), []);
 *
 *   // With a dependency (re-fetches when `userId` changes)
 *   const { data: user } = useAsync(() => fetchUser(userId), [userId]);
 *
 *   // Manual trigger (execute returns a promise you can await)
 *   const { data, loading, execute } = useAsync(submitForm, { immediate: false });
 *   <button onClick={execute}>Submit</button>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { AsyncState } from "@/types";

interface UseAsyncOptions {
    /**
     * If false, the async function is NOT called on mount — you call `execute()`
     * manually instead. Useful for form submissions or triggered actions.
     * @default true
     */
    immediate?: boolean;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
    /** Re-run the async function (or run it for the first time if `immediate: false`). */
    execute: () => Promise<void>;
    /** Reset state back to the initial idle state. */
    reset: () => void;
}

const INITIAL_STATE = { data: null, loading: false, error: null } as const;

export function useAsync<T>(
    asyncFn: () => Promise<T>,
    deps: React.DependencyList = [],
    options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
    const { immediate = true } = options;
    const [state, setState] = useState<AsyncState<T>>(INITIAL_STATE);

    // Track mounted status to prevent setState on unmounted components.
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const execute = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const result = await asyncFn();
            if (isMounted.current) setState({ data: result, loading: false, error: null });
        } catch (err) {
            if (isMounted.current) {
                setState({
                    data: null,
                    loading: false,
                    error: err instanceof Error ? err : new Error(String(err)),
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        if (immediate) execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [execute]);

    const reset = useCallback(() => setState({ ...INITIAL_STATE }), []);

    return { ...state, execute, reset };
}
