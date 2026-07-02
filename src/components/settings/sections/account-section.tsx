"use client"

import * as React from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  SettingsCard,
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card"

type Session = {
  id: string
  device: string
  location: string
  createdAt: Date
  updatedAt: Date
  current?: boolean
}

// wired: ganti dengan daftar sesi aktif dari API
const sessions: Session[] = [
  {
    id: "1",
    device: "Chrome (Windows)",
    location: "Jakarta, Jakarta, ID",
    createdAt: new Date("2026-06-29"),
    updatedAt: new Date("2026-07-02"),
    current: true,
  },
  {
    id: "2",
    device: "Chrome (Android)",
    location: "Surabaya, Surabaya, ID",
    createdAt: new Date("2026-04-28"),
    updatedAt: new Date("2026-04-30"),
  },
]

function fmt(date: Date) {
  return format(date, "d MMM yyyy", { locale: idLocale })
}

function AccountSection() {
  // wired: status 2FA dari API
  const [twoFactor, setTwoFactor] = React.useState(false)

  return (
    <div className="space-y-6">
      <h2 className="px-1 text-xl font-semibold tracking-tight sr-only">Akun</h2>

      <SettingsSection title="Akun">
        <SettingsCard>
          <SettingsRow
            label="Keluar dari perangkat ini"
            description="Anda akan keluar dari sesi saat ini."
          >
            <Button type="button" variant="outline" size="lg">
              Keluar
            </Button>
          </SettingsRow>
          <SettingsRow
            label="Keluar dari semua perangkat"
            description="Mengakhiri semua sesi aktif di seluruh perangkat."
          >
            <Button type="button" variant="outline" size="lg">
              Keluar semua
            </Button>
          </SettingsRow>
          <SettingsRow
            label="Hapus akun Anda"
            description="Tindakan ini permanen dan tidak dapat dibatalkan."
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="lg">
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus akun Anda?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua data terkait akun akan dihapus secara permanen. Tindakan
                    ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction>Ya, hapus akun</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Keamanan tambahan">
        <SettingsCard>
          <SettingsRow
            label="Autentikasi dua faktor"
            description="Beri lapisan keamanan tambahan untuk mencegah orang tak bertanggung jawab login menggunakan akun Anda."
          >
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} aria-label="Autentikasi dua faktor" />
          </SettingsRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Sesi aktif">
        <SettingsCard className="divide-y-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perangkat</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Diperbarui</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      {session.device}
                      {session.current ? (
                        <Badge variant="secondary">saat ini</Badge>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {session.location}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {fmt(session.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {fmt(session.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SettingsCard>
      </SettingsSection>
    </div>
  )
}

export { AccountSection }
