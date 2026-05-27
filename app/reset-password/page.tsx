// "use client"

// import { useState, useEffect  } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ShieldCheck, Loader2 } from "lucide-react"

// export default function ResetPassword() {
//   const searchParams = useSearchParams();
//   const token = searchParams?.get("token") ?? "";
//  if (!token) {
//   alert("Invalid reset link");
//   return;
// }
//   const router = useRouter();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) return alert("Passwords do not match");

//     setLoading(true);
//     const res = await fetch("http://bloodlinknetwork2.runasp.net/api/Auth/reset-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, newPassword: password })
//     });

//     if (res.ok) {
//       alert("Password updated! Redirecting to login...");
//       router.push("/login");
//     } else {
//       alert("Token is invalid or expired.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-50">
//       <Card className="w-full max-w-md shadow-xl border-none">
//         <CardHeader className="text-center">
//           <ShieldCheck className="mx-auto h-12 w-12 text-red-600 mb-2" />
//           <CardTitle className="text-xl font-bold">Secure Reset</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleReset} className="space-y-4">
//             <Input type="password" placeholder="New Password" required onChange={(e) => setPassword(e.target.value)} />
//             <Input type="password" placeholder="Confirm New Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
//             <Button className="w-full bg-red-600 hover:bg-red-700 h-11" disabled={loading}>
//               {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2 } from "lucide-react"

// 1. Move the logic into a content component that sits safely inside the Suspense boundary
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate the presence of the token on layout mount
  useEffect(() => {
    if (!token) {
      alert("Invalid reset link");
      router.push("/login"); // Safely bounce them back to login if no token exists
    }
  }, [token, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("http://bloodlinknetwork2.runasp.net/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });

      if (res.ok) {
        alert("Password updated! Redirecting to login...");
        router.push("/login");
      } else {
        alert("Token is invalid or expired.");
      }
    } catch (err) {
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null; // Prevents the form from flashing briefly if token is missing

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <Input type="password" placeholder="New Password" required onChange={(e) => setPassword(e.target.value)} />
      <Input type="password" placeholder="Confirm New Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
      <Button className="w-full bg-red-600 hover:bg-red-700 h-11" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
      </Button>
    </form>
  );
}

// 2. The main exported page remains the static container that builds without crashing
export default function ResetPassword() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-600 mb-2" />
          <CardTitle className="text-xl font-bold">Secure Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-red-600 h-8 w-8" />
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}