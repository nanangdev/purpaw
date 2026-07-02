"use client"

import * as React from "react"

import { NavMain } from "@/components/layout/primary/nav-main"
import { navMain } from "@/components/layout/primary/nav-data"
import { NavUser } from "@/components/layout/primary/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Paw } from "@/components/glymph/paw"

const data = {
  user: {
    name: "cemeng",
    username: "username",
    email: "m@contoh.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="group-data-[collapsible=icon]:gap-0.5">
          <SidebarMenuItem className="flex flex-row items-center justify-between">
            <SidebarMenuButton
              asChild
              className="group-data-[collapsible=icon]:hidden data-[slot=sidebar-menu-button]:p-1.5! data-[slot=sidebar-menu-button]:px-3! flex flex-row items-center gap-1"
            >
              <a href="/">
                <Paw variant="filled" className="size-6.5!" />
                <span className="text-3xl font-bold pr-2">Purpaw</span>
              </a>
            </SidebarMenuButton>

            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger />
              </TooltipTrigger>
              <TooltipContent side="right" align="center" hidden={isMobile}>
                {state === "collapsed" ? "Buka panel samping" : "Tutup panel samping"}
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sr-only md:not-sr-only">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
