"use client"

import { useState } from "react"
import { 
  Building2, 
  Search,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  Droplets
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Mock hospitals data
const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    email: "bloodbank@citygeneral.com",
    phone: "(555) 111-2222",
    address: "123 Medical Center Dr",
    city: "New York",
    type: "General",
    totalUnits: 450,
    capacity: 600,
    sosRequests: 2,
    status: "active",
    verified: true
  },
  {
    id: 2,
    name: "Metro Medical Center",
    email: "blood@metromedical.com",
    phone: "(555) 222-3333",
    address: "456 Healthcare Ave",
    city: "Los Angeles",
    type: "Specialized",
    totalUnits: 280,
    capacity: 400,
    sosRequests: 0,
    status: "active",
    verified: true
  },
  {
    id: 3,
    name: "Regional Health Center",
    email: "bloodbank@regional.com",
    phone: "(555) 333-4444",
    address: "789 Wellness Blvd",
    city: "Chicago",
    type: "Regional",
    totalUnits: 180,
    capacity: 300,
    sosRequests: 1,
    status: "active",
    verified: true
  },
  {
    id: 4,
    name: "Community Hospital",
    email: "blood@community.com",
    phone: "(555) 444-5555",
    address: "321 Care St",
    city: "Houston",
    type: "Community",
    totalUnits: 95,
    capacity: 200,
    sosRequests: 3,
    status: "active",
    verified: true
  },
  {
    id: 5,
    name: "University Medical Center",
    email: "bloodbank@umc.edu",
    phone: "(555) 555-6666",
    address: "555 University Ave",
    city: "Boston",
    type: "Academic",
    totalUnits: 0,
    capacity: 500,
    sosRequests: 0,
    status: "pending",
    verified: false
  }
]

export default function AdminHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || hospital.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalHospitals = hospitals.length
  const activeHospitals = hospitals.filter(h => h.status === "active").length
  const totalCapacity = hospitals.reduce((acc, h) => acc + h.totalUnits, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hospitals</p>
                <p className="text-3xl font-bold text-foreground">{totalHospitals}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-3xl font-bold text-green-600">{activeHospitals}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Blood Units</p>
                <p className="text-3xl font-bold text-primary">{totalCapacity.toLocaleString()}</p>
              </div>
              <Droplets className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospitals Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Hospital Partners</CardTitle>
              <CardDescription>Manage partner hospitals and blood banks</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>SOS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHospitals.map((hospital) => {
                  const inventoryPercent = (hospital.totalUnits / hospital.capacity) * 100
                  return (
                    <TableRow key={hospital.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                            <Building2 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{hospital.name}</p>
                              {hospital.verified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{hospital.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {hospital.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{hospital.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{hospital.totalUnits} units</span>
                            <span className="text-foreground">{Math.round(inventoryPercent)}%</span>
                          </div>
                          <Progress value={inventoryPercent} className="mt-1 h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {hospital.sosRequests > 0 ? (
                          <Badge className="bg-destructive text-destructive-foreground">
                            {hospital.sosRequests} active
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={hospital.status === "active" ? "default" : "secondary"}
                          className={
                            hospital.status === "active" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                          }
                        >
                          {hospital.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Droplets className="mr-2 h-4 w-4" />
                              View Inventory
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {hospital.status === "pending" && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Partner
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredHospitals.length} of {hospitals.length} hospitals
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
