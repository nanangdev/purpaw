"use client"

import { useRouterState } from "@tanstack/react-router"

import type { SettingsNavPath } from "./nav-items"

/**
 * Pathname saat ini (terbaru) dari router.
 */
export function useActivePath(): string {
  return useRouterState({ select: (s) => s.location.pathname })
}

/**
 * Apakah item nav tertentu sedang aktif berdasarkan pathname.
 * `/settings` (index) diperlakukan sebagai bagian dari "Umum" (/settings/general).
 */
export function useIsActive(): (to: SettingsNavPath) => boolean {
  const pathname = useActivePath()
  return (to) =>
    pathname === to || (to === "/settings/general" && pathname === "/settings")
}
