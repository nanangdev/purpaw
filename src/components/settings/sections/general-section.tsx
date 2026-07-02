"use client"

import * as React from "react"
import { ArrowClockwiseIcon, CheckIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"
import {
  SettingsCard,
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card"
import {
  defaultLanguage,
  languages,
} from "@/components/settings/languages"

// Dummy preview (akan diganti aset sungguhan). placehold.co sementara.
const THEME_PREVIEWS = {
  light: "https://placehold.co/600x450/ededee/1c1c1e?text=Terang&font=montserrat",
  auto: "https://placehold.co/600x450/71717a/ffffff?text=Otomatis&font=montserrat",
  dark: "https://placehold.co/600x450/1c1c1e/ededee?text=Gelap&font=montserrat",
} as const

function ThemeCard({
  label,
  preview,
  active,
  onSelect,
}: {
  label: string
  preview: string
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="group flex flex-col items-center gap-2.5 text-center"
    >
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-md md:rounded-xl ring-1 transition-all",
          active
            ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
            : "ring-border group-hover:ring-foreground/25"
        )}
      >
        <img
          src={preview}
          alt={`${label} theme preview`}
          className="size-full object-cover"
          loading="lazy"
        />
        {active && (
          <span className="absolute inset-e-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon className="size-3" weight="bold" />
          </span>
        )}
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          active ? "text-foreground" : "text-foreground/80"
        )}
      >
        {label}
      </span>
    </button>
  )
}

function GeneralSection() {
  const { theme, setTheme } = useTheme()
  // wired: bahasa aplikasi dari preferensi user / Intlayer
  const [language, setLanguage] = React.useState(defaultLanguage)

  return (
    <div className="space-y-6">
      <h2 className="px-1 text-xl font-semibold tracking-tight md:sr-only">Umum</h2>

      <SettingsSection title="Preferensi">
        <SettingsCard>
          <SettingsRow fullWidthControl className="flex flex-col w-full items-start" label="Tema" description="Sesuaikan tampilan dengan tema terang, gelap, atau mengikuti sistem.">
            <div className="grid w-full grid-cols-3 gap-4">
              <ThemeCard label="Terang" preview={THEME_PREVIEWS.light} active={theme === "light"} onSelect={() => setTheme("light")} />
              <ThemeCard label="Otomatis" preview={THEME_PREVIEWS.auto} active={theme === "auto"} onSelect={() => setTheme("auto")} />
              <ThemeCard label="Gelap" preview={THEME_PREVIEWS.dark} active={theme === "dark"} onSelect={() => setTheme("dark")} />
            </div>
          </SettingsRow>

          <SettingsRow fullWidthControl className="flex flex-col md:flex-row w-full items-start md:items-center md:justify-between" label="Bahasa aplikasi" description="Bahasa yang digunakan di seluruh antarmuka Purpaw.">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger size="default" aria-label="Bahasa aplikasi" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Panduan">
        <SettingsCard>
          <SettingsRow
            label="Mulai ulang tur"
            description="Pelajari kembali cara kerja aplikasi dengan panduan interaktif langsung pada aplikasi."
          >
            <Button type="button" variant="outline" size="lg">
              <ArrowClockwiseIcon />
              Mulai
            </Button>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>
    </div>
  )
}

export { GeneralSection }
