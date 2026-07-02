import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(app)/game")({
  component: GamePage,
})

function GamePage() {
  return <div className="p-6">todo: halaman game</div>
}
