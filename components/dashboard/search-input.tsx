/**
 * @file components/dashboard/search-input.tsx
 *
 * `SearchInput` — Pill-shaped search field with a leading search icon.
 *
 * ─── USAGE ───────────────────────────────────────────────────────────────────
 *   import { SearchInput } from "@/components/dashboard";
 *   import { useDebounce } from "@/hooks";
 *
 *   // Basic — callback fires on every keystroke:
 *   <SearchInput onSearch={(q) => setQuery(q)} placeholder="Search users..." />
 *
 *   // Debounced — only fires 400ms after the user stops typing:
 *   const [raw, setRaw] = useState("");
 *   const query = useDebounce(raw, 400);
 *   <SearchInput onSearch={setRaw} placeholder="Search users..." />
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Extra classes on the wrapper `<div>`. */
    containerClassName?: string;
    /** Called with the raw string value on every change. Pair with `useDebounce` for API calls. */
    onSearch?: (value: string) => void;
}

export function SearchInput({
    className,
    containerClassName,
    onChange,
    onSearch,
    ...props
}: SearchInputProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e);
        if (onSearch) onSearch(e.target.value);
    };

    return (
        <div className={cn("relative w-full max-w-sm group", containerClassName)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
                placeholder="Search..."
                className={cn(
                    "w-full pl-9 bg-background focus-visible:bg-background focus-visible:ring-primary/20 transition-all rounded-[var(--ios-radius-full)] border border-border shadow-sm",
                    className
                )}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
}
