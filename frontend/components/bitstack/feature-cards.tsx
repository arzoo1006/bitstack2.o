"use client"

import { motion } from "framer-motion"
import { Sparkles, LineChart, Brain, Rocket } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Smart Data Cleaning",
    description:
      "Detect missing values, outliers, and type mismatches automatically. Get a production-ready dataset in seconds.",
  },
  {
    icon: LineChart,
    title: "Automated EDA & Insights",
    description:
      "Distributions, correlations, and feature interactions surfaced as visual reports — written in plain English.",
  },
  {
    icon: Brain,
    title: "Advanced Model Training",
    description:
      "Run gradient boosting, deep nets, and classical baselines in parallel. Hyperparameters tuned for you.",
  },
  {
    icon: Rocket,
    title: "Export & Deploy",
    description:
      "Ship models as a Python package, ONNX file, or REST endpoint. From notebook to production in one click.",
  },
]

export function FeatureCards() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-sm font-mono text-primary"
          >
            01 — Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-balance text-3xl md:text-5xl font-semibold tracking-tight"
          >
            A full data team, <span className="text-muted-foreground">on autopilot.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-pretty text-muted-foreground leading-relaxed"
          >
            BitStack handles the unglamorous work — wrangling, validating, training, and explaining — so analysts and founders can focus on decisions that matter.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group glass rounded-xl p-6 transition-colors hover:border-primary/30 relative overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative">
                <div className="h-10 w-10 rounded-lg grid place-items-center bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                <div className="mt-5 inline-flex items-center text-xs text-muted-foreground/80 font-mono">
                  0{i + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
