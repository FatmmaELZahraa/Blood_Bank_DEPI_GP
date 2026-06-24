"use client"

import { useState, useEffect } from "react"
import {
  Droplets,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004"

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    window.location.href = "/login"
    return
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Request failed")
  }

  return res.status === 204 ? null : res.json()
}

// ── Types ────────────────────────────────────────────────────────────────────

interface BloodSummary {
  bloodType: string
  totalQuantity: number
}

interface InventoryData {
  inventoryId: number
  bloodBank: { userID: number; bankName: string; location: string }
  summary: BloodSummary[]
}

interface ExpiringUnit {
  unitId: number
  inventoryId: number
  bloodType: string
  quantity: number
  expiryDate: string
  daysLeft: number
}

// ── Constants ────────────────────────────────────────────────────────────────

const CAPACITY: Record<string, number> = {
  "A+": 100, "A-": 50, "B+": 80, "B-": 40,
  "AB+": 60, "AB-": 30, "O+": 120, "O-": 60,
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

// ── Status helper ────────────────────────────────────────────────────────────

function getStatus(units: number, capacity: number) {
  const pct = (units / capacity) * 100
  if (pct <= 20) return { label: "Critical", color: "bg-destructive", textColor: "text-destructive" }
  if (pct <= 40) return { label: "Low",      color: "bg-amber-500",   textColor: "text-amber-600"  }
  return              { label: "Good",     color: "bg-green-500",   textColor: "text-green-600"  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [inventories, setInventories]       = useState<InventoryData[]>([])
  const [expiring, setExpiring]             = useState<ExpiringUnit[]>([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState("")
  const [searchTerm, setSearchTerm]         = useState("")
  const [filterStatus, setFilterStatus]     = useState("all")
  const [dialogOpen, setDialogOpen]         = useState(false)
  const [submitting, setSubmitting]         = useState(false)
  const [submitError, setSubmitError]       = useState("")

  // form state
  const [selectedType, setSelectedType]           = useState("")
  const [selectedInventory, setSelectedInventory] = useState("")
  const [adjustAmount, setAdjustAmount]           = useState("")
  const [expiryDate, setExpiryDate]               = useState("")

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    try {
      setLoading(true)
      setError("")
      const [inventoriesData, expiringData] = await Promise.all([
        apiFetch("/api/inventories"),
        apiFetch("/api/blood-units/expiring?days=7"),
      ])
      setInventories(inventoriesData ?? [])
      setExpiring(expiringData ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Add blood unit ─────────────────────────────────────────────────────────

  async function handleAddStock() {
    if (!selectedType || !adjustAmount || !expiryDate || !selectedInventory) {
      setSubmitError("All fields are required.")
      return
    }
    const amount = Number(adjustAmount)
    if (amount <= 0) {
      setSubmitError("Units must be greater than 0.")
      return
    }
    try {
      setSubmitting(true)
      setSubmitError("")
      await apiFetch("/api/blood-units", {
        method: "POST",
        body: JSON.stringify({
          inventoryId: Number(selectedInventory),
          bloodType:   selectedType,
          quantity:    amount,
          expiryDate:  new Date(expiryDate).toISOString(),
        }),
      })
      await fetchAll()
      setDialogOpen(false)
      setSelectedType("")
      setSelectedInventory("")
      setAdjustAmount("")
      setExpiryDate("")
    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  // دمج كل الـ summaries من كل الـ inventories في جدول واحد لكل blood type
  const inventory = bloodTypes.map((type) => {
    const totalUnitsForType = inventories.reduce((acc, inv) => {
      const found = inv.summary.find((s) => s.bloodType === type)
      return acc + (found ? Number(found.totalQuantity) : 0)
    }, 0)
    const capacity     = CAPACITY[type] ?? 100
    const expiringSoon = expiring.filter((u) => u.bloodType === type).length
    return { type, units: totalUnitsForType, capacity, expiringSoon }
  })

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch  = item.type.toLowerCase().includes(searchTerm.toLowerCase())
    const status         = getStatus(item.units, item.capacity).label.toLowerCase()
    const matchesFilter  = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalUnits    = inventory.reduce((acc, i) => acc + i.units, 0)
  const totalCapacity = inventory.reduce((acc, i) => acc + i.capacity, 0)
  const expiringTotal = expiring.length

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inventory</p>
                <p className="text-3xl font-bold text-foreground">{totalUnits}</p>
                <p className="text-xs text-muted-foreground">of {totalCapacity} capacity</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={(totalUnits / totalCapacity) * 100} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Types</p>
                <p className="text-3xl font-bold text-amber-600">
                  {inventory.filter((i) => getStatus(i.units, i.capacity).label === "Low").length}
                </p>
                <p className="text-xs text-muted-foreground">need restocking</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-3xl font-bold text-destructive">{expiringTotal}</p>
                <p className="text-xs text-muted-foreground">units within 7 days</p>
              </div>
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Blood Inventory</CardTitle>
              <CardDescription>
                Showing combined stock from {inventories.length} blood bank(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Refresh */}
              <Button variant="outline" size="icon" onClick={fetchAll} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>

              {/* Add Stock Dialog */}
              <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); setSubmitError("") }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Blood Units</DialogTitle>
                    <DialogDescription>Add new blood units to a blood bank inventory</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">

                    {/* اختار الـ Blood Bank */}
                    <div className="space-y-2">
                      <Label>Blood Bank</Label>
                      <Select value={selectedInventory} onValueChange={setSelectedInventory}>
                        <SelectTrigger><SelectValue placeholder="Select blood bank" /></SelectTrigger>
                        <SelectContent>
                          {inventories.map((inv) => (
                            <SelectItem key={inv.inventoryId} value={String(inv.inventoryId)}>
                              {inv.bloodBank.bankName} — {inv.bloodBank.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Blood Type</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Units to Add</Label>
                      <Input
                        type="number"
                        placeholder="Enter number of units"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    {submitError && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {submitError}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddStock}
                      disabled={submitting || !selectedType || !adjustAmount || !expiryDate || !selectedInventory}
                    >
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchAll}>Retry</Button>
            </div>
          )}

          {/* Inventory Grid */}
          {!loading && !error && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredInventory.map((item) => {
                const status = getStatus(item.units, item.capacity)
                return (
                  <Card key={item.type} className="overflow-hidden">
                    <div className={`h-1 ${status.color}`} />
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-lg font-bold text-primary">{item.type}</span>
                        </div>
                        <Badge variant="outline" className={status.textColor}>
                          {status.label}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Stock Level</span>
                            <span className="font-medium text-foreground">
                              {item.units} / {item.capacity}
                            </span>
                          </div>
                          <Progress
                            value={(item.units / item.capacity) * 100}
                            className="mt-1 h-2"
                          />
                        </div>

                        {item.expiringSoon > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle className="h-3 w-3" />
                            {item.expiringSoon} units expiring soon
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}