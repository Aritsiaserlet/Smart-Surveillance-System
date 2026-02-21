"use client"

import { useState, useCallback } from "react"
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Eye,
  Play,
  Download,
  Users,
  ShieldCheck,
  Trash2,
  UserPlus,
  Mail,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
} from "recharts"

interface AiSidebarProps {
  open: boolean
}

const OCCUPANCY_DATA = [
  { time: "06:00", count: 45 },
  { time: "07:00", count: 120 },
  { time: "08:00", count: 310 },
  { time: "09:00", count: 487 },
  { time: "10:00", count: 420 },
  { time: "11:00", count: 395 },
  { time: "12:00", count: 450 },
  { time: "13:00", count: 380 },
  { time: "14:00", count: 342 },
]

const INCIDENT_DATA = [
  { day: "Mon", count: 3 },
  { day: "Tue", count: 5 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 7 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 1 },
  { day: "Sun", count: 6 },
]

interface ManagedUser {
  id: string
  name: string
  email: string
  permissions: { viewLive: boolean; playback: boolean; exportFootage: boolean; manageUsers: boolean }
}

const PERMISSION_KEYS = [
  { key: "viewLive" as const, label: "View Live", icon: Eye },
  { key: "playback" as const, label: "Playback", icon: Play },
  { key: "exportFootage" as const, label: "Export", icon: Download },
  { key: "manageUsers" as const, label: "Manage", icon: Users },
]

const AVATAR_COLORS = [
  "bg-sky-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-indigo-600",
]

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.dev@gmail.com",
    permissions: { viewLive: true, playback: true, exportFootage: true, manageUsers: false },
  },
  {
    id: "2",
    name: "Sara Nguyen",
    email: "sara.nguyen@gmail.com",
    permissions: { viewLive: true, playback: true, exportFootage: false, manageUsers: false },
  },
  {
    id: "3",
    name: "Marcus Lee",
    email: "marcus.lee@gmail.com",
    permissions: { viewLive: true, playback: false, exportFootage: false, manageUsers: false },
  },
]

