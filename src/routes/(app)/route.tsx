"use client"

import { AppSidebar } from "@/components/layout/primary/app-sidebar"
import { NavMobile } from "@/components/layout/primary/nav-mobile"
import { SiteHeader } from "@/components/layout/primary/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"

export const Route = createFileRoute("/(app)")({
    component: AppLayout,
})

function AppLayout() {
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const isSettings = pathname.startsWith("/settings")
    const isSettingsSub = pathname.startsWith("/settings/")

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                    "--bottom-nav-height": "calc(var(--spacing) * 15)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader className={cn(isSettingsSub && "max-md:hidden")} />
                <main
                    className={cn(
                        "flex flex-1 flex-col md:pb-0",
                        !isSettings &&
                        "pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+var(--spacing)*6)]"
                    )}
                >
                    <Outlet />
                </main>
                {!isSettings && <NavMobile />}
            </SidebarInset>
        </SidebarProvider>
    )
}
