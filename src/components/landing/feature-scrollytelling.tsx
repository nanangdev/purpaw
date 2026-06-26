"use client"

import { useRef, useState, useEffect } from "react"
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    AnimatePresence,
} from "motion/react"

interface FeatureBlock {
    id: string
    title: string
    description: string
    bgText: string
    image: string
}

const blocks: FeatureBlock[] = [
    {
        id: "health",
        title: "Pelacak Kesehatan Kucing",
        description:
            "Pantau kesehatan anabul secara menyeluruh. Catat berat badan, grafik pertumbuhan, dan deteksi gejala penyakit sejak dini. Dilengkapi dengan pelacakan pengobatan teratur berbasis persentase kepatuhan dosis serta wawasan medis khusus yang disesuaikan dengan ras kucing Anda.",
        bgText: "HEALTH",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_health-tracker.webp",
    },
    {
        id: "reminder",
        title: "Pengingat Pintar",
        description:
            "Kelola rutinitas harian kucing Anda tanpa khawatir terlupa. Atur jadwal makan, janji temu dokter hewan, kalender perawatan (grooming), hingga jadwal vaksinasi rutin dengan sistem pengingat cerdas yang selalu siaga.",
        bgText: "REMIND",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_pengingat.webp",
    },
    {
        id: "vet-services",
        title: "Dokter Hewan & Layanan Terdekat",
        description:
            "Temukan klinik dokter hewan, pet shop, taman bermain, dan toko mainan terdekat melalui integrasi peta interaktif. Dapatkan juga akses cepat ke pencarian vet darurat dan panggilan langsung ke pusat penanganan kritis/keracunan.",
        bgText: "NEARBY",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_vet.webp",
    },
    {
        id: "game",
        title: "Game Interaktif",
        description:
            "Ciptakan momen kebersamaan yang seru bersama anabul. Nikmati berbagai pilihan permainan interaktif yang terus bertambah, dirancang khusus untuk menstimulasi sensorik kucing sekaligus menghibur Anda sebagai pemilik.",
        bgText: "PLAY",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_game-cat.webp",
    },
    {
        id: "adopt",
        title: "Pusat Kehilangan & Adopsi",
        description:
            "Bantu sesama pecinta hewan dengan melaporkan penampakan kucing hilang melalui pin lokasi yang presisi, atau temukan serta posting kucing yang siap diadopsi untuk mendapatkan rumah baru yang penuh kasih sayang.",
        bgText: "ADOPT",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_adopt.webp",
    },
    {
        id: "profile",
        title: "Profil Kucing",
        description:
            "Buat halaman portofolio unik untuk memamerkan biodata, galeri foto, kisah menggemaskan, hingga kepribadian khas kucing Anda kepada dunia dan komunitas pecinta kucing.",
        bgText: "PROFILE",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_profile.webp",
    },
    {
        id: "community",
        title: "Komunitas Aktif",
        description:
            "Terhubung dengan sesama pemilik kucing. Bagikan tips harian, diskusikan wawasan perawatan, atau buat poster digital untuk membantu pencarian kucing hilang dengan jangkauan radius lokal yang dapat disesuaikan.",
        bgText: "SOCIAL",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_community.webp",
    },
    {
        id: "developer",
        title: "Untuk Developer",
        description:
            "Bagi para pengembang, kami menyediakan API publik yang andal dan terdokumentasi dengan lengkap. Kunjungi halaman dokumentasi kami untuk mulai membangun integrasi dan inovasi baru bagi ekosistem pecinta hewan.",
        bgText: "DEV API",
        image: "https://cdn-purpaw-l.ngepos.com/l/l_feature_developer.webp",
    },
]

