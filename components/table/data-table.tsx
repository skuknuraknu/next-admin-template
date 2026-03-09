"use client";

/**
 * @file components/table/data-table.tsx
 *
 * DataTable — Production-ready TanStack Table v8 component.
 *
 * ─── MODES ───────────────────────────────────────────────────────────────────
 *
 *  CLIENT (default)
 *    All sorting, filtering, and pagination happen inside React memory.
 *    Great for up to ~5 000 rows (combine with `enableVirtualization` beyond that).
 *
 *  SERVER  (`serverSide={true}`)
 *    The table is a dumb view. The caller is responsible for fetching data and
 *    must pass `pageCount`, `onSortingChange`, `onFilteringChange`, and
 *    `onPaginationChange` to wire the callbacks.
 *
 * ─── QUICK START ─────────────────────────────────────────────────────────────
 *
 *   import { DataTable } from "@/components/table";
 *   import type { DataTableColumn } from "@/components/table";
 *
 *   const columns: DataTableColumn<User>[] = [
 *     {
 *       id: "name",
 *       accessorKey: "name",
 *       header: "Name",
 *       enableSorting: true,
 *     },
 *     {
 *       id: "status",
 *       accessorKey: "status",
 *       header: "Status",
 *       cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
 *       filterOptions: [
 *         { label: "Active",    value: "active" },
 *         { label: "Suspended", value: "suspended" },
 *       ],
 *     },
 *   ];
 *
 *   // Client mode (simple)
 *   <DataTable columns={columns} data={users} />
 *
 *   // Server mode
 *   <DataTable
 *     columns={columns}
 *     data={page}
 *     serverSide
 *     pageCount={totalPages}
 *     isLoading={isFetching}
 *     onSortingChange={setSorting}
 *     onFilteringChange={setFilters}
 *     onPaginationChange={setPagination}
 *   />
 *
 *   // Virtualized (for 10 000+ rows)
 *   <DataTable columns={columns} data={bigData} enableVirtualization />
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo } from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type OnChangeFn,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    ArrowUp, ArrowDown, ChevronsUpDown, AlertCircle,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { TableToolbar, type ToolbarFilterConfig } from "./table-toolbar";
import { TablePagination } from "./table-pagination";

// ─── Extended column definition ──────────────────────────────────────────────

/**
 * Extends TanStack's `ColumnDef` with DataTable-specific metadata:
 * - `filterOptions` — when set, the toolbar renders a dropdown filter for this column
 * - `enableHiding ` — default true; set false to lock the column always-visible
 */
