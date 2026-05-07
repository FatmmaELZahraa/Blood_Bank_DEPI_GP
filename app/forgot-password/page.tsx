"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MailCheck } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:5004/api/Auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (res.ok) setDone(true);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-serif text-red-600">BloodLink</CardTitle>
        </CardHeader>
        <CardContent>
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">Forgot Password?</h3>
                <p className="text-sm text-muted-foreground">Enter your email and we'll send you a link to reset your password.</p>
              </div>
              <Input type="email" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)} />
              <Button className="w-full bg-red-600 hover:bg-red-700 h-11" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <MailCheck className="text-green-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">We've sent a password reset link to <span className="font-bold">{email}</span></p>
              <Button variant="ghost" onClick={() => setDone(false)}>Try another email</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}