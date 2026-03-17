"use client"

import { 
  Calendar, 
  MapPin, 
  Droplets,
  Download,
  Filter,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock donation history
const donationHistory = [
  {
    id: 1,
    date: "2026-01-15",
    center: "Central Blood Bank",
    address: "123 Medical Center Dr",
    type: "Whole Blood",
    volume: "500 ml",
    status: "completed"
  },
  {
    id: 2,
    date: "2025-10-20",
    center: "City Hospital Blood Center",
    address: "456 Healthcare Ave",
    type: "Whole Blood",
    volume: "500 ml",
    status: "completed"
  },
  {
    id: 3,
    date: "2025-07-08",
    center: "Central Blood Bank",
    address: "123 Medical Center Dr",
    type: "Platelets",
    volume: "300 ml",
    status: "completed"
  },
  {
    id: 4,
    date: "2025-04-12",
    center: "Community Health Center",
    address: "789 Wellness Blvd",
    type: "Whole Blood",
    volume: "500 ml",
    status: "completed"
  },
  {
    id: 5,
    date: "2025-01-25",
    center: "Central Blood Bank",
    address: "123 Medical Center Dr",
    type: "Whole Blood",
    volume: "500 ml",
    status: "completed"
  },
  {
    id: 6,
    date: "2024-11-10",
    center: "City Hospital Blood Center",
    address: "456 Healthcare Ave",
    type: "Plasma",
    volume: "600 ml",
    status: "completed"
  }
]

const stats = {
  totalDonations: 12,
  totalVolume: "6,000 ml",
  livesImpacted: 36,
  favoriteCenter: "Central Blood Bank"
}

export default function DonationHistoryPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalDonations}</p>
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
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalVolume}</p>
              </div>
              <div className="rounded-full bg-accent/10 p-3">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <p className="text-3xl font-bold text-foreground">{stats.livesImpacted}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Favorite Center</p>
              <p className="text-lg font-bold text-foreground">{stats.favoriteCenter}</p>
              <p className="text-xs text-muted-foreground">6 donations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation History List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Donation History
              </CardTitle>
              <CardDescription>Your complete donation record</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="whole">Whole Blood</SelectItem>
                  <SelectItem value="platelets">Platelets</SelectItem>
                  <SelectItem value="plasma">Plasma</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donationHistory.map((donation, index) => (
              <div
                key={donation.id}
                className="flex flex-col gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Droplets className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{donation.center}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {donation.address}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary">{donation.type}</Badge>
                      <span className="text-sm text-muted-foreground">{donation.volume}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {new Date(donation.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Donation #{stats.totalDonations - index}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <Button variant="outline">Load More</Button>
          </div>
        </CardContent>
      </Card>

      {/* Donation Certificate */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Certificates</CardTitle>
          <CardDescription>Download your official donation certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {donationHistory.slice(0, 3).map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {new Date(donation.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short"
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{donation.type}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
