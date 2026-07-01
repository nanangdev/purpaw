import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { TextAnimate } from '@/components/motion/text-animate'
import gsap from 'gsap'
import Lenis from 'lenis'
import { useTheme } from '@/components/theme/theme-provider'
import { QuestionIcon } from '@phosphor-icons/react'
import { OnboardingProvider, useOnboarding } from '@onboardjs/react'
import { Paw } from '@/components/glymph/paw'
import { ActivityIndicator } from '@/components/glymph/activity-indicator'
import { PawAnimated } from '@/components/glymph/paw-animated'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(login)/onboarding/')({
  component: RouteComponent,
})

// TODO(wire): persistensi progres onboarding via database (bukan localStorage) —
// gunakan customOnDataLoad / customOnDataPersist di OnboardingProvider.
// Username aman: tanpa "@" di depan (sistem yang menambahkannya), 3–20 karakter.
const USERNAME_RE = /^[a-zA-Z0-9._]{3,20}$/

// TODO(assets): ganti placehold.co dengan URL screenshot tema dari CDN dedicated.
const LIGHT_PREVIEW = 'https://placehold.co/600x400/ededee/1c1c1e?text=Light&font=montserrat'
const DARK_PREVIEW = 'https://placehold.co/600x400/1c1c1e/ededee?text=Dark&font=montserrat'

const steps = [
  { id: 'account', component: AccountStep, nextStep: 'welcome' },
  { id: 'welcome', component: WelcomeStep, nextStep: 'style' },
  { id: 'style', component: StyleStep, nextStep: 'subscribe' },
  { id: 'subscribe', component: SubscribeStep, nextStep: 'done' },
  { id: 'done', component: DoneStep, nextStep: null },
]

function RouteComponent() {
  return (
    <OnboardingProvider
      flowId="purpaw-onboarding"
      flowName="Purpaw Onboarding"
      flowVersion="1.0.0"
      steps={steps}
    >
      <OnboardingScreen />
    </OnboardingProvider>
  )
}

function OnboardingScreen() {
  const { state, currentStep, isCompleted, renderStep, loading } = useOnboarding()
  const navigate = useNavigate()

  // Lenis: smooth scroll scoped ke onboarding (di-(cleanup) saat unmount).
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])

  // Saat flow selesai (klik finish atau rehidrasi state selesai) -> keluar dari onboarding.
  // TODO(wire): baca flowData.startTour untuk memicu product tour (driver.js) + arahkan ke target app.
  const completed = isCompleted
  useEffect(() => {
    if (completed) navigate({ to: '/' })
  }, [completed, navigate])

  if (completed) return null

  if (loading.isHydrating || !state || !currentStep) {
    return (
      <OnboardingShell>
        <div className="flex min-h-40 items-center justify-center">
          <PawAnimated className="size-12 text-primary dark:text-blue-500" />
        </div>
      </OnboardingShell>
    )
  }

  const stepId = currentStep.id

  return (
    <OnboardingShell step={state.currentStepNumber} total={state.totalSteps}>
      <StepReveal key={stepId}>{renderStep()}</StepReveal>
    </OnboardingShell>
  )
}

function OnboardingShell({ step, total, children }: { step?: number; total?: number; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-background p-4 sm:p-6">
      <h1 className="sr-only">Onboarding</h1>

      <div className="relative flex w-full max-w-lg flex-1 flex-col justify-center">
        {children}
      </div>

      {/* indikator langkah ala Apple: titik, yang aktif melebar & bg-primary */}
      {typeof step === 'number' && typeof total === 'number' && total > 0 && (
        <div className="flex shrink-0 items-center justify-center gap-1.5 pt-8">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                'h-1.5 min-w-1.5 rounded-full transition-all duration-300 ease-out',
                i === step - 1 ? 'w-6 bg-primary dark:bg-blue-500' : 'w-1 bg-foreground/30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Transisi step & reveal konten via GSAP — stagger anak-anak root step (tanpa flash).
function StepReveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const scope = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    if (reduce) return
    const root = scope.current?.firstElementChild
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root?.children ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
      )
    }, scope)
    return () => ctx.revert()
  }, [reduce])

  return <div ref={scope} className="w-full">{children}</div>
}

