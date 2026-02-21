"use client"

import { useState } from "react"
import { TopNav } from "@/components/dashboard/top-nav"
import { AiSidebar } from "@/components/dashboard/ai-sidebar"
import { AlertFeed } from "@/components/dashboard/alert-feed"
import { CameraGrid } from "@/components/dashboard/camera-grid"
import { CameraModal } from "@/components/dashboard/camera-modal"
import { MiniMap } from "@/components/dashboard/mini-map"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [gridMode, setGridMode] = useState<"3x3" | "5x5">("3x3")
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null)
  const [miniMapOpen, setMiniMapOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [incidentTime, setIncidentTime] = useState<number | undefined>(undefined)

  function handleToggleGrid() {
    setGridMode((prev) => (prev === "3x3" ? "5x5" : "3x3"))
  }

  function handleOpenCamera(id: number, initialTime?: number) {
    setSelectedCamera(id)
    setIncidentTime(initialTime)
  }

  function handleCloseCamera() {
    setSelectedCamera(null)
    setIncidentTime(undefined)
  }

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <TopNav
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        gridMode={gridMode}
        onToggleGrid={handleToggleGrid}
        miniMapOpen={miniMapOpen}
        onToggleMiniMap={() => setMiniMapOpen((p) => !p)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Sidebar: Analytics & System Health */}
        <AiSidebar open={sidebarOpen} />

        {/* Main Camera Grid */}
        <main className="relative flex-1 overflow-auto">
          <CameraGrid
            gridMode={gridMode}
            onSelectCamera={(id) => handleOpenCamera(id)}
            searchQuery={searchQuery}
          />
          <MiniMap
            open={miniMapOpen}
            onClose={() => setMiniMapOpen(false)}
            onSelectCamera={(id) => handleOpenCamera(id)}
          />
        </main>

        {/* Right Panel: AI Alert Feed */}
        <AlertFeed onOpenCamera={handleOpenCamera} />
      </div>

      <CameraModal
        cameraId={selectedCamera}
        open={selectedCamera !== null}
        onClose={handleCloseCamera}
        initialTimelinePosition={incidentTime}
      />
    </div>
  )
}
