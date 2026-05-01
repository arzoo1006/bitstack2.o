"use client"

import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react"
import { uploadFile } from "@/lib/api"

export function UploadBox({
  file,
  onFile,
}: {
  file: File | null
  onFile: (f: File | null) => void
}) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const f = files[0]
      onFile(f)

      // ✅ Upload immediately
      try {
        await uploadFile(f)
        console.log("Upload success")
      } catch (err) {
        console.error(err)
        alert("Upload failed")
      }
    },
    [onFile],
  )

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            htmlFor="bitstack-upload"
            onDragEnter={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center gap-3 cursor-pointer rounded-xl border border-dashed p-10 md:p-14 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-secondary/30 hover:bg-secondary/50 hover:border-foreground/30"
            }`}
          >
            <div className="h-12 w-12 rounded-full grid place-items-center bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
              <UploadCloud className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-sm md:text-base font-medium">
                Drop your CSV here, or{" "}
                <span className="text-primary underline-offset-4 hover:underline">
                  browse
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                CSV up to 100MB · Your data never leaves the sandbox
              </p>
            </div>

            <input
              ref={inputRef}
              id="bitstack-upload"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </motion.label>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-5 flex items-center gap-4"
          >
            <div className="h-11 w-11 rounded-lg grid place-items-center bg-card border border-border">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{file.name}</p>
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatSize(file.size)} · uploaded
              </p>
            </div>

            <button
              type="button"
              onClick={() => onFile(null)}
              className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}