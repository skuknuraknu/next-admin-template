"use client";

/**
 * PageTransition
 * ─────────────────────────────────────────────────────────────────────────────
 * Wrap any page in this to get a staggered entrance animation where each
 * direct child fades in and slides up with a 60 ms delay between each.
 *
 * Usage:
 *   <PageTransition>
 *     <section>...</section>
 *     <section>...</section>
 *   </PageTransition>
 */

import React from "react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const childVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.28,
            ease: "easeOut",
        },
    },
};

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {React.Children.map(children, (child, i) =>
                child ? (
                    <motion.div key={i} variants={childVariants}>
                        {child}
                    </motion.div>
                ) : null
            )}
        </motion.div>
    );
}
