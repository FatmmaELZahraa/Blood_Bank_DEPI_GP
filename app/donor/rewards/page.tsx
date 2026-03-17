"use client"

import { useState } from "react"
import { 
  Award, 
  Gift, 
  Star, 
  Trophy,
  Zap,
  Heart,
  Target,
  CheckCircle,
  Lock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock rewards data
const userRewards = {
  totalPoints: 2450,
  currentLevel: "Gold",
  nextLevel: "Platinum",
  pointsToNextLevel: 550,
  lifetimeDonations: 12
}

const badges = [
  { id: 1, name: "First Drop", description: "Complete your first donation", icon: Heart, earned: true, date: "2020-03-15" },
  { id: 2, name: "Regular Hero", description: "Donate 5 times", icon: Star, earned: true, date: "2021-08-22" },
  { id: 3, name: "Life Saver", description: "Donate 10 times", icon: Trophy, earned: true, date: "2024-11-10" },
  { id: 4, name: "Blood Champion", description: "Donate 25 times", icon: Award, earned: false, progress: 48 },
  { id: 5, name: "Streak Master", description: "Maintain a 6-month donation streak", icon: Zap, earned: false, progress: 67 },
  { id: 6, name: "Community Leader", description: "Refer 5 new donors", icon: Target, earned: false, progress: 20 }
]

const availableRewards = [
  { id: 1, name: "Health Check Discount", description: "20% off annual health screening", points: 500, category: "Health" },
  { id: 2, name: "Fitness Pass", description: "1-month gym membership", points: 1000, category: "Fitness" },
  { id: 3, name: "Wellness Package", description: "Spa and wellness voucher", points: 1500, category: "Wellness" },
  { id: 4, name: "Premium Health Kit", description: "Blood pressure monitor + supplements", points: 2000, category: "Health" },
  { id: 5, name: "Charity Donation", description: "Donate points to a cause", points: 250, category: "Charity" }
]

const levels = [
  { name: "Bronze", minPoints: 0, color: "bg-amber-600" },
  { name: "Silver", minPoints: 1000, color: "bg-slate-400" },
  { name: "Gold", minPoints: 2000, color: "bg-yellow-500" },
  { name: "Platinum", minPoints: 3000, color: "bg-slate-300" },
  { name: "Diamond", minPoints: 5000, color: "bg-cyan-400" }
]

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"badges" | "rewards">("badges")

  const currentLevelIndex = levels.findIndex(l => l.name === userRewards.currentLevel)
  const progressToNextLevel = ((userRewards.totalPoints - levels[currentLevelIndex].minPoints) / 
    (levels[currentLevelIndex + 1]?.minPoints - levels[currentLevelIndex].minPoints || 1)) * 100

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm opacity-90">Total Points</p>
              <p className="text-4xl font-bold">{userRewards.totalPoints.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-12 w-12 rounded-full ${levels[currentLevelIndex].color} flex items-center justify-center`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">{userRewards.currentLevel} Member</p>
                <p className="text-sm opacity-90">{userRewards.pointsToNextLevel} pts to {userRewards.nextLevel}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          {/* Level Progress */}
          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{userRewards.currentLevel}</span>
              <span className="text-muted-foreground">{userRewards.nextLevel}</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
          
          {/* Level Tiers */}
          <div className="flex justify-between">
            {levels.map((level, index) => (
              <div key={level.name} className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${index <= currentLevelIndex ? level.color : "bg-muted"}`} />
                <span className={`mt-1 text-xs ${index <= currentLevelIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {level.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points Earning Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            How to Earn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-primary">+100</p>
              <p className="text-sm text-muted-foreground">Per Donation</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-primary">+50</p>
              <p className="text-sm text-muted-foreground">Referral Bonus</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-primary">+25</p>
              <p className="text-sm text-muted-foreground">Monthly Streak</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-primary">2x</p>
              <p className="text-sm text-muted-foreground">Emergency Bonus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "badges"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Badges & Achievements
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "rewards"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Redeem Rewards
        </button>
      </div>

      {/* Badges Tab */}
      {activeTab === "badges" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card key={badge.id} className={badge.earned ? "" : "opacity-75"}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-3 ${
                    badge.earned 
                      ? "bg-primary/10" 
                      : "bg-muted"
                  }`}>
                    {badge.earned ? (
                      <badge.icon className="h-6 w-6 text-primary" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{badge.name}</h4>
                      {badge.earned && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    {badge.earned ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Earned on {new Date(badge.date!).toLocaleDateString()}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">{badge.progress}%</span>
                        </div>
                        <Progress value={badge.progress} className="mt-1 h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === "rewards" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableRewards.map((reward) => {
            const canAfford = userRewards.totalPoints >= reward.points
            return (
              <Card key={reward.id}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{reward.category}</Badge>
                  </div>
                  <h4 className="mb-1 font-semibold text-foreground">{reward.name}</h4>
                  <p className="mb-4 text-sm text-muted-foreground">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{reward.points} pts</span>
                    <Button
                      size="sm"
                      disabled={!canAfford}
                      variant={canAfford ? "default" : "outline"}
                    >
                      {canAfford ? "Redeem" : "Not Enough Points"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
