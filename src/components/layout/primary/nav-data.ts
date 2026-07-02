import type { Icon } from "@phosphor-icons/react"
import {
  HouseSimpleIcon,
  FirstAidKitIcon,
  CompassIcon,
  WalletIcon,
  UsersIcon,
} from "@phosphor-icons/react"

export type NavItem = {
  title: string
  url: string
  icon?: Icon
  isShowSidebar?: boolean
  isShowSidebarMobile?: boolean
  isShowNavMobile?: boolean
}

export const navMain: NavItem[] = [
  {
    title: "Beranda",
    url: "/",
    icon: HouseSimpleIcon,
    isShowSidebar: true,
    isShowSidebarMobile: false,
    isShowNavMobile: true,
  },
  {
    title: "Kesehatan",
    url: "/health",
    icon: FirstAidKitIcon,
    isShowSidebar: true,
    isShowSidebarMobile: false,
    isShowNavMobile: true,
  },
  {
    title: "Peta",
    url: "/map",
    icon: CompassIcon,
    isShowSidebar: true,
    isShowSidebarMobile: false,
    isShowNavMobile: true,
  },
  {
    title: "Keuangan",
    url: "/money",
    icon: WalletIcon,
    isShowSidebar: true,
    isShowSidebarMobile: false,
    isShowNavMobile: true,
  },
  {
    title: "Komunitas",
    url: "/community",
    icon: UsersIcon,
    isShowSidebar: true,
    isShowSidebarMobile: false,
    isShowNavMobile: true,
  },
]