export default function FeatureScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const isTransitioning = useRef(false)
    const enteredStickyAt = useRef(0)
    const wasSticky = useRef(false)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })

    // Snippy snapping scroll wheel handler
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            // If we are actively transitioning, prevent double scroll triggers
            if (isTransitioning.current) {
                e.preventDefault()
                return
            }

            const direction = e.deltaY > 0 ? 1 : -1
            const targetIndex = activeIndex + direction

            // Prevent scroll momentum from immediately switching slides upon entry
            if (activeIndex === 0 && direction === 1) {
                const timeSinceEntry = Date.now() - enteredStickyAt.current
                if (timeSinceEntry < 600) {
                    e.preventDefault()
                    return
                }
            }

            if (activeIndex === blocks.length - 1 && direction === -1) {
                const timeSinceEntry = Date.now() - enteredStickyAt.current
                if (timeSinceEntry < 600) {
                    e.preventDefault()
                    return
                }
            }

            // Capture and snap the scroll within the scrollytelling bounds
            if (targetIndex >= 0 && targetIndex < blocks.length) {
                e.preventDefault()
                isTransitioning.current = true

                setActiveIndex(targetIndex)

                const rect = container.getBoundingClientRect()
                const absoluteTop = rect.top + window.scrollY
                const targetScroll =
                    absoluteTop + (targetIndex / (blocks.length - 1)) * window.innerHeight

                window.scrollTo({
                    top: targetScroll,
                    behavior: "smooth",
                })

                setTimeout(() => {
                    isTransitioning.current = false
                }, 800) // matches transition duration + easing speed
            }
        }

        container.addEventListener("wheel", handleWheel, { passive: false })
        return () => {
            container.removeEventListener("wheel", handleWheel)
        }
    }, [activeIndex])

    // Update active index based on scroll position (when scrolled by touch or scrollbar)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const isCurrentlySticky = latest > 0 && latest < 1
        if (isCurrentlySticky && !wasSticky.current) {
            enteredStickyAt.current = Date.now()
            wasSticky.current = true
        } else if (!isCurrentlySticky) {
            wasSticky.current = false
        }

        if (!isTransitioning.current) {
            const index = Math.min(
                Math.floor(latest * blocks.length),
                blocks.length - 1
            )
            if (index !== activeIndex) {
                setActiveIndex(index)
            }
        }
    })

    const indicatorY = useTransform(scrollYProgress, [0, 1], ["0%", "300%"])

    return (
        <section
            ref={containerRef}
            id="features"
            className="relative h-[200vh] bg-black text-white w-full"
        >
            {/* Sticky Wrapper */}
            <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden pt-16 lg:pt-24">
                {/* Visual Glows and Effects */}
                <div className="pointer-events-none absolute top-[unset] bottom-0 left-0 z-0 h-1/5 w-full bg-[#161616] xl:inset-y-0 xl:right-0 xl:left-[unset] xl:h-full xl:w-[25%]" />

                {/* Background Parallax Outline Text (Desktop) */}
                <div className="pointer-events-none sr-only absolute left-[5%] z-0 h-[400px] w-full -translate-y-1/2 select-none lg:not-sr-only lg:top-[50%] lg:left-[8%] xl:top-[35%]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute left-1/2 flex -translate-x-1/2 flex-col justify-center lg:top-[50%] xl:top-[35%]"
                        >
                            <div
                                className="text-[14vw] leading-[0.8] font-black tracking-tighter text-transparent uppercase select-none"
                                style={{
                                    WebkitTextStroke: "1px rgba(255, 255, 255, 1.0)",
                                }}
                            >
                                {blocks[activeIndex].bgText}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="relative z-2 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-between gap-8 px-6 py-8 md:justify-center md:px-12 lg:justify-between xl:flex-row">
                    {/* Hero Character Column (Left Side) */}
                    <div className="relative z-10 flex h-[300px] w-full items-center justify-center sm:h-[400px] md:h-[560px] lg:h-full xl:w-[70%] xl:pl-20">
                        <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[380px] md:max-w-[560px] lg:max-w-3xl xl:max-w-[680px]">
                            {/* Character Main Image */}
                            <div className="flex h-full w-full items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeIndex}
                                        src={blocks[activeIndex].image}
                                        alt="Purpaw Character"
                                        initial={{ opacity: 0, y: 80 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -80 }}
                                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                                        draggable="false"
                                        loading="lazy"
                                    />
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Content Column (Right Side Details & Sub-Card) */}
                    <div className="z-20 flex w-full flex-col items-center justify-center xl:w-[60%] xl:items-end">
                        {/* Right Glassmorphic Control Panel */}
                        <div className="flex w-full max-w-[380px] flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-transparent p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8 md:max-w-none lg:max-w-3xl xl:max-w-[380px]">
                            {/* Section Heading */}
                            <h2 className="sr-only">Fitur</h2>

                            {/* Feature Text Info */}
                            <div className="flex min-h-[120px] flex-col justify-center gap-3">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="space-y-2"
                                    >
                                        <h3 className="line-clamp-2 text-2xl leading-normal font-black tracking-normal text-white uppercase sm:text-3xl md:line-clamp-3">
                                            {blocks[activeIndex].title}
                                        </h3>

                                        <p className="line-clamp-3 text-sm leading-relaxed font-normal text-white/70 lg:line-clamp-10">
                                            {blocks[activeIndex].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator (Far Left) */}
                    <div className="absolute top-1/4 left-6 z-20 flex -translate-y-1/4 flex-col items-center gap-4 md:top-1/2 md:-translate-y-1/2">
                        <span
                            className="rotate-180 font-pixel text-sm font-medium tracking-widest text-white/80 uppercase"
                            style={{ writingMode: "vertical-lr" }}
                        >
                            SCROLL
                        </span>
                        <div className="relative h-32 w-0.5 overflow-hidden rounded-full bg-white/20">
                            <motion.div
                                style={{
                                    height: "25%",
                                    y: indicatorY,
                                }}
                                className="w-full rounded-full bg-linear-to-b from-blue-600 to-blue-500"
                            />
                        </div>
                        <span className="font-pixel text-sm font-black tracking-widest text-blue-400">
                            0{activeIndex + 1}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hidden SEO Crawlable List */}
            <div className="sr-only">
                {blocks.map((block) => (
                    <article key={block.id}>
                        <h3>{block.title}</h3>
                        <p>{block.description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
