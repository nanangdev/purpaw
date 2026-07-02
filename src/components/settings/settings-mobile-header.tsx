"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { CaretLeftIcon } from "@phosphor-icons/react"

import { settingsNavItems } from "./nav-items"

/**
 * Header mobile untuk halaman section `/settings/*`.
 * Menggantikan SiteHeader app di mobile (lihat `(app)/route.tsx`).
 * Desktop (`md:`) tidak merendernya.
 */
export function SettingsMobileHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const current = settingsNavItems.find((item) => item.to === pathname)
  const title = current?.label ?? "Pengaturan"

  return (
    <header className="sticky top-0 z-100 flex h-(--header-height) shrink-0 items-center gap-1 bg-background px-2 md:hidden">
      <Link
        to="/settings"
        aria-label="Kembali ke Pengaturan"
        className="inline-flex size-9 items-center justify-center rounded-md text-blue-500 transition-colors hover:text-primary/80"
      >
        <CaretLeftIcon className="size-6 rtl:rotate-180" />
      </Link>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-medium">{title}</span>
    </header>
  )
}
