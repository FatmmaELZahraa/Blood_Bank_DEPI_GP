"use client"

import { useState, useEffect } from "react"
import { 
  Droplets, Heart, Calendar, Clock, AlertCircle, CheckCircle, TrendingUp, MapPin, Loader2 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DonorProfile {
  name: string;
  bloodType: string;
  totalDonations: number;
  lastDonationDate: string; // Must match Backend exactly
  points: number;
  medicalHistory: string;
}

export default function DonorProfilePage() {
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5004/api/Auth/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setDonor(data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to connect to backend", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Logic to calculate eligibility based on the 56-day rule
  const calculateEligibility = (lastDonationDate: string | null) => {
    // Check if a valid date exists (1-1-0001 is the default C# min date)
    if (!lastDonationDate || lastDonationDate.startsWith("0001")) {
      return { daysLeft: 0, nextDate: new Date(), progress: 100, isEligible: true, hasDonatedBefore: false };
    }

    const lastDate = new Date(lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 56); 

    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const progress = Math.min(100, Math.max(0, ((56 - diffDays) / 56) * 100));
    
    return {
      daysLeft: Math.max(0, diffDays),
      nextDate: nextDate,
      progress: progress,
      isEligible: diffDays <= 0,
      hasDonatedBefore: true
    };
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!donor) return null;

  const status = calculateEligibility(donor.lastDonationDate);

  return (
    <div className="space-y-6">
      {/* Eligibility Alert */}
      {status.isEligible ? (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div className="flex-1">
            <p className="font-bold text-green-900">You are eligible to donate!</p>
            <p className="text-sm text-green-700">Make an impact today.</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/donor/appointments">Book Now</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div className="flex-1">
            <p className="font-bold text-amber-900">{status.daysLeft} days until your next donation</p>
            <p className="text-sm text-amber-700">Next eligible: {status.nextDate.toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Blood Type</p>
                <p className="text-3xl font-black text-primary">{donor.bloodType || "N/A"}</p>
              </div>
              <Droplets className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Donations</p>
                <p className="text-3xl font-black text-slate-800">{donor.totalDonations}</p>
              </div>
              <Heart className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Points</p>
                <p className="text-3xl font-black text-slate-800">{donor.points}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Lives Saved</p>
                <p className="text-3xl font-black text-slate-800">{donor.totalDonations * 3}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Eligibility Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recovery Progress</span>
                <span className="font-bold text-primary">{Math.round(status.progress)}%</span>
              </div>
              <Progress value={status.progress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Last Donation</p>
                <p className="font-bold text-slate-800">
                  {status.hasDonatedBefore ? new Date(donor.lastDonationDate).toLocaleDateString() : "Never"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Eligible Since</p>
                <p className="font-bold text-slate-800">{status.nextDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Medical Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-slate-600">History</span>
              <Badge variant="outline" className="bg-white">{donor.medicalHistory || "Healthy"}</Badge>
            </div>
            <Button variant="outline" className="w-full h-11">Update Health Data</Button>
          </CardContent>
        </Card>

      </div>
               {/* Quick Actions */}

      <Card className="shadow-sm">

        <CardHeader>

          <CardTitle>Quick Actions</CardTitle>

        </CardHeader>

        <CardContent>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Button asChild variant="outline" className="h-24 flex-col gap-2  transition-all">

              <Link href="/donor/appointments">

                <Calendar className="h-6 w-6 text-primary" />

                <span>Book Appointment</span>

              </Link>

            </Button>

            <Button asChild variant="outline" className="h-24 flex-col gap-2 transition-all">

              <Link href="/donor/qr-code">

                <Droplets className="h-6 w-6 text-primary" />

                <span>Digital ID</span>

              </Link>

            </Button>

            <Button asChild variant="outline" className="h-24 flex-col gap-2 transition-all">

              <Link href="/donor/rewards">

                <TrendingUp className="h-6 w-6 text-primary" />

                <span>Check Rewards</span>

              </Link>

            </Button>

            <Button asChild variant="outline" className="h-24 flex-col gap-2 transition-all">

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