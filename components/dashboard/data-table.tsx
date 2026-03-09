/**
 * @file components/dashboard/data-table.tsx
 *
 * `DataTable` — A generic, iOS-styled table with typed column definitions.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { DataTable } from "@/components/dashboard";
 *
 *   type User = { id: string; name: string; email: string; status: string };
 *
 *   <DataTable<User>
 *     data={users}
 *     keyExtractor={(u) => u.id}
 *     columns={[
 *       { header: "Name",   accessorKey: "name" },
 *       { header: "Email",  accessorKey: "email" },
 *       {
 *         header: "Status",
 *         accessorKey: "status",
 *         cell: (u) => <Badge>{u.status}</Badge>,
 *       },
 *     ]}
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @tip For row-level actions, add a column with `cell: (item) => <button>Edit</button>`.
 */

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColumnDef<TData> {
    header: string;
    accessorKey: keyof TData;
    cell?: (item: TData) => React.ReactNode;
    className?: string; // e.g. "text-right"
}

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    keyExtractor: (item: TData) => string | number;
    className?: string;
    emptyMessage?: string;
}

export function DataTable<TData>({
    columns,
    data,
    keyExtractor,
    className,
    emptyMessage = "No results found.",
}: DataTableProps<TData>) {
    return (
        <div className={cn("rounded-[var(--ios-radius-lg)] border border-border bg-card shadow-sm overflow-hidden", className)}>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b-border/50">
                            {columns.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className={cn("text-xs font-semibold tracking-wider text-muted-foreground uppercase py-3 whitespace-nowrap", col.className)}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground/80 font-medium"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow
                                    key={keyExtractor(item)}
                                    className="transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted border-b-border/50 last:border-0 cursor-pointer"
                                >
                                    {columns.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={cn("py-4 text-sm font-medium text-foreground whitespace-nowrap", col.className)}
                                        >
                                            {col.cell ? col.cell(item) : (item[col.accessorKey] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
