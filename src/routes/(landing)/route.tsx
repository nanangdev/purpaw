import { useEffect, useState } from "react"
import { Paw } from "@/components/glymph/paw"
import { Button } from "@/components/ui/button"
import { EqualsIcon } from "@phosphor-icons/react"
import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(landing)")({
    component: LandingLayout,
})

function LandingLayout() {
    const [isAtTop, setIsAtTop] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <header
                className={`fixed w-full z-99 transition-all duration-300 bg-transparent top-0 left-0 right-0 px-0 md:px-2 top-0" ${isAtTop ? "md:top-2" : "top-4 md:top-6"
                    }`}
            >
                <div className={`relative max-w-7xl mx-auto flex flex-row items-center justify-between transition-all duration-300" ${isAtTop ? "bg-transparent h-15 md:h-18 p-4 xl:px-0 w-full border-0" : "bg-transparent backdrop-blur-lg h-auto p-2 md:p-3 px-4 md:px-5 xl:px-4 w-[calc(100%-32px)] md:w-[calc(100%-64px)] xl:w-[calc(100%-120px)] rounded-full border border-border/40"
                    }`}>
                    <nav className="flex-1 flex justify-end md:justify-start order-2 md:order-1">
                        <button className={`relative rounded-full p-1 md:p-1.5 pr-3 h-auto text-white flex flex-row items-center gap-1.5 md:gap-3 md:pr-4 hover:brightness-105 ${isAtTop ? "md:bg-black/90 md:backdrop-blur-2xl" : "md:bg-transparent md:backdrop-blur-none"}`}>
                            <div className={`hidden absolute inset-0 rounded-full glow-ring-outer pointer-events-none ${isAtTop ? "md:block" : "md:hidden"}`} />
                            <div className={`relative size-7.5 flex items-center justify-center rounded-full transition-all duration-300 ${isAtTop ? "md:bg-black/30 md:backdrop-blur-2xl" : "md:bg-transparent md:backdrop-blur-2xl"}`}>
                                {/* Glowing rings in top-left & bottom-right */}
                                <div className={`hidden absolute inset-0 rounded-full glow-ring-inner pointer-events-none ${isAtTop ? "md:block" : "md:hidden"}`} />

                                <EqualsIcon className={`relative size-10 transition-all duration-300 z-10 ${isAtTop ? "md:size-7" : "md:size-12!"}`} />
                            </div>
                            <span className={`sr-only ${isAtTop ? "md:not-sr-only" : "sr-only"}`}>Menu</span>
                        </button>
                    </nav>
                    <a href="/" title="Purpaw" className="flex-none order-1 md:order-2">
                        <Paw variant={`${isAtTop ? "filled" : "outline"}`} className={`size-9 transition-all duration-300 ${isAtTop ? "text-primary" : "text-white"}`} />
                        <span className="sr-only">Purpaw</span>
                    </a>
                    <div className="flex-1 flex flex-row items-center justify-end sr-only md:not-sr-only md:order-3">
                        <Button size="lg" className="px-12" asChild>
                            <a href="/login" title="Masuk">
                                Mulai
                            </a>
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>

            </footer>
        </>
    )
}