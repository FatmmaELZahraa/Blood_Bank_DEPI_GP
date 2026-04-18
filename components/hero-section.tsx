import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Droplet, ArrowRight, Heart, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Heart className="h-4 w-4" />
            <span>Saving Lives Through Technology</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
            Infrastructure to Power the{" "}
            <span className="text-primary">Blood Bank Network</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-pretty">
            Seamlessly connect hospitals, blood banks, and donors on a unified platform. 
            Manage inventory, track donations, and respond to emergencies in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

  {/* Become Donor */}
  <Button
  asChild
  size="lg"
  className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-300 hover:scale-105"
>
  <Link href="/donor">
    <Droplet className="h-5 w-5" />
    Become a Donor
  </Link>
</Button>

  {/* Request Blood */}
  <Button asChild variant="outline" size="lg" className="gap-2">
    <Link href="/hospital">
      Request Blood
      <ArrowRight className="h-4 w-4" />
    </Link>
  </Button>

  {/* 🔥 Eligibility Button (Updated) */}
  <Button
    asChild
    size="lg"
    className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-300 hover:scale-105"
  >
    <Link href="/hospital/donor-eligibility">
      <Heart className="h-5 w-5" />
      Check Eligibility
    </Link>
  </Button>

</div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">Real-time Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm">50,000+ Lives Saved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
