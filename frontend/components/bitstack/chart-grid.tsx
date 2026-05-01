"use client"

import { motion } from "framer-motion"

export function ChartGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartCard title="Correlation heatmap" subtitle="Pearson, top 8 features">
        <Heatmap />
      </ChartCard>
      <ChartCard title="Target distribution" subtitle="Class balance">
        <Distribution />
      </ChartCard>
      <ChartCard title="Feature importance" subtitle="SHAP global">
        <BarChart />
      </ChartCard>
      <ChartCard title="ROC curve" subtitle="Test fold · best model" className="md:col-span-2">
        <RocCurve />
      </ChartCard>
      <ChartCard title="Residuals" subtitle="Calibration check">
        <Residuals />
      </ChartCard>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border border-border/60 bg-secondary/20 p-5 ${className}`}
    >
      <div className="flex items-baseline justify-between">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  )
}

function Heatmap() {
  const size = 8
  const cells = Array.from({ length: size * size }, (_, i) => {
    const row = Math.floor(i / size)
    const col = i % size
    if (row === col) return 1
    // pseudo-random but stable
    const v = Math.sin(row * 13.37 + col * 2.71) * 0.5 + 0.5
    return Math.max(0, Math.min(1, v * 1.4 - 0.2))
  })
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {cells.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.005 }}
          className="aspect-square rounded-[2px]"
          style={{
            background: `color-mix(in oklch, var(--color-primary) ${Math.round(v * 90)}%, transparent)`,
          }}
          title={v.toFixed(2)}
        />
      ))}
    </div>
  )
}

function Distribution() {
  const bars = [12, 28, 45, 62, 78, 88, 72, 55, 40, 28, 18, 10]
  return (
    <div className="flex items-end gap-1.5 h-32">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.04 }}
          className="flex-1 rounded-sm bg-gradient-to-t from-accent/30 to-primary/80"
        />
      ))}
    </div>
  )
}

function BarChart() {
  const items = [
    { label: "tenure_mo", v: 92 },
    { label: "monthly_bill", v: 78 },
    { label: "support_calls", v: 64 },
    { label: "plan_type", v: 50 },
    { label: "region", v: 38 },
    { label: "age_bucket", v: 22 },
  ]
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="w-24 text-[11px] text-muted-foreground font-mono truncate">
            {it.label}
          </span>
          <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${it.v}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-accent"
            />
          </div>
          <span className="w-8 text-right text-[11px] font-mono text-muted-foreground">
            {it.v / 100}
          </span>
        </div>
      ))}
    </div>
  )
}

function RocCurve() {
  // Smooth ROC-like curve
  const points: string[] = []
  const W = 320
  const H = 120
  for (let i = 0; i <= 40; i++) {
    const x = i / 40
    const y = 1 - Math.pow(1 - x, 3.2)
    points.push(`${(x * W).toFixed(2)},${((1 - y) * H).toFixed(2)}`)
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      <defs>
        <linearGradient id="rocFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rocLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={0}
          y1={p * H}
          x2={W}
          y2={p * H}
          stroke="currentColor"
          strokeOpacity="0.06"
        />
      ))}
      <line
        x1={0}
        y1={H}
        x2={W}
        y2={0}
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeDasharray="3 3"
      />
      <polygon
        points={`0,${H} ${points.join(" ")} ${W},${H}`}
        fill="url(#rocFill)"
      />
      <motion.polyline
        points={points.join(" ")}
        fill="none"
        stroke="url(#rocLine)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  )
}

function Residuals() {
  const dots = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 80) * 100
    const y = 50 + Math.sin(i * 0.4) * 10 + (Math.random() - 0.5) * 18
    return { x, y, r: Math.random() * 1.5 + 1 }
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-32">
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="2 2" />
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="var(--color-primary)"
          fillOpacity="0.6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.005 }}
        />
      ))}
    </svg>
  )
}
