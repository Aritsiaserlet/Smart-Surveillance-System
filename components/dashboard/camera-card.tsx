"use client"

import { Camera, GripVertical, Brain, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type CameraInfo,
  getStatusBgColor,
  getStatusLabel,
} from "@/lib/camera-data"

interface CameraCardProps {
  camera: CameraInfo
  onClick: () => void
  compact?: boolean
}

export function CameraCard({ camera, onClick, compact = false }: CameraCardProps) {
  const isAlert = camera.status === "alert"
  const isOffline = camera.status === "offline"
  const isProcessing = camera.status === "processing"

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isAlert
          ? "border-red-500/50 ring-4 ring-red-500/20 animate-pulse-subtle hover:ring-red-500/30"
          : isProcessing
          ? "border-indigo-500/30 hover:border-indigo-500/50"
          : "border-border hover:border-primary/40",
        isOffline ? "opacity-60" : "",
        "bg-secondary/40 hover:bg-secondary/70 hover:scale-[1.02]"
      )}
      aria-label={`View ${camera.name} - ${camera.location}`}
    >
      {/* Drag handle (visible on hover) */}
      <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-70 transition-opacity cursor-grab">
        <GripVertical className={cn("text-muted-foreground", compact ? "size-3" : "size-4")} />
      </div>

      {/* Status badge - top right */}
      <div className={cn(
        "absolute top-1.5 right-1.5 z-10 flex items-center gap-1 rounded-sm px-1.5 py-0.5",
        getStatusBgColor(camera.status),
      )}>
        <span className={cn(
          "size-1.5 rounded-full bg-white",
          camera.status === "live" && "animate-blink",
          camera.status === "alert" && "animate-blink",
        )} />
        <span className={cn(
          "font-mono font-bold tracking-wider text-white",
          compact ? "text-[6px]" : "text-[9px]"
        )}>
          {getStatusLabel(camera.status)}
        </span>
      </div>

      {/* Video area */}
      <div className={cn(
        "relative flex flex-1 items-center justify-center",
        compact ? "min-h-[50px]" : "min-h-[80px]"
      )}>
        {/* Scanline effect */}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)] opacity-0 transition-opacity group-hover:opacity-100" />

        {isOffline ? (
          <WifiOff className={cn(
            "text-neutral-600 transition-colors",
            compact ? "size-5" : "size-8"
          )} />
        ) : isProcessing ? (
          <Brain className={cn(
            "text-indigo-400 animate-pulse transition-colors",
            compact ? "size-5" : "size-8"
          )} />
        ) : (
          <Camera className={cn(
            "transition-colors text-muted-foreground group-hover:text-primary",
            compact ? "size-5" : "size-8"
          )} />
        )}

        {/* AI Processing overlay */}
        {isProcessing && (
          <div className="pointer-events-none absolute inset-0 rounded-t-lg bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
        )}

        {/* Alert pulsating glow */}
        {isAlert && (
          <div className="pointer-events-none absolute inset-0 rounded-t-lg bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.06),transparent_70%)]" />
        )}

        {/* Hover glow */}
        {!isOffline && !isProcessing && (
          <div className="pointer-events-none absolute inset-0 rounded-t-lg opacity-0 transition-opacity group-hover:opacity-100 shadow-[inset_0_0_30px_rgba(0,200,150,0.04)]" />
        )}

        {/* Person count overlay for non-offline cameras */}
        {!isOffline && !compact && (
          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="rounded bg-card/80 border border-border/50 px-1.5 py-0.5 flex items-center gap-1">
              <span className="size-1 rounded-full bg-primary" />
              <span className="text-[8px] font-mono text-muted-foreground">
                {(camera.id % 5) + 1} persons
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Camera label bar */}
      <div className={cn(
        "flex items-center gap-1.5 border-t border-border bg-card/60 text-left",
        compact ? "px-1.5 py-1.5 min-h-[28px]" : "px-2.5 py-2 min-h-[40px]"
      )}>
        <div className="flex flex-col leading-tight overflow-hidden flex-1">
          <span className={cn(
            "font-mono font-semibold text-foreground truncate",
            compact ? "text-[8px]" : "text-[11px]"
          )}>
            {camera.name}
          </span>
          <span className={cn(
            "text-muted-foreground truncate",
            compact ? "text-[7px]" : "text-[10px]"
          )}>
            {camera.location}
          </span>
        </div>
        {!compact && (
          <span className="text-[8px] font-mono text-muted-foreground/50">F{camera.floor}</span>
        )}
      </div>
    </button>
  )
}
