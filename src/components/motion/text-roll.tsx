"use client";

import { motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

const STAGGER = 0.035;

export const TextRoll: React.FC<{
    children: string;
    className?: string;
    center?: boolean;
    accessible?: boolean;
}> = ({ children, className, center = false, accessible = true }) => {
    return (
        <motion.span
            initial="initial"
            whileHover="hovered"
            className={cn("relative block overflow-hidden", className)}
            style={{
                lineHeight: 1,
            }}
            aria-label={accessible ? children : undefined}
        >
            {accessible && <span className="sr-only">{children}</span>}
            <div aria-hidden={accessible ? true : undefined}>
                {children.split("").map((l, i) => {
                    const delay = center
                        ? STAGGER * Math.abs(i - (children.length - 1) / 2)
                        : STAGGER * i;

                    return (
                        <motion.span
                            variants={{
                                initial: {
                                    y: 0,
                                },
                                hovered: {
                                    y: "-100%",
                                },
                            }}
                            transition={{
                                ease: "easeInOut",
                                delay,
                            }}
                            className="inline-block"
                            key={i}
                        >
                            {l}
                        </motion.span>
                    );
                })}
            </div>
            <div className="absolute inset-0" aria-hidden={accessible ? true : undefined}>
                {children.split("").map((l, i) => {
                    const delay = center
                        ? STAGGER * Math.abs(i - (children.length - 1) / 2)
                        : STAGGER * i;

                    return (
                        <motion.span
                            variants={{
                                initial: {
                                    y: "100%",
                                },
                                hovered: {
                                    y: 0,
                                },
                            }}
                            transition={{
                                ease: "easeInOut",
                                delay,
                            }}
                            className="inline-block"
                            key={i}
                        >
                            {l}
                        </motion.span>
                    );
                })}
            </div>
        </motion.span>
    );
};
