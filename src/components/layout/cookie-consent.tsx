"use client"

import { useState } from "react"
import { CookieIcon, XIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type CategoryId = "necessary" | "analytics" | "marketing"

interface CookieCategory {
    id: CategoryId
    title: string
    desc: string
    required?: boolean
}

const CATEGORIES: CookieCategory[] = [
    {
        id: "necessary",
        title: "Cookie Wajib",
        desc: "Diperlukan agar situs dapat berfungsi dengan baik. Tidak dapat dinonaktifkan.",
        required: true,
    },
    {
        id: "analytics",
        title: "Cookie Analitik",
        desc: "Membantu kami memahami cara pengunjung berinteraksi dengan situs.",
    },
    {
        id: "marketing",
        title: "Cookie Pemasaran",
        desc: "Digunakan untuk menampilkan iklan dan konten yang lebih relevan.",
    },
]

export interface CookieConsentProps {
    onCustomize?: () => void
    onAccept?: () => void
    onDecline?: () => void
    className?: string
}

export function CookieConsent({ onCustomize, onAccept, onDecline, className }: CookieConsentProps) {
    const [view, setView] = useState<"consent" | "customize">("consent")
    const [prefs, setPrefs] = useState<Record<CategoryId, boolean>>({
        necessary: true,
        analytics: true,
        marketing: false,
    })

    return (
        <div
            role="region"
            aria-label="Pemberitahuan cookie"
            className={cn("fixed inset-x-0 bottom-0 z-150 flex justify-center px-4 pb-4 sm:pb-6", className)}
        >
            <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-[20px] border border-black/10 bg-white/90 p-4 text-neutral-900 shadow-[0_12px_44px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-5">
                {view === "consent" ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="flex-none rounded-full bg-black/6 p-2">
                                <CookieIcon className="size-[18px]" aria-hidden="true" />
                            </span>
                            <p className="text-[13px] leading-relaxed text-neutral-800">
                                Kami menggunakan cookie untuk mempersonalisasi konten dan menganalisis lalu lintas kami. Baca{" "}
                                <a href="#" className="font-semibold text-neutral-900 underline-offset-2 hover:underline">
                                    Pilihan Privasi
                                </a>{" "}
                                untuk menyesuaikan, atau izinkan semua cookie.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-none sm:items-center sm:gap-3">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    onCustomize?.()
                                    setView("customize")
                                }}
                            >
                                Sesuaikan
                            </Button>
                            <Button size="lg" className="w-full sm:w-auto" onClick={onAccept}>
                                Izinkan
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-sm font-semibold text-neutral-900">Sesuaikan Preferensi Cookie</h2>
                            <Button variant="ghost" size="icon-lg" aria-label="Tutup" onClick={() => setView("consent")}>
                                <XIcon aria-hidden="true" />
                            </Button>
                        </div>
                        <p className="text-[13px] leading-relaxed text-neutral-700">
                            Kelola bagaimana kami menggunakan cookie. Cookie wajib tidak dapat dinonaktifkan.
                        </p>
                        <ul className="divide-y divide-black/10">
                            {CATEGORIES.map((cat) => {
                                const checked = cat.required ? true : prefs[cat.id]
                                return (
                                    <li key={cat.id} className="flex items-start justify-between gap-4 py-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] font-semibold text-neutral-900">{cat.title}</span>
                                                {cat.required && (
                                                    <span className="rounded-full bg-black/6 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-700">
                                                        Wajib
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-[12px] leading-relaxed text-neutral-700">{cat.desc}</p>
                                        </div>
                                        <Switch
                                            className="flex-none"
                                            checked={checked}
                                            disabled={cat.required}
                                            aria-label={`Izinkan ${cat.title}`}
                                            onCheckedChange={(v) => {
                                                if (cat.required) return
                                                setPrefs((p) => ({ ...p, [cat.id]: v }))
                                            }}
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="flex items-center justify-between pt-1">
                            <Button
                                variant="link"
                                size="lg"
                                onClick={() => {
                                    onDecline?.()
                                    setView("consent")
                                }}
                            >
                                Tolak semua
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => {
                                    onAccept?.()
                                    setView("consent")
                                }}
                            >
                                Simpan pilihan
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CookieConsent
