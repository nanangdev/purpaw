import { createContext, useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { Paw } from "@/components/glymph/paw"
import { Button } from "@/components/ui/button"
import { EqualsIcon, XIcon } from "@phosphor-icons/react"
import { Outlet, createFileRoute } from "@tanstack/react-router"
import { motion } from "motion/react"
import { PawCursor } from "@/components/cursor/paw-cursor"
import { TextRoll } from "@/components/motion/text-roll"
import LandingFooter from "@/components/landing/footer"
import { CookieConsent } from "@/components/layout/cookie-consent"

// Exposes a `scrollToId(id)` helper backed by the global Lenis instance so any
// descendant (e.g. the hero CTA in index.tsx) can smooth-scroll consistently.
export const LenisScrollContext = createContext<(id: string) => void>(() => { })

export const Route = createFileRoute("/(landing)")({
    component: LandingLayout,
})

function LandingLayout() {
    const [isAtTop, setIsAtTop] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const lenisRef = useRef<Lenis | null>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const menuPanelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Single global Lenis instance for the whole page, synced with ScrollTrigger.
    // Driving Lenis through gsap.ticker keeps smooth-scroll and GSAP pin/scrub
    // perfectly in lockstep, so scrolling stays consistent across every section.
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        gsap.registerPlugin(ScrollTrigger)

        const lenis = new Lenis({ autoRaf: false, anchors: false })
        lenisRef.current = lenis
        lenis.on("scroll", ScrollTrigger.update)
        const ticker = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(ticker)
        gsap.ticker.lagSmoothing(0)

        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener("load", refresh)
        const refreshTimeout = setTimeout(refresh, 300)

        return () => {
            window.removeEventListener("load", refresh)
            clearTimeout(refreshTimeout)
            gsap.ticker.remove(ticker)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    // Menu (dialog) focus management: move focus in on open, trap Tab, close on
    // Escape, and restore focus to the toggle when it closes.
    useEffect(() => {
        if (!isMenuOpen) return
        const button = menuButtonRef.current
        const panel = menuPanelRef.current
        if (!button || !panel) return

        const collectFocusables = (): HTMLElement[] => {
            const els: HTMLElement[] = [button]
            panel
                .querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
                )
                .forEach((el) => els.push(el))
            return els
        }

        const initial = collectFocusables()
        initial[1]?.focus?.()

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault()
                setIsMenuOpen(false)
                return
            }
            if (e.key !== "Tab") return
            const list = collectFocusables()
            if (list.length === 0) return
            const first = list[0]
            const last = list[list.length - 1]
            const active = document.activeElement as HTMLElement | null
            if (e.shiftKey && active === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && active === last) {
                e.preventDefault()
                first.focus()
            }
        }
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            button.focus()
        }
    }, [isMenuOpen])

    const scrollToId = (id: string) => {
        const target = document.getElementById(id)
        if (!target) return
        if (lenisRef.current) lenisRef.current.scrollTo(target)
        else target.scrollIntoView({ behavior: "smooth" })
    }

    const scrollToSection = (id: string) => (e: MouseEvent) => {
        setIsMenuOpen(false)
        if (window.location.pathname !== "/") return
        e.preventDefault()
        scrollToId(id)
    }

    return (
        <LenisScrollContext.Provider value={scrollToId}>
            <a
                href="#main-content"
                className="group fixed left-1/2 top-0 z-200 block -translate-x-1/2 -translate-y-full opacity-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:translate-y-4 focus:opacity-100 focus:pointer-events-auto focus:outline-none"
            >
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black backdrop-blur-md text-white border border-white/20 transition-all duration-300">
                    <span className="text-sm font-semibold tracking-wide text-white group-hover:text-white/80 transition-colors duration-300">
                        Lewati ke konten utama
                    </span>
                </div>
            </a>
            <style>{`
                html.lenis, html.lenis body { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
            `}</style>
            <PawCursor />
            {/* Backdrop Overlay (Click outside to close) */}
            <motion.div
                initial={false}
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, pointerEvents: "auto" },
                    closed: { opacity: 0, pointerEvents: "none" }
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-98 bg-black/60 backdrop-blur-sm"
            />

            <header
                className={`fixed w-full z-99 transition-all duration-300 top-0 left-0 right-0 px-0 md:px-2 ${isAtTop ? "top-0 md:top-2" : "top-0"
                    }`}
            >
                <div className={`relative max-w-7xl mx-auto flex flex-row items-center justify-between transition-all duration-300 ${isAtTop ? "bg-transparent h-15 md:h-18 p-4 xl:px-0 w-full border border-transparent!" : "bg-transparent backdrop-blur-lg h-auto p-2 md:p-3 px-4 md:px-5 xl:px-4 w-[calc(100%-32px)] md:w-[calc(100%-64px)] xl:w-[calc(100%-120px)] rounded-full border border-border/20 mt-4"
                    }  ${isMenuOpen ? "bg-zinc-950/95 border-white/10" : "bg-transparent"}`}>
                    <div className="flex-1 flex justify-end md:justify-start order-2 md:order-1">
                        <button
                            ref={menuButtonRef}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                            aria-haspopup="menu"
                            aria-controls="landing-menu"
                            className={`relative rounded-full p-1 md:p-1.5 pr-3 h-auto text-white flex flex-row items-center gap-1.5 md:gap-3 md:pr-4 hover:brightness-105 cursor-pointer ${isAtTop ? "md:bg-black/90 md:backdrop-blur-2xl" : "md:bg-transparent md:backdrop-blur-none"}`}
                        >
                            <div className={`hidden absolute inset-0 rounded-full glow-ring-outer pointer-events-none ${isAtTop ? "md:block" : "md:hidden"}`} />
                            <div className={`relative size-7.5 flex items-center justify-center rounded-full transition-all duration-300 ${isAtTop ? "md:bg-black/30 md:backdrop-blur-2xl" : "md:bg-transparent md:backdrop-blur-2xl"}`}>
                                {/* Glowing rings in top-left & bottom-right */}
                                <div className={`hidden absolute inset-0 rounded-full glow-ring-inner pointer-events-none ${isAtTop ? "md:block" : "md:hidden"}`} />

                                {isMenuOpen ? (
                                    <XIcon className={`relative size-10 transition-all duration-300 z-10 ${isAtTop ? "md:size-7" : "md:size-12!"}`} />
                                ) : (
                                    <EqualsIcon className={`relative size-10 transition-all duration-300 z-10 ${isAtTop ? "md:size-7" : "md:size-12!"}`} />
                                )}
                            </div>
                            <span className={`sr-only ${isAtTop ? "md:not-sr-only" : "sr-only"}`}>{isMenuOpen ? "Tutup" : "Menu"}</span>
                        </button>
                    </div>
                    <a href="/" title="Purpaw" className="flex-none order-1 md:order-2">
                        <Paw variant={`${isAtTop ? "filled" : "outline"}`} className={`size-9 transition-all duration-300 ${isAtTop ? "text-primary dark:text-blue-500" : "text-white"}`} />
                        <span className="sr-only">Purpaw</span>
                    </a>
                    <div className="flex-1 flex flex-row items-center justify-end sr-only md:not-sr-only md:order-3">
                        <Button size="lg" className="px-12" asChild>
                            <a href="/login" title="Masuk">
                                Mulai
                            </a>
                        </Button>
                    </div>

                    {/* Dropdown Menu Panel (Inherits width and curves of the Header Container) */}
                    <motion.div
                        ref={menuPanelRef}
                        id="landing-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu navigasi"
                        inert={!isMenuOpen}
                        initial={false}
                        animate={isMenuOpen ? "open" : "closed"}
                        variants={{
                            open: {
                                opacity: 1,
                                height: "var(--menu-open-height)",
                                pointerEvents: "auto",
                                transition: {
                                    height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.3 }
                                }
                            },
                            closed: {
                                opacity: 0,
                                height: 0,
                                pointerEvents: "none",
                                transition: {
                                    height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.35, ease: "easeInOut" }
                                }
                            }
                        }}
                        className={`absolute bg-transparent backdrop-blur-none top-full left-0 w-full z-80 overflow-hidden mt-3 flex flex-col gap-3 border-0 shadow-none [--menu-open-height:calc(100svh-90px)] md:[--menu-open-height:calc(100svh-120px)] ${isAtTop ? "px-4 md:px-0" : "md:px-0"}`}
                    >
                        {/* CARD 1: Main Navigation Links (Group 1) */}
                        <div className="w-full bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-6 md:p-8 flex flex-col relative shadow-2xl overflow-hidden grow flex-1">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--primary)/8%,transparent_50%)] pointer-events-none" />

                            {/* Group 1: Menu Main Navigation Links (Scrollable if height is insufficient) */}
                            <nav aria-label="Main Navigation" className="w-full overflow-y-auto scroll-fade-y grow pr-1 z-10 scrollbar-none flex flex-col items-center">
                                <div className="flex flex-col items-center gap-1.5 md:gap-2.5 text-center font-black uppercase select-none w-full my-auto py-4">
                                    <a
                                        href="/#features"
                                        className="text-3xl md:text-4xl lg:text-5xl text-white transition-colors duration-300 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        onClick={scrollToSection("features")}
                                    >
                                        <TextRoll center>Feature</TextRoll>
                                    </a>
                                    <a
                                        href="/#preview"
                                        className="text-3xl md:text-4xl lg:text-5xl text-white transition-colors duration-300 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        onClick={scrollToSection("preview")}
                                    >
                                        <TextRoll center>Preview</TextRoll>
                                    </a>
                                    <a
                                        href="/#ai"
                                        className="text-3xl md:text-4xl lg:text-5xl text-white transition-colors duration-300 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        onClick={scrollToSection("ai")}
                                    >
                                        <TextRoll center>AI</TextRoll>
                                    </a>
                                    <a
                                        href="/#faq"
                                        className="text-3xl md:text-4xl lg:text-5xl text-white transition-colors duration-300 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        onClick={scrollToSection("faq")}
                                    >
                                        <TextRoll center>FAQ</TextRoll>
                                    </a>
                                    {/* item lainnya */}
                                </div>
                            </nav>
                        </div>

                        {/* CARD 2: Login, Account & Status (Group 2 - Fixed at the bottom) */}
                        <div className="w-full bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-full p-2 md:px-4 flex flex-row items-center justify-between gap-3 relative z-10 flex-none">
                            <span className="text-white/80 uppercase ml-2">Not logged in</span>
                            <Button size="lg" className="px-8 -mr-1" asChild>
                                <a href="/login" title="Masuk" onClick={() => setIsMenuOpen(false)}>
                                    Masuk
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main id="main-content" tabIndex={-1} className="bg-black text-white focus:outline-none">
                <Outlet />
            </main>

            <LandingFooter />
            {/* PREVIEW ONLY — UI cookie consent, belum disistemkan */}
            <CookieConsent />
        </LenisScrollContext.Provider>
    )
}