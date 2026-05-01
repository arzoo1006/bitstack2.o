"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

export type Model = {
  name: string
  score: number
  metric: string
  delta: string
}

export function ModelCard({
  model,
  rank,
  best,
  index,
}: {
  model: Model
  rank: number
  best: boolean
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative rounded-xl p-5 border overflow-hidden ${
        best
          ? "border-primary/40 bg-gradient-to-br from-primary/10 to-accent/5 glow-primary"
          : "border-border/60 bg-secondary/30"
      }`}
    >
      {best && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary/15 text-primary border border-primary/30">
          <Trophy className="h-3 w-3" />
          BEST
        </div>
      )}

      <div className="text-xs text-muted-foreground font-mono">#{rank}</div>
      <h4 className="mt-1 text-lg font-medium tracking-tight">{model.name}</h4>

      <div className="mt-6 flex items-baseline gap-2">
        <span className={`text-4xl font-semibold tabular-nums ${best ? "text-foreground" : ""}`}>
          {model.score.toFixed(3)}
        </span>
        <span className="text-xs text-muted-foreground">{model.metric}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{model.delta} vs baseline</span>
        <span
          className={`font-mono ${best ? "text-primary" : "text-muted-foreground"}`}
        >
          ●●●
        </span>
      </div>
    </motion.div>
  )
}
