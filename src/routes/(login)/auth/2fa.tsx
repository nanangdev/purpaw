import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowCounterClockwiseIcon, CheckIcon, XIcon } from '@phosphor-icons/react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ActivityIndicator } from '@/components/glymph/activity-indicator'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  DynamicIsland,
  DynamicIslandProvider,
  DynamicContainer,
  DynamicTitle,
  useDynamicIslandSize,
} from '@/components/motion/dynamic-island'

export const Route = createFileRoute('/(login)/auth/2fa')({
  component: RouteComponent,
})

// WARNING
// Catatan wiring:
// - DEMO_VALID_CODE & kedua durasi di bawah adalah SIMULASI respons backend.
//   Saat di-wire, hapus DEMO_VALID_CODE dan ganti setTimeout dengan `await` ke API.
// - `busy` menjaga agar tidak ada submit ganda selama proses berjalan.
const CODE_LENGTH = 6
const DEMO_VALID_CODE = '123456' // TODO(wire): hapus — verifikasi wajib di sisi server.
const VERIFY_DURATION = 1400 // durasi "Verifying…" (diganti oleh waktu `await` API)
const RESULT_DURATION = 3000 // durasi tampil feedback sebelum di-hide

function RouteComponent() {
  return (
    <DynamicIslandProvider initialSize="empty">
      <TwoFactor />
    </DynamicIslandProvider>
  )
}

function TwoFactor() {
  const { scheduleAnimation } = useDynamicIslandSize()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const otpRef = useRef<HTMLDivElement>(null)
  const shouldRefocus = useRef(false)

  useEffect(() => {
    if (shouldRefocus.current) {
      shouldRefocus.current = false
      otpRef.current?.querySelector('input')?.focus()
    }
  }, [busy])

  function verify(value: string) {
    if (value.length < CODE_LENGTH || busy) return
    setBusy(true)
    setStatus('verifying')
    scheduleAnimation([{ size: 'compact', delay: 0 }])

    // TODO(wire): ganti simulasi di bawah dengan respons API sungguhan, mis:
    //   const ok = await verifyTwoFactor(code)
    window.setTimeout(() => {
      const ok = value === DEMO_VALID_CODE
      setStatus(ok ? 'success' : 'error')

      window.setTimeout(
        () => {
          scheduleAnimation([{ size: 'empty', delay: 0 }])
          setStatus('idle')
          setBusy(false)

          if (ok) {
            // TODO(wire): success — navigasi pengguna (mis. ke /dashboard)
          } else {
            // gagal — kosongkan & fokus ulang agar bisa mencoba lagi
            setCode('')
            shouldRefocus.current = true
          }
        },
        RESULT_DURATION,
      )
    }, VERIFY_DURATION)
  }

  return (
    <>
      <div className="relative w-full min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-linear-to-b from-muted/50 to-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_12%,transparent),transparent_75%)]" />
        <div className="relative w-full max-w-md rounded-[1.75rem] border border-black/6 dark:border-white/8 bg-card p-6 sm:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.22),0_8px_24px_-12px_rgba(0,0,0,0.12)]">
          <div className="mb-7 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight">Two-Factor Authentication</h1>
            <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">
              Enter the {CODE_LENGTH}-digit code from your authenticator app.
            </p>
          </div>

          <div ref={otpRef}>
            <InputOTP
              maxLength={CODE_LENGTH}
              value={code}
              onChange={(value) => {
                setCode(value)
                if (value.length === CODE_LENGTH) verify(value)
              }}
              pattern={REGEXP_ONLY_DIGITS}
              inputMode="numeric"
              autoFocus
              disabled={busy}
              aria-label="Authentication code"
              containerClassName="justify-center has-disabled:opacity-100"
            >
              <InputOTPGroup className="justify-center gap-1.5 sm:gap-2.5">
                {Array.from({ length: CODE_LENGTH }, (_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="size-10 sm:size-12 border rounded-lg first:rounded-s-lg last:rounded-e-lg sm:rounded-lg sm:first:rounded-s-lg sm:last:rounded-e-lg bg-card text-xl sm:text-2xl font-semibold data-[active=true]:border-primary data-[active=true]:bg-card data-[active=true]:ring-2 data-[active=true]:ring-offset-2 data-[active=true]:ring-primary"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setCode('')}
            disabled={code.length === 0 || busy}
            className="w-full h-11 gap-2 rounded-full text-[0.95rem] font-medium transition-all duration-200 mt-7"
          >
            <ArrowCounterClockwiseIcon />
            Reset
          </Button>

          <div className="mt-7 flex flex-col items-center justify-center gap-2 xl:gap-3 text-sm text-primary">
            <a
              href="/login"
              className="rounded underline-offset-4 hover:text-primary/80 hover:underline"
            >
              Back to login
            </a>
            <a
              href="/auth/2fa/backup"
              className="rounded underline-offset-4 hover:text-primary/80 hover:underline"
            >
              Use a backup code
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-6">
        <DynamicIsland id="purpaw-2fa-island">
          {status === 'verifying' && (
            <DynamicContainer key="verifying" className="flex h-full w-full items-center justify-between gap-2 px-4 text-white">
              <ActivityIndicator label="" className="size-6 text-white" />
              <DynamicTitle className="text-sm font-medium">Verifying…</DynamicTitle>
            </DynamicContainer>
          )}
          {status === 'success' && (
            <DynamicContainer key="success" className="flex h-full w-full items-center justify-between gap-2 px-4 text-white">
              <CheckIcon weight="bold" className="size-6 text-emerald-400" />
              <DynamicTitle className="text-base font-semibold">Verified</DynamicTitle>
            </DynamicContainer>
          )}
          {status === 'error' && (
            <DynamicContainer key="error" className="flex h-full w-full items-center justify-between gap-2 px-4 text-white">
              <XIcon weight="bold" className="size-6 text-red-500" />
              <DynamicTitle className="text-sm font-medium">Incorrect code</DynamicTitle>
            </DynamicContainer>
          )}
        </DynamicIsland>
      </div>
    </>
  )
}
