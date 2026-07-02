"use client"

import * as React from "react"
import {
  CaretCircleDownIcon,
  DownloadSimpleIcon,
  FlagIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  SettingsCard,
  SettingsDescription,
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card"

function PrivacyDisclosure({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left text-sm font-medium">
        {title}
        <CaretCircleDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="px-4 pb-3.5 text-sm leading-snug text-foreground/80">
          {children}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

function PrivacySection() {
  // wired: preferensi kuki dari API
  const [analytics, setAnalytics] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)

  return (
    <div className="space-y-6">
      <h2 className="px-1 text-xl font-semibold tracking-tight md:sr-only">Privasi</h2>

      <SettingsSection title="Privasi">
        <SettingsCard>
          <SettingsDescription>
            Pelajari bagaimana informasi Anda dilindungi saat menggunakan produk
            Purpaw, dan kunjungi{" "}
            <a
              href="#"
              className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Pusat Privasi
            </a>{" "}
            dan{" "}
            <a
              href="#"
              className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Kebijakan Privasi
            </a>{" "}
            kami untuk detail lebih lanjut.
          </SettingsDescription>

          <PrivacyDisclosure title="Bagaimana kami melindungi data Anda">
            Data Anda dienkripsi saat transit dan saat disimpan. Akses dibatasi
            berdasarkan prinsip kebutuhan, dan kami melakukan audit keamanan
            secara berkala.
          </PrivacyDisclosure>

          <PrivacyDisclosure title="Bagaimana kami menggunakan data Anda">
            Kami menggunakan data untuk menyediakan, memelihara, dan
            meningkatkan fitur Purpaw, serta untuk menjaga keamanan akun Anda.
          </PrivacyDisclosure>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Preferensi">
        <SettingsCard>
          <SettingsRow
            label="Kuki analitik"
            description="Bantu kami memahami cara Anda menggunakan situs termasuk fiturnya."
          >
            <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Kuki analitik" />
          </SettingsRow>
          <SettingsRow
            label="Kuki pemasaran"
            description="Digunakan untuk menampilkan iklan atau konten yang lebih relevan."
          >
            <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Kuki pemasaran" />
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Data Anda">
        <SettingsCard>
          <SettingsRow
            label="Ekspor data"
            description="Unduh salinan data yang kami simpan tentang akun Anda."
          >
            <Button type="button" variant="outline" size="lg">
              <DownloadSimpleIcon />
              Ekspor
            </Button>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Laporkan">
        <SettingsCard>
          <SettingsRow
            label="Laporkan penyalahgunaan atau konten ilegal"
            description="Kami meninjau laporan dalam 24 jam atau kurang."
          >
            <Button type="button" variant="outline" size="lg">
              <FlagIcon />
              Laporkan
            </Button>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>
    </div>
  )
}

export { PrivacySection }
