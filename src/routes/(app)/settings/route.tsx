"use client"

import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"

import { SettingsMobileHeader } from "@/components/settings/settings-mobile-header"

export const Route = createFileRoute("/(app)/settings")({
  component: SettingsLayout,
  loader: () => ({ title: "Pengaturan" }),
})

function SettingsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isIndex = pathname === "/settings" || pathname === "/settings/"

  return (
    <>
      {!isIndex && <SettingsMobileHeader />}
      <Outlet />
    </>
  )
}
