"use client"

import { useState } from "react"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation,
  CheckCircle,
  Phone
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Mock blood centers data
const bloodCenters = [
  {
    id: 1,
    name: "Central Blood Bank",
    address: "123 Medical Center Dr, Downtown",
    distance: "0.8 miles",
    phone: "(555) 123-4567",
    availableSlots: 12,
    rating: 4.8
  },
  {
    id: 2,
    name: "City Hospital Blood Center",
    address: "456 Healthcare Ave, Midtown",
    distance: "2.1 miles",
    phone: "(555) 234-5678",
    availableSlots: 8,
    rating: 4.6
  },
  {
    id: 3,
    name: "Community Health Center",
    address: "789 Wellness Blvd, Eastside",
    distance: "3.5 miles",
    phone: "(555) 345-6789",
    availableSlots: 15,
    rating: 4.9
  }
]

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
]

const upcomingAppointments = [
  {
    id: 1,
    center: "Central Blood Bank",
    date: "2026-04-20",
    time: "10:00 AM",
    status: "confirmed"
  }
]

export default function AppointmentsPage() {
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [bookingStep, setBookingStep] = useState(1)

  const handleBookAppointment = () => {
    if (selectedCenter && selectedDate && selectedTime) {
      setBookingStep(4) // Success state
    }
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{apt.center}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(apt.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {apt.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Confirmed
                    </Badge>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Book New Appointment */}
      <Card>
        <CardHeader>
          <CardTitle>Book New Appointment</CardTitle>
          <CardDescription>Select a blood center, date, and time slot</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingStep === 4 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Appointment Booked!</h3>
              <p className="mb-4 text-muted-foreground">
                Your appointment has been confirmed. You will receive a confirmation email shortly.
              </p>
              <Button onClick={() => {
                setBookingStep(1)
                setSelectedCenter(null)
                setSelectedDate("")
                setSelectedTime("")
              }}>
                Book Another Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Select Center */}
              <div>
           

                <RadioGroup
                  value={selectedCenter?.toString()}
                  onValueChange={(value) => setSelectedCenter(parseInt(value))}
                >
                  <div className="space-y-3">
                    {bloodCenters.map((center) => (
                      <div key={center.id}>
                        <RadioGroupItem
                          value={center.id.toString()}
                          id={`center-${center.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`center-${center.id}`}
                          className="flex cursor-pointer flex-col gap-2 rounded-lg border-2 border-border p-4 transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{center.name}</p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {center.address}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {center.phone}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{center.distance}</Badge>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {center.availableSlots} slots available
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Step 2: Select Date */}
              <div className={selectedCenter ? "" : "pointer-events-none opacity-50"}>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    2
                  </span>
                  Select Date
                </h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Step 3: Select Time */}
              <div className={selectedDate ? "" : "pointer-events-none opacity-50"}>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    3
                  </span>
                  Select Time Slot
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <Button
                className="w-full"
                size="lg"
                disabled={!selectedCenter || !selectedDate || !selectedTime}
                onClick={handleBookAppointment}
              >
                Confirm Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
