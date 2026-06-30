import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { CaretLeftIcon } from "@phosphor-icons/react"
import { TextRoll } from "@/components/motion/text-roll"
import { Badge } from "@/components/ui/badge"

export function NotFound() {
    const [isPopped, setIsPopped] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handlePointerDown = useCallback(() => {
        setIsPopped(true)
        if (!audioRef.current) {
            audioRef.current = new Audio("https://cdn-purpaw-l.ngepos.com/n/pop.ogg")
        }
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => { })
    }, [])

    const handlePointerUp = useCallback(() => {
        setIsPopped(false)
    }, [])

    return (
        <main className="relative min-h-svh w-full p-6 overflow-hidden flex flex-col items-center justify-center gap-16 select-none">
            <div className="flex flex-col gap-8 items-center justify-between z-2">
                <h1 className="order-2 text-base xl:text-xl text-center">Bruh you're looking for something that doesn't exist</h1>
                <div className="order-1 flex flex-row items-center justify-center text-[32vw] md:text-[24vw] font-black leading-none tracking-wide">
                    <span><TextRoll center>4</TextRoll></span>
                    <div
                        className="relative flex flex-col items-center justify-center leading-none cursor-pointer select-none"
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <img
                            src="https://cdn-purpaw-l.ngepos.com/n/unpop.webp"
                            alt=""
                            className={`block h-[1em] w-auto object-contain pointer-events-none ${isPopped ? "opacity-0" : "opacity-100"}`}
                            draggable={false}
                        />
                        <img
                            src="https://cdn-purpaw-l.ngepos.com/n/pop.webp"
                            alt="popcat"
                            className={`absolute inset-0 block h-[1em] w-auto object-contain pointer-events-none ${isPopped ? "opacity-100" : "opacity-0"}`}
                            draggable={false}
                        />
                        <Badge variant="outline" className="tracking-normal">Click me</Badge>
                    </div>
                    <span><TextRoll center>4</TextRoll></span>
                </div>
            </div>
            <div className="flex flex-row items-center z-2">
                <Button size="lg" asChild>
                    <a href="/">
                        <CaretLeftIcon weight="bold" />
                        Back to Home
                    </a>
                </Button>
            </div>
        </main>
    )
}
