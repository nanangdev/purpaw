"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { SettingsNavColumn, SettingsNavTabs } from "./settings-nav"

/**
 * Kerangka konten pengaturan:
 * - xl+: kolom nav kiri (sticky) + konten kanan (Claude-style)
 * - md–lg: tab horizontal (Embla) di atas konten
 * - < md: hanya konten (+ tombol kembali opsional)
 *
 * `showBack` menampilkan tombol kembali ke /settings (hanya mobile), dipakai
 * oleh halaman section; index tidak menggunakannya.
 */
function SettingsShell({
  showBack = false,
  children,
  className,
}: {
  showBack?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 py-4 md:py-6", className)}>
      <div className="grid grid-cols-1 gap-6 xlgap-8 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
        <h1 className="sr-only">Pengaturan</h1>
        <aside className="hidden xl:block">
          <div className="sticky top-6">
            <SettingsNavColumn />
          </div>
        </aside>

        <div className="mx-auto min-w-0 w-full max-w-3xl space-y-6">
          {showBack && (
            <Link
              to="/settings"
              className="-mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground md:hidden"
            >
              <ArrowLeftIcon className="size-4 rtl:rotate-180" />
              Pengaturan
            </Link>
          )}

          <div className="hidden md:block xl:hidden">
            <SettingsNavTabs />
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export { SettingsShell }
