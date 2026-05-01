"use client"

import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

export const PROCESSING_STEPS = [
  "Cleaning data...",
  "Running EDA...",
  "Training models...",
  "Evaluating results...",
] as const

export function ProcessingState({ stepIndex }: { stepIndex: number }) {
  const progress = Math.min(100, ((stepIndex + 1) / PROCESSING_STEPS.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-border/70 bg-secondary/30 p-6 md:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 grid place-items-center rounded-full bg-primary/10 border border-primary/30">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
        <div>
          <p className="text-sm font-medium">Analyzing your dataset</p>
          <p className="text-xs text-muted-foreground">This usually takes under 3 minutes.</p>
        </div>
        <div className="ml-auto text-xs font-mono text-muted-foreground">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1.5 w-full rounded-full bg-background overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>

      {/* Steps */}
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {PROCESSING_STEPS.map((step, i) => {
          const done = i < stepIndex
          const active = i === stepIndex
          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-sm ${
                done || active ? "text-foreground" : "text-muted-foreground/60"
              }`}
            >
              <span
                className={`h-5 w-5 grid place-items-center rounded-full border ${
                  done
                    ? "bg-primary/20 border-primary/40"
                    : active
                      ? "border-primary/40"
                      : "border-border"
                }`}
              >
                {done ? (
                  <Check className="h-3 w-3 text-primary" />
                ) : active ? (
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </span>
              <span>{step}</span>
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
