"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2, AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004"
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

// ✅ FIX: reads "userId" (lowercase d) — matches what login page saves
function getUserId(): number | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("userId")
  const id = Number(raw)
  return id > 0 ? id : null
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
  if (res.status === 401) { window.location.href = "/login"; return }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error("API Error:", res.status, err)
    throw new Error(err.error || "Request failed")
  }
  return res.status === 204 ? null : res.json()
}

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

export default function BloodRequestsPage() {
  const [requests, setRequests]       = useState<BloodRequest[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState("")
  const [open, setOpen]               = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Filter state — "all" بدل "" عشان SelectItem مش بيقبل empty string
  const [filterStatus, setFilterStatus]       = useState("Pending")
  const [filterBloodType, setFilterBloodType] = useState("all")
  const [mounted, setMounted]                 = useState(false)

  // Form state
  const [bloodType, setBloodType]   = useState("")
  const [quantity, setQuantity]     = useState("")
  const [priority, setPriority]     = useState("")
  const [notes, setNotes]           = useState("")

  // Fix hydration: wait until client is mounted before reading localStorage
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (mounted) fetchRequests() }, [mounted, filterStatus, filterBloodType])

  async function fetchRequests() {
    try {
      setLoading(true)
      setError("")
      const userId = getUserId()
      if (!userId) { window.location.href = "/login"; return }

      const params = new URLSearchParams({ UserID: String(userId) })
      if (filterStatus !== "all")    params.set("status", filterStatus)
      if (filterBloodType !== "all") params.set("bloodType", filterBloodType)

      const data = await apiFetch(`/api/blood-requests?${params}`)
      setRequests(data ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!bloodType || !quantity || !priority) {
      setSubmitError("Blood type, quantity and priority are required.")
      return
    }

    const userID = getUserId()
    if (!userID) {
      window.location.href = "/login"
      return
    }

    try {
      setSubmitting(true)
      setSubmitError("")
      await apiFetch("/api/blood-requests", {
        method: "POST",
        body: JSON.stringify({
          bloodType,
          quantity: Number(quantity),
          priority,
          userID,
          notes,
        }),
      })
      setSubmitted(true)
      setBloodType("")
      setQuantity("")
      setPriority("")
      setNotes("")
      setTimeout(() => {
        setSubmitted(false)
        setOpen(false)
      }, 2000)
      fetchRequests()
    } catch (e: any) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this blood request?")) return
    try {
      await apiFetch(`/api/blood-requests/${id}`, { method: "DELETE" })
      setRequests(prev => prev.filter(r => r.requestId !== id))
    } catch (e: any) {
      alert(e.message || "Failed to delete request.")
    }
  }

  const statusColor: Record<string, string> = {
    Pending:   "bg-amber-100 text-amber-800",
    Approved:  "bg-blue-100 text-blue-800",
    Fulfilled: "bg-green-100 text-green-800",
    Rejected:  "bg-red-100 text-red-800",
  }

  const pendingCount = requests.filter(r => r.status === "Pending").length

  if (!mounted) return null

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blood Requests</h1>
          <p className="text-muted-foreground">Manage and track blood requests</p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setSubmitted(false); setSubmitError("") } }}>
          <DialogTrigger asChild>
            <Button className="bg-destructive hover:bg-destructive/90">
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Blood Request</DialogTitle>
              <DialogDescription>Submit a new blood request</DialogDescription>
            </DialogHeader>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Request Submitted!</h3>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Units Needed</Label>
                    <Input type="number" value={quantity}
                      onChange={e => setQuantity(e.target.value)} placeholder="e.g. 3" min="1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={notes}
                    onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />{submitError}
                  </div>
                )}

                <Button className="w-full bg-destructive hover:bg-destructive/90"
                  onClick={handleSubmit}
                  disabled={submitting || !bloodType || !quantity || !priority}>
                  {submitting
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                    : "Submit Request"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {["Pending", "Approved", "Fulfilled", "Rejected"].map(s => (
          <Card key={s} className="cursor-pointer" onClick={() => setFilterStatus(s)}>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">{s}</p>
              <p className="text-2xl font-bold">
                {requests.filter(r => r.status === s).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Fulfilled">Fulfilled</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterBloodType} onValueChange={setFilterBloodType}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Blood Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {bloodTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filterStatus === "all" ? "All" : filterStatus} Requests
            {pendingCount > 0 && filterStatus === "Pending" && (
              <Badge className="ml-2 bg-amber-500 text-white">{pendingCount}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchRequests}>Retry</Button>
            </div>
          )}
          {!loading && !error && requests.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">No requests found</div>
          )}
          {!loading && !error && requests.length > 0 && (
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r.requestId} className="flex items-start justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{r.bloodType}</span>
                      <Badge className={statusColor[r.status] ?? "bg-gray-100 text-gray-800"}>
                        {r.status}
                      </Badge>
                      <Badge variant="outline">{r.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.quantity} units</p>
                    {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  {r.status === "Pending" && (
                    <Button variant="ghost" size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(r.requestId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}