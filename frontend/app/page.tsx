"use client"

import { useRef } from "react"
import { Navbar } from "@/components/bitstack/navbar"
import { HeroSection } from "@/components/bitstack/hero-section"
import { FeatureCards } from "@/components/bitstack/feature-cards"
import StudioSection from "@/components/bitstack/studio-section"
import { Footer } from "@/components/bitstack/footer"

export default function HomePage() {
  const studioRef = useRef<HTMLDivElement | null>(null)

  const scrollToStudio = () => {
    studioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection onGetStarted={scrollToStudio} />
      <FeatureCards />

      {/* ✅ FIXED */}
      <div ref={studioRef}>
        <StudioSection />
      </div>

      <Footer />
    </main>
  )
}