import { cn } from "@/lib/utils"

// Versi animasi dari glyph paw — cocok sebagai loader.
// Empat jari (x-center kiri→kanan: ~3, ~9, ~17, ~23) dari paw filled.
const TOES = [
  "M0 11.6992C0 14.2383 1.28906 16.123 3.01758 16.123C4.74609 16.123 6.04492 14.2383 6.04492 11.6992C6.04492 9.16992 4.74609 7.26562 3.01758 7.26562C1.28906 7.26562 0 9.16992 0 11.6992Z",
  "M6.11328 4.42383C6.11328 6.95312 7.42188 8.84766 9.14062 8.84766C10.8789 8.84766 12.168 6.95312 12.168 4.42383C12.168 1.875 10.8789 0 9.14062 0C7.42188 0 6.11328 1.875 6.11328 4.42383Z",
  "M14.3457 4.42383C14.3457 6.95312 15.6445 8.84766 17.373 8.84766C19.1016 8.84766 20.4004 6.95312 20.4004 4.42383C20.4004 1.875 19.1016 0 17.373 0C15.6348 0 14.3457 1.875 14.3457 4.42383Z",
  "M20.4785 11.6992C20.4785 14.2383 21.7676 16.123 23.5059 16.123C25.2344 16.123 26.5234 14.2383 26.5234 11.6992C26.5234 9.16992 25.2344 7.26562 23.5059 7.26562C21.7676 7.26562 20.4785 9.16992 20.4785 11.6992Z",
] as const

// Bantalan tengah (selalu fill).
const PALM =
  "M3.70117 21.6211C3.70117 24.1309 5.44922 25.9375 7.97852 25.9375C9.22852 25.9375 10.1367 25.5762 11.0156 25.2539C11.748 24.9805 12.4219 24.7461 13.252 24.7461C14.082 24.7461 14.7656 24.9805 15.4883 25.2539C16.3672 25.5762 17.2852 25.9375 18.5352 25.9375C21.0547 25.9375 22.8027 24.1309 22.8027 21.6211C22.8027 19.3945 21.4453 18.252 20.1758 17.2168C19.4922 16.6602 18.8281 16.1328 18.3887 15.4492C18.0371 14.9023 17.7441 14.2969 17.4707 13.7012C16.582 11.7676 15.8008 9.83398 13.252 9.83398C10.6934 9.83398 9.92188 11.7773 9.0332 13.7012C8.76953 14.2871 8.48633 14.8828 8.13477 15.4102C7.69531 16.1035 7.02148 16.6504 6.32812 17.2168C5.05859 18.2617 3.70117 19.4043 3.70117 21.6211Z"

interface PawAnimatedProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Kecepatan animasi (pengali). 1 = normal, 2 = dua kali lebih cepat,
   * 0.5 = setengah kecepatan. Diabaikan bila `duration` di-set.
   */
  speed?: number
  /** Durasi satu siklus penuh dalam milidetik. Override `speed`. */
  duration?: number
  /**
   * Tebal garis outline jari saat "mati" (dalam unit viewBox, ikut
   * menskala dengan ukuran glyph). Default 1.4.
   */
  strokeWidth?: number
}

const BASE_DURATION_MS = 1400

function PawAnimated({
  speed = 1,
  duration,
  strokeWidth = 1.4,
  className,
  ...props
}: PawAnimatedProps) {
  const cycleMs = duration ?? BASE_DURATION_MS / (speed > 0 ? speed : 1)

  return (
    <svg
      data-slot="paw-animated"
      viewBox="-1 -1 28.8848 27.9473"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
      className={cn("size-6", className)}
      {...props}
    >
      {/* Bantalan tengah — selalu menyala penuh. */}
      <path d={PALM} />
      {/* Jari — mati = outline, nyala = fill; kumulatif kiri→kanan, loop. */}
      {TOES.map((d, i) => (
        <path
          key={i}
          d={d}
          data-paw-toe={i + 1}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          style={{
            fill: "transparent",
            animationName: `purpaw-paw-toe-${i + 1}`,
            animationDuration: `${cycleMs}ms`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </svg>
  )
}

export { PawAnimated }
export type { PawAnimatedProps }