"use client"

import { useState } from "react"
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  Camera,
  ChevronDown,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  type AlertSeverity,
  MOCK_ALERTS,
  getSeverityBgColor,
  getSeverityColor,
  getSeverityLabel,
} from "@/lib/camera-data"

interface AlertFeedProps {
  onOpenCamera: (id: number, incidentTime?: number) => void
}

type ResponseStatus = "new" | "investigating" | "resolved" | "escalated"

function getResponseBadge(status: ResponseStatus) {
  switch (status) {
    case "new":
      return { label: "New", className: "bg-sky-500/15 border-sky-500/30 text-sky-400" }
    case "investigating":
      return { label: "Investigating", className: "bg-amber-500/15 border-amber-500/30 text-amber-400" }
    case "resolved":
      return { label: "Resolved", className: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" }
    case "escalated":
      return { label: "Escalated", className: "bg-red-500/15 border-red-500/30 text-red-400" }
  }
}

// Extended alert data with confidence and response status
const ALERT_EXTENSIONS: Record<number, { confidence: number; responseStatus: ResponseStatus }> = {
  1: { confidence: 94, responseStatus: "escalated" },
  2: { confidence: 89, responseStatus: "investigating" },
  3: { confidence: 87, responseStatus: "investigating" },
  4: { confidence: 76, responseStatus: "new" },
  5: { confidence: 99, responseStatus: "resolved" },
  6: { confidence: 72, responseStatus: "new" },
  7: { confidence: 98, responseStatus: "resolved" },
  8: { confidence: 100, responseStatus: "resolved" },
  9: { confidence: 81, responseStatus: "investigating" },
  10: { confidence: 85, responseStatus: "new" },
  11: { confidence: 100, responseStatus: "resolved" },
  12: { confidence: 78, responseStatus: "new" },
}

const severityIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case "info": return <ShieldCheck className="size-3.5 text-emerald-400" />
    case "warning": return <AlertTriangle className="size-3.5 text-amber-400" />
    case "critical": return <AlertTriangle className="size-3.5 text-red-400" />
    case "emergency": return <Activity className="size-3.5 text-red-300 animate-blink" />
  }
}

export function AlertFeed({ onOpenCamera }: AlertFeedProps) {
  const [alertFilter, setAlertFilter] = useState<string>("all")
  const [responseStatuses, setResponseStatuses] = useState<Record<number, ResponseStatus>>(
    Object.fromEntries(Object.entries(ALERT_EXTENSIONS).map(([k, v]) => [Number(k), v.responseStatus]))
  )

  const filteredAlerts =
    alertFilter === "all"
      ? MOCK_ALERTS
      : MOCK_ALERTS.filter((a) => a.severity === alertFilter)

  function handleStatusChange(alertId: number, newStatus: ResponseStatus) {
    setResponseStatuses((prev) => ({ ...prev, [alertId]: newStatus }))
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-sidebar overflow-hidden w-80">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-sidebar-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-red-400" />
          <span className="text-xs font-semibold text-foreground">AI Alert Feed</span>
          <Badge variant="outline" className="text-[8px] h-4 px-1.5 bg-red-500/15 border-red-500/30 text-red-400">
            {MOCK_ALERTS.filter((a) => a.severity === "emergency" || a.severity === "critical").length} active
          </Badge>
        </div>
        <Select value={alertFilter} onValueChange={setAlertFilter}>
          <SelectTrigger className="h-6 w-[80px] text-[10px] bg-secondary/50 border-border">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-xs">All</SelectItem>
            <SelectItem value="emergency" className="text-xs">Emergency</SelectItem>
            <SelectItem value="critical" className="text-xs">Critical</SelectItem>
            <SelectItem value="warning" className="text-xs">Warning</SelectItem>
            <SelectItem value="info" className="text-xs">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert Cards */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-2.5">
          {filteredAlerts.map((alert) => {
            const ext = ALERT_EXTENSIONS[alert.id]
            const currentStatus = responseStatuses[alert.id] ?? "new"
            const responseBadge = getResponseBadge(currentStatus)

            return (
              <div
                key={alert.id}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  getSeverityBgColor(alert.severity),
                  alert.severity === "emergency" && "animate-pulse-subtle"
                )}
              >
                {/* Top Row: Icon + Time + Severity Badge */}
                <div className="flex items-center gap-1.5 mb-2">
                  {severityIcon(alert.severity)}
                  <span className="font-mono text-[10px] text-muted-foreground">{alert.time}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[8px] h-4 px-1.5 border ml-auto",
                      getSeverityBgColor(alert.severity),
                      getSeverityColor(alert.severity)
                    )}
                  >
                    {getSeverityLabel(alert.severity)}
                  </Badge>
                </div>

                {/* Content Row: Thumbnail + Text */}
                <div className="flex gap-2.5">
                  {/* Incident Thumbnail */}
                  {alert.cameraId && (
                    <button
                      onClick={() => onOpenCamera(alert.cameraId!, alert.incidentTime)}
                      className="shrink-0 w-16 h-12 rounded border border-border/50 bg-background/50 flex items-center justify-center hover:border-primary/40 transition-colors overflow-hidden"
                      aria-label={`View incident on camera ${alert.cameraId}`}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Camera className="size-4 text-muted-foreground/40" />
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(0,0,0,0.06)_1px,rgba(0,0,0,0.06)_2px)]" />
                        <div className="absolute bottom-0.5 left-0.5 rounded bg-card/80 px-1 py-0.5">
                          <span className="text-[7px] font-mono text-muted-foreground">Cam {alert.cameraId}</span>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Alert text + confidence */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <p className="text-[11px] text-foreground leading-relaxed">
                      {alert.text}
                    </p>
                    {ext && (
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground">
                          Confidence: <span className={cn(
                            "font-mono font-bold",
                            ext.confidence >= 90 ? "text-red-400" : ext.confidence >= 80 ? "text-amber-400" : "text-muted-foreground"
                          )}>{ext.confidence}%</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Status Row */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                  {alert.cameraId && (
                    <button
                      onClick={() => onOpenCamera(alert.cameraId!, alert.incidentTime)}
                      className="text-[9px] font-medium text-primary hover:underline underline-offset-2"
                    >
                      View Incident
                    </button>
                  )}
                  {!alert.cameraId && <span />}

                  <Select
                    value={currentStatus}
                    onValueChange={(v) => handleStatusChange(alert.id, v as ResponseStatus)}
                  >
                    <SelectTrigger className={cn(
                      "h-5 w-auto gap-1 text-[9px] border px-2 rounded-full",
                      responseBadge.className
                    )}>
                      <SelectValue />
                      <ChevronDown className="size-2.5" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="new" className="text-[10px]">New</SelectItem>
                      <SelectItem value="investigating" className="text-[10px]">Investigating</SelectItem>
                      <SelectItem value="resolved" className="text-[10px]">Resolved</SelectItem>
                      <SelectItem value="escalated" className="text-[10px]">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
