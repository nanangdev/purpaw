"use client"

import { useId, useState } from "react"
import type { KeyboardEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { TextAnimate } from "../motion/text-animate"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface FaqItem {
    q: string
    a: string
}

interface FaqCategory {
    id: string
    label: string
    items: FaqItem[]
}

const FAQ_DATA: FaqCategory[] = [
    {
        id: "general",
        label: "General",
        items: [
            {
                q: "Pertanyaan 1",
                a: "Jawaban 1",
            },
            {
                q: "Pertanyaan 2",
                a: "Jawaban 2",
            },
            {
                q: "Pertanyaan 3",
                a: "Jawaban 3",
            },
            {
                q: "Pertanyaan 4",
                a: "Jawaban 4",
            },
            {
                q: "Pertanyaan 5",
                a: "Jawaban 5",
            },
        ],
    },
    {
        id: "developer",
        label: "Developer",
        items: [
            {
                q: "Pertanyaan dev 1",
                a: "Jawaban dev 1",
            },
            {
                q: "Pertanyaan dev 2",
                a: "Jawaban dev 2",
            },
            {
                q: "Pertanyaan dev 3",
                a: "Jawaban dev 3",
            },
            {
                q: "Pertanyaan dev 4",
                a: "Jawaban dev 4",
            },
            {
                q: "Pertanyaan dev 5",
                a: "Jawaban dev 5",
            },
        ],
    },
]

// ---------------------------------------------------------------------------
// Paw Icon
// ---------------------------------------------------------------------------

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className={className}
        >
            <path d="M13 16h-2v-2h2v2Zm-2-2H9v-2h2v2Zm4 0h-2v-2h2v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM7 10H5V8h2v2Zm12 0h-2V8h2v2Z" />
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Accordion Item
// ---------------------------------------------------------------------------

function AccordionItem({
    item,
    isOpen,
    onToggle,
}: {
    item: FaqItem
    isOpen: boolean
    onToggle: () => void
}) {
    const reactId = useId()
    const buttonId = `faq-trigger-${reactId}`
    const panelId = `faq-content-${reactId}`
    return (
        <div
            className="border-b last:border-b-0 border-white/80 transition-colors duration-200">
            <button
                onClick={onToggle}
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-6 py-5 text-start cursor-pointer"
            >
                <span className="text-base font-medium text-white/90 md:text-xl">
                    {item.q}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        "flex-none transition-colors duration-200",
                        isOpen ? "text-blue-400" : "text-white"
                    )}
                >
                    <ChevronDownIcon className="size-7" />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.25, delay: 0.1 },
                        }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-sm leading-relaxed text-white/80 md:text-base">
                            {item.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function LandingFaq() {
    const [activeTab, setActiveTab] = useState(FAQ_DATA[0].id)
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const activeCategory = FAQ_DATA.find((c) => c.id === activeTab)!

    const handleTabChange = (id: string) => {
        setActiveTab(id)
        setOpenIndex(null)
    }

    const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const idx = FAQ_DATA.findIndex((c) => c.id === activeTab)
        let nextIdx: number | null = null
        if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % FAQ_DATA.length
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + FAQ_DATA.length) % FAQ_DATA.length
        else if (e.key === "Home") nextIdx = 0
        else if (e.key === "End") nextIdx = FAQ_DATA.length - 1
        if (nextIdx === null) return
        e.preventDefault()
        const nextCat = FAQ_DATA[nextIdx]
        handleTabChange(nextCat.id)
        requestAnimationFrame(() => document.getElementById(`faq-tab-${nextCat.id}`)?.focus())
    }

    const handleAccordionToggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index))
    }

    return (
        <section id="faq" className="relative w-full bg-black text-white min-h-svh lg:min-h-0">
            {/* Header */}
            <div className="mx-auto max-w-7xl px-6 pt-28 pb-10 md:pt-36 md:pb-14 text-center">
                <TextAnimate animation="slideUp" by="word" as="h2" className="max-w-4xl mx-auto text-4xl font-black text-white md:text-6xl lg:text-7xl leading-tight">
                    Pertanyaan yang Sering Diajukan
                </TextAnimate>
                <TextAnimate animation="slideUp" by="word" as="p" className="mx-auto mt-6 text-base text-white/80 md:text-lg">
                    Temukan jawaban atas pertanyaan yang paling sering ditanyakan
                    seputar Purpaw.
                </TextAnimate>
            </div>

            {/* Content Area */}
            <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
                    {/* Tabs — sticky */}
                    <div className="sticky w-full top-24 self-start z-10 flex-none lg:w-56 xl:w-64 lg:py-4">
                        <div
                            role="tablist"
                            aria-label="Kategori FAQ"
                            onKeyDown={handleTabKeyDown}
                            className="w-full flex justify-center gap-0.5 lg:gap-2 overflow-x-auto rounded-full bg-white lg:bg-transparent p-1 lg:p-0 scrollbar-none lg:flex-col lg:justify-start lg:rounded-2xl lg:overflow-visible">
                            {FAQ_DATA.map((cat) => (
                                <button
                                    key={cat.id}
                                    role="tab"
                                    id={`faq-tab-${cat.id}`}
                                    aria-selected={activeTab === cat.id}
                                    aria-controls="faq-tabpanel"
                                    tabIndex={activeTab === cat.id ? 0 : -1}
                                    onClick={() => handleTabChange(cat.id)}
                                    className={cn(
                                        "relative flex-1 lg:flex-none rounded-full px-5 py-2.5 text-base font-medium lg:bg-white/10 text-black lg:text-white transition-colors duration-200 cursor-pointer z-10",
                                        "lg:w-full lg:text-left lg:px-4 lg:py-3",
                                        activeTab === cat.id
                                            ? "text-white"
                                            : "lg:text-white lg:hover:text-white/80"
                                    )}
                                >
                                    {activeTab === cat.id && (
                                        <motion.span
                                            layoutId="faq-tab"
                                            className="absolute inset-0 rounded-full bg-primary"
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                    <span className="relative">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accordion */}
                    <div
                        role="tabpanel"
                        id="faq-tabpanel"
                        aria-labelledby={`faq-tab-${activeTab}`}
                        tabIndex={0}
                        className="flex-1 min-w-0 focus:outline-none">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            >
                                {activeCategory.items.map((item, i) => (
                                    <AccordionItem
                                        key={`${activeTab}-${i}`}
                                        item={item}
                                        isOpen={openIndex === i}
                                        onToggle={() =>
                                            handleAccordionToggle(i)
                                        }
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
