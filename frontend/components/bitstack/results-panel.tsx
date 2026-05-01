"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { DownloadButtons } from "./download-buttons"

const ChartGrid = dynamic(
  () => import("./chart-grid").then((mod) => mod.ChartGrid),
  { ssr: false }
)

export function ResultsPanel({
  target,
  task,
  results = [],
}: {
  target: string
  task: string
  results?: { model: string; score: number }[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16"
    >

      {/* 01 — Models */}
      <section>
        <SectionHeader
          step="01"
          title="Top performing models"
          subtitle={`Trained on ${task} task · target column "${target || "target"}"`}
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.length > 0 ? (
            results.map((m, i) => (
              <div key={i} className="rounded-xl border p-4 bg-secondary/20">
                <div className="font-semibold">{m.model}</div>
                <div className="text-sm text-muted-foreground">
                  Score: {m.score}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">
              No results yet. Run analysis to see models.
            </div>
          )}
        </div>
      </section>

      {/* 02 — Charts */}
      <section>
        <SectionHeader
          step="02"
          title="Exploratory analysis"
          subtitle="Auto-generated visualizations from your dataset"
        />
        <div className="mt-6">
          <img
            src="http://127.0.0.1:8000/eda/"
            alt="EDA"
            className="rounded-lg border"
          />
        </div>
      </section>

      {/* 03 — Insights */}
      <section>
        <SectionHeader
          step="03"
          title="Insights & recommendations"
          subtitle="Plain-language summary written by BitStack"
        />

        <div className="mt-6 rounded-xl border border-border/60 bg-secondary/20 p-6 md:p-8 max-w-3xl">
          <div className="space-y-4 text-pretty leading-relaxed text-foreground/90">

            {results.length > 0 ? (
              <>
                <p>
                  Your dataset has been successfully analyzed using an automated machine learning pipeline.
                </p>

                <p>
                  📊 Best model: <strong>{results[0]?.model}</strong> with score{" "}
                  <strong>{results[0]?.score}</strong>
                </p>

                <p>
                  📦 {results.length} models were trained and evaluated automatically.
                </p>

                <p>
                  ⚙️ The system performed data cleaning, feature engineering, model tuning, and stacking.
                </p>

                <p>
                  🧠 Feature selection ensured only relevant variables influenced predictions.
                </p>

                <p className="text-muted-foreground">
                  🚀 Recommendation: Use the best model for deployment and improve results with better data.
                </p>

                <p className="text-muted-foreground">
                  💡 AI Insight: The system simulated a full data science workflow automatically.
                </p>
              </>
            ) : (
              <>
                <p>No analysis yet.</p>
                <p className="text-muted-foreground">
                  Upload a dataset and run analysis to generate insights here.
                </p>
              </>
            )}

          </div>
        </div>
      </section>

      {/* 04 — Export */}
      <section className="pb-8">
        <SectionHeader
          step="04"
          title="Export your work"
          subtitle="Cleaned data, trained models, and a shareable report"
        />
        <div className="mt-6">
          <DownloadButtons />
        </div>
      </section>

    </motion.div>
  )
}

function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-mono text-primary">{step}</div>
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}