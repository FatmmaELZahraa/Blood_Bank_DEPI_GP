"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  Search,
  Download,
  Phone,
  MapPin,
  Droplets,
  AlertTriangle,
  Syringe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const API_URL = "http://localhost:5004"

// ─── Types ───────────────────────────────────────────────
interface Hospital {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  totalCapacity: number
  currentUnits: number
  isVerified: boolean
  createdAt: string
}

interface SosRequest {
  sosId: number
  bloodType: string
  units: number
  priority: string
  description: string | null
  requestDate: string
  hospitalId: number
  hospital?: { userID: number; name: string; phone: string | null }
  // local UI state
  uiStatus?: "Pending" | "Completed"
}

interface BloodRequest {
  requestId: number
  bloodType: string
  quantity: number
  priority: string
  status: string
  requestDate: string
  notes: string | null
  userID: number
  hospital?: { userID: number; name: string }
  // local UI state
  uiStatus?: "Pending" | "Completed"
}

// ─── Helper ───────────────────────────────────────────────
function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    Urgent:   "bg-orange-100 text-orange-700 border-orange-200",
    High:     "bg-yellow-100 text-yellow-700 border-yellow-200",
    Normal:   "bg-blue-100 text-blue-700 border-blue-200",
  }
  return map[priority] ?? "bg-muted text-muted-foreground"
}

