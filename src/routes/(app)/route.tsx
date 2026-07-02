import { AppSidebar } from "@/components/layout/primary/app-sidebar"
import { NavMobile } from "@/components/layout/primary/nav-mobile"
import { SiteHeader } from "@/components/layout/primary/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(app)")({
    component: AppLayout,
})

function AppLayout() {
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
                <SiteHeader />
                <main className="flex flex-1 flex-col pb-[calc(var(--bottom-nav-height)_+_env(safe-area-inset-bottom)_+_var(--spacing)*6)] md:pb-0">
                    <Outlet />
                </main>
                <NavMobile />
            </SidebarInset>
        </SidebarProvider>
    )
}