// ── Step 1 ──────────────────────────────────────────────────────────────────
function AccountStep() {
  const { state, updateContext, next } = useOnboarding()
  if (!state) return null
  const flow = state.context.flowData
  const name = flow.name ?? ''
  const username = flow.username ?? ''
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const nameValid = name.trim().length >= 2
  const usernameValid = USERNAME_RE.test(username)
  const canContinue = nameValid && usernameValid && !checking

  function handleUsername(value: string) {
    updateContext({ flowData: { ...flow, username: value.replace(/^@+/, '') } })
    if (error) setError(null)
  }

  async function handleContinue() {
    if (!canContinue) return
    setChecking(true)
    setError(null)
    // TODO(wire): ganti dengan `await checkUsernameAvailability(username)`.
    await new Promise((r) => setTimeout(r, 600))
    const taken = username.toLowerCase() === 'taken'
    setChecking(false)
    if (taken) {
      setError('Username sudah dipakai. Coba yang lain.')
      return
    }
    next()
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1 flex flex-col items-center justify-center text-center">
        <Paw variant="outline" className="size-12 mb-6" />
        <TextAnimate as="h2" by="word" animation="blurInUp" delay={0.1} duration={0.5} startOnView={false} className="text-2xl sm:text-4xl font-semibold lg:font-bold">Buat akun baru</TextAnimate>
        <TextAnimate as="p" by="word" animation="fadeIn" delay={0.3} duration={0.5} startOnView={false} className="text-foreground/80">Informasi ini digunakan untuk menyebut Anda pada komunitas dan informasi nama penyebutan di pesan email.</TextAnimate>
      </header>

      <div className="space-y-4 w-full max-w-lg rounded-[1.75rem] border border-black/6 dark:border-white/8 bg-card p-6 lg:p-8 shadow-md transition-all duration-250">
        <div className="space-y-1">
          <Label htmlFor="ob-name" className="text-base font-medium">
            Nama
          </Label>
          <Input
            id="ob-name"
            value={name}
            onChange={(e) => updateContext({ flowData: { ...flow, name: e.target.value } })}
            placeholder="John Doe"
            autoComplete="name"
            className="h-11 lg:h-12 w-full mx-auto rounded-lg border border-foreground/30 bg-card text-base! caret-primary dark:caret-blue-500 outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="ob-username" className="text-base font-medium">
              Username
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-primary transition-colors hover:text-primary/80"
                  aria-label="Info username"
                >
                  <QuestionIcon className="size-4.5 dark:text-blue-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Username dapat diubah setiap 6 bulan sekali.</TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/80">
              @
            </span>
            <Input
              id="ob-username"
              value={username}
              onChange={(e) => handleUsername(e.target.value)}
              placeholder="johndoe"
              autoComplete="username"
              spellCheck={false}
              aria-invalid={!!error}
              className="h-11 lg:h-12 w-full mx-auto rounded-lg border border-foreground/30 bg-card text-base! pl-10 caret-primary dark:caret-blue-500 outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            />
          </div>
          {/* slot error / hint — masuk & keluar halus (tinggi + opacity) via motion */}
          <AnimatePresence initial={false} mode="wait">
            {error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden text-sm text-destructive pt-1"
              >
                {error}
              </motion.p>
            ) : username && !usernameValid ? (
              <motion.p
                key="hint"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden text-sm text-foreground/60 pt-1"
              >
                3-20 karakter: huruf, angka, titik, atau garis bawah.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <Button className="h-11 w-full text-base mt-1" onClick={handleContinue} disabled={!canContinue}>
          {checking ? <ActivityIndicator label="Memeriksa" className="size-5" /> : 'Lanjutkan'}
        </Button>

      </div>
    </div>
  )
}

// ── Step 2 ──────────────────────────────────────────────────────────────────
function WelcomeStep() {
  const { next } = useOnboarding()

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <header className="space-y-1 flex flex-col items-center justify-center text-center">
        <Paw variant="filled" className="size-12 mb-6" />
        <TextAnimate as="h2" by="word" animation="blurInUp" delay={0.1} duration={0.5} startOnView={false} className="text-2xl sm:text-4xl font-bold">Welcome to Purpaw</TextAnimate>
        <TextAnimate as="p" by="word" animation="fadeIn" delay={0.3} duration={0.5} startOnView={false} className="text-foreground/80 max-w-sm">Purpaw is a comprehensive web-based app for pet cat care.</TextAnimate>
      </header>
      <Button className="h-11 w-full max-w-sm text-base mt-4" onClick={() => next()}>
        Get started
      </Button>
    </div>
  )
}

