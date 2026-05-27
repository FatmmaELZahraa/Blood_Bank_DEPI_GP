// "use client"

// import { useState } from "react"
// import { 
//   QrCode, 
//   Download, 
//   Share2, 
//   Copy, 
//   CheckCircle,
//   Droplets,
//   User,
//   Calendar,
//   Shield
// } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

// // Mock donor data for QR code
// const donorQRData = {
//   id: "DONOR-2026-78542",
//   name: "John Doe",
//   bloodType: "O+",
//   dateOfBirth: "1990-05-15",
//   lastDonation: "2026-01-15",
//   totalDonations: 12,
//   verified: true
// }

// export default function QRCodePage() {
//   const [copied, setCopied] = useState(false)

//   const handleCopyId = () => {
//     navigator.clipboard.writeText(donorQRData.id)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Digital ID Card */}
//       <Card className="overflow-hidden">
//         <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Droplets className="h-8 w-8" />
//               <div>
//                 <h2 className="text-xl font-bold">BloodLink</h2>
//                 <p className="text-sm opacity-90">Digital Donor ID</p>
//               </div>
//             </div>
//             {donorQRData.verified && (
//               <Badge className="bg-white/20 text-white hover:bg-white/30">
//                 <Shield className="mr-1 h-3 w-3" />
//                 Verified
//               </Badge>
//             )}
//           </div>
//         </div>
//         <CardContent className="p-6">
//           <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
//             {/* QR Code */}
//             <div className="flex flex-col items-center">
//               <div className="rounded-xl border-4 border-primary/20 bg-white p-4">
//                 {/* SVG QR Code Pattern */}
//                 <svg
//                   width="180"
//                   height="180"
//                   viewBox="0 0 180 180"
//                   className="text-foreground"
//                 >
//                   {/* QR Code finder patterns */}
//                   <rect x="10" y="10" width="50" height="50" fill="currentColor" />
//                   <rect x="15" y="15" width="40" height="40" fill="white" />
//                   <rect x="20" y="20" width="30" height="30" fill="currentColor" />
                  
//                   <rect x="120" y="10" width="50" height="50" fill="currentColor" />
//                   <rect x="125" y="15" width="40" height="40" fill="white" />
//                   <rect x="130" y="20" width="30" height="30" fill="currentColor" />
                  
//                   <rect x="10" y="120" width="50" height="50" fill="currentColor" />
//                   <rect x="15" y="125" width="40" height="40" fill="white" />
//                   <rect x="20" y="130" width="30" height="30" fill="currentColor" />
                  
//                   {/* Data modules */}
//                   <rect x="70" y="10" width="10" height="10" fill="currentColor" />
//                   <rect x="90" y="10" width="10" height="10" fill="currentColor" />
//                   <rect x="70" y="30" width="10" height="10" fill="currentColor" />
//                   <rect x="80" y="20" width="10" height="10" fill="currentColor" />
//                   <rect x="100" y="20" width="10" height="10" fill="currentColor" />
                  
//                   <rect x="70" y="70" width="10" height="10" fill="currentColor" />
//                   <rect x="80" y="80" width="10" height="10" fill="currentColor" />
//                   <rect x="90" y="70" width="10" height="10" fill="currentColor" />
//                   <rect x="100" y="80" width="10" height="10" fill="currentColor" />
//                   <rect x="90" y="90" width="10" height="10" fill="currentColor" />
//                   <rect x="80" y="100" width="10" height="10" fill="currentColor" />
                  
//                   <rect x="120" y="70" width="10" height="10" fill="currentColor" />
//                   <rect x="130" y="80" width="10" height="10" fill="currentColor" />
//                   <rect x="140" y="70" width="10" height="10" fill="currentColor" />
//                   <rect x="150" y="90" width="10" height="10" fill="currentColor" />
//                   <rect x="160" y="80" width="10" height="10" fill="currentColor" />
                  
