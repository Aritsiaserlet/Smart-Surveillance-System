"use client"

import { useState } from "react"
import {
  Menu,
  Grid3X3,
  LayoutGrid,
  Shield,
  Search,
  Map,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TopNavProps {
  onToggleSidebar: () => void
  gridMode: "3x3" | "5x5"
  onToggleGrid: () => void
  miniMapOpen: boolean
  onToggleMiniMap: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const NOTIFICATIONS = [
  { id: 1, text: "Weapon-like object detected near main entrance", time: "2 min ago", severity: "emergency" as const, read: false },
  { id: 2, text: "Unauthorized access: Restricted area breach on Floor 2", time: "4 min ago", severity: "critical" as const, read: false },
  { id: 3, text: "Suspicious package detected near south entrance", time: "6 min ago", severity: "critical" as const, read: false },
  { id: 4, text: "Camera 09 is now offline - connection lost", time: "15 min ago", severity: "warning" as const, read: true },
  { id: 5, text: "AI model updated to v3.2.1 successfully", time: "20 min ago", severity: "info" as const, read: true },
  { id: 6, text: "System scan complete. 23/25 cameras online", time: "25 min ago", severity: "info" as const, read: true },
]

function getSeverityDotColor(severity: string) {
  switch (severity) {
    case "emergency": return "bg-red-400"
    case "critical": return "bg-red-400"
    case "warning": return "bg-amber-400"
    case "info": return "bg-emerald-400"
    default: return "bg-muted-foreground"
  }
}

export function TopNav({
  onToggleSidebar,
  gridMode,
  onToggleGrid,
  miniMapOpen,
  onToggleMiniMap,
  searchQuery,
  onSearchChange,
}: TopNavProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 gap-4">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Menu className="size-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          <h1 className="text-sm font-bold tracking-tight text-foreground hidden md:block">
            AI Vision Command Center
          </h1>
          <h1 className="text-sm font-bold tracking-tight text-foreground md:hidden hidden sm:block">
            AI Vision
          </h1>
        </div>
      </div>

      {/* Center: global search */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cameras, users, incidents..."
            className="h-8 w-full pl-9 text-xs bg-secondary/50 border-border placeholder:text-muted-foreground/50 focus:bg-secondary"
          />
        </div>
      </div>

      {/* Right: notifications, profile, minimap, grid */}
      <div className="flex items-center gap-1.5">
        {/* Notification Bell */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-4 rounded-full bg-red-500 text-[9px] font-bold text-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 p-0 bg-card border-border"
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <span className="text-xs font-semibold text-foreground">Notifications</span>
              <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-red-500/15 border-red-500/30 text-red-400">
                {unreadCount} new
              </Badge>
            </div>
            <ScrollArea className="max-h-72">
              <div className="flex flex-col">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <span className={cn("size-2 rounded-full mt-1.5 shrink-0", getSeverityDotColor(n.severity))} />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className={cn("text-xs leading-relaxed", !n.read ? "text-foreground" : "text-muted-foreground")}>
                        {n.text}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60 font-mono">{n.time}</span>
                    </div>
                    {!n.read && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-border px-3 py-2">
              <button className="text-[10px] text-primary hover:underline w-full text-center">
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Avatar className="size-6">
                <AvatarImage src="/placeholder-user.jpg" alt="J. Mitchell" />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">JM</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground hidden lg:block">J. Mitchell</span>
              <ChevronDown className="size-3 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="J. Mitchell" />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">JM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">James Mitchell</span>
                  <span className="text-[10px] text-muted-foreground">j.mitchell@securityhq.com</span>
                  <span className="text-[10px] text-muted-foreground/60 mt-0.5">Admin - Last active: 5 min ago</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-xs gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
              <User className="size-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
              <Settings className="size-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-xs gap-2 text-red-400 hover:text-red-300 cursor-pointer">
              <LogOut className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

        {/* Mini-map toggle */}
        <Button
          variant={miniMapOpen ? "default" : "ghost"}
          size="icon"
          onClick={onToggleMiniMap}
          aria-label="Toggle mini-map"
          className={cn(
            "hidden sm:inline-flex",
            miniMapOpen
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <Map className="size-4" />
        </Button>

        {/* Grid layout toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleGrid}
          aria-label={`Switch to ${gridMode === "3x3" ? "5x5" : "3x3"} grid`}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          {gridMode === "3x3" ? (
            <LayoutGrid className="size-5" />
          ) : (
            <Grid3X3 className="size-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
