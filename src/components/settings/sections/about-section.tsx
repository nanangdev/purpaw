"use client"

import type { Icon } from "@phosphor-icons/react"
import {
  ArrowSquareOutIcon,
  BugIcon,
  LifebuoyIcon,
  ScrollIcon,
} from "@phosphor-icons/react"

import {
  SettingsCard,
  SettingsRow,
} from "@/components/settings/settings-card"

// wired: baca versi aplikasi dari build/package
const APP_VERSION = "1.0.0"

function AboutLinkRow({
  href,
  icon: Icon,
  title,
  description,
  external = false,
}: {
  href: string
  icon: Icon
  title: string
  description?: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-between gap-8 px-4 py-3.5 transition-colors hover:bg-accent/50"
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-medium leading-tight">
          <Icon className="size-5 text-muted-foreground" />
          {title}
        </div>
        {description ? (
          <p className="text-sm leading-snug text-foreground/80">{description}</p>
        ) : null}
      </div>
      <ArrowSquareOutIcon className="size-5 shrink-0 text-foreground/80" />
    </a>
  )
}

function AboutSection() {
  return (
    <div className="space-y-6">
      <h2 className="px-1 text-xl font-semibold tracking-tight md:sr-only">Tentang</h2>

      <SettingsCard>
        <AboutLinkRow
          href="#"
          external
          icon={LifebuoyIcon}
          title="Hubungi dukungan"
          description="Pertanyaan, bantuan akun, permintaan fitur, atau lainnya. Kami biasanya membalas dalam 2 hari kerja."
        />
        <AboutLinkRow
          href="#"
          external
          icon={BugIcon}
          title="Laporkan bug"
          description="Bantu kami berkembang dengan mengirim laporan bug atau kerentanan keamanan."
        />
        <AboutLinkRow
          href="#"
          external
          icon={ScrollIcon}
          title="Lisensi"
        />
        <SettingsRow label="Versi">
          <span className="text-sm tabular-nums text-foreground/80">
            {APP_VERSION}
          </span>
        </SettingsRow>
      </SettingsCard>
    </div>
  )
}

export { AboutSection }
