"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MouseScrollIcon from "@/components/motion/mouse-scroll-icon"
import { IphoneFrame } from "@/components/glymph/iphone-frame"
import { IpadFrame } from "@/components/glymph/ipad-frame"

interface PreviewItem {
    mobileUrl: string
    tabletUrl: string
    alt: string
}

const PREVIEW_ITEMS: PreviewItem[] = [
    { mobileUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-mobile.webp", tabletUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-tablet.webp", alt: "Pratinjau antarmuka Purpaw" },
    { mobileUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-mobile.webp", tabletUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-tablet.webp", alt: "Pratinjau pelacak kesehatan" },
    { mobileUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-mobile.webp", tabletUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-tablet.webp", alt: "Pratinjau pengingat pintar" },
    { mobileUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-mobile.webp", tabletUrl: "https://cdn-purpaw-l.ngepos.com/l/placeholder/placeholder-tablet.webp", alt: "Pratinjau komunitas Purpaw" },
]

function PreviewBezelItem({ item }: { item: PreviewItem }) {
    return (
        <div className="relative flex h-full flex-none items-center">
            <div className="h-full text-black lg:hidden">
                <IphoneFrame
                    src={item.mobileUrl}
                    role="img"
                    aria-label={item.alt}
                    className="h-full w-auto select-none"
                />
            </div>

            <div className="hidden h-full text-black lg:block">
                <IpadFrame
                    src={item.tabletUrl}
                    role="img"
                    aria-label={item.alt}
                    className="h-full w-auto select-none"
                />
            </div>
        </div>
    )
}

export default function LandingPreview() {
    const sectionRef = useRef<HTMLElement>(null)
    const leftDoorRef = useRef<HTMLDivElement>(null)
    const rightDoorRef = useRef<HTMLDivElement>(null)
    const previewLeftRef = useRef<HTMLDivElement>(null)
    const previewRightRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const stripWrapRef = useRef<HTMLDivElement>(null)
    const stripRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        const leftDoor = leftDoorRef.current
        const rightDoor = rightDoorRef.current
        const content = contentRef.current
        const stripWrap = stripWrapRef.current
        const strip = stripRef.current
        if (!section || !leftDoor || !rightDoor || !content || !stripWrap || !strip) return

        gsap.registerPlugin(ScrollTrigger)

        const PHASE_DOORS = 0.25

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=300%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            })

            tl.to(leftDoor, { xPercent: -100, duration: PHASE_DOORS, ease: "power2.inOut" }, 0)
            tl.to(rightDoor, { xPercent: 100, duration: PHASE_DOORS, ease: "power2.inOut" }, 0)
            tl.fromTo(
                [previewLeftRef.current, previewRightRef.current],
                { autoAlpha: 1 },
                { autoAlpha: 0, duration: PHASE_DOORS * 0.5 },
                0,
            )
            tl.fromTo(
                content,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: PHASE_DOORS },
                0,
            )

            tl.fromTo(
                strip,
                { x: 0 },
                {
                    x: () => -(strip.scrollWidth - stripWrap.clientWidth),
                    duration: 1 - PHASE_DOORS,
                },
                PHASE_DOORS,
            )
        }, sectionRef)

        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener("load", refresh)
        const refreshTimeout = setTimeout(refresh, 300)

        return () => {
            window.removeEventListener("load", refresh)
            clearTimeout(refreshTimeout)
            ctx.revert()
        }
    }, [])

    const wordClass =
        "text-[18vw] leading-none font-black tracking-tight text-white uppercase select-none md:text-[16vw] lg:text-[14vw]"

    return (
        <>
            <style>{`
                html.lenis, html.lenis body { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
            `}</style>

            <section id="preview" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
                <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pt-24 pb-10 md:gap-10">
                    <div className="max-w-2xl flex-none text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-4xl lg:text-5xl">
                            Intip Sekilas Purpaw
                        </h2>
                        <p className="mt-3 text-sm text-white/60 md:text-base">
                            Lanjutkan scroll untuk menggeser pratinjau antarmuka — dari ponsel hingga tablet.
                        </p>
                    </div>
                    <div ref={stripWrapRef} className="w-full flex-1 overflow-hidden">
                        <div ref={stripRef} className="flex h-full items-center gap-5 px-6 select-none md:gap-10 md:px-12">
                            {PREVIEW_ITEMS.map((item, i) => (
                                <PreviewBezelItem key={i} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                <div ref={leftDoorRef} className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-black">
                    <div className="absolute inset-y-0 left-0 flex w-[200%] items-center justify-center">
                        <div ref={previewLeftRef} aria-hidden="true" className={wordClass}>
                            PREVIEW
                        </div>
                    </div>
                    <div aria-hidden="true" className="absolute bottom-0 left-0 flex w-[200%] justify-center pb-8">
                        <MouseScrollIcon className="relative bottom-auto left-auto translate-x-0 text-white" />
                    </div>
                </div>

                <div ref={rightDoorRef} className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-black">
                    <div className="absolute inset-y-0 right-0 flex w-[200%] items-center justify-center">
                        <div ref={previewRightRef} aria-hidden="true" className={wordClass}>
                            PREVIEW
                        </div>
                    </div>
                    <div aria-hidden="true" className="absolute bottom-0 right-0 flex w-[200%] justify-center pb-8">
                        <MouseScrollIcon className="relative bottom-auto left-auto translate-x-0 text-white" />
                    </div>
                </div>
            </section>
        </>
    )
}
