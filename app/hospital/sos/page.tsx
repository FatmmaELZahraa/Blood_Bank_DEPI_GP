"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Send, CheckCircle, Zap, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004"
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

// ✅ FIX: reads "userId" (lowercase d) — matches what login.page.tsx saves
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

interface SosRequest {
  sosId: number
  bloodType: string
  units: number
  priority: string
  description?: string
  requestDate: string
  hospitalId: number
  hospital?: { userID: number; name: string; phone?: string }
}

export default function SOSPage() {
  const [sosList, setSosList]         = useState<SosRequest[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState("")
  const [submitted, setSubmitted]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [selectedBloodType, setSelectedBloodType] = useState("")
  const [unitsNeeded, setUnitsNeeded]             = useState("")
  const [priority, setPriority]                   = useState("")
  const [description, setDescription]             = useState("")

  useEffect(() => { fetchSOS() }, [])

  async function fetchSOS() {
    try {
      setLoading(true)
      setError("")
      const hospitalId = getUserId()
      if (!hospitalId) { window.location.href = "/login"; return }
      const data = await apiFetch(`/api/sos-requests?hospitalId=${hospitalId}`)
      setSosList(data ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!selectedBloodType || !unitsNeeded || !priority) {
      setSubmitError("Blood type, units and priority are required.")
      return
    }

    // ✅ FIX: use getUserId() which reads "userId" correctly
    const hospitalId = getUserId()
    if (!hospitalId) {
      window.location.href = "/login"
      return
    }

    const mappedPriority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()

    try {
      setSubmitting(true)
      setSubmitError("")
      await apiFetch("/api/sos-requests", {
        method: "POST",
        body: JSON.stringify({
          bloodType:   selectedBloodType,
          units:       Number(unitsNeeded),
          priority:    mappedPriority,
          hospitalId,
          description,
        }),
      })
      setSubmitted(true)
      setSelectedBloodType("")
      setUnitsNeeded("")
      setPriority("")
      setDescription("")
      setTimeout(() => setSubmitted(false), 3000)
      fetchSOS()
    } catch (e: any) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Cancel this SOS request?")) return
    try {
      await apiFetch(`/api/sos-requests/${id}`, { method: "DELETE" })
      setSosList(prev => prev.filter(s => s.sosId !== id))
    } catch (e: any) {
      alert("Failed to cancel request.")
    }
  }

  return (
    <div className="space-y-6">

      {/* Alert Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <div>
          <p className="font-semibold text-destructive">Emergency Blood Request System</p>
          <p className="text-sm text-muted-foreground">
            SOS requests are broadcast to all nearby blood banks and eligible donors immediately.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Create SOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-destructive" />
              Create SOS Request
            </CardTitle>
            <CardDescription>Send an emergency blood request to the network</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">SOS Request Sent!</h3>
                <p className="text-muted-foreground">Your request has been broadcast successfully.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Blood Type Required</Label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Units Needed</Label>
                  <Input type="number" value={unitsNeeded}
                    onChange={e => setUnitsNeeded(e.target.value)} placeholder="Enter units" min="1" />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description}
                    onChange={e => setDescription(e.target.value)} placeholder="Describe situation..." />
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />{submitError}
                  </div>
                )}

                <Button className="w-full bg-destructive hover:bg-destructive/90"
                  onClick={handleSubmit} disabled={submitting || !selectedBloodType || !unitsNeeded || !priority}>
                  {submitting
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                    : <><Send className="mr-2 h-4 w-4" />Send SOS Request</>}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active SOS List */}
        <Card>
          <CardHeader>
            <CardTitle>Active SOS Requests</CardTitle>
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
                <Button variant="outline" size="sm" onClick={fetchSOS}>Retry</Button>
              </div>
            )}
            {!loading && !error && sosList.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">No active SOS requests</div>
            )}
            {!loading && !error && (
              <div className="space-y-4">
                {sosList.map(sos => (
                  <div key={sos.sosId} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg">{sos.bloodType}</span>
                          <Badge className={
                            sos.priority?.toLowerCase() === "critical"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-amber-500 text-white"
                          }>
                            {sos.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{sos.units} units needed</p>
                        {sos.hospital?.name && (
                          <p className="text-sm text-muted-foreground">{sos.hospital.name}</p>
                        )}
                        {sos.description && (
                          <p className="text-xs text-muted-foreground mt-1">{sos.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(sos.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(sos.sosId)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}