"use client"

import { CircleCheck, Circle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { chapters, exam, parts } from "@/content/course"
import { ratingMeta, resetProgress, useProgress, type Rating } from "@/lib/progress"
import { cn } from "@/lib/utils"

function formatRemaining(ms: number) {
  if (ms <= 0) return "Exam time"
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return h >= 48 ? `${Math.floor(h / 24)} days to go` : `${h} h ${m} min to go`
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])
  if (now === null) return null
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-sm text-primary">
      {formatRemaining(new Date(exam.startsAt).getTime() - now)}
    </span>
  )
}

export function StudyPath() {
  const progress = useProgress()
  return (
    <div className="space-y-8">
      {parts.map((part) => (
        <div key={part.id}>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <h3 className="font-medium">{part.title}</h3>
            <span className="font-mono text-xs text-muted-foreground">{part.lectures}</span>
          </div>
          <ol className="divide-y rounded-xl border">
            {chapters
              .filter((c) => c.part === part.id)
              .map((c) => {
                const done = progress.studied[c.slug]
                return (
                  <li key={c.slug}>
                    <Link href={`/learn/${c.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60">
                      {done ? (
                        <CircleCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className="w-5 font-mono text-xs text-muted-foreground">{c.number}</span>
                      <span className="min-w-0 flex-1 truncate">{c.title}</span>
                      <span className="hidden gap-1 sm:flex">
                        {c.questions.map((q) => {
                          const r = progress.ratings[`q${q}`]
                          return (
                            <span
                              key={q}
                              className={cn(
                                "rounded px-1.5 py-0.5 font-mono text-[0.7rem]",
                                r ? ratingMeta[r].className : "bg-muted text-muted-foreground",
                              )}
                            >
                              Q{q}
                            </span>
                          )
                        })}
                      </span>
                    </Link>
                  </li>
                )
              })}
          </ol>
        </div>
      ))}
    </div>
  )
}

export function RatingSummary() {
  const progress = useProgress()
  const ids = Array.from({ length: 23 }, (_, i) => i + 1)
  const order: Rating[] = ["got", "shaky", "missed"]
  const hasAny = Object.keys(progress.ratings).length + Object.keys(progress.studied).length > 0
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-1.5" role="img" aria-label="Question bank self-ratings">
        {ids.map((id) => {
          const r = progress.ratings[`q${id}`]
          return (
            <Link
              key={id}
              href={`/questions#q${id}`}
              title={`Q${id}${r ? `: ${ratingMeta[r].label}` : ""}`}
              className={cn(
                "flex aspect-square items-center justify-center rounded font-mono text-[0.65rem]",
                r ? ratingMeta[r].className : "bg-muted text-muted-foreground",
              )}
            >
              {id}
            </Link>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {order.map((r) => (
          <span key={r} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-sm", ratingMeta[r].className)} />
            {ratingMeta[r].label}
          </span>
        ))}
        {hasAny && (
          <Button
            variant="ghost"
            size="xs"
            className="ml-auto text-muted-foreground"
            onClick={() => {
              if (window.confirm("Clear all saved progress, ratings, and drafts?")) resetProgress()
            }}
          >
            Reset progress
          </Button>
        )}
      </div>
    </div>
  )
}