export type DataTableColumn<TData> = ColumnDef<TData> & {
    /** Options for the column-level filter dropdown in the toolbar. */
    filterOptions?: Array<{ label: string; value: string }>;
    /** Whether the column can be hidden. Defaults to true. */
    enableHiding?: boolean;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableBaseProps<TData> {
    columns: DataTableColumn<TData>[];
    data: TData[];

    // ── Features (all default to false/undefined unless noted) ──
    /** Enable TanStack's built-in pagination (client-side). Default: true. */
    pagination?: boolean;
    /** Default page size. Default: 10. */
    defaultPageSize?: number;
    /** Enable client-side sorting. Default: true. */
    sorting?: boolean;
    /** Enable global search + per-column filter dropdowns. Default: true. */
    filtering?: boolean;
    /** Show a row-selection checkbox column. Default: false. */
    enableRowSelection?: boolean;
    /** Renders inside the bulk-actions bar when ≥1 rows are selected. */
    renderBulkActions?: (rows: TData[]) => React.ReactNode;
    /** Enable row virtualization for large datasets (10 k+ rows). Default: false. */
    enableVirtualization?: boolean;
    /** Estimated height of each row in pixels (for virtualizer). Default: 56. */
    estimatedRowHeight?: number;
    /** Placeholder text for the global search input. */
    searchPlaceholder?: string;
    /** Text label after the row count e.g. "users". Default: "results" */
    rowLabel?: string;
    /** Show loading skeleton rows. */
    isLoading?: boolean;
    /** Message shown when data is empty and not loading. */
    emptyMessage?: string;
    /** Show toolbar (search/filters/visibility). Default: true. */
    showToolbar?: boolean;
    /** Additional CSS class on the outer wrapper. */
    className?: string;
}

// ── Client-side mode ──────────────────────────────────────────────────────────
interface ClientModeProps {
    serverSide?: false;
    pageCount?: never;
    onSortingChange?: never;
    onFilteringChange?: never;
    onPaginationChange?: never;
}

// ── Server-side mode ──────────────────────────────────────────────────────────
interface ServerModeProps {
    serverSide: true;
    /** Total number of pages. Required in server mode. */
    pageCount: number;
    onSortingChange?: OnChangeFn<SortingState>;
    onFilteringChange?: OnChangeFn<ColumnFiltersState>;
    onPaginationChange?: OnChangeFn<PaginationState>;
}

export type DataTableProps<TData> = DataTableBaseProps<TData> &
    (ClientModeProps | ServerModeProps);

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent border-b border-border/40">
                    {Array.from({ length: cols }).map((_, j) => (
                        <TableCell key={j} className="py-4">
                            <Skeleton
                                className="h-4 rounded-full"
                                style={{ width: `${60 + ((i * 3 + j * 7) % 30)}%` }}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={999} className="h-40 text-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground/70">
                    <AlertCircle className="h-8 w-8 opacity-40" />
                    <p className="text-sm font-medium">{message}</p>
                </div>
            </TableCell>
        </TableRow>
    );
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
    if (sorted === "asc") return <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />;
    if (sorted === "desc") return <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />;
    return <ChevronsUpDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DataTable<TData>({
    columns: columnDefs,
    data,
    pagination = true,
    defaultPageSize = 10,
    sorting: enableSorting = true,
    filtering: enableFiltering = true,
    enableRowSelection = false,
    renderBulkActions,
    enableVirtualization = false,
    estimatedRowHeight = 56,
    searchPlaceholder = "Search...",
    rowLabel = "results",
    isLoading = false,
    emptyMessage = "No results found.",
    showToolbar = true,
    className,
    serverSide = false,
    pageCount: serverPageCount,
    onSortingChange,
    onFilteringChange,
    onPaginationChange,
}: DataTableProps<TData>) {

    // ── Controlled state (needed for server mode and for reading values) ──
    const [sortingState, setSortingState] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [paginationState, setPaginationState] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    // ── Column augmentation: prepend checkbox column if selection is enabled ──
    const augmentedColumns = useMemo<ColumnDef<TData>[]>(() => {
        const base: ColumnDef<TData>[] = columnDefs.map((col) => ({
            enableHiding: true,
            ...col,
        }));

        if (!enableRowSelection) return base;

        const selectionCol: ColumnDef<TData> = {
            id: "__select__",
            enableHiding: false,
            enableSorting: false,
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
                    aria-label="Select all"
                    className="translate-y-[1px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(val) => row.toggleSelected(!!val)}
                    aria-label="Select row"
                    className="translate-y-[1px]"
                    onClick={(e) => e.stopPropagation()}
                />
            ),
            size: 44,
        };

        return [selectionCol, ...base];
    }, [columnDefs, enableRowSelection]);

    // ── TanStack table instance ───────────────────────────────────────────────
    const table = useReactTable({
        data,
        columns: augmentedColumns,
        pageCount: serverSide ? serverPageCount : undefined,
        manualSorting: serverSide,
        manualFiltering: serverSide,
        manualPagination: serverSide,

        // Row models (only needed for client mode; TanStack ignores in manual mode)
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,

        // State
        state: {
            sorting: sortingState,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination: paginationState,
        },

        // Callbacks — server mode forwards to caller, client mode updates local state
        onSortingChange: serverSide && onSortingChange
            ? (updater) => {
                const next = typeof updater === "function" ? updater(sortingState) : updater;
                setSortingState(next);
                onSortingChange(next);
            }
            : setSortingState,

        onColumnFiltersChange: serverSide && onFilteringChange
            ? (updater) => {
                const next = typeof updater === "function" ? updater(columnFilters) : updater;
                setColumnFilters(next);
                onFilteringChange(next);
            }
            : setColumnFilters,

        onPaginationChange: serverSide && onPaginationChange
            ? (updater) => {
                const next = typeof updater === "function" ? updater(paginationState) : updater;
                setPaginationState(next);
                onPaginationChange(next);
            }
            : setPaginationState,

        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,

        enableRowSelection,
        enableMultiRowSelection: enableRowSelection,
        enableGlobalFilter: enableFiltering && !serverSide,
    });

    // ── Build toolbar filter configs from columns that have filterOptions ──
    const toolbarFilters = useMemo<ToolbarFilterConfig[]>(() => {
        return columnDefs
            .filter((col) => col.filterOptions && col.filterOptions.length > 0)
            .map((col) => ({
                columnId: (col as { id?: string; accessorKey?: string }).id
                    ?? (col as { accessorKey?: string }).accessorKey as string,
                placeholder: `All ${(col as { header?: string }).header ?? ""}`,
                options: col.filterOptions!,
            }));
    }, [columnDefs]);

    // ── Virtualizer (only active when enableVirtualization is true) ───────────
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const rows = table.getRowModel().rows;

    const virtualizer = useVirtualizer({
        count: enableVirtualization ? rows.length : 0,
        getScrollElement: () => (enableVirtualization ? scrollContainerRef.current : null),
        estimateSize: () => estimatedRowHeight,
        overscan: 10,
    });

    const virtualItems = enableVirtualization ? virtualizer.getVirtualItems() : null;
    const totalVirtualHeight = enableVirtualization ? virtualizer.getTotalSize() : 0;

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className={cn("flex flex-col gap-4", className)}>

            {/* ── Toolbar ── */}
            {showToolbar && (
                <TableToolbar
                    table={table}
                    filters={toolbarFilters}
                    isLoading={isLoading}
                    renderBulkActions={renderBulkActions}
                    searchPlaceholder={searchPlaceholder}
                    enableSearch={enableFiltering}
                />
            )}

            {/* ── Table wrapper — scroll container ── */}
            <div
                ref={scrollContainerRef}
                className={cn(
                    "rounded-[var(--ios-radius-lg)] border border-border bg-card shadow-sm overflow-hidden",
                    enableVirtualization && "overflow-auto",
                )}
            >
                <Table className="w-full">
                    {/* ── Sticky header ── */}
                    <TableHeader className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent border-b-0"
                            >
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                            className={cn(
                                                "py-3 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase whitespace-nowrap select-none group",
                                                canSort && "cursor-pointer hover:text-foreground transition-colors",
                                            )}
                                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center gap-1.5">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {canSort && (
                                                        <SortIcon
                                                            sorted={header.column.getIsSorted()}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    {/* ── Body ── */}
                    <TableBody>
                        {/* Loading skeleton */}
                        {isLoading ? (
                            <TableSkeleton
                                rows={paginationState.pageSize}
                                cols={augmentedColumns.length}
                            />
                        ) : rows.length === 0 ? (
                            <EmptyState message={emptyMessage} />
                        ) : enableVirtualization && virtualItems ? (
                            /* ── Virtualized rows ── */
                            <>
                                {/* Spacer above visible rows */}
                                {virtualItems[0]?.start > 0 && (
                                    <tr>
                                        <td style={{ height: virtualItems[0].start }} />
                                    </tr>
                                )}
                                {virtualItems.map((virtualRow) => {
                                    const row = rows[virtualRow.index];
                                    return (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() ? "selected" : undefined}
                                            className={cn(
                                                "border-b border-border/50 last:border-0 transition-colors",
                                                "hover:bg-muted/40",
                                                row.getIsSelected() && "bg-primary/5 hover:bg-primary/8",
                                            )}
                                            style={{ height: estimatedRowHeight }}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="px-4 py-3 text-sm text-foreground"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                                {/* Spacer below visible rows */}
                                {(() => {
                                    const last = virtualItems[virtualItems.length - 1];
                                    const remaining = last
                                        ? totalVirtualHeight - last.end
                                        : 0;
                                    return remaining > 0 ? (
                                        <tr>
                                            <td style={{ height: remaining }} />
                                        </tr>
                                    ) : null;
                                })()}
                            </>
                        ) : (
                            /* ── Normal (paginated) rows ── */
                            rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className={cn(
                                        "border-b border-border/50 last:border-0 transition-colors",
                                        "hover:bg-muted/40 cursor-default",
                                        row.getIsSelected() && "bg-primary/5 hover:bg-primary/8",
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-4 py-4 text-sm text-foreground"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Pagination footer ── */}
            {pagination && !enableVirtualization && (
                <TablePagination table={table} rowLabel={rowLabel} />
            )}
        </div>
    );
}
