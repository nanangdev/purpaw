"use client"

import type { ComponentPropsWithoutRef, CSSProperties } from "react"
import { motion, useReducedMotion } from "motion/react"
import type { Transition, Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface SpinningTextProps extends ComponentPropsWithoutRef<"div"> {
    children: string | string[]
    duration?: number
    reverse?: boolean
    radius?: number
    transition?: Transition
    variants?: {
        container?: Variants
        item?: Variants
    }
}

const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    ease: "linear",
}

const BASE_ITEM_VARIANTS: Variants = {
    hidden: {
        opacity: 1,
    },
    visible: {
        opacity: 1,
    },
}

export function SpinningText({
    children,
    duration = 10,
    reverse = false,
    radius = 5,
    transition,
    variants,
    className,
    style,
}: SpinningTextProps) {
    const reduce = useReducedMotion()
    if (typeof children !== "string" && !Array.isArray(children)) {
        throw new Error("children must be a string or an array of strings")
    }

    if (Array.isArray(children)) {
        // Validate all elements are strings
        if (!children.every((child) => typeof child === "string")) {
            throw new Error("all elements in children array must be strings")
        }
        children = children.join("")
    }

    const letters = children.split("")
    letters.push(" ")

    const finalTransition: Transition = reduce
        ? { duration: 0 }
        : {
              ...BASE_TRANSITION,
              ...transition,
              duration: (transition as { duration?: number } | undefined)?.duration ?? duration,
          }

    const containerVariants: Variants = reduce
        ? { visible: { rotate: 0 }, ...variants?.container }
        : { visible: { rotate: reverse ? -360 : 360 }, ...variants?.container }

    const itemVariants: Variants = {
        ...BASE_ITEM_VARIANTS,
        ...variants?.item,
    }

    return (
        <motion.div
            className={cn("relative flex items-center justify-center flex-none select-none", className)}
            style={{
                width: `calc(${radius} * 2ch)`,
                height: `calc(${radius} * 2ch)`,
                ...style,
            }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            transition={finalTransition}
        >
            {letters.map((letter, index) => (
                <motion.span
                    aria-hidden="true"
                    key={`${index}-${letter}`}
                    variants={itemVariants}
                    className="absolute top-1/2 left-1/2 inline-block"
                    style={
                        {
                            "--index": index,
                            "--total": letters.length,
                            "--radius": radius,
                            transform: `
                  translate(-50%, -50%)
                  rotate(calc(360deg / var(--total) * var(--index)))
                  translateY(calc(var(--radius, 5) * -1ch))
                `,
                            transformOrigin: "center",
                        } as CSSProperties
                    }
                >
                    {letter}
                </motion.span>
            ))}
            <span className="sr-only">{children}</span>
        </motion.div>
    )
}
