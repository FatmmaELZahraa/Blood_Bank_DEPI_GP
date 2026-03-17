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

// Mock active SOS requests
const activeSOS = [
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
]

// Mock nearby blood banks
const nearbyBanks = [
  { id: 1, name: "Regional Blood Center", distance: "5 km", available: { "O-": 8, "B-": 4 }, phone: "(555) 111-2222" },
  { id: 2, name: "Metro Blood Bank", distance: "12 km", available: { "O-": 15, "B-": 6 }, phone: "(555) 333-4444" },
  { id: 3, name: "University Hospital Bank", distance: "18 km", available: { "O-": 3, "B-": 2 }, phone: "(555) 555-6666" }
]

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function SOSPage() {
  const [selectedBloodType, setSelectedBloodType] = useState("")
  const [unitsNeeded, setUnitsNeeded] = useState("")
  const [priority, setPriority] = useState("")
  const [reason, setReason] = useState("")
  const [notifyDonors, setNotifyDonors] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedBloodType && unitsNeeded && priority) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
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
                <h3 className="mb-2 text-xl font-semibold text-foreground">SOS Request Sent!</h3>
                <p className="text-muted-foreground">
                  Your request has been broadcast to the network. Nearby blood banks and eligible donors have been notified.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Blood Type Required</Label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
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
                    placeholder="Enter number of units"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-destructive" />
                          Critical - Life threatening
                        </span>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Urgent - Within hours
                        </span>
                      </SelectItem>
                      <SelectItem value="high">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          High - Within 24 hours
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reason / Notes</Label>
                  <Textarea
                    placeholder="Describe the emergency situation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify"
                    checked={notifyDonors}
                    onCheckedChange={(checked) => setNotifyDonors(checked as boolean)}
                  />
                  <Label htmlFor="notify" className="text-sm font-normal">
                    Also notify eligible donors in the area
                  </Label>
                </div>

                <Button 
                  className="w-full bg-destructive hover:bg-destructive/90" 
                  size="lg"
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

        {/* Active SOS Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active SOS Requests
            </CardTitle>
            <CardDescription>Your current emergency requests</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSOS.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No active SOS requests
              </div>
            ) : (
              <div className="space-y-4">
                {activeSOS.map((sos) => (
                  <div
                    key={sos.id}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                          <span className="text-lg font-bold text-destructive">{sos.bloodType}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{sos.units} units needed</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {sos.createdAt}
                          </div>
                        </div>
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
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-green-600 dark:text-green-400">
                        {sos.responses} responses received
                      </span>
                      <Button variant="outline" size="sm">
                        View Responses
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nearby Blood Banks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Nearby Blood Banks
          </CardTitle>
          <CardDescription>Contact blood banks directly for immediate assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyBanks.map((bank) => (
              <Card key={bank.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{bank.name}</h4>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {bank.distance} away
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">Available Stock:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(bank.available).map(([type, units]) => (
                        <Badge key={type} variant="outline">
                          {type}: {units} units
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    {bank.phone}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
