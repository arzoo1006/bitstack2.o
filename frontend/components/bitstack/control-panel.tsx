"use client"

import { Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type TaskType = "classification" | "regression"

export function ControlPanel({
  target,
  onTarget,
  task,
  onTask,
  disabled,
  running,
  onRun,
}: {
  target: string
  onTarget: (v: string) => void
  task: TaskType
  onTask: (v: TaskType) => void
  disabled: boolean
  running: boolean
  onRun: () => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
      
      {/* Target input */}
      <div>
        <Label htmlFor="target" className="text-xs text-muted-foreground">
          Target column
        </Label>
        <Input
          id="target"
          value={target}
          onChange={(e) => onTarget(e.target.value)}
          placeholder="e.g. churn, price, target"
          className="mt-2 h-11 bg-secondary/40 border-border/70 focus-visible:ring-primary/50"
        />
      </div>

      {/* Task type */}
      <div>
        <Label htmlFor="task" className="text-xs text-muted-foreground">
          Task type
        </Label>
        <Select value={task} onValueChange={(v) => onTask(v as TaskType)}>
          <SelectTrigger
            id="task"
            className="mt-2 h-11 bg-secondary/40 border-border/70 focus:ring-primary/50"
          >
            <SelectValue placeholder="Select task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classification">Classification</SelectItem>
            <SelectItem value="regression">Regression</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Run button */}
      <Button
        onClick={onRun}
        disabled={disabled}
        size="lg"
        className="h-11 px-6 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 disabled:opacity-40 glow-primary"
      >
        {running ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            Running…
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4 fill-current" />
            Run Analysis
          </>
        )}
      </Button>

    </div>
  )
}