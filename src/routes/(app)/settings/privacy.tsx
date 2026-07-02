import { createFileRoute } from "@tanstack/react-router"

import { SettingsShell } from "@/components/settings/settings-shell"
import { PrivacySection } from "@/components/settings/sections/privacy-section"

export const Route = createFileRoute("/(app)/settings/privacy")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsShell showBack>
      <PrivacySection />
    </SettingsShell>
  )
}
