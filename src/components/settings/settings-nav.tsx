"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Link } from "@tanstack/react-router"
import { CaretRightIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { settingsNavItems, type SettingsNavPath } from "./nav-items"
import { useIsActive } from "./use-active-path"

function useActiveIndex() {
  const isActive = useIsActive()
  return React.useMemo(
    () =>
      settingsNavItems.findIndex((item) => isActive(item.to)),
    [isActive]
  )
}

/* -------------------------------------------------------------------------- */
/* xl: kolom kiri (Claude-style)                                              */
/* -------------------------------------------------------------------------- */

function SettingsNavColumn({ className }: { className?: string }) {
  const isActive = useIsActive()

  return (
    <nav aria-label="Navigasi pengaturan" className={cn("flex flex-col gap-1", className)}>
      {settingsNavItems.map((item) => {
        const active = isActive(item.to)
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-2xl px-3 text-base font-normal transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground"
            )}
          >
            <Icon weight={active ? "fill" : "regular"} className="size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/* md–lg: tab horizontal (Embla)                                              */
/* -------------------------------------------------------------------------- */

function SettingsNavTabs({ className }: { className?: string }) {
  const isActive = useIsActive()
  const activeIndex = useActiveIndex()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  })

  React.useEffect(() => {
    if (emblaApi && activeIndex >= 0) {
      emblaApi.scrollTo(activeIndex, true)
    }
  }, [emblaApi, activeIndex])

  return (
    <div className={cn("overflow-hidden", className)} ref={emblaRef}>
      <div className="flex gap-1.5">
        {settingsNavItems.map((item) => {
          const active = isActive(item.to)
          const Icon = item.icon
          return (
            <Link key={item.to} to={item.to} className="shrink-0">
              <span
                className={cn(
                  "flex h-11 items-center gap-2 rounded-2xl px-3 text-base font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon weight={active ? "fill" : "regular"} className="size-5" />
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* mobile: daftar (pakai di halaman /settings)                                */
/* -------------------------------------------------------------------------- */

const mobileNavGroups: SettingsNavPath[][] = [
  ["/settings/general"],
  ["/settings/profile", "/settings/account"],
  ["/settings/privacy"],
  ["/settings/about"],
]

function SettingsNavMobile({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {mobileNavGroups.map((group) => (
        <div
          key={group[0]}
          className="divide-y divide-border overflow-hidden rounded-3xl border border-border/60 bg-card"
        >
          {group.map((to) => {
            const item = settingsNavItems.find((it) => it.to === to)
            if (!item) return null
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon weight="regular" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-tight">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </span>
                <CaretRightIcon className="size-4 text-muted-foreground rtl:rotate-180" />
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export { SettingsNavColumn, SettingsNavTabs, SettingsNavMobile }
