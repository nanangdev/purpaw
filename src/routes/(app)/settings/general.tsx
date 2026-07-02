import { createFileRoute } from "@tanstack/react-router"

import { SettingsShell } from "@/components/settings/settings-shell"
import { GeneralSection } from "@/components/settings/sections/general-section"

export const Route = createFileRoute("/(app)/settings/general")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsShell showBack>
      <GeneralSection />
    </SettingsShell>
  )
}