// ─── Main Page ────────────────────────────────────────────
export default function AdminHospitalsPage() {
  const [hospitals, setHospitals]       = useState<Hospital[]>([])
  const [sosRequests, setSosRequests]   = useState<SosRequest[]>([])
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const [searchTerm, setSearchTerm]   = useState("")
  const [expandedId, setExpandedId]   = useState<number | null>(null)

  // sos tab: "Pending" | "Completed"
  const [sosTab, setSosTab]           = useState<"Pending" | "Completed">("Pending")
  // blood tab: "Pending" | "Completed"
  const [bloodTab, setBloodTab]       = useState<"Pending" | "Completed">("Pending")

  // ── Fetch all data ──
  useEffect(() => {
    const load = async () => {
      try {
        const [hRes, sosRes, brRes] = await Promise.all([
         fetch(`${API_URL}/api/bloodbank/hospitals`, { headers: authHeaders() }),
          fetch(`${API_URL}/api/sos-requests`,     { headers: authHeaders() }),
          fetch(`${API_URL}/api/blood-requests`,   { headers: authHeaders() }),
        ])

        if (!hRes.ok)   throw new Error(`Hospitals: ${hRes.status}`)
        if (!sosRes.ok) throw new Error(`SOS: ${sosRes.status}`)
        if (!brRes.ok)  throw new Error(`Blood Requests: ${brRes.status}`)

        const [hData, sosData, brData] = await Promise.all([
          hRes.json(), sosRes.json(), brRes.json(),
        ])

        setHospitals(hData)
        setSosRequests(sosData.map((s: SosRequest) => ({ ...s, uiStatus: "Pending" as const })))
        setBloodRequests(brData.map((b: BloodRequest) => ({ ...b, uiStatus: "Pending" as const })))
      } catch (err: any) {
        setError(err.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Toggle SOS status ──
  const toggleSosStatus = async (id: number) => {
    const current = sosRequests.find(s => s.sosId === id)
    if (!current) return
    const newStatus = current.uiStatus === "Pending" ? "Completed" : "Pending"
    try {
      const res = await fetch(`${API_URL}/api/sos-requests/${id}/status`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSosRequests(prev =>
        prev.map(s => s.sosId === id ? { ...s, uiStatus: newStatus } : s)
      )
    } catch (e) {
      console.error("SOS toggle failed:", e)
      alert("Failed to update SOS status")
    }
  }

  // ── Toggle Blood Request status ──
  const toggleBloodStatus = async (id: number) => {
    const current = bloodRequests.find(b => b.requestId === id)
    if (!current) return
    const newStatus = current.uiStatus === "Pending" ? "Completed" : "Pending"
    try {
      const res = await fetch(`${API_URL}/api/blood-requests/${id}/status`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error(await res.text())
      setBloodRequests(prev =>
        prev.map(b => b.requestId === id ? { ...b, uiStatus: newStatus } : b)
      )
    } catch (e) {
      console.error("Blood toggle failed:", e)
      alert("Failed to update Blood Request status")
    }
  }

  // ── Derived ──
  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.address ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCapacity = hospitals.reduce((a, h) => a + (h.currentUnits ?? 0), 0)

  const filteredSos   = sosRequests.filter(s => s.uiStatus === sosTab)
  const filteredBlood = bloodRequests.filter(b => b.uiStatus === bloodTab)

  // ── Loading / Error ──
  if (loading) return (
    <div className="flex items-center justify-center p-16">
      <div className="text-center">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground">Loading data…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center p-16">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold text-destructive">Connection Error</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Building2 className="h-7 w-7 text-primary" />} label="Hospitals" value={hospitals.length} />
        <StatCard icon={<Droplets className="h-7 w-7 text-primary" />}   label="Network Blood Units" value={totalCapacity.toLocaleString()} />
        <StatCard icon={<AlertTriangle className="h-7 w-7 text-destructive" />} label="Active SOS" value={sosRequests.filter(s => s.uiStatus === "Pending").length} />
      </div>

      {/* ── Hospitals Table ── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Hospital Partners</CardTitle>
              <CardDescription>Manage partner hospitals and blood banks</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or address…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>SOS Requests</TableHead>
                  <TableHead>Blood Requests</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHospitals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No hospitals found
                    </TableCell>
                  </TableRow>
                ) : filteredHospitals.map(hospital => {
                  const isOpen = expandedId === hospital.id
                  const hosSos   = sosRequests.filter(s => s.hospitalId   === hospital.id)
                  const hosBlood = bloodRequests.filter(b => b.userID === hospital.id)

                  return (
                    <>
                      <TableRow
                        key={hospital.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedId(isOpen ? null : hospital.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground leading-tight">{hospital.name}</p>
                              <p className="text-xs text-muted-foreground">{hospital.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {hospital.address || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 shrink-0" />
                            {hospital.phone || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {hosSos.length > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              <AlertTriangle className="h-3 w-3" />
                              {hosSos.length} active
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {hosBlood.length > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              <Droplets className="h-3 w-3" />
                              {hosBlood.length} active
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isOpen
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                      </TableRow>

                      {/* ── Expanded Panel ── */}
                      {isOpen && (
                        <TableRow key={`${hospital.id}-expanded`}>
                          <TableCell colSpan={6} className="p-0 bg-muted/30">
                            <div className="p-5 space-y-6">

                              {/* SOS Requests */}
                              <RequestSection
                                icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
                                title="SOS Requests"
                                tab={sosTab}
                                setTab={setSosTab}
                                pendingCount={hosSos.filter(s => s.uiStatus === "Pending").length}
                                completedCount={hosSos.filter(s => s.uiStatus === "Completed").length}
                              >
                                {hosSos.filter(s => s.uiStatus === sosTab).length === 0 ? (
                                  <EmptyState label={`No ${sosTab.toLowerCase()} SOS requests`} />
                                ) : hosSos.filter(s => s.uiStatus === sosTab).map(sos => (
                                  <RequestCard
                                    key={sos.sosId}
                                    status={sos.uiStatus!}
                                    onToggle={() => toggleSosStatus(sos.sosId)}
                                    badge={
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityBadge(sos.priority)}`}>
                                        {sos.priority}
                                      </span>
                                    }
                                    lines={[
                                      <><Droplets className="h-3 w-3" /> {sos.bloodType} — {sos.units} units</>,
                                      <><Clock className="h-3 w-3" /> {new Date(sos.requestDate).toLocaleDateString()}</>,
                                      sos.description ? <span className="italic">{sos.description}</span> : null,
                                    ]}
                                  />
                                ))}
                              </RequestSection>

                              {/* Blood Requests */}
                              <RequestSection
                                icon={<Syringe className="h-4 w-4 text-primary" />}
                                title="Blood Requests"
                                tab={bloodTab}
                                setTab={setBloodTab}
                                pendingCount={hosBlood.filter(b => b.uiStatus === "Pending").length}
                                completedCount={hosBlood.filter(b => b.uiStatus === "Completed").length}
                              >
                                {hosBlood.filter(b => b.uiStatus === bloodTab).length === 0 ? (
                                  <EmptyState label={`No ${bloodTab.toLowerCase()} blood requests`} />
                                ) : hosBlood.filter(b => b.uiStatus === bloodTab).map(br => (
                                  <RequestCard
                                    key={br.requestId}
                                    status={br.uiStatus!}
                                    onToggle={() => toggleBloodStatus(br.requestId)}
                                    badge={
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityBadge(br.priority)}`}>
                                        {br.priority}
                                      </span>
                                    }
                                    lines={[
                                      <><Droplets className="h-3 w-3" /> {br.bloodType} — {br.quantity} units</>,
                                      <><Clock className="h-3 w-3" /> {new Date(br.requestDate).toLocaleDateString()}</>,
                                      br.notes ? <span className="italic">{br.notes}</span> : null,
                                    ]}
                                  />
                                ))}
                              </RequestSection>

                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Showing {filteredHospitals.length} of {hospitals.length} hospitals
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

function RequestSection({
  icon, title, tab, setTab, pendingCount, completedCount, children,
}: {
  icon: React.ReactNode
  title: string
  tab: "Pending" | "Completed"
  setTab: (v: "Pending" | "Completed") => void
  pendingCount: number
  completedCount: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 mb-3 bg-muted rounded-lg p-1 w-fit">
        {(["Pending", "Completed"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              tab === t
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "Pending"
              ? <Clock className="h-3 w-3" />
              : <CheckCircle2 className="h-3 w-3" />}
            {t}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              tab === t ? "bg-primary/10 text-primary" : "bg-muted-foreground/20 text-muted-foreground"
            }`}>
              {t === "Pending" ? pendingCount : completedCount}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">{children}</div>
    </div>
  )
}

function RequestCard({
  status, onToggle, badge, lines,
}: {
  status: "Pending" | "Completed"
  onToggle: () => void
  badge: React.ReactNode
  lines: (React.ReactNode | null)[]
}) {
  return (
    <div className={`flex items-start justify-between gap-4 rounded-lg border p-3 transition-all ${
      status === "Completed"
        ? "border-green-200 bg-green-50/50 opacity-75"
        : "border-border bg-background"
    }`}>
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {badge}
          {status === "Completed" && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </span>
          )}
        </div>
        {lines.filter(Boolean).map((line, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {line}
          </div>
        ))}
      </div>
      <Button
        size="sm"
        variant={status === "Pending" ? "default" : "outline"}
        className="shrink-0 h-7 text-xs"
        onClick={onToggle}
      >
        {status === "Pending" ? "Mark Complete" : "Mark Pending"}
      </Button>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="py-4 text-center text-sm text-muted-foreground">{label}</p>
  )
}