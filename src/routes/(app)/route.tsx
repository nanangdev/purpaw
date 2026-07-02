import { AppSidebar } from "@/components/layout/primary/app-sidebar"
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
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main className="flex flex-1 flex-col">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}