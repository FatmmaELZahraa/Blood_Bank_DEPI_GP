// "use client"

// import { useState } from "react"
// import { 
//   Award, 
//   Gift, 
//   Star, 
//   Trophy,
//   Zap,
//   Heart,
//   Target,
//   CheckCircle,
//   Lock
// } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"

// // Mock rewards data
// const userRewards = {
//   totalPoints: 2450,
//   currentLevel: "Gold",
//   nextLevel: "Platinum",
//   pointsToNextLevel: 550,
//   lifetimeDonations: 12
// }

// const badges = [
//   { id: 1, name: "First Drop", description: "Complete your first donation", icon: Heart, earned: true, date: "2020-03-15" },
//   { id: 2, name: "Regular Hero", description: "Donate 5 times", icon: Star, earned: true, date: "2021-08-22" },
//   { id: 3, name: "Life Saver", description: "Donate 10 times", icon: Trophy, earned: true, date: "2024-11-10" },
//   { id: 4, name: "Blood Champion", description: "Donate 25 times", icon: Award, earned: false, progress: 48 },
//   { id: 5, name: "Streak Master", description: "Maintain a 6-month donation streak", icon: Zap, earned: false, progress: 67 },
//   { id: 6, name: "Community Leader", description: "Refer 5 new donors", icon: Target, earned: false, progress: 20 }
// ]

// const availableRewards = [
//   { id: 1, name: "Health Check Discount", description: "20% off annual health screening", points: 500, category: "Health" },
//   { id: 2, name: "Fitness Pass", description: "1-month gym membership", points: 1000, category: "Fitness" },
//   { id: 3, name: "Wellness Package", description: "Spa and wellness voucher", points: 1500, category: "Wellness" },
//   { id: 4, name: "Premium Health Kit", description: "Blood pressure monitor + supplements", points: 2000, category: "Health" },
//   { id: 5, name: "Charity Donation", description: "Donate points to a cause", points: 250, category: "Charity" }
// ]

// const levels = [
//   { name: "Bronze", minPoints: 0, color: "bg-amber-600" },
//   { name: "Silver", minPoints: 1000, color: "bg-slate-400" },
//   { name: "Gold", minPoints: 2000, color: "bg-yellow-500" },
//   { name: "Platinum", minPoints: 3000, color: "bg-slate-300" },
//   { name: "Diamond", minPoints: 5000, color: "bg-cyan-400" }
// ]

// export default function RewardsPage() {
//   const [activeTab, setActiveTab] = useState<"badges" | "rewards">("badges")

//   const currentLevelIndex = levels.findIndex(l => l.name === userRewards.currentLevel)
//   const progressToNextLevel = ((userRewards.totalPoints - levels[currentLevelIndex].minPoints) / 
//     (levels[currentLevelIndex + 1]?.minPoints - levels[currentLevelIndex].minPoints || 1)) * 100

