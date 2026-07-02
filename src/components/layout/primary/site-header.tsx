import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PlusIcon } from "@phosphor-icons/react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 md:border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 md:hidden" />
        <span className="text-base font-medium">Untuk Anda</span>
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
