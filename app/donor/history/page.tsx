"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, MapPin, Droplets, Download, Filter, TrendingUp, Loader2 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export default function DonationHistoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5004/api/Appointments/donation-history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
  if (!data) return <p className="text-center p-10">No records found.</p>;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-r-4 border-r-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-serif">Total Donations</p>
                <p className="text-3xl font-bold font-serif">{data.stats.totalDonations}</p>
              </div>
              <Droplets className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-serif">Total Volume</p>
                <p className="text-3xl font-bold font-serif">{data.stats.totalVolume}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-serif">Lives Impacted</p>
                <p className="text-3xl font-bold font-serif">{data.stats.livesImpacted}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500 opacity-20" />
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
                <Calendar className="h-5 w-5 text-primary font-serif" />
                Donation History
              </CardTitle>
              <CardDescription className="font-serif">
                Your verified donation records
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4 font-serif" /> Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.history.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 font-serif">No past donations recorded yet.</p>
            ) : (
                data.history.map((donation: any) => (
              <div
                key={donation.id}
                className="flex flex-col gap-4 rounded-lg border p-4 hover:bg-slate-50 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 font-serif">{donation.centerName}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground font-serif">
                      <MapPin className="h-3 w-3" /> {donation.centerAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end">
                  <div className="text-right sm:mb-2">
                    <p className="font-bold text-slate-700 font-serif">
                      {new Date(donation.appointmentDate).toLocaleDateString()}
                    </p>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">{donation.type}</Badge>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Completed</Badge>
                </div>
              </div>
            )))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}