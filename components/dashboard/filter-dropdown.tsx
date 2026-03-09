/**
 * @file components/dashboard/filter-dropdown.tsx
 *
 * `FilterDropdown` — A pill-shaped select used for filtering list data.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { FilterDropdown } from "@/components/dashboard";
 *
 *   const [status, setStatus] = useState<string>();
 *
 *   <FilterDropdown
 *     placeholder="All Statuses"
 *     value={status}
 *     onValueChange={setStatus}
 *     options={[
 *       { label: "Active",    value: "active" },
 *       { label: "Invited",   value: "invited" },
 *       { label: "Suspended", value: "suspended" },
 *     ]}
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/** A single option in the dropdown list. */
export interface FilterOption {
    /** Display label shown to the user. */
    label: string;
    /** Internal value passed to `onValueChange`. */
    value: string;
}

interface FilterDropdownProps {
    options: FilterOption[];
    /** Currently selected value (controlled). */
    value?: string;
    /** Called when the user selects a new option. */
    onValueChange?: (value: string) => void;
    /** Placeholder shown when no value is selected. */
    placeholder?: string;
}

export function FilterDropdown({
    options,
    value,
    onValueChange,
    placeholder = "Filter by...",
}: FilterDropdownProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[180px] bg-card rounded-[var(--ios-radius-full)] border-border border shadow-sm transition-shadow hover:shadow-md focus:ring-primary/20 bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="rounded-[var(--ios-radius-lg)] shadow-lg border-border/50">
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        className="rounded-[var(--ios-radius-md)] cursor-pointer"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
