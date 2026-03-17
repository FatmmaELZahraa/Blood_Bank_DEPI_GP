"use client"

import { 
  Droplets, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Users,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock data
const inventoryOverview = [
  { type: "A+", units: 45, capacity: 100, status: "good" },
  { type: "A-", units: 12, capacity: 50, status: "low" },
  { type: "B+", units: 38, capacity: 80, status: "good" },
  { type: "B-", units: 8, capacity: 40, status: "critical" },
  { type: "AB+", units: 22, capacity: 60, status: "good" },
  { type: "AB-", units: 5, capacity: 30, status: "critical" },
  { type: "O+", units: 52, capacity: 120, status: "good" },
  { type: "O-", units: 15, capacity: 60, status: "low" }
]

const recentActivity = [
  { id: 1, action: "Blood received", type: "O+", units: 10, time: "2 hours ago", status: "incoming" },
  { id: 2, action: "Emergency request fulfilled", type: "B-", units: 4, time: "3 hours ago", status: "outgoing" },
  { id: 3, action: "Blood received", type: "A+", units: 15, time: "5 hours ago", status: "incoming" },
  { id: 4, action: "Routine transfer", type: "AB+", units: 6, time: "8 hours ago", status: "outgoing" }
]

const pendingRequests = [
  { id: 1, patient: "Emergency Surgery", type: "O-", units: 3, priority: "urgent", time: "30 min ago" },
  { id: 2, patient: "ICU Patient #245", type: "A+", units: 2, priority: "high", time: "1 hour ago" },
  { id: 3, patient: "Scheduled Surgery", type: "B+", units: 4, priority: "normal", time: "2 hours ago" }
]

function getStatusColor(status: string) {
  switch (status) {
    case "good": return "bg-green-500"
    case "low": return "bg-amber-500"
    case "critical": return "bg-destructive"
    default: return "bg-muted"
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "urgent":
      return <Badge className="bg-destructive text-destructive-foreground">Urgent</Badge>
    case "high":
      return <Badge className="bg-amber-500 text-white">High</Badge>
    default:
      return <Badge variant="secondary">Normal</Badge>
  }
}

export default function HospitalDashboardPage() {
  const totalUnits = inventoryOverview.reduce((acc, item) => acc + item.units, 0)
  const totalCapacity = inventoryOverview.reduce((acc, item) => acc + item.capacity, 0)
  const criticalCount = inventoryOverview.filter(i => i.status === "critical").length
  const lowCount = inventoryOverview.filter(i => i.status === "low").length

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-3xl font-bold text-foreground">{totalUnits}</p>
                <p className="text-xs text-muted-foreground">of {totalCapacity} capacity</p>
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
                <p className="text-3xl font-bold text-foreground">{pendingRequests.length}</p>
                <p className="text-xs text-muted-foreground">awaiting fulfillment</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">156</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
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
            <div className="grid grid-cols-2 gap-4">
              {inventoryOverview.map((item) => (
                <div key={item.type} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">{item.type}</span>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.units} units</span>
                      <span className="text-muted-foreground">{Math.round((item.units / item.capacity) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(item.units / item.capacity) * 100} 
                      className="mt-1 h-1.5" 
                    />
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{request.type}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{request.patient}</p>
                      <p className="text-sm text-muted-foreground">{request.units} units - {request.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(request.priority)}
                    <Button size="sm">Fulfill</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest blood bank transactions</CardDescription>
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
                    activity.status === "incoming" 
                      ? "bg-green-100 dark:bg-green-900" 
                      : "bg-amber-100 dark:bg-amber-900"
                  }`}>
                    {activity.status === "incoming" ? (
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{activity.type}</Badge>
                  <p className={`text-sm font-medium ${
                    activity.status === "incoming" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {activity.status === "incoming" ? "+" : "-"}{activity.units} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
