"use client"

import { useRouterState } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { navMain } from "@/components/layout/primary/nav-data"

export function NavMobile() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const reduceMotion = useReducedMotion()
  const items = navMain.filter((item) => item.isShowNavMobile ?? false)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),var(--spacing)*3)] md:hidden">
      <nav
        aria-label="Navigasi utama"
        className="pointer-events-auto mx-auto max-w-md"
      >
        <ul className="flex h-(--bottom-nav-height) items-stretch rounded-full border border-border/50 bg-card/70 p-1 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-xl">
          {items.map((item) => {
            const active = pathname === item.url
            const Icon = item.icon
            return (
              <li key={item.url} className="flex-1">
                <a
                  href={item.url}
                  aria-current={active ? "page" : undefined}
                  className="relative flex h-full flex-col items-center justify-center gap-1 rounded-full text-muted-foreground transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-mobile-indicator"
                      initial={false}
                      className="absolute inset-0 rounded-full bg-foreground/10"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 320, damping: 30 }
                      }
                    />
                  )}
                  {Icon && (
                    <Icon
                      weight={active ? "fill" : "regular"}
                      className={cn(
                        "relative size-6 transition-colors",
                        active && "text-primary"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative text-[0.6875rem] leading-none transition-colors",
                      active && "font-medium text-foreground"
                    )}
                  >
                    {item.title}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
