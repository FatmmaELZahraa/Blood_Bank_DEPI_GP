"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { HeartPulse, Weight, User } from "lucide-react"

export default function DonorEligibility() {
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [chronic, setChronic] = useState(false)
  const [result, setResult] = useState<null | { status: string; message: string }>(null)

  const check = () => {
    if (!age || !weight) {
      setResult({ status: "Rejected", message: "Please fill in all fields." })
      return
    }

    if (parseInt(age) < 18) {
      setResult({ status: "Rejected", message: "Age must be at least 18." })
      return
    }

    if (parseInt(weight) < 50) {
      setResult({ status: "Rejected", message: "Weight must be at least 50 kg." })
      return
    }

    if (chronic) {
      setResult({ status: "Rejected", message: "Chronic diseases are not allowed." })
      return
    }

    setResult({ status: "Accepted", message: "You are eligible to donate blood ✅" })
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-2xl shadow-lg border">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Donor Eligibility Check</CardTitle>
          <CardDescription>
            Enter your information to see if you are eligible to donate blood
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Age */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Age
            </Label>
            <Input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Weight (kg)
            </Label>
            <Input
              type="number"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* Chronic */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <input
              type="checkbox"
              checked={chronic}
              onChange={() => setChronic(!chronic)}
              className="h-4 w-4"
            />
            <Label className="flex items-center gap-2 cursor-pointer">
              <HeartPulse className="h-4 w-4 text-red-500" />
              Do you have any chronic diseases?
            </Label>
          </div>

          {/* Button */}
          <Button onClick={check} className="w-full text-lg py-6">
            Check Eligibility
          </Button>

          {/* Result */}
          {result && (
            <div className="text-center space-y-2 pt-4 border-t">
              <Badge
                className="text-base px-4 py-1"
                variant={result.status === "Accepted" ? "default" : "destructive"}
              >
                {result.status}
              </Badge>
              <p className="text-muted-foreground">{result.message}</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}