// ── Step 3 ──────────────────────────────────────────────────────────────────
function StyleStep() {
  const { state, updateContext, next } = useOnboarding()
  const { resolvedTheme, setTheme } = useTheme()
  if (!state) return null
  const flow = state.context.flowData
  const selected = (flow.theme ?? resolvedTheme ?? 'light') as 'light' | 'dark'

  function pick(value: 'light' | 'dark') {
    setTheme(value)
    updateContext({ flowData: { ...flow, theme: value } })
  }

  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <header className="space-y-1 flex flex-col items-center justify-center text-center">
        <TextAnimate as="h2" by="word" animation="blurInUp" delay={0.1} duration={0.5} startOnView={false} className="text-3xl sm:text-5xl font-bold">Choose your style</TextAnimate>
        <TextAnimate as="p" by="word" animation="fadeIn" delay={0.3} duration={0.5} startOnView={false} className="text-foreground/80 max-w-sm">Change your theme at any time via the command menu or settings.</TextAnimate>
      </header>

      <div className="grid rounded-2xl border border-foreground/20 overflow-hidden grid-cols-2 divide-x divide-y-0 divide-foreground/20">
        <ThemeOption
          label="Light"
          preview={LIGHT_PREVIEW}
          active={selected === 'light'}
          onClick={() => pick('light')}
        />
        <ThemeOption
          label="Dark"
          preview={DARK_PREVIEW}
          active={selected === 'dark'}
          onClick={() => pick('dark')}
        />
      </div>

      <Button className="h-11 w-full text-base max-w-sm mt-2" onClick={() => next()}>
        Continue
      </Button>
    </div>
  )
}

function ThemeOption({
  label,
  preview,
  active,
  onClick,
}: {
  label: string
  preview: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group flex flex-col items-center gap-3 p-4 text-center transition-colors md:p-6"
    >
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-lg bg-foreground/5 transition-all',
          active
            ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
            : 'ring-1 ring-transparent group-hover:ring-foreground/15',
        )}
      >
        <img src={preview} alt={`${label} theme preview`} className="size-full object-cover" loading="lazy" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

// ── Step 4 ──────────────────────────────────────────────────────────────────
function SubscribeStep() {
  const { state, updateContext, next } = useOnboarding()
  if (!state) return null
  const flow = state.context.flowData
  const subscribed = flow.subscribeChangelog ?? true

  return (
    <div className="space-y-6">
      <header className="space-y-1 flex flex-col items-center justify-center text-center max-w-4xl">
        <TextAnimate as="h2" by="word" animation="blurInUp" delay={0.1} duration={0.5} startOnView={false} className="text-3xl sm:text-5xl font-bold">Subscribe to updates</TextAnimate>
        <TextAnimate as="p" by="word" animation="fadeIn" delay={0.3} duration={0.5} startOnView={false} className="text-foreground/80">Purpaw is constantly evolving. Subscribe to learn about changes.</TextAnimate>
      </header>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-foreground/30 p-4">
        <div className="space-y-0.5">
          <p className="font-medium">
            Subscribe to changelog <span className="font-normal text-foreground/70">(not marketing)</span>
          </p>
          <p className="text-sm text-foreground/70">Email about new features and improvements</p>
        </div>
        <Switch
          checked={subscribed}
          onCheckedChange={(v) => updateContext({ flowData: { ...flow, subscribeChangelog: v } })}
          aria-label="Subscribe to changelog"
        />
      </div>

      <Button className="h-11 w-full text-base" onClick={() => next()}>
        Continue
      </Button>
    </div>
  )
}

// ── Step 5 ──────────────────────────────────────────────────────────────────
function DoneStep() {
  const { state, updateContext, next } = useOnboarding()
  if (!state) return null
  const flow = state.context.flowData

  function finish(startTour: boolean) {
    updateContext({ flowData: { ...flow, startTour } })
    next()
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 flex flex-col items-center justify-center text-center max-w-4xl">
        <TextAnimate as="h2" by="word" animation="blurInUp" delay={0.1} duration={0.5} startOnView={false} className="text-3xl sm:text-5xl font-bold">You're good to go</TextAnimate>
        <TextAnimate as="p" by="word" animation="fadeIn" delay={0.3} duration={0.5} startOnView={false} className="text-foreground/80">Go ahead and explore the app. If you need guidance on using the app, please use the tour feature. You can re-enable the tour in Settings if needed.</TextAnimate>
      </header>

      <div className="space-y-2.5 pt-4 flex flex-col">
        <Button className="h-11 w-full text-base" onClick={() => finish(true)}>
          Start the tour
        </Button>
        <Button variant="secondary" className="h-11 w-full text-base" onClick={() => finish(false)}>
          Finish, I don't need a tour
        </Button>
      </div>
    </div>
  )
}
