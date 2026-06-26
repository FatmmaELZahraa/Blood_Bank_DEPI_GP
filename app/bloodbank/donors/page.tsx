"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Search,
  CheckCircle,
  Calendar,
  Check,
  X,
  MapPin,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const BASE_URL = "http://localhost:5004"
const bloodTypes = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function getStatusStyle(status: string) {
  switch (status) {
    case "Confirmed":  return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    case "Completed":  return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    case "Cancelled":  return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    default:           return "bg-muted text-muted-foreground"
  }
}

// ✅ helper: يقرأ الـ field سواء جه PascalCase من C# أو camelCase
function getField(obj: any, ...keys: string[]): any {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key]
  }
  return undefined
}

function getInitials(name: string): string {
  return (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function AdminDonorsPage() {
  const [donors, setDonors]                     = useState<any[]>([])
  const [appointments, setAppointments]         = useState<any[]>([])
  const [loading, setLoading]                   = useState(true)
  const [searchTerm, setSearchTerm]             = useState("")
  const [bloodTypeFilter, setBloodTypeFilter]   = useState("All")
  const [updatingId, setUpdatingId]             = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token   = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const [donorsRes, apptRes] = await Promise.all([
          fetch(`${BASE_URL}/api/Donor/all`,        { headers }),
          fetch(`${BASE_URL}/api/Appointments/all`, { headers }),
        ])

        if (donorsRes.ok) setDonors(await donorsRes.json())
        if (apptRes.ok)   setAppointments(await apptRes.json())
      } catch (err) {
        console.error("Failed to fetch:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateStatus = async (appointmentId: number, newStatus: string) => {
    // Optimistic update — update UI immediately
    setAppointments(prev =>
      prev.map(a => {
        const id = getField(a, "id", "Id")
        return id === appointmentId ? { ...a, status: newStatus, Status: newStatus } : a
      })
    )
    setUpdatingId(appointmentId)
    try {
      const token = localStorage.getItem("token")
      const res   = await fetch(`${BASE_URL}/api/Appointments/${appointmentId}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const errText = await res.text()
        console.error("Update failed:", res.status, errText)
        // Revert on failure — re-fetch appointments
        const token2 = localStorage.getItem("token")
        const refetch = await fetch(`${BASE_URL}/api/Appointments/all`, {
          headers: { Authorization: `Bearer ${token2}` },
        })
        if (refetch.ok) setAppointments(await refetch.json())
      }
    } catch (err) {
      console.error("Failed to update:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  // ✅ fallback: لو الـ backend ما رجعش donorName نلاقيه من قائمة الـ donors
  const resolveDonorName = (appt: any): string => {
    const fromAppt = getField(appt, "donorName", "DonorName")
    if (fromAppt) return fromAppt

    const donorId = getField(appt, "donorId", "DonorId")
    const found   = donors.find(d => getField(d, "userID", "id", "Id") === donorId)
    return found ? getField(found, "name", "Name") ?? "Unknown Donor" : "Unknown Donor"
  }

  const filteredDonors = donors.filter(d => {
    const name  = getField(d, "name", "Name") ?? ""
    const email = getField(d, "email", "Email") ?? ""
    const blood = getField(d, "bloodType", "BloodType") ?? ""
    const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchBlood  = bloodTypeFilter === "All" || blood === bloodTypeFilter
    return matchSearch && matchBlood
  })

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donors</p>
                <p className="text-3xl font-bold text-foreground">{donors.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-3xl font-bold text-green-600">{appointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Donors Table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Donor Management</CardTitle>
          <CardDescription>View and manage all registered donors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search donors..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Blood Type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Donations</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Last Donation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No donors found.
                    </TableCell>
                  </TableRow>
                ) : filteredDonors.map(donor => {
                  const id            = getField(donor, "userID", "id", "Id")
                  const name          = getField(donor, "name", "Name") ?? "—"
                  const email         = getField(donor, "email", "Email") ?? "—"
                  const phone         = getField(donor, "phone", "Phone")
                  const bloodType     = getField(donor, "bloodType", "BloodType")
                  const totalDon      = getField(donor, "totalDonations", "TotalDonations") ?? 0
                  const points        = getField(donor, "points", "Points") ?? 0
                  const lastDonation  = getField(donor, "lastDonationDate", "LastDonationDate")

                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{name}</p>
                            <p className="text-sm text-muted-foreground">{email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{phone ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold">
                          {bloodType || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{totalDon}</TableCell>
                      <TableCell>{points}</TableCell>
                      <TableCell>
                        {lastDonation && lastDonation !== "0001-01-01T00:00:00"
                          ? new Date(lastDonation).toLocaleDateString("en-GB")
                          : "Never"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDonors.length} of {donors.length} donors
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Appointments ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Donor Appointments
          </CardTitle>
          <CardDescription>
            Review and approve or reject donor appointment requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No appointments found.</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map(appt => {
                    const apptId      = getField(appt, "id", "Id")
                    const donorName   = resolveDonorName(appt)
                    const centerName  = getField(appt, "centerName", "CenterName") ?? "—"
                    const address     = getField(appt, "centerAddress", "CenterAddress") ||
                                        getField(appt, "location", "Location") || "—"
                    const apptDate    = getField(appt, "appointmentDate", "AppointmentDate")
                    const timeSlot    = getField(appt, "timeSlot", "TimeSlot")
                    const status      = getField(appt, "status", "Status") ?? "—"

                    return (
                      <TableRow key={apptId}>

                        {/* Donor */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(donorName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{donorName}</span>
                          </div>
                        </TableCell>

                        {/* Center */}
                        <TableCell className="font-medium">{centerName}</TableCell>

                        {/* Address */}
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {address}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {apptDate
                              ? new Date(apptDate).toLocaleDateString("en-GB", {
                                  day: "numeric", month: "short", year: "numeric",
                                })
                              : "—"}
                          </div>
                        </TableCell>

                        {/* Time slot */}
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {timeSlot || "—"}
                          </div>
                        </TableCell>

                        {/* Status — clickable toggle between Pending and Completed */}
                        <TableCell>
                          {status === "Completed" ? (
                            <button
                              onClick={() => updateStatus(apptId, "Pending")}
                              disabled={updatingId === apptId}
                              className="inline-flex items-center gap-1.5 rounded-full border border-green-400 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm transition-all hover:bg-green-200 hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                              {updatingId === apptId ? (
                                <span className="animate-pulse">...</span>
                              ) : (
                                <><span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />Completed</>
                              )}
                            </button>
                          ) : status === "Pending" || status === "Confirmed" ? (
                            <button
                              onClick={() => updateStatus(apptId, "Completed")}
                              disabled={updatingId === apptId}
                              className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 shadow-sm transition-all hover:bg-yellow-200 hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                              {updatingId === apptId ? (
                                <span className="animate-pulse">...</span>
                              ) : (
                                <><span className="h-1.5 w-1.5 rounded-full bg-yellow-500 inline-block" />Pending</>
                              )}
                            </button>
                          ) : (
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}>{status}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}