"use client"

import { ChevronDown } from "lucide-react"
import { useState, type ReactNode } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ratingMeta, setRating, useProgress, type Rating } from "@/lib/progress"
import { cn } from "@/lib/utils"

const ratings: Rating[] = ["got", "shaky", "missed"]

export function RevealRow({
  ratingKey,
  prompt,
  answer,
  aside,
  forceOpen = false,
  id,
}: {
  ratingKey: string
  prompt: ReactNode
  answer: ReactNode
  aside?: ReactNode
  forceOpen?: boolean
  id?: string
}) {
  const [openState, setOpen] = useState(false)
  const open = forceOpen || openState
  const rating = useProgress().ratings[ratingKey]

  return (
    <li id={id} className="scroll-mt-32 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-start gap-3 text-left"
      >
        <ChevronDown
          className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", !open && "-rotate-90")}
        />
        <div className="min-w-0 flex-1 leading-7">{prompt}</div>
        {rating && (
          <span className={cn("mt-1 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", ratingMeta[rating].className)}>
            {ratingMeta[rating].label}
          </span>
        )}
      </button>
      {open && (
        <div className="mt-3 ml-7 space-y-3">
          <div className="rounded-lg border-l-4 border-primary bg-primary/5 px-4 py-3 leading-7">{answer}</div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <ToggleGroup
              value={rating ? [rating] : []}
              onValueChange={(v) => setRating(ratingKey, (v[0] as Rating | undefined) ?? null)}
              variant="outline"
              size="sm"
            >
              {ratings.map((r) => (
                <ToggleGroupItem key={r} value={r}>
                  {ratingMeta[r].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {aside}
          </div>
        </div>
      )}
    </li>
  )
}
