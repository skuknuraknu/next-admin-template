"use client";

/**
 * @file hooks/use-sidebar.ts
 *
 * `useSidebar` — manages the sidebar open/collapsed state, persisted to
 * localStorage so the user's preference survives page reloads.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   const { isOpen, toggle, open, close } = useSidebar();
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

const STORAGE_KEY = "admin-sidebar-open";

interface UseSidebarReturn {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}

export function useSidebar(): UseSidebarReturn {
    const [isOpen, setIsOpen] = useLocalStorage<boolean>(STORAGE_KEY, true);

    const toggle = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);
    const open = useCallback(() => setIsOpen(true), [setIsOpen]);
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);

    return { isOpen, toggle, open, close };
}
