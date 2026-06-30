import { useEffect, useRef } from 'react'
import type Hls from 'hls.js'
import { useReducedMotion } from 'motion/react'
import { Paw } from '@/components/glymph/paw'
import { Google } from '@/components/logos/google'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

const PLAYBACK_ID = 'jV4zlaQi0002Es8c8BJ8v1Muq022ZN9StxMCm2PlG5VU3k'
const VIDEO_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8?min_resolution=720p`
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.png?time=2`

export const Route = createFileRoute('/(login)/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

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

  return (
    <div className="w-full min-h-dvh flex flex-row lg:flex-col xl:flex-row items-center justify-center xl:justify-between overflow-x-hidden xl:gap-6">
      <section className="order-2 lg:order-1 xl:order-2 w-full max-w-lg lg:w-1/2 xl:w-4/7 bg-background flex flex-col items-center justify-center relative lg:rounded-2xl xl:h-[calc(100svh-64px)] xl:mr-6 px-6 xl:px-12 overflow-hidden">
        <div className="w-full flex flex-col items-center justify-center relative">
          <div className="mb-5">
            <Paw variant="filled" className="size-12" aria-label="Babu" />
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Login or Register</h1>
            <p className="mt-1.5 text-base">To use Purpaw you must log into an existing account or create one using one of the options below</p>
          </div>
        </div>
        <div className="flex flex-col items-center w-full mb-4 pt-2">
          <Button
            type='button'
            variant="secondary"
            className="group relative w-full flex items-center justify-center gap-2.5 h-11 px-4 text-base uppercase transition-all duration-200 mb-5"
          >
            <Google />
            Google

            {/* terakhir digunakan */}
            <Badge className="text-xs normal-case absolute -top-2 right-2">Terakhir digunakan</Badge>
          </Button>
          <div className="w-full flex flex-row items-center justify-center gap-2 relative overflow-hidden text-sm text-foreground/80 mb-4">
            <Separator />
            <span>atau</span>
            <Separator />
          </div>

          {/* warning! ada form */}
          <form className="w-full">
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
                className="text-base w-full h-[3.29rem] rounded-[12px] border pt-4.5 px-4 focus:border-primary/70 focus-visible:border-primary/70 focus-visible:outline-primary/70 transition-all caret-primary"
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
              disabled
              className="group relative w-full flex items-center justify-center gap-2.5 h-11 px-4 text-base transition-all duration-200 my-5"
            >
              <span>Masuk</span>

              {/* loading */}
              {/* <ActivityIndicator /> */}

              {/* terakhir digunakan */}
              <Badge variant="secondary" className="text-xs normal-case absolute -top-2 right-2">Terakhir digunakan</Badge>
            </Button>

            <p className="text-sm md:text-base text-center text-foreground/90 md:mt-8">
              By signing in, you accept the <a href="#" target="_blank" className="underline underline-offset-1 hover:no-underline">Terms of Service</a> and acknowledge our <a href="#" target="_blank" className="underline underline-offset-1 hover:no-underline">Privacy Policy</a>.
            </p>
          </form>
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
    </div>
  )
}