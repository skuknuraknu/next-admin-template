/**
 * @file components/table/index.ts
 * Barrel export for the Table module.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { DataTable } from "@/components/table";
 *   import type { DataTableColumn, DataTableProps } from "@/components/table";
 * ─────────────────────────────────────────────────────────────────────────────
 */

export { DataTable } from "./data-table";
export type { DataTableColumn, DataTableProps } from "./data-table";

export { TableToolbar } from "./table-toolbar";
export type { ToolbarFilterConfig, ColumnFilterOption } from "./table-toolbar";

export { TablePagination } from "./table-pagination";
