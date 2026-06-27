"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import gsap from "gsap"
import Zdog from "zdog"
import { cn } from "@/lib/utils"

type ZNode = { translate: { x: number; y: number; z: number }; children: unknown[]; updateGraph: () => void; remove: () => void }

type CursorStatus = "default" | "pointer" | "pressed" | "not-allowed"

export interface PawCursorProps {
    offset?: [number, number]
    size?: number
    furColor?: string
    padColor?: string
    padPrintColor?: string
    maxPrintLifeTime?: number
    laserColor?: string
    zIndex?: number
}

const DEFAULT_SHAPE_SIZE = 80
const DEFAULT_OFFSET: [number, number] = [60, 30]

const INTERACTIVE_SELECTOR =
    'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor="pointer"]'
const NOT_ALLOWED_SELECTOR = '[data-cursor="not-allowed"], [disabled], [aria-disabled="true"]'

function hexToRgba(hex: string, alpha = 1): string {
    let h = hex.replace("#", "")
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    const n = Number.parseInt(h, 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return `rgba(${r},${g},${b},${alpha})`
}

function PawPrintCanvas({
    size,
    padPrintColor,
    maxPrintLifeTime,
    zIndex,
}: {
    size: number
    padPrintColor: string
    maxPrintLifeTime: number
    zIndex: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        const canvas = canvasRef.current
        if (!canvas) return

        const { Illustration, Group, Hemisphere } = Zdog
        const v = (b: number) => b * (size / DEFAULT_SHAPE_SIZE)
        // Size the canvas *before* creating the Illustration — Zdog bakes the
        // element dimensions into the renderer at construction. Combined with
        // centered:false (origin at the top-left instead of the canvas center),
        // print positions no longer depend on the canvas size at all, so they
        // stay correct across viewport resize / devtools / iframe preview.
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const illo = new Illustration({ element: canvas, centered: false })
        const pads: { group: ZNode; docX: number; docY: number; createdAt: number }[] = []
        let mx = window.innerWidth / 2
        let my = window.innerHeight / 2

        // With centered:false the origin is the canvas top-left, so a print's
        // group sits directly at its document coordinates; scroll is offset
        // once via illo.translate in the loop. Document coords never change on
        // resize, so prints stay exactly where they were placed.
        const layoutPrint = (p: { group: ZNode; docX: number; docY: number }) => {
            p.group.translate.x = p.docX
            p.group.translate.y = p.docY + v(20)
        }

        const spawn = () => {
            const group = new Group({
                addTo: illo,
                rotate: { z: -Math.PI / 20 },
            }) as unknown as ZNode
            new Hemisphere({ addTo: group as never, translate: { y: v(-10), z: v(38) }, diameter: 0, color: padPrintColor, stroke: 0, width: v(45), height: v(40) })
            new Hemisphere({ addTo: group as never, translate: { y: v(-13), z: v(38) }, diameter: 0, color: padPrintColor, stroke: 0, width: v(35), height: v(40) })
            for (const [x, y] of [[20, -40], [8, -50], [-8, -50], [-20, -40]] as const) {
                new Hemisphere({ addTo: group as never, translate: { x: v(x), y: v(y), z: v(38) }, diameter: 0, color: padPrintColor, width: v(10), height: v(20) })
            }
            const p = {
                group,
                docX: mx + window.scrollX,
                docY: my + window.scrollY,
                createdAt: performance.now(),
            }
            layoutPrint(p)
            pads.push(p)
            illo.updateRenderGraph()
        }

        const onMove = (e: PointerEvent) => {
            mx = e.clientX
            my = e.clientY
        }
        const onDown = () => spawn()
        const onResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            illo.updateRenderGraph()
        }
        onResize()

        let raf = 0
        const loop = () => {
            const now = performance.now()
            illo.translate.x = -window.scrollX
            illo.translate.y = -window.scrollY
            for (let i = pads.length - 1; i >= 0; i--) {
                const p = pads[i]
                const dt = now - p.createdAt
                if (dt > maxPrintLifeTime - 1000) {
                    const opacity = 1 - (dt - (maxPrintLifeTime - 1000)) / 1000
                    const col = hexToRgba(padPrintColor, opacity)
                    p.group.children.forEach((c) => {
                        if (c instanceof Hemisphere) (c as { color: string }).color = col
                    })
                    p.group.updateGraph()
                }
                if (dt > maxPrintLifeTime) {
                    p.group.remove()
                    pads.splice(i, 1)
                }
            }
            illo.updateRenderGraph()
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)

        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerdown", onDown)
        window.addEventListener("resize", onResize)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerdown", onDown)
            window.removeEventListener("resize", onResize)
            pads.forEach((p) => p.group.remove())
            illo.remove()
        }
    }, [size, padPrintColor, maxPrintLifeTime])

    return <canvas ref={canvasRef} className="pointer-events-none fixed left-0 top-0" style={{ zIndex }} />
}

