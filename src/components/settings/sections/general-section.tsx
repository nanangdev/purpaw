"use client"

import * as React from "react"
import {
  ArrowClockwiseIcon,
  CircleHalfIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useTheme, type Theme } from "@/components/theme/theme-provider"
import {
  SettingsCard,
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card"
import {
  defaultLanguage,
  languages,
} from "@/components/settings/languages"

function GeneralSection() {
  const { theme, setTheme } = useTheme()
  // wired: bahasa aplikasi dari preferensi user / Intlayer
  const [language, setLanguage] = React.useState(defaultLanguage)

  return (
    <div className="space-y-6">
      <h2 className="px-1 text-xl font-semibold tracking-tight md:sr-only">Umum</h2>

      <SettingsSection title="Preferensi">
        <SettingsCard>
          <SettingsRow className="flex flex-col w-full items-start" label="Tema" description="Sesuaikan tampilan dengan tema terang, gelap, atau mengikuti sistem.">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={theme}
              onValueChange={(value) => {
                if (value) setTheme(value as Theme)
              }}
            >
              <ToggleGroupItem value="light">
                <SunIcon />
                <span className="hidden sm:inline">Terang</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="auto">
                <CircleHalfIcon />
                <span className="hidden sm:inline">Otomatis</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="dark">
                <MoonIcon />
                <span className="hidden sm:inline">Gelap</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </SettingsRow>

          <SettingsRow className="flex flex-col md:flex-row w-full items-start md:items-center md:justify-between" label="Bahasa aplikasi" description="Bahasa yang digunakan di seluruh antarmuka Purpaw.">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger size="default" aria-label="Bahasa aplikasi">
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
