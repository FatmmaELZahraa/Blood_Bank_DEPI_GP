"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  Send,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Building2,
  Zap
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Mock nearby blood banks
const nearbyBanks = [
  { id: 1, name: "Regional Blood Center", distance: "5 km", available: { "O-": 8, "B-": 4 }, phone: "(555) 111-2222" },
  { id: 2, name: "Metro Blood Bank", distance: "12 km", available: { "O-": 15, "B-": 6 }, phone: "(555) 333-4444" },
  { id: 3, name: "University Hospital Bank", distance: "18 km", available: { "O-": 3, "B-": 2 }, phone: "(555) 555-6666" }
]

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function SOSPage() {
  // ✅ FIX: hooks داخل component
  const [activeSOS, setActiveSOS] = useState([
    {
      id: 1,
      bloodType: "O-",
      units: 5,
      priority: "critical",
      createdAt: "30 min ago",
      responses: 3,
      status: "active"
    },
    {
      id: 2,
      bloodType: "B-",
      units: 3,
      priority: "urgent",
      createdAt: "2 hours ago",
      responses: 5,
      status: "active"
    }
  ])

  const [selectedBloodType, setSelectedBloodType] = useState("")
  const [unitsNeeded, setUnitsNeeded] = useState("")
  const [priority, setPriority] = useState("")
  const [reason, setReason] = useState("")
  const [notifyDonors, setNotifyDonors] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  // ✅ Add new SOS request
  const handleSubmit = () => {
    if (selectedBloodType && unitsNeeded && priority) {
      const newRequest = {
        id: Date.now(),
        bloodType: selectedBloodType,
        units: Number(unitsNeeded),
        priority,
        createdAt: "Just now",
        responses: 0,
        status: "active"
      }

      setActiveSOS(prev => [newRequest, ...prev])

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)

      // reset form
      setSelectedBloodType("")
      setUnitsNeeded("")
      setPriority("")
      setReason("")
    }
  }

  return (
    <div className="space-y-6">

      {/* Alert Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <div>
          <p className="font-semibold text-destructive">
            Emergency Blood Request System
          </p>
          <p className="text-sm text-muted-foreground">
            SOS requests are broadcast to all nearby blood banks and eligible donors immediately.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Create SOS Request */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-destructive" />
              Create SOS Request
            </CardTitle>
            <CardDescription>
              Send an emergency blood request to the network
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">SOS Request Sent!</h3>
                <p className="text-muted-foreground">
                  Your request has been broadcast successfully.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Blood Type */}
                <div className="space-y-2">
                  <Label>Blood Type Required</Label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Units */}
                <div className="space-y-2">
                  <Label>Units Needed</Label>
                  <Input
                    type="number"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    placeholder="Enter units"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe situation..."
                  />
                </div>

                <Button
                  className="w-full bg-destructive hover:bg-destructive/90"
                  onClick={handleSubmit}
                  disabled={!selectedBloodType || !unitsNeeded || !priority}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send SOS Request
                </Button>

              </div>
            )}
          </CardContent>
        </Card>

        {/* Active SOS */}
        <Card>
          <CardHeader>
            <CardTitle>Active SOS Requests</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {activeSOS.map((sos) => (
                <div key={sos.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{sos.bloodType}</p>
                      <p className="text-sm">{sos.units} units needed</p>
                      <p className="text-xs text-gray-500">{sos.createdAt}</p>
                    </div>

                    <Badge 
  className={
    sos.priority === "critical" 
      ? "bg-destructive text-destructive-foreground" 
      : "bg-amber-500 text-white"
  }
>
  {sos.priority}
</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}