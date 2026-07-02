"use client"

import * as React from "react"
import {
  ArrowSquareOutIcon,
  BoneIcon,
  CaretUpDownIcon,
  GearIcon,
  GlobeIcon,
  InfoIcon,
  SignOutIcon,
} from "@phosphor-icons/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  languages,
  defaultLanguage,
} from "@/components/settings/languages"

export function NavUser({
  user,
}: {
  user: {
    name: string
    username: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [language, setLanguage] = React.useState(defaultLanguage)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-9 w-9 rounded-full grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full">CM</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.username}
                </span>
              </div>
              <CaretUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-left text-sm">
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href="/settings">
                  <GearIcon />
                  Pengaturan
                </a>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <GlobeIcon />
                  Bahasa
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={12} align="end" className="rounded-xl">
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    {languages.map((lang) => (
                      <DropdownMenuRadioItem key={lang.value} value={lang.value} className="capitalize [&_svg]:text-primary dark:[&_svg]:text-blue-400 gap-8!">
                        {lang.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <InfoIcon />
                  Pelajari lebih lanjut
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={12} align="end" className="rounded-xl">
                  <DropdownMenuItem className="gap-8" asChild>
                    <a href="/about" target="_blank" rel="noopener noreferrer">
                      Tentang Purpaw
                      <ArrowSquareOutIcon className="ml-auto" />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-8" asChild>
                    <a href="/legal/aup" target="_blank" rel="noopener noreferrer">
                      Kebijakan penggunaan
                      <ArrowSquareOutIcon className="ml-auto" />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-8" asChild>
                    <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">
                      Kebijakan privasi
                      <ArrowSquareOutIcon className="ml-auto" />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings/privacy">
                      Pilihan privasi Anda
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-8">
                    Aktifkan mode tour
                    <BoneIcon className="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <SignOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
