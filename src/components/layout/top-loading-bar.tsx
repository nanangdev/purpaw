import { useEffect, useRef } from "react"
import LoadingBar from "react-top-loading-bar"
import type { LoadingBarRef } from "react-top-loading-bar"
import { useRouterState } from "@tanstack/react-router"

// Top loading bar yang tersinkron dengan status navigasi TanStack Router:
// saat router "pending" (memuat rute/loader) bar berjalan, saat "idle" selesai.
function TopLoadingBar() {
    const ref = useRef<LoadingBarRef>(null)
    const isLoading = useRouterState({
        select: (state) => state.status === "pending",
    })

    useEffect(() => {
        if (isLoading) {
            ref.current?.continuousStart()
        } else {
            ref.current?.complete()
        }
    }, [isLoading])

    return (
        <LoadingBar
            ref={ref}
            color="var(--primary)"
            height={3}
            shadow
            waitingTime={300}
        />
    )
}

export { TopLoadingBar }