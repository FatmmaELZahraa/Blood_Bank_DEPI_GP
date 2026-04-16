import ProfilePage from "@/components/profile" 
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { StatsSection } from "@/components/stats-section"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ProfilePage/>
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