export function AiSidebar({ open }: AiSidebarProps) {
  const [activeTab, setActiveTab] = useState("analytics")
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS)
  const [inviteEmail, setInviteEmail] = useState("")

  const handleInviteUser = useCallback(() => {
    const trimmed = inviteEmail.trim()
    if (!trimmed || !trimmed.includes("@")) return
    const name = trimmed.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    const newUser: ManagedUser = {
      id: Date.now().toString(),
      name,
      email: trimmed,
      permissions: { viewLive: true, playback: false, exportFootage: false, manageUsers: false },
    }
    setUsers((prev) => [...prev, newUser])
    setInviteEmail("")
  }, [inviteEmail])

  const handleRemoveUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const handleTogglePermission = useCallback((userId: string, key: keyof ManagedUser["permissions"]) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, permissions: { ...u.permissions, [key]: !u.permissions[key] } } : u
      )
    )
  }, [])

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300 overflow-hidden",
        open ? "w-80" : "w-0"
      )}
      aria-label="Sidebar navigation"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="shrink-0 border-b border-sidebar-border px-2 pt-2 pb-0">
          <TabsList className="w-full bg-secondary/50 h-8">
            <TabsTrigger value="analytics" className="flex-1 text-[10px] gap-1 h-6 px-2">
              <BarChart3 className="size-3" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex-1 text-[10px] gap-1 h-6 px-2">
              <Server className="size-3" />
              System
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Analytics & Insights Tab */}
        <TabsContent value="analytics" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-3">
              {/* Occupancy Over Time */}
              <div className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="size-3.5 text-primary" />
                  <span className="text-[11px] font-semibold text-foreground">Occupancy Over Time</span>
                </div>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={OCCUPANCY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.65 0.2 160)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="oklch(0.65 0.2 160)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                      <ReTooltip
                        contentStyle={{
                          background: "oklch(0.17 0.005 260)",
                          border: "1px solid oklch(0.28 0.005 260)",
                          borderRadius: "6px",
                          fontSize: "10px",
                          color: "oklch(0.95 0 0)",
                        }}
                      />
                      <Area type="monotone" dataKey="count" stroke="oklch(0.65 0.2 160)" fill="url(#occupancyGrad)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Incident Trend */}
              <div className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="size-3.5 text-red-400" />
                  <span className="text-[11px] font-semibold text-foreground">Incident Trend (7 days)</span>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INCIDENT_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                      <XAxis dataKey="day" tick={{ fontSize: 9, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "oklch(0.65 0 0)" }} axisLine={false} tickLine={false} />
                      <ReTooltip
                        contentStyle={{
                          background: "oklch(0.17 0.005 260)",
                          border: "1px solid oklch(0.28 0.005 260)",
                          borderRadius: "6px",
                          fontSize: "10px",
                          color: "oklch(0.95 0 0)",
                        }}
                      />
                      <Bar dataKey="count" fill="oklch(0.55 0.22 25)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insight Sentences */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">AI Insights</span>
                <div className="rounded-md border border-border bg-card/50 p-2.5">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="size-3 text-primary mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Crowd density increased <span className="text-foreground font-semibold">27%</span> vs yesterday
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-border bg-card/50 p-2.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-3 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Most incidents occurred on <span className="text-foreground font-semibold">Floor 1</span> (parking lot area)
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-border bg-card/50 p-2.5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="size-3 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Average response time improved to <span className="text-foreground font-semibold">2.3 min</span> (-18%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Suggestion</span>
                    <p className="text-[11px] text-foreground leading-relaxed mt-1">
                      Deploy additional security staff to Parking Lot A. Incident frequency in this zone is 3x above average during 14:00-16:00.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* System Health & Settings Tab */}
        <TabsContent value="system" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-3">
              {/* System Health */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">System Health</span>

                {/* Cameras Online */}
                <div className="rounded-md border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="size-3.5 text-emerald-400" />
                      <span className="text-[11px] text-foreground font-medium">Cameras Online</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">23/25</span>
                  </div>
                  <Progress value={92} className="h-1.5 bg-secondary [&>div]:bg-emerald-500" />
                  <span className="text-[9px] text-muted-foreground mt-1 block">92% uptime</span>
                </div>

                {/* AI Processing Load */}
                <div className="rounded-md border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="size-3.5 text-amber-400" />
                      <span className="text-[11px] text-foreground font-medium">AI Processing (CPU/GPU)</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-400">67%</span>
                  </div>
                  <Progress value={67} className="h-1.5 bg-secondary [&>div]:bg-amber-500" />
                  <span className="text-[9px] text-muted-foreground mt-1 block">GPU: 4.2 TFLOPS / 6.0 TFLOPS</span>
                </div>

                {/* Storage Remaining */}
                <div className="rounded-md border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="size-3.5 text-sky-400" />
                      <span className="text-[11px] text-foreground font-medium">Storage Remaining</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-sky-400">4.2 TB</span>
                  </div>
                  <Progress value={58} className="h-1.5 bg-secondary [&>div]:bg-sky-500" />
                  <span className="text-[9px] text-muted-foreground mt-1 block">4.2 TB / 10.0 TB (42% used)</span>
                </div>

                {/* Network Status */}
                <div className="rounded-md border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wifi className="size-3.5 text-primary" />
                      <span className="text-[11px] text-foreground font-medium">Network Status</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-primary">Stable</span>
                  </div>
                  <Progress value={95} className="h-1.5 bg-secondary [&>div]:bg-primary" />
                  <span className="text-[9px] text-muted-foreground mt-1 block">Latency: 12ms / Bandwidth: 940 Mbps</span>
                </div>
              </div>

              {/* User Access Management */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-primary" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">User Access Management</span>
                </div>

                {/* Invite Input */}
                <div className="rounded-lg border border-border bg-card/50 p-3">
                  <label className="text-[10px] font-medium text-muted-foreground mb-2 block">Invite a new user</label>
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
                      <Input
                        type="email"
                        placeholder="Invite user by Gmail..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleInviteUser() }}
                        className="h-7 pl-7 text-[11px] bg-secondary/50 border-border placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleInviteUser}
                      disabled={!inviteEmail.trim() || !inviteEmail.includes("@")}
                      className="h-7 px-2.5 text-[10px] font-semibold gap-1"
                    >
                      <UserPlus className="size-3" />
                      Invite
                    </Button>
                  </div>
                </div>

                {/* Users List */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-muted-foreground">{users.length} user{users.length !== 1 ? "s" : ""} with access</span>

                  {users.map((user, idx) => (
                    <div
                      key={user.id}
                      className="rounded-lg border border-border bg-card/50 p-3 transition-colors hover:border-primary/20"
                    >
                      {/* User Identity Row */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback
                            className={cn(
                              "text-[10px] font-bold text-foreground",
                              AVATAR_COLORS[idx % AVATAR_COLORS.length]
                            )}
                          >
                            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-foreground truncate leading-tight">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate leading-tight">{user.email}</p>
                        </div>
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleRemoveUser(user.id)}
                                className="size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                                aria-label={`Remove ${user.name}`}
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-[10px]">
                              Remove user
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Permission Toggles */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                        {PERMISSION_KEYS.map((perm) => {
                          const PermIcon = perm.icon
                          const isOn = user.permissions[perm.key]
                          return (
                            <label
                              key={perm.key}
                              className="flex items-center gap-1.5 cursor-pointer group"
                            >
                              <Switch
                                checked={isOn}
                                onCheckedChange={() => handleTogglePermission(user.id, perm.key)}
                                className="h-4 w-7 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-secondary"
                              />
                              <PermIcon
                                className={cn(
                                  "size-3 transition-colors",
                                  isOn ? "text-emerald-400" : "text-muted-foreground"
                                )}
                              />
                              <span
                                className={cn(
                                  "text-[10px] transition-colors select-none",
                                  isOn ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                              >
                                {perm.label}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
