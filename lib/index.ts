/**
 * @file lib/index.ts
 * Barrel — import utilities from "@/lib" without specifying the sub-module.
 *
 * @example import { cn, formatCurrency, sleep } from "@/lib";
 */

export * from "./utils";
export * from "./format";
export { APP_NAME, APP_DESCRIPTION, APP_VERSION, NAV_GROUPS } from "./constants";
export type { NavItem, NavGroup } from "./constants";
