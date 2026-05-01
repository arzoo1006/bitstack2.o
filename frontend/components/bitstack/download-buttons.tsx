"use client"

import { Download, Database, Box } from "lucide-react"
import { Button } from "@/components/ui/button"

// 🔥 Replace with your actual Render backend URL
const BASE_URL = "https://bitstack-backend.onrender.com"

export function DownloadButtons() {
  const items = [
    {
      icon: Database,
      title: "Cleaned dataset",
      sub: "CSV · 4.2 MB",
      url: `${BASE_URL}/download-data/`,
    },
    {
      icon: Box,
      title: "Trained models",
      sub: "ZIP · ONNX + pickle · 18.6 MB",
      url: `${BASE_URL}/download-model/`,
    },
    {
      icon: Download,
      title: "Full report",
      sub: "PDF · 1.1 MB",
      url: `${BASE_URL}/download-report/`,
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-xl border border-border/60 bg-secondary/20 p-4 flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg grid place-items-center bg-card border border-border/60">
            <it.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{it.title}</p>
            <p className="text-xs text-muted-foreground">{it.sub}</p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="rounded-md bg-secondary hover:bg-secondary/70 border border-border/60"
            onClick={() => window.open(it.url, "_blank")}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      ))}
    </div>
  )
}