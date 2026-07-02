"use client"

import * as React from "react"
import Cropper, { type Area } from "react-easy-crop"
import {
  CheckIcon,
  PencilSimpleIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react"

import { ActivityIndicator } from "@/components/glymph/activity-indicator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { getCroppedImg } from "./crop-image"

/**
 * Tombol berbentuk avatar:
 * - kosong → hover overlay (desktop) / overlay persisten 1/4 bawah (mobile) + ikon unggah
 * - terisi → overlay sama + ikon ubah
 * - klik membuka dialog: pratinjau + unggah/ubah/hapus, dan crop bila ada berkas baru.
 * wired: ganti `previewSrc` dengan avatar user dari API.
 */
function AvatarUploader({
  initialSrc,
  fallback = "PA",
  className,
}: {
  initialSrc?: string
  fallback?: string
  className?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [previewSrc, setPreviewSrc] = React.useState(initialSrc)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [rawSrc, setRawSrc] = React.useState<string | null>(null)

  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] =
    React.useState<Area | null>(null)

  const [busy, setBusy] = React.useState(false)
  const [removing, setRemoving] = React.useState(false)

  const hasAvatar = Boolean(previewSrc)
  const isCropping = Boolean(rawSrc)

  React.useEffect(() => {
    setPreviewSrc(initialSrc)
  }, [initialSrc])

  function clearRawSrc() {
    if (rawSrc) URL.revokeObjectURL(rawSrc)
    setRawSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  function triggerFile() {
    inputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (rawSrc) URL.revokeObjectURL(rawSrc)
    setRawSrc(URL.createObjectURL(file))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setDialogOpen(true)
    event.target.value = ""
  }

  async function handleConfirmCrop() {
    if (!rawSrc || !croppedAreaPixels) return
    try {
      setBusy(true)
      const cropped = await getCroppedImg(rawSrc, croppedAreaPixels)
      setPreviewSrc(cropped)
      clearRawSrc()
      setDialogOpen(false)
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove() {
    try {
      setRemoving(true)
      // wired: panggil API hapus avatar
      setPreviewSrc(undefined)
      clearRawSrc()
      setDialogOpen(false)
    } finally {
      setRemoving(false)
    }
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open)
    if (!open) clearRawSrc()
  }

  const OverlayIcon = hasAvatar ? PencilSimpleIcon : UploadSimpleIcon

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={hasAvatar ? "Ubah foto profil" : "Unggah foto profil"}
            className={cn(
              "group relative inline-flex size-16 shrink-0 overflow-hidden rounded-full md:size-11",
              className
            )}
          >
            <Avatar className="size-full rounded-full">
              {previewSrc ? (
                <AvatarImage src={previewSrc} alt="Foto profil" />
              ) : (
                <AvatarFallback>{fallback}</AvatarFallback>
              )}
            </Avatar>

            {/* overlay hover penuh (desktop) */}
            <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 group-hover:opacity-100 md:flex">
              <OverlayIcon className="size-4 text-white" />
            </span>

            {/* overlay persisten 1/4 bawah (mobile) */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/45 py-0.5 backdrop-blur-[2px] md:hidden">
              <OverlayIcon className="size-3.5 text-white" />
            </span>
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCropping ? "Sesuaikan foto" : "Foto profil"}
            </DialogTitle>
            <DialogDescription>
              {isCropping
                ? "Geser, perbesar, dan putar foto Anda hingga pas."
                : "Unggah, ubah, atau hapus foto profil Anda."}
            </DialogDescription>
          </DialogHeader>

          {isCropping && rawSrc ? (
            <>
              <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-muted">
                <Cropper
                  image={rawSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Perbesar</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.01}
                    onValueChange={(v) => setZoom(v[0] ?? 1)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearRawSrc}
                  disabled={busy}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmCrop}
                  disabled={busy}
                  aria-label="Terapkan"
                >
                  {busy ? (
                    <ActivityIndicator label="" className="size-4" />
                  ) : (
                    <>
                      <CheckIcon />
                      Terapkan
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 py-2">
                <Avatar className="size-28">
                  {previewSrc ? (
                    <AvatarImage src={previewSrc} alt="Foto profil" />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {fallback}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                {hasAvatar ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleRemove}
                    disabled={removing}
                    aria-label="Hapus foto"
                  >
                    {removing ? (
                      <ActivityIndicator label="" className="size-4" />
                    ) : (
                      <>
                        <TrashIcon />
                        Hapus
                      </>
                    )}
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex w-full gap-2 sm:w-auto">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost" className="flex-1 sm:flex-none">
                      Tutup
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={triggerFile} className="flex-1 sm:flex-none">
                    {hasAvatar ? <PencilSimpleIcon /> : <UploadSimpleIcon />}
                    {hasAvatar ? "Ubah" : "Unggah"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}

export { AvatarUploader }
