"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

interface AiMedia {
    type: "image" | "video"
    src: string
    poster?: string
}

interface AiItem {
    title: string
    description: string
    bg: string
    media: AiMedia
}

const AI_ITEMS: AiItem[] = [
    {
        title: "Diagnosis Cerdas",
        description:
            "Foto atau deskripsikan gejalanya. AI Purpaw mengenali kemungkinan penyebab dan menilai tingkat urgensi dalam hitungan detik.",
        bg: "#000", // tetap black agar sama dengan utamanya
        media: { type: "image", src: "https://placehold.co/1200x1500/0c1024/ffffff?text=01+Diagnosis" },
    },
    {
        title: "Saran Personal",
        description:
            "Rekomendasi perawatan, nutrisi, dan jadwal yang disesuaikan dengan ras, usia, serta riwayat kesehatan kucingmu.",
        bg: "#04181f",
        media: { type: "image", src: "https://placehold.co/1200x1500/04181f/ffffff?text=02+Saran" },
    },
    {
        title: "Asisten 24/7",
        description:
            "Tanya apa pun soal perilaku atau kesehatan kucing. Jawaban andal siap kapan pun kamu membutuhkannya.",
        bg: "#1a0820",
        media: { type: "image", src: "https://placehold.co/1200x1500/1a0820/ffffff?text=03+Asisten" },
    },
]

export default function LandingAiPowered() {
    const sectionRef = useRef<HTMLElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const slideRefs = useRef<(HTMLDivElement | null)[]>([])
    const mediaRefs = useRef<(HTMLElement | null)[]>([])

    useEffect(() => {
        const section = sectionRef.current
        const stage = stageRef.current
        if (!section || !stage) return

        gsap.registerPlugin(ScrollTrigger)
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        const lenisState: {
            lenis: Lenis | null
            ticker: ((time: number) => void) | null
        } = { lenis: null, ticker: null }

        const initLenis = () => {
            if (reduceMotion || lenisState.lenis) return
            const lenis = new Lenis({ autoRaf: false, anchors: false })
            lenis.on("scroll", ScrollTrigger.update)
            const ticker = (time: number) => lenis.raf(time * 1000)
            gsap.ticker.add(ticker)
            gsap.ticker.lagSmoothing(0)
            lenisState.lenis = lenis
            lenisState.ticker = ticker
        }

        const destroyLenis = () => {
            if (lenisState.ticker) {
                gsap.ticker.remove(lenisState.ticker)
                lenisState.ticker = null
            }
            if (lenisState.lenis) {
                lenisState.lenis.destroy()
                lenisState.lenis = null
            }
        }

        const slideEls = slideRefs.current.filter(Boolean) as HTMLDivElement[]
        const mediaEls = mediaRefs.current.filter(Boolean) as HTMLElement[]
        const N = AI_ITEMS.length

        const ctx = gsap.context(() => {
            gsap.from(".ai-header > *", {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: ".ai-header",
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })

            // initial states: slide 0 visible, the rest clipped + content hidden
            slideEls.forEach((el, i) => {
                gsap.set(el, { clipPath: i === 0 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" })
                gsap.set(el.querySelectorAll("[data-line]"), { yPercent: i === 0 ? 0 : 115 })
                gsap.set(el.querySelectorAll("[data-fade]"), {
                    opacity: i === 0 ? 1 : 0,
                    y: i === 0 ? 0 : 18,
                })
            })
            mediaEls.forEach((el, i) => gsap.set(el, { scale: i === 0 ? 1 : 1.15 }))

            const slot = 1 / N
            const half = slot * 0.4

            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: stage,
                    start: "top top",
                    end: () => "+=" + window.innerHeight * N,
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            })

            for (let i = 1; i < N; i++) {
                const start = i * slot - half
                const dur = half * 2
                tl.to(slideEls[i], { clipPath: "inset(0 0% 0 0)", duration: dur, ease: "power2.inOut" }, start)
                tl.to(mediaEls[i], { scale: 1, duration: dur, ease: "power2.out" }, start)
                tl.to(
                    slideEls[i].querySelectorAll("[data-line]"),
                    { yPercent: 0, duration: dur * 0.7, ease: "power3.out", stagger: 0.05 },
                    start + half * 0.35,
                )
                tl.to(
                    slideEls[i].querySelectorAll("[data-fade]"),
                    { opacity: 1, y: 0, duration: dur * 0.7, ease: "power2.out" },
                    start + half * 0.45,
                )
            }

            // hold on the last slide before the pin releases
            tl.to({}, { duration: 0.6 * slot })

            ScrollTrigger.create({
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                onEnter: initLenis,
                onEnterBack: initLenis,
                onLeave: destroyLenis,
                onLeaveBack: destroyLenis,
            })
        }, sectionRef)

        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener("load", refresh)
        const refreshTimeout = setTimeout(refresh, 300)

        return () => {
            window.removeEventListener("load", refresh)
            clearTimeout(refreshTimeout)
            ctx.revert()
            destroyLenis()
        }
    }, [])

    return (
        <section ref={sectionRef} id="ai" className="relative w-full overflow-hidden bg-black text-white">
            <div className="ai-header mx-auto max-w-3xl px-6 pt-28 pb-16 text-center md:pt-36">
                <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                    AI yang Paham Kucingmu
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm text-white/60 md:text-base">
                    Purpaw menggabungkan data kesehatan kucing dengan kecerdasan buatan untuk
                    memberi saran yang tepat — kapan pun, di mana pun.
                </p>
            </div>

            <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
                {AI_ITEMS.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            slideRefs.current[i] = el
                        }}
                        className="absolute inset-0"
                        style={{ zIndex: i, backgroundColor: item.bg }}
                    >
                        <div className="flex h-full flex-col lg:flex-row">
                            {/* media half */}
                            <div className="relative min-h-0 flex-1 overflow-hidden lg:h-full lg:w-1/2 lg:flex-none">
                                {item.media.type === "video" ? (
                                    <video
                                        ref={(el) => {
                                            mediaRefs.current[i] = el
                                        }}
                                        src={item.media.src}
                                        poster={item.media.poster}
                                        className="h-full w-full select-none object-cover"
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        ref={(el) => {
                                            mediaRefs.current[i] = el
                                        }}
                                        src={item.media.src}
                                        alt={item.title}
                                        loading="lazy"
                                        draggable={false}
                                        className="h-full w-full select-none object-cover"
                                    />
                                )}
                            </div>

                            {/* text half */}
                            <div className="flex min-h-0 flex-1 flex-col justify-center px-6 py-8 sm:px-10 lg:h-full lg:w-1/2 lg:flex-none lg:justify-center lg:px-16 lg:py-20">
                                <div className="overflow-hidden">
                                    <span
                                        data-line
                                        className="block text-[11px] font-semibold tracking-[0.3em] text-white/50 uppercase"
                                    >
                                        0{i + 1} — Fitur AI
                                    </span>
                                </div>
                                <div className="mt-3 overflow-hidden">
                                    <h3
                                        data-line
                                        className="block text-3xl font-black leading-[1.02] tracking-tight text-white md:text-4xl lg:text-6xl"
                                    >
                                        {item.title}
                                    </h3>
                                </div>
                                <p
                                    data-fade
                                    className="mt-4 max-w-md text-sm leading-relaxed text-white/60 md:text-base"
                                >
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
