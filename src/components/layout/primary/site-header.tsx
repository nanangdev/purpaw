"use client"

import { useRouterState } from "@tanstack/react-router"
import { PlusIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { navMain } from "@/components/layout/primary/nav-data"
import { cn } from "@/lib/utils"

export function SiteHeader({ className }: { className?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const matches = useRouterState({ select: (s) => s.matches })
  const titledMatch = matches.find((m) =>
    Boolean((m.loaderData as { title?: string } | undefined)?.title)
  )
  const root = "/" + (pathname.split("/").filter(Boolean)[0] ?? "")
  const title =
    (titledMatch?.loaderData as { title?: string } | undefined)?.title ??
    navMain.find((item) => item.url === root)?.title ??
    "Untuk Anda"

  return (
    <header className={cn("flex h-(--header-height) shrink-0 md:border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)", className)}>
      <div className="relative flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 md:hidden" />
        <span className="max-md:pointer-events-none max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 text-base font-medium">
          {title}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <PlusIcon />
            Buat kabar baru
          </Button>
        </div>
      </div>
    </header>
  )
}
