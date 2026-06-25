import { cn } from "@/lib/utils"

// Activity indicator ala Apple: 8 "spoke" yang memudar bergiliran sehingga
// titik terang seolah berputar. Warna mengikuti `currentColor` (atur via
// utilitas teks Tailwind, mis. text-muted-foreground).
const SPOKES = 8

interface ActivityIndicatorProps extends React.ComponentProps<"svg"> {
  /**
   * Label aksesibilitas untuk pembaca layar. Default "Loading".
   * Set ke "" bila indikator murni dekoratif (akan jadi aria-hidden).
   */
  label?: string
  /** Durasi satu putaran penuh dalam milidetik. Default 1000. */
  duration?: number
}

function ActivityIndicator({
  label = "Loading",
  duration = 1000,
  className,
  ...props
}: ActivityIndicatorProps) {
  const decorative = label === ""

  return (
    <svg
      data-slot="activity-indicator"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      className={cn("size-6", className)}
      {...props}
    >
      {Array.from({ length: SPOKES }, (_, i) => {
        const angle = i * (360 / SPOKES)
        // Spoke paling "baru" mulai paling terang; delay negatif agar
        // animasi sudah berjalan di tengah siklus sejak frame pertama.
        const delay = (-(SPOKES - 1 - i) * duration) / SPOKES

        return (
          <rect
            key={i}
            x="10.5"
            y="2"
            width="3"
            height="6"
            rx="1.5"
            fill="currentColor"
            transform={`rotate(${angle} 12 12)`}
            style={{
              animationName: "purpaw-activity-fade",
              animationDuration: `${duration}ms`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: `${delay}ms`,
            }}
          />
        )
      })}
    </svg>
  )
}

export { ActivityIndicator }
export type { ActivityIndicatorProps }
