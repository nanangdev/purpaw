import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export default function MouseScrollIcon({ className }: { className?: string }) {
    const reduce = useReducedMotion();

    return (
        <div className={cn("fixed bottom-[30px] left-1/2 -translate-x-1/2 text-black flex flex-col items-center gap-1", className)}>
            <svg width="30" height="45" viewBox="0 0 24 36" fill="none">
                <rect x="2" y="2" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="2" />
                <motion.circle
                    cx="12"
                    r="2.5"
                    fill="currentColor"
                    animate={reduce ? { cy: 11 } : { cy: [10, 18, 10], opacity: [1, 0.3, 1] }}
                    transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>
            <div className="flex flex-col items-center">
                {[0, 1].map((i) => (
                    <motion.svg
                        key={i}
                        width="16"
                        height="8"
                        viewBox="0 0 16 8"
                        fill="none"
                        animate={reduce ? { opacity: 1 - i * 0.35 } : { opacity: [0, 1, 0], y: [0, 3, 6] }}
                        transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                    >
                        <path d="M2 2L8 6L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                ))}
            </div>
        </div>
    );
}
