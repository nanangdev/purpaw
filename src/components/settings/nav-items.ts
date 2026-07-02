import type { Icon } from "@phosphor-icons/react"
import {
  GearIcon,
  UserCircleIcon,
  UserCircleGearIcon,
  ShieldChevronIcon,
  InfoIcon,
} from "@phosphor-icons/react"

export type SettingsNavPath =
  | "/settings/general"
  | "/settings/profile"
  | "/settings/account"
  | "/settings/privacy"
  | "/settings/about"

export type SettingsNavItem = {
  label: string
  to: SettingsNavPath
  icon: Icon
  description?: string
}

export const settingsNavItems: SettingsNavItem[] = [
  {
    label: "Umum",
    to: "/settings/general",
    icon: GearIcon,
    description: "Tema, bahasa, dan panduan",
  },
  {
    label: "Profil",
    to: "/settings/profile",
    icon: UserCircleIcon,
    description: "Avatar, nama, dan notifikasi",
  },
  {
    label: "Akun",
    to: "/settings/account",
    icon: UserCircleGearIcon,
    description: "Sesi, keamanan, dan hapus akun",
  },
  {
    label: "Privasi",
    to: "/settings/privacy",
    icon: ShieldChevronIcon,
    description: "Data, kuki, dan pelaporan",
  },
  {
    label: "Tentang",
    to: "/settings/about",
    icon: InfoIcon,
    description: "Dukungan, laporan, dan versi",
  },
]