export function PawCursor({
    offset = DEFAULT_OFFSET,
    size = 40,
    furColor = "#444",
    padColor = "#FFA5A5",
    padPrintColor = "#DDD",
    maxPrintLifeTime = 5000,
    laserColor = "#F00",
    zIndex = 2147483647,
}: PawCursorProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [active, setActive] = useState(false)
    const [laserState, setLaserState] = useState<CursorStatus>("default")

    const mouseX = useMotionValue(-100)
    const mouseY = useMotionValue(-100)
    const laserX = useMotionValue(-100)
    const laserY = useMotionValue(-100)
    const springX = useSpring(mouseX, { stiffness: 170, damping: 17, mass: 0.7 })
    const springY = useSpring(mouseY, { stiffness: 170, damping: 17, mass: 0.7 })

    useEffect(() => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
            setActive(true)
        }
    }, [])

    useEffect(() => {
        if (!active) return
        const svg = svgRef.current
        if (!svg) return

        const { Illustration, Shape, Hemisphere } = Zdog
        const v = (b: number) => b * (size / DEFAULT_SHAPE_SIZE)

        const illo = new Illustration({ element: svg })
        const arm = new Shape({
            addTo: illo,
            stroke: v(70),
            path: [{ y: v(-40) }, { bezier: [{ y: v(0) }, { y: v(0) }, { y: v(40) }] }],
            color: furColor,
        }) as unknown as { path: unknown[]; color: string; updatePath: () => void }

        new Hemisphere({ addTo: illo, translate: { y: v(-10), z: v(38) }, diameter: 0, color: padColor, stroke: 0, width: v(45), height: v(40) })
        new Hemisphere({ addTo: illo, translate: { y: v(-13), z: v(38) }, diameter: 0, color: padColor, stroke: 0, width: v(35), height: v(40) })
        for (const [x, y] of [[20, -40], [8, -50], [-8, -50], [-20, -40]] as const) {
            new Hemisphere({ addTo: illo, translate: { x: v(x), y: v(y), z: v(38) }, diameter: 0, color: padColor, width: v(10), height: v(20) })
        }

        const updateArm = (armEndX: number) => {
            arm.path = [{ y: v(-40) }, { bezier: [{ y: v(-20) }, { y: v(20) }, { x: armEndX, y: v(40) }] }]
            arm.color = furColor
            arm.updatePath()
        }

        const html = document.documentElement
        const prevCursor = html.style.cursor
        html.style.cursor = "none"

        const pose = { offsetX: offset[0], offsetY: offset[1], armEndX: v(10), roll: Math.PI / 10, yaw: Math.PI / 20 }

        const POSES: Record<CursorStatus, { offsetX: number; offsetY: number; armEndX: number; roll: number; yaw: number; duration: number; ease: string }> = {
            default: { offsetX: offset[0], offsetY: offset[1], armEndX: v(10), roll: Math.PI / 10, yaw: Math.PI / 20, duration: 0.8, ease: "elastic.out(1,0.5)" },
            pointer: { offsetX: offset[0] * 1.5, offsetY: -offset[1] * 1.5, armEndX: v(20), roll: Math.PI / 6, yaw: Math.PI / 6, duration: 0.5, ease: "back.out(2)" },
            pressed: { offsetX: 0, offsetY: offset[1] / 2, armEndX: v(-30), roll: Math.PI, yaw: -Math.PI / 20, duration: 0.16, ease: "power3.out" },
            "not-allowed": { offsetX: 0, offsetY: v(20), armEndX: v(-20), roll: -Math.PI / 50 + Math.PI * 2, yaw: Math.PI / 100, duration: 0.5, ease: "back.out(2)" },
        }

        let currentStatus: CursorStatus = "default"
        let pressed = false
        let hover: CursorStatus = "default"
        let poseTween: gsap.core.Tween | null = null

        const applyStatus = (status: CursorStatus) => {
            if (status === currentStatus) return
            currentStatus = status
            setLaserState(status)
            const target = POSES[status]
            poseTween?.kill()
            poseTween = gsap.to(pose, {
                offsetX: target.offsetX,
                offsetY: target.offsetY,
                armEndX: target.armEndX,
                roll: target.roll,
                yaw: target.yaw,
                duration: target.duration,
                ease: target.ease,
                onUpdate: () => updateArm(pose.armEndX),
            })
        }

        const resolveStatus = (): CursorStatus => {
            if (hover === "not-allowed") return "not-allowed"
            if (pressed) return "pressed"
            if (hover === "pointer") return "pointer"
            return "default"
        }

        let lastX = 0
        let lastT = performance.now()
        let rawVx = 0
        let velYaw = 0

        const onMove = (e: PointerEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
            laserX.set(e.clientX)
            laserY.set(e.clientY)
            const now = performance.now()
            const dt = Math.max(1, now - lastT)
            rawVx = (e.clientX - lastX) / dt
            lastX = e.clientX
            lastT = now

            const t = e.target as Element | null
            if (t && typeof t.closest === "function") {
                if (t.closest(NOT_ALLOWED_SELECTOR)) hover = "not-allowed"
                else if (t.closest(INTERACTIVE_SELECTOR)) hover = "pointer"
                else hover = "default"
            } else {
                hover = "default"
            }
            applyStatus(resolveStatus())
        }
        const onDown = () => {
            pressed = true
            applyStatus(resolveStatus())
        }
        const onUp = () => {
            pressed = false
            applyStatus(resolveStatus())
        }

        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerdown", onDown)
        window.addEventListener("pointerup", onUp)

        let raf = 0
        const loop = () => {
            const status = currentStatus
            const targetVel = status === "default" ? Math.max(-0.6, Math.min(0.6, rawVx / 4)) : 0
            velYaw += (targetVel - velYaw) * 0.15
            rawVx *= 0.9
            const x = springX.get()
            const y = springY.get()
            const finalYaw = pose.yaw + (status === "default" ? velYaw : 0)
            const finalRoll = pose.roll - (status === "default" ? velYaw : 0)
            illo.rotate.y = finalRoll
            svg.style.transform = `translate(${x - size + pose.offsetX}px, ${y - size + pose.offsetY}px) rotate(${finalYaw}rad)`
            illo.updateRenderGraph()
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointerup", onUp)
            poseTween?.kill()
            html.style.cursor = prevCursor
            illo.remove()
        }
    }, [active, size, offset, furColor, padColor, mouseX, mouseY, springX, springY])

    if (!active) return null

    const laserActive = laserState === "pointer"

    return (
        <>
            <PawPrintCanvas size={size} padPrintColor={padPrintColor} maxPrintLifeTime={maxPrintLifeTime} zIndex={zIndex} />
            <motion.div
                style={{
                    x: laserX,
                    y: laserY,
                    backgroundColor: laserColor,
                    boxShadow: laserActive ? "0 0 6px 4px white" : `0 0 16px 2px ${laserColor}`,
                    opacity: laserActive ? 1 : 0.8,
                    zIndex,
                }}
                className={cn("pointer-events-none fixed left-0 top-0 size-1 rounded-full -ml-0.5 -mt-0.5")}
            />
            <svg
                ref={svgRef}
                width={size * 2}
                height={size * 2}
                className="pointer-events-none fixed left-0 top-0 overflow-visible"
                style={{ zIndex }}
            />
        </>
    )
}

export default PawCursor
