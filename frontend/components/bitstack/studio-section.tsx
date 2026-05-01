"use client"

import { useState } from "react"
import { ResultsPanel } from "./results-panel"
import { UploadBox } from "./upload-box"
import { ControlPanel } from "./control-panel"
import { trainModels, uploadFile } from "@/lib/api"

export default function StudioSection() {

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // ✅ added missing states
  const [file, setFile] = useState<File | null>(null)
  const [target, setTarget] = useState("")
  const [task, setTask] = useState<"classification" | "regression">("classification")
  const handleRun = async () => {
    if (!file) {
      alert("Upload file first")
      return
    }

    setLoading(true)

    try {
      // ✅ upload first
      await uploadFile(file)

      // ✅ then train
      const res = await trainModels(target, task)
      console.log(res.data)

      setResults(res.data.top_models)

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">

      {/* Upload Box */}
      <UploadBox file={file} onFile={setFile} />

      {/* Controls */}
      <ControlPanel
        target={target}
        onTarget={setTarget}
        task={task}
        onTask={setTask}
        disabled={!file || loading}
        running={loading}
        onRun={handleRun}
      />

      {/* Results */}
      <ResultsPanel
        target={target}
        task={task}
        results={results}
      />

    </div>
  )
}