import { useCallback, useEffect, useRef, useState } from 'react'
import type Hls from 'hls.js'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { toast } from 'sonner'
import {
  ArrowClockwiseIcon,
  CheckIcon,
  XIcon,
} from '@phosphor-icons/react'
import { Paw } from '@/components/glymph/paw'
import { ActivityIndicator } from '@/components/glymph/activity-indicator'
import { Google } from '@/components/logos/google'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  DynamicContainer,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
  useDynamicIslandSize,
} from '@/components/motion/dynamic-island'
import { createFileRoute } from '@tanstack/react-router'

const PLAYBACK_ID = 'jV4zlaQi0002Es8c8BJ8v1Muq022ZN9StxMCm2PlG5VU3k'
const VIDEO_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8?min_resolution=720p`
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.png?time=2`

// WARNING
// Catatan wiring (sama seperti auth/2fa.tsx):
// - DEMO_VALID_CODE & kedua durasi di bawah adalah SIMULASI respons backend.
//   Saat di-wire, hapus DEMO_VALID_CODE dan ganti setTimeout dengan `await` ke API.
// - Backend mengirim DUA hal sekaligus ke email: kode OTP dan magic link.
//   User bebas memilih: ketik kodenya di sini, atau buka link dari emailnya.
const DEMO_VALID_CODE = '123456' // TODO(wire): hapus — verifikasi wajib di sisi server.
const SEND_DURATION = 900 // durasi "Mengirim…" (diganti oleh waktu `await` API kirim kode)
const VERIFY_DURATION = 1400 // durasi "Verifying…" (diganti oleh waktu `await` API verifikasi)
const RESULT_DURATION = 3000 // durasi tampil feedback verify sebelum di-hide
const RESEND_COOLDOWN = 60 // detik antar pengiriman ulang

const LAST_USED_KEY = 'purpaw:last-used-method'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const Route = createFileRoute('/(login)/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DynamicIslandProvider initialSize="empty">
      <Login />
    </DynamicIslandProvider>
  )
}

