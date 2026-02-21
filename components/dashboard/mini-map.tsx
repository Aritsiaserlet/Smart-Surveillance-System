"use client"

import { useState } from "react"
import { X, Camera, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface MiniMapProps {
  open: boolean
  onClose: () => void
  onSelectCamera: (id: number) => void
}

interface MapDot {
  id: string
  type: "camera" | "incident" | "heatmap" | "path"
  x: number
  y: number
  label: string
  cameraId?: number
}

const FLOOR_DOTS: Record<string, MapDot[]> = {
  "1": [
    { id: "c1", type: "camera", x: 15, y: 25, label: "Cam 01 - Main Entrance", cameraId: 1 },
    { id: "c2", type: "camera", x: 45, y: 20, label: "Cam 02 - Lobby", cameraId: 2 },
    { id: "c5", type: "camera", x: 70, y: 55, label: "Cam 05 - Hallway B2", cameraId: 5 },
    { id: "i1", type: "incident", x: 30, y: 70, label: "Incident - Parking Lot A", cameraId: 4 },
    { id: "h1", type: "heatmap", x: 55, y: 40, label: "High Traffic Zone" },
    { id: "h2", type: "heatmap", x: 40, y: 60, label: "Moderate Traffic" },
    { id: "c8", type: "camera", x: 85, y: 30, label: "Cam 08 - Loading Dock", cameraId: 8 },
    { id: "i2", type: "incident", x: 20, y: 85, label: "Incident - South Entrance", cameraId: 12 },
  ],
  "2": [
    { id: "c6", type: "camera", x: 25, y: 35, label: "Cam 06 - Server Room", cameraId: 6 },
    { id: "i3", type: "incident", x: 60, y: 25, label: "Incident - Restricted Area", cameraId: 7 },
    { id: "c11", type: "camera", x: 50, y: 55, label: "Cam 11 - Elevator Hall", cameraId: 11 },
    { id: "c13", type: "camera", x: 75, y: 40, label: "Cam 13 - Break Room", cameraId: 13 },
    { id: "h3", type: "heatmap", x: 40, y: 70, label: "Traffic Zone" },
    { id: "c14", type: "camera", x: 35, y: 80, label: "Cam 14 - Conference Rm", cameraId: 14 },
  ],
  "3": [
    { id: "c9", type: "camera", x: 50, y: 20, label: "Cam 09 - Rooftop (Offline)", cameraId: 9 },
    { id: "c22", type: "camera", x: 30, y: 50, label: "Cam 22 - Generator Room", cameraId: 22 },
    { id: "c23", type: "camera", x: 70, y: 60, label: "Cam 23 - Archive Room", cameraId: 23 },
    { id: "c25", type: "camera", x: 55, y: 80, label: "Cam 25 - West Corridor", cameraId: 25 },
    { id: "h4", type: "heatmap", x: 45, y: 45, label: "Low Traffic" },
  ],
}

const FLOOR_ROOMS: Record<string, { x: number; y: number; w: number; h: number; label: string }[]> = {
  "1": [
    { x: 5, y: 10, w: 25, h: 30, label: "Entrance" },
    { x: 35, y: 8, w: 25, h: 25, label: "Lobby" },
    { x: 65, y: 15, w: 30, h: 35, label: "Hall B" },
    { x: 10, y: 55, w: 35, h: 35, label: "Parking A" },
    { x: 50, y: 55, w: 30, h: 25, label: "Corridor" },
  ],
  "2": [
    { x: 10, y: 15, w: 30, h: 35, label: "Server Rm" },
    { x: 45, y: 10, w: 30, h: 30, label: "Restricted" },
    { x: 35, y: 45, w: 30, h: 25, label: "Elevator" },
    { x: 60, y: 25, w: 30, h: 30, label: "Break Rm" },
    { x: 20, y: 65, w: 30, h: 25, label: "Conf. Rm" },
  ],
  "3": [
    { x: 30, y: 5, w: 40, h: 30, label: "Rooftop" },
    { x: 15, y: 35, w: 30, h: 30, label: "Generator" },
    { x: 50, y: 45, w: 35, h: 30, label: "Archive" },
    { x: 35, y: 70, w: 35, h: 22, label: "West Corr." },
  ],
}

function getDotColor(type: MapDot["type"]): string {
  switch (type) {
    case "camera": return "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
    case "incident": return "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)] animate-blink"
    case "heatmap": return "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
    case "path": return "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]"
  }
}

export function MiniMap({ open, onClose, onSelectCamera }: MiniMapProps) {
  const [is3D, setIs3D] = useState(false)
  const [floor, setFloor] = useState("1")
  const [hoveredDot, setHoveredDot] = useState<string | null>(null)

  if (!open) return null

  const dots = FLOOR_DOTS[floor] ?? []
  const rooms = FLOOR_ROOMS[floor] ?? []

  return (
    <div className="absolute top-2 right-2 z-30 w-80 rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-semibold text-foreground">Facility Map</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={cn("text-[10px] font-mono", !is3D ? "text-primary" : "text-muted-foreground")}>2D</span>
            <Switch
              checked={is3D}
              onCheckedChange={setIs3D}
              className="h-4 w-7 data-[state=checked]:bg-primary"
            />
            <span className={cn("text-[10px] font-mono", is3D ? "text-primary" : "text-muted-foreground")}>3D</span>
          </div>

          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger className="h-6 w-20 text-[10px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="1" className="text-xs">Floor 1</SelectItem>
              <SelectItem value="2" className="text-xs">Floor 2</SelectItem>
              <SelectItem value="3" className="text-xs">Floor 3</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className={cn(
        "relative mx-3 my-3 h-52 rounded-md border border-border/50 overflow-hidden",
        is3D ? "bg-[linear-gradient(160deg,oklch(0.12_0.01_260),oklch(0.18_0.005_260))]" : "bg-background"
      )}>
        <div className="absolute top-2 right-2 z-10 flex flex-col items-center gap-0.5">
          <Compass className="size-4 text-muted-foreground/50" />
          <span className="text-[7px] font-mono text-muted-foreground/50">N</span>
        </div>

        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 10}%`} x2="100%" y2={`${(i + 1) * 10}%`} stroke="currentColor" className="text-foreground" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 10}%`} y1="0" x2={`${(i + 1) * 10}%`} y2="100%" stroke="currentColor" className="text-foreground" />
          ))}
        </svg>

        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          {rooms.map((room, i) => (
            <g key={i}>
              <rect
                x={`${room.x}%`}
                y={`${room.y}%`}
                width={`${room.w}%`}
                height={`${room.h}%`}
                fill="none"
                stroke="oklch(0.4 0.005 260)"
                strokeWidth="0.8"
                strokeDasharray="3 2"
                rx="2"
              />
              <text
                x={`${room.x + room.w / 2}%`}
                y={`${room.y + room.h / 2}%`}
                textAnchor="middle"
                dominantBaseline="central"
                fill="oklch(0.45 0 0)"
                fontSize="7"
                fontFamily="monospace"
              >
                {room.label}
              </text>
            </g>
          ))}

          <text x="17%" y="7%" textAnchor="middle" fill="oklch(0.6 0 0)" fontSize="7" fontFamily="monospace">
            {"ENTRANCE"}
          </text>
        </svg>

        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <polyline
            points="15%,25% 30%,35% 45%,20% 55%,40% 70%,55%"
            fill="none"
            stroke="oklch(0.65 0.15 220)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.4"
          />
          <polygon points="69%,53% 72%,56% 68%,56%" fill="oklch(0.65 0.15 220)" opacity="0.5" />
        </svg>

        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute group"
            style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHoveredDot(dot.id)}
            onMouseLeave={() => setHoveredDot(null)}
            onClick={() => dot.cameraId && onSelectCamera(dot.cameraId)}
            role={dot.cameraId ? "button" : undefined}
            tabIndex={dot.cameraId ? 0 : undefined}
            aria-label={dot.label}
          >
            <div className={cn(
              "size-3 rounded-full cursor-pointer transition-transform hover:scale-[1.8]",
              getDotColor(dot.type)
            )} />

            {hoveredDot === dot.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                <div className="rounded-md bg-popover border border-border shadow-xl overflow-hidden">
                  {dot.cameraId && (
                    <div className="w-36 h-20 bg-background relative flex items-center justify-center">
                      <Camera className="size-5 text-muted-foreground/30" />
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(0,0,0,0.05)_1px,rgba(0,0,0,0.05)_2px)]" />
                      <div className="absolute top-1 left-1 flex items-center gap-1">
                        <span className={cn(
                          "size-1.5 rounded-full",
                          dot.type === "incident" ? "bg-red-500 animate-blink" : "bg-emerald-500 animate-blink"
                        )} />
                        <span className="text-[7px] font-mono text-muted-foreground">
                          {dot.type === "incident" ? "ALERT" : "LIVE"}
                        </span>
                      </div>
                      <div className="absolute bottom-1 left-1 rounded bg-card/80 px-1 py-0.5">
                        <span className="text-[7px] font-mono text-muted-foreground">
                          Cam {dot.cameraId}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="px-2 py-1.5 max-w-[144px]">
                    <p className="text-[9px] text-popover-foreground leading-tight">{dot.label}</p>
                    {dot.cameraId && (
                      <p className="text-[8px] text-primary mt-0.5">Click to open</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {is3D && (
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.1_0.005_260_/_0.3)_100%)] pointer-events-none" />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="text-[9px] text-muted-foreground">Online</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-400" />
            <span className="text-[9px] text-muted-foreground">Incident</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="text-[9px] text-muted-foreground">Heatmap</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-0.5 border-t border-dashed border-sky-400" />
            <span className="text-[9px] text-muted-foreground">Path</span>
          </div>
        </div>
      </div>
      <p className="px-3 pb-2 text-[8px] text-muted-foreground/50">
        Hover for live preview. Click camera dot to open detail view.
      </p>
    </div>
  )
}
