import { useId } from "react"
import { cn } from "@/lib/utils"

type ModernSeparatorProps = React.SVGProps<SVGSVGElement>

function ModernSeparator({ className, ...props }: ModernSeparatorProps) {
    const gradientId = useId()
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1352 69"
            fill="none"
            aria-hidden="true"
            className={cn("h-auto w-full", className)}
            {...props}
        >
            <path
                stroke={`url(#${gradientId})`}
                d="M1352 .5H804.164a32 32 0 0 0-25.348 12.468l-32.568 42.264A32 32 0 0 1 720.901 67.7h-91.525a32 32 0 0 1-25.228-12.314l-33.221-42.572A32 32 0 0 0 545.699.5H0"
            />
            <defs>
                <linearGradient id={gradientId} x1="-32" x2="1339" y1="69.5" y2="69.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#040404" />
                    <stop offset=".514" stopColor="#fff" />
                    <stop offset="1" stopColor="#040505" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export { ModernSeparator }
export type { ModernSeparatorProps }
