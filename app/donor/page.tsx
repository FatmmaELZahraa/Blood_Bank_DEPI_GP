"use client"

import { useState } from "react"
import { 
  Droplets, 
  Heart, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  MapPin
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock donor data
const donorData = {
  name: "Fatma ",
  bloodType: "O+",
  totalDonations: 12,
  lastDonation: "2026-01-15",
  nextEligible: "2026-04-15",
  medicalHistory: {
    allergies: "None",
    medications: "None",
    conditions: "None"
  },
  stats: {
    livesImpacted: 36,
    totalVolume: "6,000 ml",
    donationStreak: 4
  }
}

function calculateDaysUntilEligible(nextEligibleDate: string): number {
  const today = new Date()
  const eligible = new Date(nextEligibleDate)
  const diffTime = eligible.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

function getEligibilityProgress(lastDonation: string): number {
  const donationDate = new Date(lastDonation)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24))
  const requiredDays = 90 // 90 days between whole blood donations
  return Math.min(100, (diffDays / requiredDays) * 100)
}

export default function DonorProfilePage() {
  const daysUntilEligible = calculateDaysUntilEligible(donorData.nextEligible)
  const eligibilityProgress = getEligibilityProgress(donorData.lastDonation)
  const isEligible = daysUntilEligible === 0

  return (
    <div className="space-y-6">
      {/* Eligibility Alert */}
      {isEligible ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <p className="font-medium text-green-800 dark:text-green-200">You are eligible to donate!</p>
            <p className="text-sm text-green-600 dark:text-green-400">Book your appointment today and save lives.</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/donor/appointments">Book Now</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              {daysUntilEligible} days until you can donate again
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Next eligible date: {new Date(donorData.nextEligible).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="text-3xl font-bold text-primary">{donorData.bloodType}</p>
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
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold text-foreground">{donorData.totalDonations}</p>
              </div>
              <div className="rounded-full bg-accent/10 p-3">
                <Heart className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <p className="text-3xl font-bold text-foreground">{donorData.stats.livesImpacted}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Donation Streak</p>
                <p className="text-3xl font-bold text-foreground">{donorData.stats.donationStreak}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Eligibility Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Eligibility Status
            </CardTitle>
            <CardDescription>Track your donation eligibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recovery Progress</span>
                <span className="font-medium text-foreground">{Math.round(eligibilityProgress)}%</span>
              </div>
              <Progress value={eligibilityProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Last Donation</p>
                <p className="font-semibold text-foreground">
                  {new Date(donorData.lastDonation).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Next Eligible</p>
                <p className="font-semibold text-foreground">
                  {new Date(donorData.nextEligible).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">
                Whole blood donors must wait 56 days (8 weeks) between donations. 
                Platelet donors may give every 7 days, up to 24 times a year.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Medical Profile
            </CardTitle>
            <CardDescription>Your health information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-muted-foreground">Allergies</span>
              <Badge variant="outline">{donorData.medicalHistory.allergies}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-muted-foreground">Current Medications</span>
              <Badge variant="outline">{donorData.medicalHistory.medications}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-muted-foreground">Medical Conditions</span>
              <Badge variant="outline">{donorData.medicalHistory.conditions}</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Update Medical Information
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/donor/appointments">
                <Calendar className="h-6 w-6 text-primary" />
                <span>Book Appointment</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/donor/qr-code">
                <Droplets className="h-6 w-6 text-primary" />
                <span>View Digital ID</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/donor/rewards">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span>Check Rewards</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link href="/donor/history">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Find Centers</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
