"use client"

import { 
  Users, 
  Building2, 
  Droplets, 
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Heart,
  Calendar
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

const bloodTypeDistribution = [
  { type: "O+", value: 35, color: "hsl(var(--chart-1))" },
  { type: "A+", value: 28, color: "hsl(var(--chart-2))" },
  { type: "B+", value: 18, color: "hsl(var(--chart-3))" },
  { type: "AB+", value: 8, color: "hsl(var(--chart-4))" },
  { type: "O-", value: 5, color: "hsl(var(--chart-5))" },
  { type: "A-", value: 3, color: "hsl(var(--chart-1))" },
  { type: "B-", value: 2, color: "hsl(var(--chart-2))" },
  { type: "AB-", value: 1, color: "hsl(var(--chart-3))" },
]

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
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donors</p>
                <p className="text-3xl font-bold text-foreground">57,492</p>
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
                <p className="text-3xl font-bold text-foreground">211</p>
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
                <p className="text-3xl font-bold text-foreground">24,856</p>
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
                <p className="text-sm text-muted-foreground">Active SOS</p>
                <p className="text-3xl font-bold text-destructive">7</p>
                <p className="text-xs text-muted-foreground">3 critical, 4 urgent</p>
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
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
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
                    stroke="hsl(var(--chart-1))" 
                    fill="url(#donationsGradient)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="hsl(var(--chart-2))" 
                    fill="url(#requestsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
                <span className="text-sm text-muted-foreground">Donations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
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
                <Bar yAxisId="left" dataKey="hospitals" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="donors" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
              <span className="text-sm text-muted-foreground">Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
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
          <CardDescription>Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    activity.type === "donation" ? "bg-green-100 dark:bg-green-900" :
                    activity.type === "sos" ? "bg-destructive/10" :
                    activity.type === "sos_fulfilled" ? "bg-accent/10" :
                    "bg-primary/10"
                  }`}>
                    {activity.type === "donation" && <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    {activity.type === "sos" && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    {activity.type === "sos_fulfilled" && <Droplets className="h-5 w-5 text-accent" />}
                    {activity.type === "registration" && <Building2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.type === "donation" && `${activity.user} donated blood`}
                      {activity.type === "sos" && `${activity.user} sent SOS for ${activity.units} units of ${activity.bloodType}`}
                      {activity.type === "sos_fulfilled" && `SOS fulfilled for ${activity.user}`}
                      {activity.type === "registration" && `${activity.user} registered as ${activity.type2}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.location || activity.bloodType ? 
                        (activity.location || `${activity.units} units of ${activity.bloodType}`) : 
                        "New partner"}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
