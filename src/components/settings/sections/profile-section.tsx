"use client"

import * as React from "react"

import { ActivityIndicator } from "@/components/glymph/activity-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  SettingsCard,
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card"
import { AvatarUploader } from "@/components/settings/avatar-uploader"

// 3–20 karakter: huruf, angka, atau garis bawah. "@" dilarang.
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

function ProfileSection() {
  // wired: ganti dengan data profil user dari API
  const [fullName, setFullName] = React.useState("")
  const [nickname, setNickname] = React.useState("")
  const [notifyChangelog, setNotifyChangelog] = React.useState(true)
  const [notifyReminder, setNotifyReminder] = React.useState(true)
  // wired: username dari API
  const [username, setUsername] = React.useState("")
  const isUsernameValid = USERNAME_PATTERN.test(username)
  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    // larang menambah ulang "@" dan karakter lain di luar pola
    setUsername(event.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
  }

  // baseline nilai tersimpan untuk mendeteksi perubahan (dirty) pada 3 input
  const [savedValues, setSavedValues] = React.useState({
    username: "",
    fullName: "",
    nickname: "",
  })
  const [saving, setSaving] = React.useState(false)
  const isProfileDirty =
    username !== savedValues.username ||
    fullName !== savedValues.fullName ||
    nickname !== savedValues.nickname

  async function handleSaveProfile() {
    try {
      setSaving(true)
      // wired: panggil API simpan profil (username, nama lengkap, nama panggilan)
      setSavedValues({ username, fullName, nickname })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="px-1 text-xl font-semibold tracking-tight md:sr-only">Profil</h2>

      <SettingsSection title="Profil">
        <SettingsCard>
          <SettingsRow
            className="flex flex-col w-full items-start gap-1.5 md:flex-row md:items-center md:justify-between"
            label="Foto profil"
            description="Unggah, ubah, atau hapus foto profil Anda."
          >
            <AvatarUploader initialSrc="/avatars/shadcn.jpg" fallback="PA" />
          </SettingsRow>
          <SettingsRow fullWidthControl className="flex flex-col md:flex-row w-full items-start md:items-center md:justify-between gap-1.5" label="Username">
            <div className="relative w-full md:w-60">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 inset-s-0 flex items-center ps-3.5 text-sm text-muted-foreground"
              >
                @
              </span>
              <Input
                value={username}
                onChange={handleUsernameChange}
                type="text"
                inputMode="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={20}
                pattern={USERNAME_PATTERN.source}
                placeholder="username"
                aria-label="Username"
                aria-invalid={username.length > 0 && !isUsernameValid}
                title="3-20 karakter: huruf, angka, atau garis bawah"
                className="h-11 w-full border border-foreground/30 bg-card ps-8 caret-primary outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary dark:caret-blue-500 dark:focus-visible:ring-blue-500"
              />
            </div>
          </SettingsRow>
          <SettingsRow fullWidthControl className="flex flex-col md:flex-row w-full items-start md:items-center md:justify-between gap-1.5" label="Nama lengkap">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap Anda"
              className="w-full md:w-60 h-11 border border-foreground/30 bg-card caret-primary dark:caret-blue-500 outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary dark:focus-visible:ring-blue-500"
            />
          </SettingsRow>
          <SettingsRow fullWidthControl className="flex flex-col md:flex-row w-full items-start md:items-center md:justify-between gap-1.5" label="Nama panggilan">
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nama panggilan"
              className="w-full md:w-60 h-11 border border-foreground/30 bg-card caret-primary dark:caret-blue-500 outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary dark:focus-visible:ring-blue-500"
            />
          </SettingsRow>

          <div
            className={cn(
              "border-0! grid transition-[grid-template-rows] duration-300 ease-out",
              isProfileDirty ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="flex justify-end px-4 py-3.5">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  aria-label="Simpan"
                >
                  {saving ? (
                    <ActivityIndicator label="" className="size-4" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Notifikasi">
        <SettingsCard>
          <SettingsRow
            label="Update changelog"
            description="Dapatkan notifikasi saat Purpaw melakukan pembaruan fitur atau perubahan lainnya (bukan promosi)."
          >
            <Switch
              checked={notifyChangelog}
              onCheckedChange={setNotifyChangelog}
              aria-label="Update changelog"
            />
          </SettingsRow>
          <SettingsRow
            label="Pengingat"
            description="Dapatkan notifikasi di perangkat Anda tentang pengingat yang Anda simpan sebelumnya."
          >
            <Switch checked={notifyReminder} onCheckedChange={setNotifyReminder} aria-label="Pengingat" />
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>
    </div>
  )
}

export { ProfileSection }
