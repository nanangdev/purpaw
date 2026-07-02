import { createFileRoute } from "@tanstack/react-router"

import { SettingsShell } from "@/components/settings/settings-shell"
import { AccountSection } from "@/components/settings/sections/account-section"

export const Route = createFileRoute("/(app)/settings/account")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsShell showBack>
      <AccountSection />
    </SettingsShell>
  )
}
