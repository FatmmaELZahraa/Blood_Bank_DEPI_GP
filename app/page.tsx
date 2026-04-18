"use client"
import ProfilePage from "@/components/profile" 
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { StatsSection } from "@/components/stats-section"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { LogIn } from "lucide-react"
import LoginPage from "./login/page";
import SignUpPage from "./signup/page";

import { useState } from "react";


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
