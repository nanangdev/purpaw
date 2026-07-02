import { createFileRoute } from "@tanstack/react-router"

import { SettingsShell } from "@/components/settings/settings-shell"
import { AboutSection } from "@/components/settings/sections/about-section"

export const Route = createFileRoute("/(app)/settings/about")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsShell>
      <AboutSection />
    </SettingsShell>
  )
}
