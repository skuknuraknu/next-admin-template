/**
 * @file hooks/index.ts
 * Barrel file — re-exports all hooks for clean single-path imports.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { useSidebar, useDebounce, useAsync } from "@/hooks";
 * ─────────────────────────────────────────────────────────────────────────────
 */

export { useSidebar } from "./use-sidebar";
export { useLocalStorage } from "./use-local-storage";
export { useMediaQuery, useIsMobile, useIsTablet, usePrefersDark } from "./use-media-query";
export { useDebounce, useDebouncedCallback } from "./use-debounce";
export { useAsync } from "./use-async";
