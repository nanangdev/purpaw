import { createFileRoute } from "@tanstack/react-router"

import { SettingsNavMobile } from "@/components/settings/settings-nav"
import { SettingsShell } from "@/components/settings/settings-shell"
import { GeneralSection } from "@/components/settings/sections/general-section"

export const Route = createFileRoute("/(app)/settings/")({
    component: SettingsPage,
})

function SettingsPage() {
    return (
        <>
            {/* mobile: daftar section */}
            <div className="md:hidden">
                <div className="mx-auto w-full max-w-5xl px-4 py-6">
                    <h1 className="mb-3 px-1 text-xl font-semibold tracking-tight">
                        Pengaturan
                    </h1>
                    <SettingsNavMobile />
                </div>
            </div>

            {/* desktop: shell dengan konten Umum */}
            <div className="hidden md:block">
                <SettingsShell>
                    <GeneralSection />
                </SettingsShell>
            </div>
        </>
    )
}
