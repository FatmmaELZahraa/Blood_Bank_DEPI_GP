"use client"

import { useState, useEffect, useRef } from "react"

function useCSSVar(variable: string, fallback: string): string {
  const [value, setValue] = useState(fallback)
  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
    if (resolved) setValue(`hsl(${resolved})`)
  }, [variable])
  return value
}

import { 
  Users, 
  Building2, 
  Droplets, 
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Mock data for charts
const donationTrends = [
  { month: "Jan", donations: 245, requests: 180 },
  { month: "Feb", donations: 312, requests: 220 },
  { month: "Mar", donations: 289, requests: 195 },
  { month: "Apr", donations: 356, requests: 240 },
  { month: "May", donations: 401, requests: 280 },
  { month: "Jun", donations: 378, requests: 265 },
]

// bloodTypeDistribution moved inside component — see below

const regionalData = [
  { region: "North", hospitals: 45, donors: 12500 },
  { region: "South", hospitals: 38, donors: 9800 },
  { region: "East", hospitals: 52, donors: 15200 },
  { region: "West", hospitals: 41, donors: 11400 },
  { region: "Central", hospitals: 35, donors: 8600 },
]

const recentActivity = [
  { id: 1, type: "donation", user: "John Doe", location: "Central Blood Bank", time: "2 hours ago" },
  { id: 2, type: "sos", user: "City Hospital", bloodType: "O-", units: 5, time: "3 hours ago" },
  { id: 3, type: "registration", user: "Memorial Hospital", type2: "hospital", time: "5 hours ago" },
  { id: 4, type: "donation", user: "Sarah Wilson", location: "Metro Blood Center", time: "6 hours ago" },
  { id: 5, type: "sos_fulfilled", user: "Regional Hospital", bloodType: "B-", units: 3, time: "8 hours ago" },
]

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [totalDonors, setTotalDonors] = useState<number>(0);
  const [totalHospitals, setTotalHospitals] = useState<number>(0);
  const [sosRequests, setSosRequests] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalBloodUnits, setTotalBloodUnits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Resolve CSS vars for Recharts at runtime
  const chart1 = useCSSVar("--chart-1", "#e11d48")
  const chart2 = useCSSVar("--chart-2", "#f97316")
  const chart3 = useCSSVar("--chart-3", "#eab308")
  const chart4 = useCSSVar("--chart-4", "#22c55e")
  const chart5 = useCSSVar("--chart-5", "#3b82f6")

  const bloodTypeDistribution = [
    { type: "O+", value: 35, color: chart1 },
    { type: "A+", value: 28, color: chart2 },
    { type: "B+", value: 18, color: chart3 },
    { type: "AB+", value: 8, color: chart4 },
    { type: "O-", value: 5, color: chart5 },
    { type: "A-", value: 3, color: chart1 },
    { type: "B-", value: 2, color: chart2 },
    { type: "AB-", value: 1, color: chart3 },
  ]

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [overviewRes, donorsRes, sosRes, bloodRes, apptRes, inventoriesRes] = await Promise.all([
          fetch("http://localhost:5004/api/admin/overview", { headers }),
          fetch("http://localhost:5004/api/Donor/all", { headers }),
          fetch("http://localhost:5004/api/sos-requests", { headers }),
          fetch("http://localhost:5004/api/blood-requests", { headers }),
          fetch("http://localhost:5004/api/Appointments/all", { headers }),
          fetch("http://localhost:5004/api/inventories", { headers }),
        ]);

        if (overviewRes.ok) setOverview(await overviewRes.json());
        if (donorsRes.ok) { const d = await donorsRes.json(); setTotalDonors(Array.isArray(d) ? d.length : 0); }
        if (sosRes.ok) { const d = await sosRes.json(); console.log("🔴 SOS[0]:", d[0]); setSosRequests(d); }
        if (bloodRes.ok) { const d = await bloodRes.json(); console.log("🩸 Blood[0]:", d[0]); setBloodRequests(d); }
        if (apptRes.ok) { const d = await apptRes.json(); console.log("📅 Appt[0]:", d[0]); setAppointments(d); }

        if (inventoriesRes.ok) {
          const inventories = await inventoriesRes.json();
          const total = inventories.reduce((sum: number, inv: any) => {
            const invTotal = (inv.summary ?? []).reduce(
              (s: number, g: any) => s + (g.totalQuantity ?? 0),
              0
            );
            return sum + invTotal;
          }, 0);
          setTotalBloodUnits(total);
        }
      } catch (error) {
        console.error("❌ Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Helper: parse date safely (handles UTC strings from .NET)
  const parseDate = (raw: string | null | undefined): Date | null => {
    if (!raw) return null;
    // .NET returns "2025-06-10T14:30:00" without Z — treat as UTC
    const normalized = raw.endsWith("Z") ? raw : raw + "Z";
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  };

  // C# System.Text.Json serializes to camelCase by default:
  // SOSId→sosId, BloodType→bloodType, Units→units, Priority→priority,
  // RequestDate→requestDate, HospitalId→hospitalId, Hospital.Name→hospital.name
  const recentActivity = [
    ...sosRequests.map((s: any) => ({
      id: `sos-${s.sosId ?? s.SOSId}`,
      type: "sos" as const,
      hospitalName:
        s.hospital?.name ?? s.Hospital?.Name ?? s.hospitalName ?? "مستشفى غير معروف",
      bloodType: s.bloodType ?? s.BloodType ?? "—",
      units: s.units ?? s.Units ?? "—",
      priority: s.priority ?? s.Priority ?? null,
      status: null, // SOS model has no Status field
      time: s.requestDate ?? s.RequestDate ?? null,
    })),
    ...bloodRequests.map((b: any) => ({
      id: `blood-${b.requestId ?? b.RequestId}`,
      type: "blood" as const,
      hospitalName:
        b.hospital?.name ?? b.Hospital?.Name ?? b.hospitalName ?? "مستشفى غير معروف",
      bloodType: b.bloodType ?? b.BloodType ?? "—",
      units: b.quantity ?? b.Quantity ?? "—",
      priority: b.priority ?? b.Priority ?? null,
      status: b.status ?? b.Status ?? null,
      time: b.requestDate ?? b.RequestDate ?? null,
    })),
  ]
    .sort((a, b) => {
      const ta = parseDate(a.time)?.getTime() ?? 0;
      const tb = parseDate(b.time)?.getTime() ?? 0;
      return tb - ta;
    })
    .slice(0, 10);

  // Derive unique hospital count from fetched requests
  useEffect(() => {
    const ids = new Set([
      ...sosRequests.map((s: any) => s.hospitalId ?? s.HospitalId),
      ...bloodRequests.map((b: any) => b.userID ?? b.UserID),
    ].filter(Boolean));
    setTotalHospitals(ids.size);
  }, [sosRequests, bloodRequests]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (  
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donors</p>
                <p className="text-3xl font-serif text-foreground">{totalDonors}</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% this month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Partner Hospitals</p>
                <p className="text-3xl font-serif text-foreground">{totalHospitals || overview?.totalHospitals || 0}</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +5 new this month
                </p>
              </div>
              <div className="rounded-full bg-accent/10 p-3">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Blood Units</p>
                <p className="text-3xl font-serif text-foreground">{totalBloodUnits}</p>
                <p className="flex items-center gap-1 text-xs text-amber-600">
                  <TrendingDown className="h-3 w-3" />
                  -3.2% from last week
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-serif">Active SOS</p>
                <p className="text-3xl  text-destructive font-serif">{sosRequests.length}</p>
                <p className="text-xs text-muted-foreground font-serif">Live from system</p>
              </div>
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donation Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Donation Trends
            </CardTitle>
            <CardDescription>Donations vs Requests over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationTrends}>
                  <defs>
                    <linearGradient id="donationsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chart1} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chart1} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chart2} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chart2} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="donations" 
                    stroke={chart1} 
                    fill="url(#donationsGradient)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke={chart2} 
                    fill="url(#requestsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chart1 }} />
                <span className="text-sm text-muted-foreground">Donations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chart2 }} />
                <span className="text-sm text-muted-foreground">Requests</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Blood Type Distribution
            </CardTitle>
            <CardDescription>Current inventory by blood type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {bloodTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {bloodTypeDistribution.map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.type}</span>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Regional Overview
          </CardTitle>
          <CardDescription>Hospital and donor distribution by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="region" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar yAxisId="left" dataKey="hospitals" fill={chart1} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="donors" fill={chart2} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chart1 }} />
              <span className="text-sm text-muted-foreground">Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chart2 }} />
              <span className="text-sm text-muted-foreground">Donors</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest SOS requests & blood requests — sorted by time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const isSOS = activity.type === "sos"
                return (
                  <div
                    key={activity.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      isSOS
                        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                        : "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-950/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Icon + Type badge */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            isSOS
                              ? "bg-red-100 dark:bg-red-900"
                              : "bg-pink-100 dark:bg-pink-900"
                          }`}
                        >
                          {isSOS ? (
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <Droplets className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          )}
                        </div>

                        <div className="space-y-1">
                          {/* Type label */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-medium text-foreground text-sm">
                              {isSOS ? "🚨 SOS Request" : "🩸 Blood Request"}
                            </span>
                            {/* Priority badge — SOS only */}
                            {isSOS && activity.priority && (
                              <Badge
                                variant="outline"
                                className={
                                  activity.priority === "Critical"
                                    ? "border-red-500 text-red-600 dark:text-red-400 text-xs"
                                    : activity.priority === "High"
                                    ? "border-orange-500 text-orange-600 dark:text-orange-400 text-xs"
                                    : "border-yellow-500 text-yellow-600 dark:text-yellow-400 text-xs"
                                }
                              >
                                {activity.priority}
                              </Badge>
                            )}
                            {/* Status badge */}
                            {activity.status && (
                              <Badge
                                variant="secondary"
                                className="text-xs capitalize"
                              >
                                {activity.status}
                              </Badge>
                            )}
                          </div>

                          {/* Hospital name */}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="font-serif">{activity.hospitalName}</span>
                          </div>

                          {/* Blood type + units */}
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <Droplets className="h-3.5 w-3.5 text-primary" />
                              {activity.bloodType}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                              <span className="font-medium text-foreground">{activity.units}</span> units
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date/Time */}
                      <div className="shrink-0 text-right">
                        {parseDate(activity.time) ? (
                          <>
                            <p className="text-xs text-muted-foreground">
                              {parseDate(activity.time)!.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {parseDate(activity.time)!.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No recent activity yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}