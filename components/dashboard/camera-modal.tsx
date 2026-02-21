"use client"

import { useState, useEffect } from "react"
import {
  Camera,
  Radio,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ZoomIn,
  ZoomOut,
  Scan,
  Users,
  Brain,
  Flame,
  PersonStanding,
  Swords,
  ScanFace,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getCameraById, getStatusBgColor, getStatusLabel } from "@/lib/camera-data"

interface CameraModalProps {
  cameraId: number | null
  open: boolean
  onClose: () => void
  initialTimelinePosition?: number
}

const AI_OVERLAYS = [
  { id: "bbox", label: "Bounding Boxes", icon: Scan },
  { id: "count", label: "Person Count", icon: Users },
  { id: "behavior", label: "Behavior", icon: Brain },
  { id: "heatmap", label: "Heatmap", icon: Flame },
  { id: "fall", label: "Fall Detection", icon: PersonStanding },
  { id: "weapon", label: "Weapon", icon: Swords },
  { id: "face", label: "Face Match", icon: ScanFace },
]

export function CameraModal({ cameraId, open, onClose, initialTimelinePosition }: CameraModalProps) {
  const [mode, setMode] = useState<string>("realtime")
  const [timelineValue, setTimelineValue] = useState([50])
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set(["bbox"]))
  const [dateInput, setDateInput] = useState("2026-02-21")
  const [timeInput, setTimeInput] = useState("14:00")

  // When opened from an alert, jump to history mode at the incident time
  useEffect(() => {
    if (open && initialTimelinePosition !== undefined) {
      setMode("history")
      setTimelineValue([initialTimelinePosition])
      setIsPlaying(false)
    } else if (open) {
      setMode("realtime")
      setIsPlaying(true)
    }
  }, [open, initialTimelinePosition])

  if (!cameraId) return null

  const camera = getCameraById(cameraId)
  if (!camera) return null

  const hours = Math.floor((timelineValue[0] / 100) * 24)
  const minutes = Math.floor(((timelineValue[0] / 100) * 24 * 60) % 60)
  const seconds = Math.floor(((timelineValue[0] / 100) * 24 * 3600) % 60)
  const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  function toggleOverlay(id: string) {
    setActiveOverlays((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function goToLive() {
    setMode("realtime")
    setIsPlaying(true)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-card border-border p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle className="text-foreground">{camera.name} - {camera.location}</DialogTitle>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-[10px] border",
                camera.status === "alert"
                  ? "bg-red-500/15 border-red-500/30 text-red-400"
                  : camera.status === "live"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : camera.status === "recording"
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  : camera.status === "processing"
                  ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                  : "bg-neutral-500/15 border-neutral-500/30 text-neutral-400"
              )}
            >
              <span className={cn("size-1.5 rounded-full mr-1", getStatusBgColor(camera.status), (camera.status === "live" || camera.status === "alert") && "animate-blink")} />
              {getStatusLabel(camera.status)}
            </Badge>
          </div>
          <DialogDescription className="text-muted-foreground">
            Floor {camera.floor} - {camera.location}
          </DialogDescription>

          {/* AI Insight Overlay Toggles */}
          <div className="flex items-center gap-1.5 pt-2 flex-wrap">
            <span className="text-[10px] text-muted-foreground mr-1">AI Overlays:</span>
            {AI_OVERLAYS.map((overlay) => {
              const Icon = overlay.icon
              const isActive = activeOverlays.has(overlay.id)
              return (
                <Button
                  key={overlay.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleOverlay(overlay.id)}
                  className={cn(
                    "h-6 px-2 text-[10px] gap-1",
                    isActive
                      ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                      : "text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  <Icon className="size-3" />
                  {overlay.label}
                </Button>
              )
            })}
          </div>
        </DialogHeader>

        {/* Video Player Area */}
        <div className="px-4 pt-3">
          <Tabs value={mode} onValueChange={setMode} className="w-full">
            <div className="relative rounded-lg border border-border bg-background overflow-hidden"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            >
              <div className="aspect-video flex items-center justify-center relative">
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)]" />

                {/* Main placeholder */}
                <div className="flex flex-col items-center gap-3">
                  {mode === "realtime" ? (
                    <>
                      <Camera className="size-16 text-muted-foreground/30" />
                      <span className="font-mono text-sm text-muted-foreground">
                        Live Feed - {camera.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="size-16 text-muted-foreground/30" />
                      <span className="font-mono text-sm text-muted-foreground">
                        Playback - {timeLabel}
                      </span>
                    </>
                  )}
                </div>

                {/* AI overlay indicators when active */}
                {activeOverlays.has("bbox") && (
                  <div className="absolute top-[25%] left-[30%] w-20 h-28 border-2 border-primary/40 rounded-sm" />
                )}
                {activeOverlays.has("bbox") && (
                  <div className="absolute top-[30%] right-[25%] w-16 h-24 border-2 border-amber-400/40 rounded-sm" />
                )}
                {activeOverlays.has("count") && (
                  <div className="absolute top-3 right-3 rounded bg-card/80 border border-border px-2 py-1 font-mono text-[11px] text-foreground flex items-center gap-1.5">
                    <Users className="size-3 text-primary" />
                    Persons: 3
                  </div>
                )}
                {activeOverlays.has("heatmap") && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(239,68,68,0.15),transparent_60%)]" />
                )}

                {/* Recording indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={cn("size-2 rounded-full", mode === "realtime" ? "bg-red-500 animate-blink" : "bg-amber-500")} />
                  <span className={cn("font-mono text-[11px]", mode === "realtime" ? "text-red-400" : "text-amber-400")}>
                    {mode === "realtime" ? "REC" : "PLAYBACK"}
                  </span>
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-3 left-3 rounded bg-background/80 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                  {mode === "realtime" ? new Date().toLocaleString() : `${dateInput} ${timeLabel}`}
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
              {/* Playback controls */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label="Take snapshot">
                  <Camera className="size-4" />
                </Button>
                <div className="h-5 w-px bg-border mx-1" />
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>
                  <ZoomIn className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}>
                  <ZoomOut className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label="Fullscreen">
                  <Maximize className="size-4" />
                </Button>
                {zoom !== 1 && (
                  <span className="text-[10px] font-mono text-muted-foreground ml-1">{Math.round(zoom * 100)}%</span>
                )}
              </div>

              {/* Mode tabs + Go to Live */}
              <div className="flex items-center gap-2">
                {mode === "history" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={goToLive}
                    className="h-7 px-3 text-[11px] font-semibold gap-1.5 bg-red-600 hover:bg-red-500 text-white"
                  >
                    <span className="size-1.5 rounded-full bg-white animate-blink" />
                    GO TO LIVE
                  </Button>
                )}

                <TabsList className="h-8 bg-secondary">
                  <TabsTrigger value="realtime" className="text-xs gap-1 h-6 px-3">
                    <Radio className="size-3" />
                    Real-Time
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs gap-1 h-6 px-3">
                    <Clock className="size-3" />
                    History
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* History Controls */}
            <TabsContent value="history" className="mt-0 pt-2">
              {/* Date/Time picker */}
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="h-7 w-36 text-[11px] bg-secondary/50 border-border font-mono"
                />
                <Input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="h-7 w-28 text-[11px] bg-secondary/50 border-border font-mono"
                />
                <Button variant="outline" size="sm" className="h-7 text-[10px] px-3 border-border">
                  Jump
                </Button>
              </div>

              {/* Timeline scrubber */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                  <span>00:00:00</span>
                  <span className="text-foreground font-medium">{timeLabel}</span>
                  <span>23:59:59</span>
                </div>
                <div className="relative">
                  <Slider
                    value={timelineValue}
                    onValueChange={setTimelineValue}
                    max={100}
                    step={0.1}
                  />
                  {/* Incident markers on timeline */}
                  <div className="absolute top-0 left-[72%] w-1 h-4 -mt-0.5 bg-red-500/60 rounded-full pointer-events-none" />
                  <div className="absolute top-0 left-[55%] w-1 h-4 -mt-0.5 bg-amber-500/60 rounded-full pointer-events-none" />
                  <div className="absolute top-0 left-[38%] w-1 h-4 -mt-0.5 bg-amber-500/60 rounded-full pointer-events-none" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Markers indicate detected incidents</span>
                </div>
              </div>
            </TabsContent>

            {/* Real-time has no extra controls */}
            <TabsContent value="realtime" className="mt-0" />
          </Tabs>
        </div>

        {/* Bottom padding */}
        <div className="h-4" />
      </DialogContent>
    </Dialog>
  )
}
