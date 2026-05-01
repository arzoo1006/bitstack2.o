"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      {/* Background gradients */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="aurora absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[radial-gradient(closest-side,var(--color-primary),transparent_70%)] opacity-25 blur-3xl" />
        <div className="aurora absolute top-40 right-0 h-[400px] w-[600px] rounded-full bg-[radial-gradient(closest-side,var(--color-accent),transparent_70%)] opacity-20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
          >
            Automate Your <br className="hidden md:block" />
            <span className="text-gradient">Data Science Workflow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl text-pretty text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            Upload your data. Get insights, models, and predictions instantly. BitStack runs cleaning, EDA, training, and evaluation — so you ship results, not pipelines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="rounded-full h-12 px-7 text-sm bg-foreground text-background hover:bg-foreground/90 group"
            >
              Get Started
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>

        {/* Floating preview card */}
        <FloatingPreview />
      </div>
    </section>
  )
}

function FloatingPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
      className="relative mx-auto mt-16 md:mt-20 w-full max-w-4xl"
    >
      <div className="absolute -inset-x-10 -inset-y-6 rounded-[2rem] bg-gradient-to-b from-primary/15 to-accent/10 blur-3xl -z-10" />
      <div className="glass rounded-2xl p-1.5 shadow-2xl shadow-black/40">
        <div className="rounded-[14px] bg-card/90 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            </div>
            <div className="text-xs text-muted-foreground font-mono">bitstack.app/run/xb91-q</div>
            <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              live
            </div>
          </div>

          {/* Content grid */}
          <div className="grid md:grid-cols-3 gap-3 p-4">
            <PreviewMetric icon={<TrendingUp className="h-4 w-4" />} label="Best model" value="XGBoost" sub="ROC-AUC 0.947" highlight />
            <PreviewMetric icon={<BarChart3 className="h-4 w-4" />} label="Features" value="42" sub="8 engineered" />
            <PreviewMetric icon={<Sparkles className="h-4 w-4" />} label="Runtime" value="2m 14s" sub="on 18k rows" />

            <div className="md:col-span-2 rounded-lg bg-secondary/50 border border-border/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">Model leaderboard</p>
                <p className="text-xs text-muted-foreground font-mono">ROC-AUC</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: "XGBoost", score: 0.947, w: 96 },
                  { name: "LightGBM", score: 0.941, w: 92 },
                  { name: "Random Forest", score: 0.918, w: 84 },
                  { name: "Logistic Reg.", score: 0.882, w: 72 },
                ].map((m, i) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-foreground/90">{m.name}</div>
                    <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.w}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${i === 0 ? "bg-gradient-to-r from-primary to-accent" : "bg-foreground/30"}`}
                      />
                    </div>
                    <div className="w-12 text-right text-xs font-mono text-muted-foreground">{m.score.toFixed(3)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
              <p className="text-xs text-muted-foreground mb-3">Feature importance</p>
              <div className="flex items-end gap-1.5 h-24">
                {[60, 88, 45, 72, 30, 95, 55, 40, 68, 25].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.04, ease: "easeOut" }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary/80"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PreviewMetric({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border/50 bg-secondary/50"
      }`}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className={highlight ? "text-primary" : ""}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}
