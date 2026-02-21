"use client"

import { CameraCard } from "./camera-card"
import { CAMERAS } from "@/lib/camera-data"
import { cn } from "@/lib/utils"

interface CameraGridProps {
  gridMode: "3x3" | "5x5"
  onSelectCamera: (id: number) => void
  searchQuery: string
}

export function CameraGrid({ gridMode, onSelectCamera, searchQuery }: CameraGridProps) {
  const count = gridMode === "3x3" ? 9 : 25
  const cameras = CAMERAS.slice(0, count)

  const filtered = searchQuery.trim()
    ? cameras.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cameras

  return (
    <div
      className={cn(
        "grid h-full w-full gap-2 p-3 transition-all duration-300 auto-rows-fr",
        gridMode === "3x3" ? "grid-cols-3" : "grid-cols-5"
      )}
    >
      {filtered.map((cam) => (
        <CameraCard
          key={cam.id}
          camera={cam}
          onClick={() => onSelectCamera(cam.id)}
          compact={gridMode === "5x5"}
        />
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full flex items-center justify-center h-40 text-muted-foreground text-sm">
          No cameras match your search.
        </div>
      )}
    </div>
  )
}
