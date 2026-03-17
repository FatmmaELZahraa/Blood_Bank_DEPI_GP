"use client"

import { useState } from "react"
import { 
  FileText, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock requests data
const requests = [
  {
    id: 1,
    patient: "John Smith",
    patientId: "PT-2026-001",
    bloodType: "O+",
    units: 2,
    priority: "urgent",
    department: "Emergency",
    doctor: "Dr. Johnson",
    status: "pending",
    createdAt: "2026-03-16T10:30:00",
    notes: "Emergency surgery scheduled"
  },
  {
    id: 2,
    patient: "Mary Johnson",
    patientId: "PT-2026-002",
    bloodType: "A+",
    units: 3,
    priority: "high",
    department: "ICU",
    doctor: "Dr. Williams",
    status: "pending",
    createdAt: "2026-03-16T09:15:00",
    notes: "Post-operative care"
  },
  {
    id: 3,
    patient: "Robert Davis",
    patientId: "PT-2026-003",
    bloodType: "B+",
    units: 4,
    priority: "normal",
    department: "Surgery",
    doctor: "Dr. Brown",
    status: "fulfilled",
    createdAt: "2026-03-15T14:00:00",
    fulfilledAt: "2026-03-15T15:30:00",
    notes: "Scheduled transfusion"
  },
  {
    id: 4,
    patient: "Sarah Wilson",
    patientId: "PT-2026-004",
    bloodType: "AB-",
    units: 2,
    priority: "high",
    department: "Oncology",
    doctor: "Dr. Garcia",
    status: "cancelled",
    createdAt: "2026-03-14T11:00:00",
    notes: "Surgery postponed"
  }
]

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

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

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-600">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "fulfilled":
      return (
        <Badge variant="outline" className="border-green-500 text-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Fulfilled
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
          <XCircle className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      )
    default:
      return null
  }
}

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newRequest, setNewRequest] = useState({
    patient: "",
    patientId: "",
    bloodType: "",
    units: "",
    priority: "",
    department: "",
    doctor: "",
    notes: ""
  })

  const pendingRequests = requests.filter(r => r.status === "pending")
  const completedRequests = requests.filter(r => r.status !== "pending")

  const filteredPending = pendingRequests.filter(r =>
    r.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCompleted = completedRequests.filter(r =>
    r.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fulfilled Today</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === "fulfilled").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total This Week</p>
                <p className="text-3xl font-bold text-foreground">{requests.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Blood Requests</CardTitle>
              <CardDescription>Manage and track blood requests</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Blood Request</DialogTitle>
                  <DialogDescription>
                    Submit a new blood request for a patient
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input 
                        placeholder="Full name"
                        value={newRequest.patient}
                        onChange={(e) => setNewRequest({...newRequest, patient: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Patient ID</Label>
                      <Input 
                        placeholder="PT-XXXX-XXX"
                        value={newRequest.patientId}
                        onChange={(e) => setNewRequest({...newRequest, patientId: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Blood Type</Label>
                      <Select 
                        value={newRequest.bloodType}
                        onValueChange={(value) => setNewRequest({...newRequest, bloodType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Units Needed</Label>
                      <Input 
                        type="number"
                        placeholder="0"
                        min="1"
                        value={newRequest.units}
                        onChange={(e) => setNewRequest({...newRequest, units: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={newRequest.priority}
                      onValueChange={(value) => setNewRequest({...newRequest, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input 
                        placeholder="e.g., ICU"
                        value={newRequest.department}
                        onChange={(e) => setNewRequest({...newRequest, department: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Requesting Doctor</Label>
                      <Input 
                        placeholder="Dr. Name"
                        value={newRequest.doctor}
                        onChange={(e) => setNewRequest({...newRequest, doctor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea 
                      placeholder="Additional information..."
                      value={newRequest.notes}
                      onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {filteredPending.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No pending requests
                </div>
              ) : (
                filteredPending.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-bold text-primary">{request.bloodType}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">{request.patient}</p>
                          <span className="text-sm text-muted-foreground">({request.patientId})</span>
                          {getPriorityBadge(request.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.units} units - {request.department} - {request.doctor}
                        </p>
                        <p className="text-xs text-muted-foreground">{request.notes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      <Button size="sm">Fulfill</Button>
                      <Button variant="ghost" size="sm">Cancel</Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredCompleted.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No completed requests
                </div>
              ) : (
                filteredCompleted.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-bold text-muted-foreground">{request.bloodType}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">{request.patient}</p>
                          <span className="text-sm text-muted-foreground">({request.patientId})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.units} units - {request.department} - {request.doctor}
                        </p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
