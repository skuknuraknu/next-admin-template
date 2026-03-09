"use client";

/**
 * @file components/table/table-pagination.tsx
 *
 * TablePagination — footer row for the DataTable.
 *
 * Renders:
 *  - Total rows count  (left)
 *  - Page-size selector  (center-left)
 *  - Page info "Page X of Y"  (center-right)
 *  - Prev / Next / First / Last navigation  (right)
 */

import React from "react";
import { Table } from "@tanstack/react-table";
import {
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TablePaginationProps<TData> {
    table: Table<TData>;
    /** Text label before the total count, e.g. "results". */
    rowLabel?: string;
    pageSizeOptions?: number[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TablePagination<TData>({
    table,
    rowLabel = "results",
    pageSizeOptions = [10, 25, 50, 100],
}: TablePaginationProps<TData>) {
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = table.getFilteredRowModel().rows.length;
    // For server-side, TanStack exposes pageCount via options.pageCount
    const pageCount = table.getPageCount();

    const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">

            {/* ── Left: row range label ── */}
            <p className="text-sm text-muted-foreground tabular-nums shrink-0">
                {totalRows === 0 ? (
                    <span>No {rowLabel}</span>
                ) : (
                    <>
                        <span className="font-medium text-foreground">{from}–{to}</span>
                        {" "}of{" "}
                        <span className="font-medium text-foreground">{totalRows}</span>
                        {" "}{rowLabel}
                    </>
                )}
            </p>

            {/* ── Right: page size + navigation ── */}
            <div className="flex items-center gap-3 ml-auto">

                {/* Page size selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Rows</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(val) => table.setPageSize(Number(val))}
                    >
                        <SelectTrigger className="h-8 w-16 rounded-[var(--ios-radius-md)] text-sm border-border bg-background/60 focus:ring-primary/20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            side="top"
                            className="rounded-[var(--ios-radius-lg)] shadow-lg border-border/50 min-w-[4rem]"
                        >
                            {pageSizeOptions.map((size) => (
                                <SelectItem
                                    key={size}
                                    value={String(size)}
                                    className="rounded-[var(--ios-radius-md)] cursor-pointer"
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Page info */}
                <span className="text-sm text-muted-foreground tabular-nums hidden md:inline">
                    Page{" "}
                    <span className="font-medium text-foreground">{pageIndex + 1}</span>
                    {" "}of{" "}
                    <span className="font-medium text-foreground">{pageCount || 1}</span>
                </span>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-[var(--ios-radius-md)] border-border bg-background/60 hover:bg-accent disabled:opacity-40"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                        <span className="sr-only">First page</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-[var(--ios-radius-md)] border-border bg-background/60 hover:bg-accent disabled:opacity-40"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-[var(--ios-radius-md)] border-border bg-background/60 hover:bg-accent disabled:opacity-40"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-[var(--ios-radius-md)] border-border bg-background/60 hover:bg-accent disabled:opacity-40"
                        onClick={() => table.setPageIndex(pageCount - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                        <span className="sr-only">Last page</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
