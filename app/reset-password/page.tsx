"use client"

import { useState, useEffect  } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2 } from "lucide-react"

export default function ResetPassword() {
  const searchParams = useSearchParams();
 const token = searchParams?.get("token") ?? "";
 if (!token) {
  alert("Invalid reset link");
  return;
}
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    const res = await fetch("http://localhost:5004/api/Auth/reset-password", {
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
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-600 mb-2" />
          <CardTitle className="text-xl font-bold">Secure Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <Input type="password" placeholder="New Password" required onChange={(e) => setPassword(e.target.value)} />
            <Input type="password" placeholder="Confirm New Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button className="w-full bg-red-600 hover:bg-red-700 h-11" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}