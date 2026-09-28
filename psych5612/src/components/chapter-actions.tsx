"use client"

import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toggleStudied, useProgress } from "@/lib/progress"

export function MarkStudied({ slug }: { slug: string }) {
  const done = Boolean(useProgress().studied[slug])
  return (
    <Button variant={done ? "secondary" : "default"} onClick={() => toggleStudied(slug)}>
      <Check />
      {done ? "Studied" : "Mark chapter as studied"}
    </Button>
  )
}

export function StudiedBadge({ slug }: { slug: string }) {
  const done = Boolean(useProgress().studied[slug])
  if (!done) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
      <Check className="size-3" />
      Studied
    </span>
  )
}
