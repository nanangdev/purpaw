import { useEffect, useRef } from "react"
import type Hls from "hls.js"
import { motion, useScroll, useTransform } from "motion/react"
import { createFileRoute } from "@tanstack/react-router"
import { CaretRightIcon } from "@phosphor-icons/react"
import { DiaTextReveal } from "@/components/motion/dia-text-reveal"
import { SpinningText } from "@/components/motion/spinning-text"
import { TextAnimate } from "@/components/motion/text-animate"
import FeatureScrollytelling from "@/components/landing/feature-scrollytelling"
import LandingPreview from "@/components/landing/preview"
import { ModernSeparator } from "@/components/glymph/modern-separator"
import LandingAiPowered from "@/components/landing/ai-powered"

const PLAYBACK_ID = "5Bk6THGwzsJuwmtjYhCHzh9wLvaL3lOxa2z1Opr8LSs"
const VIDEO_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8?min_resolution=720p`
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.png?time=0`

export const Route = createFileRoute("/(landing)/")({ component: LandingMain })

function LandingMain() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 600], [0, 120])
    const opacity = useTransform(scrollY, [0, 400], [0.8, 0.3])
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        let hls: Hls | null = null
        let cancelled = false

        // Safari / iOS play HLS natively — just point the element at the stream
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = VIDEO_SRC
            return
        }

        // Other browsers: attach the stream via hls.js (Media Source Extensions).
        // Dynamic import keeps hls.js out of the server bundle (SSR-safe).
        void import("hls.js").then(({ default: HlsLib }) => {
            if (cancelled || !HlsLib.isSupported()) return
            hls = new HlsLib({ capLevelToPlayerSize: true })
            hls.loadSource(VIDEO_SRC)
            hls.attachMedia(video)
            hls.on(HlsLib.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {})
            })
        })

        return () => {
            cancelled = true
            hls?.destroy()
        }
    }, [])

    return (
        <>
            <section className="relative min-h-svh lg:min-h-screen w-full bg-black text-white overflow-hidden flex flex-col justify-between pt-16 pb-6 xl:pb-8 px-6">
                <video
                    ref={videoRef}
                    poster={POSTER_SRC}
                    playsInline
                    loop
                    autoPlay
                    muted
                    className="absolute inset-0 z-1 mix-blend-difference w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-1 bg-linear-to-t from-black via-black/0 to-black/0 pointer-events-none" />

                {/* Giant Background Text */}
                <motion.div
                    style={{ y, opacity }}
                    className="absolute z-0 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-full max-w-7xl mx-auto flex items-center justify-center px-6 pointer-events-none"
                >
                    <TextAnimate animation="slideUp" by="character" as="h1" duration={0.5} className="text-[18vw] lg:text-[16vw] xl:text-[19vw] font-black tracking-wide text-center leading-none uppercase text-white">
                        Purpaw
                    </TextAnimate>
                </motion.div>

                {/* Main Content Container */}
                <div className="relative z-2 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between gap-12">

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 gap-8 items-end mt-auto pt-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end lg:items-start mt-12 lg:mt-24">

                            {/* Left Column */}
                            <div className="flex flex-col items-start gap-6 max-w-md md:max-w-lg xl:max-w-none">
                                <h2 className="text-4xl md:text-5xl font-bold leading-snug text-white pr-4">
                                    Your cat is part of{" "}<DiaTextReveal textColor="#fff" text="your family." className="leading" />
                                </h2>

                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col md:flex-row lg:flex-col items-start md:items-center md:justify-between lg:items-end gap-6 text-left lg:text-right">
                                <div className="max-w-xs space-y-4">
                                    <p className="md:text-sm lg:text-base xl:text-lg leading-relaxed">
                                        Purpaw is a comprehensive web-based app for pet cat care.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Left Column Buttons (lg:col-span-7) */}
                        <div className="relative w-full flex flex-row items-end justify-between">
                            <div className="flex flex-wrap items-center gap-4">
                                <button className="bg-linear-to-r from-primary to-primary/90 text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.2)] cursor-pointer">
                                    Start Now
                                </button>
                                <button
                                    onClick={() => {
                                        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                                    }}
                                    className="relative bg-black/90 backdrop-blur-2xl rounded-full p-1 pl-5 h-auto text-white flex flex-row items-center gap-5 hover:brightness-105 cursor-pointer"
                                >
                                    <div className="absolute inset-0 rounded-full glow-ring-outer pointer-events-none" />
                                    <span className="font-pixel">Feature</span>
                                    <div className="relative size-9 flex items-center justify-center bg-black/30 backdrop-blur-2xl rounded-full">
                                        {/* Glowing rings in top-left & bottom-right */}
                                        <div className="absolute inset-0 rounded-full glow-ring-inner pointer-events-none" />

                                        <CaretRightIcon className="relative z-10" />
                                    </div>
                                </button>
                            </div>

                            <div className="absolute bottom-0 right-0">
                                <SpinningText reverse className="hidden md:block text-base" radius={5}>
                                    AI-Powered • AI-Powered •
                                </SpinningText>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FeatureScrollytelling />
            <LandingPreview />
            <div className="w-full px-6 xl:px-0" aria-hidden="true">
                <ModernSeparator />
            </div>
            <LandingAiPowered />
            <section className="h-svh"></section>
        </>
    )
}