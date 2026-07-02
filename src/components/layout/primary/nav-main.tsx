"use client"

import { useRouterState } from "@tanstack/react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/components/layout/primary/nav-data"

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const { isMobile } = useSidebar()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items
            .filter((item) =>
              isMobile ? item.isShowSidebarMobile ?? false : item.isShowSidebar ?? true
            )
            .map((item) => {
              const active = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    aria-label={item.title}
                    isActive={active}
                    className="min-h-10 min-w-10 group-data-[collapsible=icon]:justify-center"
                  >
                    {item.icon && (
                      <item.icon
                        className="size-5.5!"
                        weight={active ? "fill" : "regular"}
                      />
                    )}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