function Login() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  const { scheduleAnimation } = useDynamicIslandSize()

  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [email, setEmail] = useState('')
  const emailValid = EMAIL_RE.test(email)
  const [lastUsed, setLastUsed] = useState<'oauth' | 'manual' | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(LAST_USED_KEY)
    if (stored === 'oauth' || stored === 'manual') setLastUsed(stored)
  }, [])

  function markUsed(method: 'oauth' | 'manual') {
    setLastUsed(method)
    window.localStorage.setItem(LAST_USED_KEY, method)
  }

  // pengiriman kode awal (email submit)
  const [sending, setSending] = useState(false)
  // verifikasi OTP
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const otpRef = useRef<HTMLDivElement>(null)
  const shouldRefocus = useRef(false)
  // kirim ulang
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [cooldown])

  const startCooldown = useCallback(() => setCooldown(RESEND_COOLDOWN), [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let hls: Hls | null = null
    let cancelled = false

    // Safari / iOS play HLS natively — just point the element at the stream
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = VIDEO_SRC
      return
    }

    // Other browsers: attach the stream via hls.js (Media Source Extensions).
    // Dynamic import keeps hls.js out of the server bundle (SSR-safe).
    void import('hls.js').then(({ default: HlsLib }) => {
      if (cancelled || !HlsLib.isSupported()) return
      hls = new HlsLib({ capLevelToPlayerSize: true })
      hls.loadSource(VIDEO_SRC)
      hls.attachMedia(video)
      hls.on(HlsLib.Events.MANIFEST_PARSED, () => {
        if (reduce) return
        video.play().catch(() => { })
      })
    })

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [reduce])

  function requestCode(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValid || sending) return
    setSending(true)
    markUsed('manual')

    // TODO(wire): ganti simulasi dengan `await sendLoginCode(email)` —
    // backend lalu mengirim kode OTP + magic link ke email ini.
    window.setTimeout(() => {
      setSending(false)
      setStep('verify')
      setCode('')
      setStatus('idle')
      startCooldown()
      toast.success('Periksa email Anda', {
        description: `Kami mengirim kode & tautan masuk ke ${email}`,
      })
    }, SEND_DURATION)
  }

  function verify(value: string) {
    if (value.length === 0 || busy) return
    setBusy(true)
    setStatus('verifying')
    scheduleAnimation([{ size: 'compact', delay: 0 }])

    // TODO(wire): ganti simulasi dengan `await verifyLoginCode(email, code)`.
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
            setCode('')
            shouldRefocus.current = true
          }
        },
        RESULT_DURATION,
      )
    }, VERIFY_DURATION)
  }

  function resend() {
    if (resending || cooldown > 0) return
    setResending(true)
    setResendStatus('sending')
    scheduleAnimation([{ size: 'compact', delay: 0 }])

    // TODO(wire): ganti dengan `await sendLoginCode(email)` (kode + magic link).
    window.setTimeout(() => {
      setResending(false)
      setResendStatus('sent')
      startCooldown()

      window.setTimeout(
        () => {
          scheduleAnimation([{ size: 'empty', delay: 0 }])
          setResendStatus('idle')
        },
        RESULT_DURATION,
      )
    }, SEND_DURATION)
  }

  function backToEmail() {
    setStep('email')
    setCode('')
    setStatus('idle')
    setBusy(false)
  }

  return (
    <div className="w-full min-h-dvh flex flex-row lg:flex-col xl:flex-row items-center justify-center xl:justify-between overflow-x-hidden xl:gap-6">
      <section className="order-2 lg:order-1 xl:order-2 w-full max-w-lg lg:w-1/2 xl:w-4/7 bg-background flex flex-col items-center justify-center relative lg:rounded-2xl xl:h-[calc(100svh-64px)] xl:mr-6 px-6 xl:px-12 overflow-hidden">
        <div className="w-full flex flex-col items-center justify-center relative">
          <div className="mb-5">
            <Paw variant="filled" className="size-12" aria-label="Babu" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {step === 'email' ? (
              <motion.div
                key="email-step"
                className="w-full flex flex-col items-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <EmailStep
                  email={email}
                  onEmailChange={setEmail}
                  emailValid={emailValid}
                  sending={sending}
                  onSubmit={requestCode}
                  lastUsed={lastUsed}
                  onGoogleClick={() => markUsed('oauth')}
                />
              </motion.div>
            ) : (
              <motion.div
                key="verify-step"
                className="w-full flex flex-col items-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <VerifyStep
                  email={email}
                  code={code}
                  onCodeChange={setCode}
                  onVerify={() => verify(code)}
                  busy={busy}
                  otpRef={otpRef}
                  shouldRefocus={shouldRefocus}
                  onResend={resend}
                  resending={resending}
                  cooldown={cooldown}
                  onBack={backToEmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section aria-hidden="true" className="order-1 lg:order-2 xl:order-1 xl:aspect-video lg:rounded-3xl lg:overflow-hidden xl:h-[calc(100svh-64px)] xl:ml-8 hidden xl:flex flex-col items-center justify-center relative overflow-hidden">
        <video
          ref={videoRef}
          poster={POSTER_SRC}
          playsInline
          loop
          autoPlay={!reduce}
          muted
          className="w-auto h-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 inset-shadow-md" />
      </section>

      <VerifyIsland status={status} resendStatus={resendStatus} />
    </div>
  )
}

function EmailStep({
  email,
  onEmailChange,
  emailValid,
  sending,
  onSubmit,
  lastUsed,
  onGoogleClick,
}: {
  email: string
  onEmailChange: (value: string) => void
  emailValid: boolean
  sending: boolean
  onSubmit: (e: React.FormEvent) => void
  lastUsed: 'oauth' | 'manual' | null
  onGoogleClick: () => void
}) {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Login or Register</h1>
        <p className="mt-1.5 text-base">To use Purpaw you must log into an existing account or create one using one of the options below</p>
      </div>

      <div className="flex flex-col items-center w-full mb-4 pt-2">
        <Button
          type='button'
          variant="secondary"
          className="group relative w-full flex items-center justify-center gap-2.5 h-11 px-4 text-base uppercase transition-all duration-200 mb-5"
          onClick={onGoogleClick}
        >
          <Google />
          Google

          {/* terakhir digunakan */}
          {lastUsed === 'oauth' && (
            <Badge className="text-xs normal-case absolute -top-2 right-2">Terakhir digunakan</Badge>
          )}
        </Button>
        <div className="w-full flex flex-row items-center justify-center gap-2 relative overflow-hidden text-sm text-foreground/80 mb-4">
          <Separator />
          <span>atau</span>
          <Separator />
        </div>

        {/* warning! ada form */}
        <form className="w-full" onSubmit={onSubmit}>
          <div className="group w-full mb-3 relative">
            <label
              htmlFor='email'
              className="pointer-events-none absolute left-4 top-4 origin-left whitespace-nowrap text-base text-accent-foreground/70 transition-all group-has-[input:focus]:top-2.5 group-has-[input:focus]:text-xs group-has-[input:not(:placeholder-shown)]:top-2.5 group-has-[input:not(:placeholder-shown)]:text-xs"
            >
              Alamat email
            </label>
            <input
              type="email"
              id="email"
              autoComplete='email'
              placeholder=' '
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={sending}
              className="text-base w-full h-[3.29rem] rounded-[12px] border pt-4.5 px-4 focus:border-primary/70 focus-visible:border-primary/70 focus-visible:outline-primary/70 transition-all caret-primary disabled:opacity-60"
            />
          </div>

          {/** jika: error | sesuaikan jika hanya salah sandi */}
          {/* <Alert variant="destructive" className="max-w-md mt-2 mb-3 border-destructive bg-destructive/10">
              <AlertTitle className="sr-only">Akun diblokir</AlertTitle>
              <AlertDescription className="text-accent-foreground/80 text-center">
                Akun Anda diblokir permanen. Jika merasa ini kesalahan, silahkan hubungi kami melalui <a href="/help" className="static inline-block underline underline-offset-2 hover:no-underline">pusat bantuan</a>.
              </AlertDescription>
            </Alert> */}

          <Button
            type="submit"
            disabled={!emailValid || sending}
            className="group relative w-full flex items-center justify-center gap-2.5 h-11 px-4 text-base transition-all duration-200 my-5"
          >
            {sending ? <ActivityIndicator label="Mengirim" className="size-6!" /> : <span>Masuk</span>}

            {/* terakhir digunakan */}
            {lastUsed === 'manual' && (
              <Badge variant="secondary" className="text-xs normal-case absolute -top-2 right-2">Terakhir digunakan</Badge>
            )}
          </Button>

          <p className="text-sm md:text-[15px] text-center text-foreground/90 md:mt-8">
            By signing in, you accept the <a href="#" target="_blank" className="underline underline-offset-1 hover:no-underline">Terms of Service</a> and acknowledge our <a href="#" target="_blank" className="underline underline-offset-1 hover:no-underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </>
  )
}

function VerifyStep({
  email,
  code,
  onCodeChange,
  onVerify,
  busy,
  otpRef,
  shouldRefocus,
  onResend,
  resending,
  cooldown,
  onBack,
}: {
  email: string
  code: string
  onCodeChange: (value: string) => void
  onVerify: () => void
  busy: boolean
  otpRef: React.RefObject<HTMLDivElement | null>
  shouldRefocus: React.RefObject<boolean>
  onResend: () => void
  resending: boolean
  cooldown: number
  onBack: () => void
}) {
  const [mode, setMode] = useState<'link' | 'code'>('link')
  const reduce = useReducedMotion()

  useEffect(() => {
    if (shouldRefocus.current) {
      shouldRefocus.current = false
      otpRef.current?.querySelector('input')?.focus()
    }
  }, [busy, otpRef, shouldRefocus])

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-1.5 text-base text-foreground/80">
          We've sent you a temporary login {mode === 'code' ? 'code' : 'link'}.<br />
          Please check your inbox at <span className="font-medium">{email}</span>
        </p>
      </div>
      <div className="flex flex-col items-center w-full mb-4 pt-2">
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'link' ? (
            <motion.div
              key="link-mode"
              className="flex flex-col items-center w-full max-w-xs gap-2"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="mt-6 w-full h-11 border border-primary/10 text-base"
                onClick={() => setMode('code')}
              >
                Enter code manually
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="w-full h-11 text-base"
                onClick={onBack}
              >
                Back to login
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="code-mode"
              className="flex flex-col items-center w-full"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div ref={otpRef} className="w-full max-w-xs">
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
                  autoFocus
                  disabled={busy}
                  aria-label="Kode masuk"
                  placeholder="Masukkan kode"
                  className="h-11 lg:h-12 w-full mx-auto rounded-lg border border-foreground/30 bg-card text-center font-mono text-xl lg:text-2xl! caret-primary outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                />
              </div>

              <div className="mt-4 lg:mt-6 flex flex-col items-center w-full max-w-xs gap-2">
                <Button
                  type="button"
                  size="lg"
                  className="w-full h-11 text-base"
                  onClick={onVerify}
                  disabled={code.length === 0 || busy}
                >
                  Continue with login code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="w-full h-11 text-base font-normal"
                  onClick={onBack}
                >
                  Back to login
                </Button>
                <button
                  type="button"
                  onClick={onResend}
                  disabled={resending || cooldown > 0 || busy}
                  className={`mt-1 h-11 text-base inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 ${cooldown > 0 ? 'text-foreground/80' : 'text-primary'}`}
                >
                  {resending ? (
                    <ActivityIndicator label="Mengirim ulang" className="size-5" />
                  ) : cooldown > 0 ? (
                    <span>Resend in {cooldown}s</span>
                  ) : (
                    <>
                      <ArrowClockwiseIcon className="size-4" />
                      Resend code
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function VerifyIsland({
  status,
  resendStatus,
}: {
  status: 'idle' | 'verifying' | 'success' | 'error'
  resendStatus: 'idle' | 'sending' | 'sent'
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-6">
      <DynamicIsland id="purpaw-login-island">
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
        {status === 'idle' && resendStatus === 'sending' && (
          <DynamicContainer key="resending" className="flex h-full w-full items-center justify-between gap-2 px-4 text-white">
            <ActivityIndicator label="" className="size-6 text-white" />
            <DynamicTitle className="text-sm font-medium">Mengirim ulang…</DynamicTitle>
          </DynamicContainer>
        )}
        {status === 'idle' && resendStatus === 'sent' && (
          <DynamicContainer key="resent" className="flex h-full w-full items-center justify-between gap-2 px-4 text-white">
            <CheckIcon weight="bold" className="size-6 text-emerald-400" />
            <DynamicTitle className="text-base font-semibold">Kode dikirim ulang</DynamicTitle>
          </DynamicContainer>
        )}
      </DynamicIsland>
    </div>
  )
}
