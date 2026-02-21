export type CameraStatus = "live" | "recording" | "alert" | "offline" | "processing"

export interface CameraInfo {
  id: number
  name: string
  location: string
  floor: number
  status: CameraStatus
}

export type AlertSeverity = "info" | "warning" | "critical" | "emergency"

export interface AlertMessage {
  id: number
  severity: AlertSeverity
  text: string
  cameraId?: number
  time: string
  incidentTime?: number
}

export const CAMERAS: CameraInfo[] = [
  { id: 1, name: "Cam 01", location: "Main Entrance", floor: 1, status: "live" },
  { id: 2, name: "Cam 02", location: "Lobby", floor: 1, status: "live" },
  { id: 3, name: "Cam 03", location: "Cafeteria", floor: 1, status: "recording" },
  { id: 4, name: "Cam 04", location: "Parking Lot A", floor: 1, status: "alert" },
  { id: 5, name: "Cam 05", location: "Hallway B2", floor: 1, status: "live" },
  { id: 6, name: "Cam 06", location: "Server Room", floor: 2, status: "processing" },
  { id: 7, name: "Cam 07", location: "Restricted Area", floor: 2, status: "alert" },
  { id: 8, name: "Cam 08", location: "Loading Dock", floor: 1, status: "live" },
  { id: 9, name: "Cam 09", location: "Rooftop", floor: 3, status: "offline" },
  { id: 10, name: "Cam 10", location: "Stairwell A", floor: 1, status: "recording" },
  { id: 11, name: "Cam 11", location: "Elevator Hall", floor: 2, status: "live" },
  { id: 12, name: "Cam 12", location: "South Entrance", floor: 1, status: "alert" },
  { id: 13, name: "Cam 13", location: "Break Room", floor: 2, status: "live" },
  { id: 14, name: "Cam 14", location: "Conference Rm 1", floor: 2, status: "recording" },
  { id: 15, name: "Cam 15", location: "Parking Lot B", floor: 1, status: "live" },
  { id: 16, name: "Cam 16", location: "Storage Wing", floor: 3, status: "offline" },
  { id: 17, name: "Cam 17", location: "Reception", floor: 1, status: "live" },
  { id: 18, name: "Cam 18", location: "Mailroom", floor: 2, status: "processing" },
  { id: 19, name: "Cam 19", location: "Hallway C1", floor: 2, status: "live" },
  { id: 20, name: "Cam 20", location: "Emergency Exit", floor: 1, status: "live" },
  { id: 21, name: "Cam 21", location: "North Gate", floor: 1, status: "recording" },
  { id: 22, name: "Cam 22", location: "Generator Room", floor: 3, status: "live" },
  { id: 23, name: "Cam 23", location: "Archive Room", floor: 3, status: "live" },
  { id: 24, name: "Cam 24", location: "Courtyard", floor: 1, status: "live" },
  { id: 25, name: "Cam 25", location: "West Corridor", floor: 3, status: "recording" },
]

export const MOCK_ALERTS: AlertMessage[] = [
  { id: 1, severity: "emergency", text: "Weapon-like object detected near main entrance.", cameraId: 1, time: "14:32:05", incidentTime: 72 },
  { id: 2, severity: "critical", text: "Unauthorized access: Restricted area breach.", cameraId: 7, time: "14:30:41", incidentTime: 68 },
  { id: 3, severity: "critical", text: "Suspicious package detected near south entrance.", cameraId: 12, time: "14:28:18", incidentTime: 62 },
  { id: 4, severity: "warning", text: "Unusual crowd behavior detected in parking lot.", cameraId: 4, time: "14:25:33", incidentTime: 55 },
  { id: 5, severity: "info", text: "System scan complete. 23/25 cameras online.", time: "14:22:00" },
  { id: 6, severity: "warning", text: "Unidentified individual loitering in lobby.", cameraId: 2, time: "14:20:47", incidentTime: 45 },
  { id: 7, severity: "info", text: "Vehicle identified: Authorized delivery truck.", time: "14:18:12" },
  { id: 8, severity: "info", text: "AI model updated to v3.2.1 - Fall detection improved.", time: "14:15:00" },
  { id: 9, severity: "warning", text: "Motion detected in server room after hours.", cameraId: 6, time: "14:12:22", incidentTime: 38 },
  { id: 10, severity: "critical", text: "Perimeter fence anomaly detected at north gate.", cameraId: 21, time: "14:10:05", incidentTime: 32 },
  { id: 11, severity: "info", text: "Shift change: Operator B now on duty.", time: "14:08:00" },
  { id: 12, severity: "warning", text: "Camera 9 offline - connection lost.", cameraId: 9, time: "14:05:33" },
]

export function getCameraById(id: number): CameraInfo | undefined {
  return CAMERAS.find((c) => c.id === id)
}

export function getStatusColor(status: CameraStatus): string {
  switch (status) {
    case "live": return "text-emerald-400"
    case "recording": return "text-amber-400"
    case "alert": return "text-red-400"
    case "offline": return "text-neutral-500"
    case "processing": return "text-indigo-400"
  }
}

export function getStatusBgColor(status: CameraStatus): string {
  switch (status) {
    case "live": return "bg-emerald-500"
    case "recording": return "bg-amber-500"
    case "alert": return "bg-red-500"
    case "offline": return "bg-neutral-600"
    case "processing": return "bg-indigo-500"
  }
}

export function getStatusLabel(status: CameraStatus): string {
  switch (status) {
    case "live": return "LIVE"
    case "recording": return "REC"
    case "alert": return "ALERT"
    case "offline": return "OFFLINE"
    case "processing": return "AI PROC"
  }
}

export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return "text-emerald-400"
    case "warning": return "text-amber-400"
    case "critical": return "text-red-400"
    case "emergency": return "text-red-300"
  }
}

export function getSeverityBgColor(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return "bg-emerald-500/15 border-emerald-500/30"
    case "warning": return "bg-amber-500/15 border-amber-500/30"
    case "critical": return "bg-red-500/15 border-red-500/30"
    case "emergency": return "bg-red-500/20 border-red-400/40"
  }
}

export function getSeverityLabel(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return "Info"
    case "warning": return "Warning"
    case "critical": return "Critical"
    case "emergency": return "Emergency"
  }
}
