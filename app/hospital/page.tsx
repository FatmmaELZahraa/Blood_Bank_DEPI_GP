"use client"

import { useState, useEffect } from "react"
import {
  Droplets,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// ── API helpers ──────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004"

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

async function apiFetch(path: string) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (res.status === 401) { window.location.href = "/login"; return null }
  if (!res.ok) return null
  return res.json()
}

// ── Types ────────────────────────────────────────────────────────────────────

interface BloodRequest {
  requestId: number
  bloodType: string
  quantity: number
  priority: string
  status: string
  requestDate: string
  notes?: string
  userID: number
  hospital?: { userID: number; name: string }
}

interface SosRequest {
  sosId?: number
  SOSId?: number
  bloodType: string
  units: number
  priority: string
  description?: string
  requestDate: string
  hospitalId: number
}

interface InventorySummary {
  inventoryId: number
  bloodBank: { userID: number; bankName: string; location: string }
  summary: { bloodType: string; totalQuantity: number }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const CAPACITY_MAP: Record<string, number> = {
  "A+": 100, "A-": 50, "B+": 80, "B-": 40,
  "AB+": 60, "AB-": 30, "O+": 120, "O-": 60
}

function getInventoryStatus(units: number, capacity: number) {
  const pct = (units / capacity) * 100
  if (pct <= 15) return "critical"
  if (pct <= 35) return "low"
  return "good"
}

function getStatusColor(status: string) {
  switch (status) {
    case "good": return "bg-green-500"
    case "low": return "bg-amber-500"
    case "critical": return "bg-destructive"
    default: return "bg-muted"
  }
}

function getPriorityBadge(priority: string) {
  switch (priority?.toLowerCase()) {
    case "critical":
    case "urgent":
      return <Badge className="bg-destructive text-destructive-foreground">{priority}</Badge>
    case "high":
      return <Badge className="bg-amber-500 text-white">High</Badge>
    case "medium":
      return <Badge className="bg-blue-500 text-white">Medium</Badge>
    default:
      return <Badge variant="secondary">Low</Badge>
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HospitalDashboardPage() {
  const [requests, setRequests]     = useState<BloodRequest[]>([])
  const [sosList, setSosList]       = useState<SosRequest[]>([])
  const [inventories, setInventories] = useState<InventorySummary[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
  try {
    setLoading(true)
    setError("")

    const userId = localStorage.getItem("UserID") || localStorage.getItem("userId")

    if (!userId) {
      setError("Session expired. Please login again.")
      setLoading(false)
      return
    }

    const [reqData, sosData, invData] = await Promise.all([
      apiFetch(`/api/blood-requests?UserID=${userId}`),
      apiFetch(`/api/sos-requests?hospitalId=${userId}`),
      apiFetch("/api/inventories"),
    ])

    setRequests(reqData ?? [])
    setSosList(sosData ?? [])
    setInventories(invData ?? [])
    setLastUpdated(new Date())
  } catch (e: any) {
    setError("Failed to load dashboard data.")
  } finally {
    setLoading(false)
  }
}

  // ── Derived data ──────────────────────────────────────────────────────────

  const pendingRequests = requests.filter(r => r.status?.toLowerCase() === "pending")
  const fulfilledCount  = requests.filter(r => r.status?.toLowerCase() === "fulfilled").length
  const activeSOS       = sosList.length

  // Merge all inventories into one blood type map
  const bloodTypeMap: Record<string, number> = {}
  inventories.forEach(inv => {
    inv.summary?.forEach(s => {
      bloodTypeMap[s.bloodType] = (bloodTypeMap[s.bloodType] ?? 0) + Number(s.totalQuantity)
    })
  })

  const inventoryOverview = BLOOD_TYPES.map(type => {
    const units    = bloodTypeMap[type] ?? 0
    const capacity = CAPACITY_MAP[type]
    return { type, units, capacity, status: getInventoryStatus(units, capacity) }
  })

  const totalUnits    = inventoryOverview.reduce((a, i) => a + i.units, 0)
  const totalCapacity = inventoryOverview.reduce((a, i) => a + i.capacity, 0)
  const criticalCount = inventoryOverview.filter(i => i.status === "critical").length

  // Recent activity = last 5 requests of any status
  const recentActivity = [...requests]
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
    .slice(0, 5)

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={fetchAll}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Critical Alert */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Critical Stock Alert</p>
            <p className="text-sm text-muted-foreground">
              {criticalCount} blood type(s) are critically low. Consider initiating SOS request.
            </p>
          </div>
          <Button asChild variant="destructive" size="sm">
            <Link href="/hospital/sos">Send SOS</Link>
          </Button>
        </div>
      )}

      {/* SOS Alert */}
      {activeSOS > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <Zap className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-amber-600">{activeSOS} Active SOS Request(s)</p>
            <p className="text-sm text-muted-foreground">Emergency blood requests are pending response.</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hospital/sos">View SOS</Link>
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-3xl font-bold">{totalUnits}</p>
                <p className="text-xs text-muted-foreground">of {totalCapacity} capacity</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={(totalUnits / totalCapacity) * 100} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Stock</p>
                <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">blood types</p>
              </div>
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-bold text-amber-600">{pendingRequests.length}</p>
                <p className="text-xs text-muted-foreground">awaiting fulfillment</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
                <p className="text-3xl font-bold text-green-600">{fulfilledCount}</p>
                <p className="text-xs text-muted-foreground">total requests</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  Blood Inventory
                </CardTitle>
                <CardDescription>Current stock levels by blood type</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/hospital/inventory">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {inventories.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No inventory data available</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {inventoryOverview.map((item) => (
                  <div key={item.type} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{item.type}</span>
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.units} units</span>
                        <span className="text-muted-foreground">
                          {Math.round((item.units / item.capacity) * 100)}%
                        </span>
                      </div>
                      <Progress value={(item.units / item.capacity) * 100} className="mt-1 h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Pending Requests
                </CardTitle>
                <CardDescription>Blood requests awaiting fulfillment</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/hospital/requests">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-sm text-muted-foreground">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 4).map((req) => (
                  <div key={req.requestId}
                    className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-bold text-primary">{req.bloodType}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {req.hospital?.name ?? `Hospital #${req.userID}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.quantity} units · {new Date(req.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getPriorityBadge(req.priority)}
                  </div>
                ))}
                {pendingRequests.length > 4 && (
                  <p className="text-center text-xs text-muted-foreground">
                    +{pendingRequests.length - 4} more requests
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest blood requests</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/hospital/requests">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((req) => (
                <div key={req.requestId}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      req.status?.toLowerCase() === "fulfilled"
                        ? "bg-green-100 dark:bg-green-900"
                        : req.status?.toLowerCase() === "pending"
                        ? "bg-amber-100 dark:bg-amber-900"
                        : "bg-muted"
                    }`}>
                      {req.status?.toLowerCase() === "fulfilled" ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : req.status?.toLowerCase() === "pending" ? (
                        <Clock className="h-5 w-5 text-amber-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {req.hospital?.name ?? `Hospital #${req.userID}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(req.requestDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{req.bloodType}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{req.quantity} units</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}