//   return (
//     <div className="space-y-6">
//       {/* Points Overview */}
//       <Card className="overflow-hidden">
//         <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Points</p>
//               <p className="text-4xl font-bold">{userRewards.totalPoints.toLocaleString()}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className={`h-12 w-12 rounded-full ${levels[currentLevelIndex].color} flex items-center justify-center`}>
//                 <Trophy className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <p className="font-semibold">{userRewards.currentLevel} Member</p>
//                 <p className="text-sm opacity-90">{userRewards.pointsToNextLevel} pts to {userRewards.nextLevel}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <CardContent className="p-6">
//           {/* Level Progress */}
//           <div className="mb-4">
//             <div className="mb-2 flex justify-between text-sm">
//               <span className="text-muted-foreground">{userRewards.currentLevel}</span>
//               <span className="text-muted-foreground">{userRewards.nextLevel}</span>
//             </div>
//             <Progress value={progressToNextLevel} className="h-3" />
//           </div>
          
      //     {/* Level Tiers */}
      //     <div className="flex justify-between">
      //       {levels.map((level, index) => (
      //         <div key={level.name} className="flex flex-col items-center">
      //           <div className={`h-3 w-3 rounded-full ${index <= currentLevelIndex ? level.color : "bg-muted"}`} />
      //           <span className={`mt-1 text-xs ${index <= currentLevelIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>
      //             {level.name}
      //           </span>
      //         </div>
      //       ))}
      //     </div>
      //   </CardContent>
      // </Card>

      // {/* Points Earning Info */}
      // <Card>
      //   <CardHeader>
      //     <CardTitle className="flex items-center gap-2">
      //       <Zap className="h-5 w-5 text-primary" />
      //       How to Earn Points
      //     </CardTitle>
      //   </CardHeader>
      //   <CardContent>
      //     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      //       <div className="rounded-lg bg-muted p-4 text-center">
      //         <p className="text-2xl font-bold text-primary">+100</p>
      //         <p className="text-sm text-muted-foreground">Per Donation</p>
      //       </div>
      //       <div className="rounded-lg bg-muted p-4 text-center">
      //         <p className="text-2xl font-bold text-primary">+50</p>
      //         <p className="text-sm text-muted-foreground">Referral Bonus</p>
      //       </div>
      //       <div className="rounded-lg bg-muted p-4 text-center">
      //         <p className="text-2xl font-bold text-primary">+25</p>
      //         <p className="text-sm text-muted-foreground">Monthly Streak</p>
      //       </div>
      //       <div className="rounded-lg bg-muted p-4 text-center">
      //         <p className="text-2xl font-bold text-primary">2x</p>
      //         <p className="text-sm text-muted-foreground">Emergency Bonus</p>
      //       </div>
      //     </div>
      //   </CardContent>
      // </Card>

      // {/* Tabs */}
      // <div className="flex gap-2 border-b border-border">
      //   <button
      //     onClick={() => setActiveTab("badges")}
      //     className={`px-4 py-2 text-sm font-medium transition-colors ${
      //       activeTab === "badges"
      //         ? "border-b-2 border-primary text-primary"
      //         : "text-muted-foreground hover:text-foreground"
      //     }`}
      //   >
      //     Badges & Achievements
      //   </button>
      //   <button
      //     onClick={() => setActiveTab("rewards")}
      //     className={`px-4 py-2 text-sm font-medium transition-colors ${
      //       activeTab === "rewards"
      //         ? "border-b-2 border-primary text-primary"
      //         : "text-muted-foreground hover:text-foreground"
      //     }`}
      //   >
      //     Redeem Rewards
      //   </button>
      // </div>

      // {/* Badges Tab */}
      // {activeTab === "badges" && (
      //   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      //     {badges.map((badge) => (
      //       <Card key={badge.id} className={badge.earned ? "" : "opacity-75"}>
      //         <CardContent className="p-6">
      //           <div className="flex items-start gap-4">
      //             <div className={`rounded-full p-3 ${
      //               badge.earned 
      //                 ? "bg-primary/10" 
      //                 : "bg-muted"
      //             }`}>
      //               {badge.earned ? (
      //                 <badge.icon className="h-6 w-6 text-primary" />
      //               ) : (
      //                 <Lock className="h-6 w-6 text-muted-foreground" />
      //               )}
      //             </div>
      //             <div className="flex-1">
      //               <div className="flex items-center gap-2">
      //                 <h4 className="font-semibold text-foreground">{badge.name}</h4>
      //                 {badge.earned && (
      //                   <CheckCircle className="h-4 w-4 text-green-500" />
      //                 )}
      //               </div>
      //               <p className="text-sm text-muted-foreground">{badge.description}</p>
      //               {badge.earned ? (
      //                 <p className="mt-2 text-xs text-muted-foreground">
      //                   Earned on {new Date(badge.date!).toLocaleDateString()}
      //                 </p>
      //               ) : (
      //                 <div className="mt-2">
      //                   <div className="flex items-center justify-between text-xs">
      //                     <span className="text-muted-foreground">Progress</span>
      //                     <span className="text-foreground">{badge.progress}%</span>
      //                   </div>
      //                   <Progress value={badge.progress} className="mt-1 h-1.5" />
      //                 </div>
      //               )}
      //             </div>
      //           </div>
      //         </CardContent>
      //       </Card>
      //     ))}
      //   </div>
      // )}

      // {/* Rewards Tab */}
      // {activeTab === "rewards" && (
      //   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      //     {availableRewards.map((reward) => {
      //       const canAfford = userRewards.totalPoints >= reward.points
      //       return (
      //         <Card key={reward.id}>
      //           <CardContent className="p-6">
      //             <div className="mb-4 flex items-start justify-between">
      //               <div className="rounded-full bg-primary/10 p-3">
      //                 <Gift className="h-6 w-6 text-primary" />
      //               </div>
      //               <Badge variant="secondary">{reward.category}</Badge>
      //             </div>
      //             <h4 className="mb-1 font-semibold text-foreground">{reward.name}</h4>
      //             <p className="mb-4 text-sm text-muted-foreground">{reward.description}</p>
      //             <div className="flex items-center justify-between">
      //               <span className="font-bold text-primary">{reward.points} pts</span>
      //               <Button
      //                 size="sm"
      //                 disabled={!canAfford}
      //                 variant={canAfford ? "default" : "outline"}
      //               >
      //                 {canAfford ? "Redeem" : "Not Enough Points"}
      //               </Button>
      //             </div>
      //           </CardContent>
      //         </Card>
      //       )
      //     })}
      //   </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Award, Gift, Star, Trophy, Zap, Heart, Target, CheckCircle, Lock, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function RewardsPage() {
  const [userPointsData, setUserPointsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"badges" | "rewards" | any>("badges")
  const [isRedeeming, setIsRedeeming] = useState<number | null>(null) // Track which ID is being redeemed
  const router = useRouter()

  useEffect(() => {
    fetchUserPoints()
  }, [])

  const fetchUserPoints = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:5004/api/Rewards/user-points", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUserPointsData(data)
      }
    } catch (err) {
      console.error("Error fetching points:", err)
    } finally {
      setLoading(false)
    }
  }

  // CONNECTION LOGIC
 const handleRedeem = async (rewardId: number, cost: number) => {
    const token = localStorage.getItem("token")
    
    if (userPointsData.totalPoints < cost) {
        alert("You don't have enough points for this reward.");
        return;
    }

    if (!confirm("Are you sure you want to redeem this reward?")) return;

    setIsRedeeming(rewardId) 

    try {
      const response = await fetch(`http://localhost:5004/api/Rewards/redeem/${rewardId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(cost) // يرسل التكلفة كـ Number داخل الـ Body
      })

      const result = await response.json(); // محاولة قراءة الرد كـ JSON

      if (response.ok) {
        alert(result.message || "Reward Redeemed Successfully!")
        await fetchUserPoints() 
      } else {
        // عرض رسالة الخطأ القادمة من الـ Backend (مثل "Insufficient points")
        alert(result.message || result || "Failed to redeem reward")
      }
    } catch (err) {
      alert("Server error. Please check if backend is running.")
    } finally {
      setIsRedeeming(null)
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-red-600" /></div>
  if (!userPointsData) return null

  const currentLevelIndex = levels.findIndex(l => l.name === userPointsData.currentLevel)
  const nextLevelMin = levels[currentLevelIndex + 1]?.minPoints || userPointsData.totalPoints
  const currentLevelMin = levels[currentLevelIndex].minPoints
  const progressToNextLevel = ((userPointsData.totalPoints - currentLevelMin) / (nextLevelMin - currentLevelMin || 1)) * 100

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="overflow-hidden shadow-lg border-none">
        <div className="bg-gradient-to-r from-red-700 to-red-500 p-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm opacity-90 font-serif">Available Balance</p>
              <p className="text-4xl font-bold">{userPointsData.totalPoints.toLocaleString()} <span className="text-lg font-normal opacity-80">pts</span></p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
              <div className={`h-12 w-12 rounded-full ${levels[currentLevelIndex].color} flex items-center justify-center shadow-inner`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg font-serif">{userPointsData.currentLevel} Rank</p>
                <p className="text-xs opacity-90">{userPointsData.pointsToNextLevel} pts to reach {userPointsData.nextLevel}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-white">
          <div className="mb-2 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <span>{userPointsData.currentLevel}</span>
            <span>{userPointsData.nextLevel}</span>
          </div>
          <Progress value={progressToNextLevel} className="h-3 bg-gray-100" />
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

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("badges")}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === "badges" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400"}`}
        >
          Badges
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === "rewards" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400"}`}
        >
          Redeem Items
        </button>
      </div>

      {/* Badges Tab */}
      {activeTab === "badges" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card key={badge.id} className={`${badge.earned ? "border-green-100 bg-green-50/20" : "opacity-60 bg-gray-50"}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-3 ${badge.earned ? "bg-green-100" : "bg-gray-200"}`}>
                    {badge.earned ? <badge.icon className="h-6 w-6 text-green-600" /> : <Lock className="h-6 w-6 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{badge.name}</h4>
                    <p className="text-xs text-gray-500 leading-tight">{badge.description}</p>
                    {badge.earned ? (
                        <Badge className="mt-2 bg-green-500 hover:bg-green-500 text-[10px]">UNLOCKED</Badge>
                    ) : (
                        <div className="mt-3">
                            <Progress value={badge.progress} className="h-1" />
                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{badge.progress}% complete</p>
                        </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rewards Tab - CONNECTED TO BACKEND */}
      {activeTab === "rewards" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableRewards.map((reward) => {
            const canAfford = userPointsData.totalPoints >= reward.points
            const isLoading = isRedeeming === reward.id

            return (
              <Card key={reward.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-red-50 p-3"><Gift className="h-6 w-6 text-red-600" /></div>
                    <Badge variant="outline" className="text-red-600 border-red-100">{reward.category}</Badge>
                  </div>
                  <h4 className="font-bold text-gray-800">{reward.name}</h4>
                  <p className="text-xs text-gray-500 mb-4 h-8 overflow-hidden">{reward.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-lg font-black text-red-600">{reward.points} <span className="text-xs">pts</span></span>
                    <Button
                      size="sm"
                      disabled={!canAfford || isLoading}
                      onClick={() => handleRedeem(reward.id, reward.points)} // CALLING REDEEM
                      className={canAfford ? "bg-red-600 hover:bg-red-700" : "bg-gray-200 text-gray-400"}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redeem"}
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

const levels = [
  { name: "Bronze", minPoints: 0, color: "bg-orange-600" },
  { name: "Silver", minPoints: 1000, color: "bg-gray-400" },
  { name: "Gold", minPoints: 2000, color: "bg-yellow-500" },
  { name: "Platinum", minPoints: 3000, color: "bg-blue-400" },
  { name: "Diamond", minPoints: 5000, color: "bg-cyan-300" }
]

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