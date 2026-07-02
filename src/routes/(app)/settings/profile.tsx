import { createFileRoute } from "@tanstack/react-router"

import { SettingsShell } from "@/components/settings/settings-shell"
import { ProfileSection } from "@/components/settings/sections/profile-section"

export const Route = createFileRoute("/(app)/settings/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsShell showBack>
      <ProfileSection />
    </SettingsShell>
  )
}
