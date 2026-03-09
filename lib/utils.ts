/**
 * @file lib/utils.ts
 * General-purpose utility helpers for the AdminKit template.
 *
 * Import from "@/lib/utils" or "@/lib" (via barrel).
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class strings, resolving conflicts intelligently.
 * @example cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a promise that resolves after `ms` milliseconds.
 * Useful for simulating async delays in mock data / storybook.
 * @example await sleep(500); // wait 500ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A no-op function — safe default for optional callback props.
 * @example onClose={onClose ?? noop}
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => { };
