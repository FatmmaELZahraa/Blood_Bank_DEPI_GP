"use client"

import { useEffect, useState } from "react"
import { Droplet, Building2, Users, Activity } from "lucide-react"

const stats = [
  { 
    label: "Blood Units Available", 
    value: 12500, 
    suffix: "+",
    icon: Droplet,
    color: "text-primary"
  },
  { 
    label: "Partner Hospitals", 
    value: 250, 
    suffix: "+",
    icon: Building2,
    color: "text-accent"
  },
  { 
    label: "Registered Donors", 
    value: 85000, 
    suffix: "+",
    icon: Users,
    color: "text-chart-3"
  },
  { 
    label: "Lives Saved", 
    value: 50000, 
    suffix: "+",
    icon: Activity,
    color: "text-chart-4"
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl bg-secondary mb-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
