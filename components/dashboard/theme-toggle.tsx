"use client";

/**
 * @file components/dashboard/theme-toggle.tsx
 *
 * ThemeToggle — animated Sun ↔ Moon button for the Topbar.
 *
 * Micro-interactions:
 *  • Icons swap with a rotate + scale animation via Framer Motion AnimatePresence
 *  • Button matches the Topbar ghost/icon style exactly
 *  • Accessible: aria-label updates to reflect the action ("Switch to dark mode")
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const iconVariants = {
    initial: { opacity: 0, rotate: -90, scale: 0.6 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0.6 },
};

const transition = { duration: 0.22, ease: "easeInOut" } as const;

export function ThemeToggle() {
    const { resolvedTheme, toggleTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="relative rounded-[var(--ios-radius-full)] text-muted-foreground hover:text-foreground hover:bg-accent overflow-hidden"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.span
                        key="sun"
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                        className="absolute flex items-center justify-center"
                    >
                        <Sun size={20} strokeWidth={2} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="moon"
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                        className="absolute flex items-center justify-center"
                    >
                        <Moon size={20} strokeWidth={2} />
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
}