//                   <rect x="70" y="120" width="10" height="10" fill="currentColor" />
//                   <rect x="80" y="130" width="10" height="10" fill="currentColor" />
//                   <rect x="90" y="140" width="10" height="10" fill="currentColor" />
//                   <rect x="100" y="150" width="10" height="10" fill="currentColor" />
//                   <rect x="70" y="160" width="10" height="10" fill="currentColor" />
                  
//                   <rect x="120" y="120" width="10" height="10" fill="currentColor" />
//                   <rect x="140" y="130" width="10" height="10" fill="currentColor" />
//                   <rect x="160" y="140" width="10" height="10" fill="currentColor" />
//                   <rect x="130" y="150" width="10" height="10" fill="currentColor" />
//                   <rect x="150" y="160" width="10" height="10" fill="currentColor" />
//                 </svg>
//               </div>
//               <p className="mt-3 text-center text-sm text-muted-foreground">
//                 Scan at any BloodLink center
//               </p>
//             </div>

//             {/* Donor Info */}
//             <div className="flex-1 space-y-4">
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                     <User className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Donor Name</p>
//                     <p className="font-semibold text-foreground">{donorQRData.name}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                     <Droplets className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Blood Type</p>
//                     <p className="text-2xl font-bold text-primary">{donorQRData.bloodType}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                     <Calendar className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Last Donation</p>
//                     <p className="font-semibold text-foreground">
//                       {new Date(donorQRData.lastDonation).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Donor ID */}
//               <div className="rounded-lg bg-muted p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Donor ID</p>
//                     <p className="font-mono text-sm font-semibold text-foreground">{donorQRData.id}</p>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={handleCopyId}>
//                     {copied ? (
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                     ) : (
//                       <Copy className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-2">
//                 <Button className="flex-1">
//                   <Download className="mr-2 h-4 w-4" />
//                   Download
//                 </Button>
//                 <Button variant="outline" className="flex-1">
//                   <Share2 className="mr-2 h-4 w-4" />
//                   Share
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Usage Instructions */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <QrCode className="h-5 w-5 text-primary" />
//             How to Use Your Digital ID
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 sm:grid-cols-3">
//             <div className="rounded-lg bg-muted p-4 text-center">
//               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <span className="text-xl font-bold text-primary">1</span>
//               </div>
//               <h4 className="mb-1 font-semibold text-foreground">Arrive at Center</h4>
//               <p className="text-sm text-muted-foreground">
//                 Visit any BloodLink partner blood center
//               </p>
//             </div>
//             <div className="rounded-lg bg-muted p-4 text-center">
//               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <span className="text-xl font-bold text-primary">2</span>
//               </div>
//               <h4 className="mb-1 font-semibold text-foreground">Show QR Code</h4>
//               <p className="text-sm text-muted-foreground">
//                 Present your digital ID at the registration desk
//               </p>
//             </div>
//             <div className="rounded-lg bg-muted p-4 text-center">
//               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <span className="text-xl font-bold text-primary">3</span>
//               </div>
//               <h4 className="mb-1 font-semibold text-foreground">Quick Check-in</h4>
//               <p className="text-sm text-muted-foreground">
//                 Skip paperwork and start your donation faster
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Donation Statistics</CardTitle>
//           <CardDescription>Encoded in your Digital ID</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="flex items-center justify-between rounded-lg border border-border p-4">
//               <span className="text-muted-foreground">Total Donations</span>
//               <span className="text-2xl font-bold text-foreground">{donorQRData.totalDonations}</span>
//             </div>
//             <div className="flex items-center justify-between rounded-lg border border-border p-4">
//               <span className="text-muted-foreground">Donor Since</span>
//               <span className="text-lg font-semibold text-foreground">2020</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle,
  Droplets,
  User,
  Calendar,
  Shield
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Define the type based on your Backend response
type DonorQRData = {
  name: string;
  email: string;
  bloodType: string;
  totalDonations: number;
  role: string;
  // We can use email as a fallback ID if UserID isn't in the DTO
  id?: string; 
}

export default function QRCodePage() {
  const [donorData, setDonorData] = useState<DonorQRData | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQRData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5004/api/Auth/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDonorData(data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch QR Data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQRData();
  }, [router]);

  const handleCopyId = () => {
    if (donorData?.email) {
      navigator.clipboard.writeText(donorData.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <div className="p-10 text-center font-serif">Generating Digital ID...</div>;
  if (!donorData) return null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-bold font-serif">BloodLink</h2>
                <p className="text-sm opacity-90 font-serif">Digital Donor ID</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30 font-serif">
              <Shield className="mr-1 h-3 w-3" />
              Verified Donor
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
            {/* QR Code Section */}
            <div className="flex flex-col items-center">
              <div className="rounded-xl border-4 border-primary/20 bg-white p-4">
                <svg width="180" height="180" viewBox="0 0 180 180" className="text-foreground">
                   {/* QR Patterns use the name/email for uniqueness logic if needed */}
                  <rect x="10" y="10" width="50" height="50" fill="currentColor" />
                  <rect x="15" y="15" width="40" height="40" fill="white" />
                  <rect x="20" y="20" width="30" height="30" fill="currentColor" />
                  <rect x="120" y="10" width="50" height="50" fill="currentColor" />
                  <rect x="125" y="15" width="40" height="40" fill="white" />
                  <rect x="130" y="20" width="30" height="30" fill="currentColor" />
                  <rect x="10" y="120" width="50" height="50" fill="currentColor" />
                  <rect x="15" y="125" width="40" height="40" fill="white" />
                  <rect x="20" y="130" width="30" height="30" fill="currentColor" />
                  <rect x="70" y="70" width="40" height="40" fill="currentColor" opacity="0.2"/>
                </svg>
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground font-serif">
                Scan at center for quick check-in
              </p>
            </div>

            {/* Dynamic Data from .NET Backend */}
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-serif">Donor Name</p>
                    <p className="font-semibold text-foreground font-serif">{donorData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Droplets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-serif">Blood Type</p>
                    <p className="text-2xl font-bold text-primary font-serif">{donorData.bloodType || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <QrCode className="h-5 w-5 text-primary font-serif" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-serif">Total Donations</p>
                    <p className="font-semibold text-foreground font-serif">{donorData.totalDonations} Donations</p>
                  </div>
                </div>
              </div>

              {/* Unique Donor ID (Using Email) */}
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-serif">Account Identifier</p>
                    <p className="font-mono text-sm font-semibold text-foreground font-serif  ">{donorData.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopyId}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
       {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <QrCode className="h-5 w-5 text-primary font-serif" />
            How to Use Your Digital ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h4 className="mb-1 font-semibold text-foreground font-serif">Arrive at Center</h4>
              <p className="text-sm text-muted-foreground font-serif">
                Visit any BloodLink partner blood center
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h4 className="mb-1 font-semibold text-foreground font-serif">Show QR Code</h4>
              <p className="text-sm text-muted-foreground font-serif">
                Present your digital ID at the registration desk
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h4 className="mb-1 font-semibold text-foreground font-serif">Quick Check-in</h4>
              <p className="text-sm text-muted-foreground font-serif">
                Skip paperwork and start your donation faster
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Donation Statistics</CardTitle>
          <CardDescription className="font-serif" >Encoded in your Digital ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-muted-foreground font-serif">Total Donations</span>
              <p className="font-semibold text-foreground font-serif">{donorData.totalDonations} Donations</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-muted-foreground font-serif">Donor Since</span>
              <span className="text-lg font-semibold text-foreground font-serif">2026</span>
            </div>
          </div>
        </CardContent>
      </Card>
   
      
      
    </div>
  )
}
