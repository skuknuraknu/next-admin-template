"use client";

/**
 * @file components/table/table-toolbar.tsx
 *
 * TableToolbar — the control strip rendered above the DataTable.
 *
 * Sections (left → right):
 *  1. Global search (debounced 300 ms)
 *  2. Per-column filter dropdowns (opt-in per column via `filterOptions`)
 *  3. Column visibility toggle (DropdownMenu with checkboxes)
 *  4. Bulk-actions slot (appears when ≥1 row is selected)
 *
 * This component is internal to `/components/table`. Consumers should
 * not need to import it directly; DataTable renders it automatically.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table } from "@tanstack/react-table";
import {
    Search, SlidersHorizontal, Columns3, X, Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ColumnFilterOption {
    label: string;
    value: string;
}

export interface ToolbarFilterConfig {
    /** Must match the column's `id` or `accessorKey`. */
    columnId: string;
    placeholder: string;
    options: ColumnFilterOption[];
}

interface TableToolbarProps<TData> {
    table: Table<TData>;
    /** Column-level filter configs. Each adds a dropdown pill to the toolbar. */
    filters?: ToolbarFilterConfig[];
    /** Shown in place of the selection count when loading. */
    isLoading?: boolean;
    /** Renders inside the bulk-actions bar when rows are selected. */
    renderBulkActions?: (selectedRows: TData[]) => React.ReactNode;
    /** Placeholder for the global search input. */
    searchPlaceholder?: string;
    /** Either hide or show the global search box */
    enableSearch?: boolean;
}

// ─── Debounced search value ───────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TableToolbar<TData>({
    table,
    filters = [],
    isLoading = false,
    renderBulkActions,
    searchPlaceholder = "Search...",
    enableSearch = true,
}: TableToolbarProps<TData>) {
    const [rawSearch, setRawSearch] = useState(
        (table.getState().globalFilter as string) ?? "",
    );
    const debouncedSearch = useDebouncedValue(rawSearch, 300);

    // Sync debounced search → TanStack global filter
    const prevDebounced = useRef(debouncedSearch);
    useEffect(() => {
        if (debouncedSearch !== prevDebounced.current) {
            table.setGlobalFilter(debouncedSearch);
            prevDebounced.current = debouncedSearch;
        }
    }, [debouncedSearch, table]);

    const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((r) => r.original);
    const hasSelection = selectedRows.length > 0;

    const clearFilters = useCallback(() => {
        setRawSearch("");
        table.setGlobalFilter("");
        table.resetColumnFilters();
    }, [table]);

    const hasActiveFilters =
        rawSearch.length > 0 ||
        table.getState().columnFilters.length > 0;

    return (
        <div className="flex flex-col gap-3">
            {/* ── Main toolbar row ── */}
            <div className="flex flex-wrap items-center gap-2">

                {/* Global search */}
                {enableSearch && (
                    <div className="relative flex-1 min-w-[180px] max-w-xs group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
                        <Input
                            value={rawSearch}
                            onChange={(e) => setRawSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="pl-9 rounded-[var(--ios-radius-full)] bg-background/60 border-border focus-visible:ring-primary/20 h-9 text-sm"
                        />
                        {rawSearch.length > 0 && (
                            <button
                                onClick={() => {
                                    setRawSearch("");
                                    table.setGlobalFilter("");
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Per-column filter dropdowns */}
                {filters.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {filters.map((filter) => {
                            const col = table.getColumn(filter.columnId);
                            if (!col) return null;
                            const current = (col.getFilterValue() as string) ?? "";
                            return (
                                <Select
                                    key={filter.columnId}
                                    value={current || "__all__"}
                                    onValueChange={(val) =>
                                        col.setFilterValue(val === "__all__" ? undefined : val)
                                    }
                                >
                                    <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-[var(--ios-radius-full)] bg-background/60 border-border text-sm focus:ring-primary/20">
                                        <div className="flex items-center gap-1.5">
                                            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                            <SelectValue placeholder={filter.placeholder} />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-[var(--ios-radius-lg)] shadow-lg border-border/50">
                                        <SelectItem
                                            value="__all__"
                                            className="rounded-[var(--ios-radius-md)] cursor-pointer"
                                        >
                                            {filter.placeholder}
                                        </SelectItem>
                                        {filter.options.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                                className="rounded-[var(--ios-radius-md)] cursor-pointer"
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        })}
                    </div>
                )}

                {/* Clear filters pill */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9 px-3 text-muted-foreground hover:text-foreground rounded-[var(--ios-radius-full)] gap-1.5 text-sm"
                    >
                        <X className="h-3.5 w-3.5" />
                        Clear
                    </Button>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin ml-1" />
                )}

                {/* ── Right side — Column visibility ── */}
                <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2 rounded-[var(--ios-radius-full)] text-sm border-border bg-background/60 hover:bg-accent"
                            >
                                <Columns3 className="h-4 w-4 text-muted-foreground" />
                                <span className="hidden sm:inline text-muted-foreground">Columns</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-[var(--ios-radius-lg)] shadow-lg border-border/50"
                        >
                            <DropdownMenuLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                Toggle columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        className="rounded-[var(--ios-radius-md)] cursor-pointer capitalize"
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(val) => col.toggleVisibility(val)}
                                    >
                                        {col.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ── Bulk actions bar — slides in when rows are selected ── */}
            {hasSelection && renderBulkActions && (
                <div className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-[var(--ios-radius-lg)]",
                    "bg-primary/8 border border-primary/20",
                    "text-sm font-medium",
                )}>
                    <span className="text-primary font-semibold tabular-nums">
                        {selectedRows.length} selected
                    </span>
                    <div className="h-4 w-px bg-primary/20" />
                    <div className="flex items-center gap-2">
                        {renderBulkActions(selectedRows)}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-7 px-2 text-muted-foreground hover:text-foreground rounded-[var(--ios-radius-md)]"
                        onClick={() => table.resetRowSelection()}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
