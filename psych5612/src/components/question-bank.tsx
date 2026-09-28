"use client"

import { Eye, EyeOff, Shuffle } from "lucide-react"
import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ratingMeta, setDraft, setRating, useProgress, type Rating } from "@/lib/progress"
import { cn } from "@/lib/utils"

export type BankQuestion = {
  id: number
  title: string
  prompt: string
  answer: ReactNode
  chapter: { slug: string; number: number; shortTitle: string } | null
}

type Filter = "all" | "unrated" | "review" | "mock"

const ratings: Rating[] = ["got", "shaky", "missed"]

function pickMock(ids: number[]) {
  return [...ids].sort(() => Math.random() - 0.5).slice(0, 8).sort((a, b) => a - b)
}

export function QuestionBank({ groups }: { groups: { title: string; questions: BankQuestion[] }[] }) {
  const progress = useProgress()
  const [filter, setFilter] = useState<Filter>("all")
  const allIds = useMemo(() => groups.flatMap((g) => g.questions.map((q) => q.id)), [groups])
  const [mock, setMock] = useState<number[]>(() => allIds.slice(0, 8))

  const visible = (id: number) => {
    const r = progress.ratings[`q${id}`]
    switch (filter) {
      case "all":
        return true
      case "unrated":
        return !r
      case "review":
        return r === "shaky" || r === "missed"
      case "mock":
        return mock.includes(id)
      default: {
        const unreachable: never = filter
        return unreachable
      }
    }
  }

  const counts = ratings.map((r) => allIds.filter((id) => progress.ratings[`q${id}`] === r).length)

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-5 mb-8 flex flex-wrap items-center gap-3 border-b bg-background/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <ToggleGroup
          value={[filter]}
          onValueChange={(v) => {
            const next = v[0] as Filter | undefined
            if (!next) return
            if (next === "mock") setMock(pickMock(allIds))
            setFilter(next)
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="all">All 23</ToggleGroupItem>
          <ToggleGroupItem value="unrated">Not rated</ToggleGroupItem>
          <ToggleGroupItem value="review">Shaky or missed</ToggleGroupItem>
          <ToggleGroupItem value="mock">Mock set of 8</ToggleGroupItem>
        </ToggleGroup>
        {filter === "mock" && (
          <Button variant="ghost" size="sm" onClick={() => setMock(pickMock(allIds))}>
            <Shuffle />
            New set
          </Button>
        )}
        <div className="ml-auto flex gap-2 text-xs">
          {ratings.map((r, i) => (
            <span key={r} className={cn("rounded-full px-2 py-0.5 font-medium", ratingMeta[r].className)}>
              {ratingMeta[r].label} {counts[i]}
            </span>
          ))}
        </div>
      </div>

      {groups.map((g) => {
        const qs = g.questions.filter((q) => visible(q.id))
        if (qs.length === 0) return null
        return (
          <section key={g.title} className="mb-12">
            <h2 className="mb-5 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Questions on material from {g.title}
            </h2>
            <div className="space-y-6">
              {qs.map((q) => (
                <QuestionItem key={q.id} q={q} />
              ))}
            </div>
          </section>
        )
      })}
      {groups.every((g) => g.questions.every((q) => !visible(q.id))) && (
        <p className="py-16 text-center text-muted-foreground">Nothing here yet.</p>
      )}
    </div>
  )
}

function QuestionItem({ q }: { q: BankQuestion }) {
  const progress = useProgress()
  const key = `q${q.id}`
  const [open, setOpen] = useState(false)
  const rating = progress.ratings[key]

  return (
    <article id={key} className="scroll-mt-32 rounded-xl border p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">
          <span className="mr-2 font-mono text-primary">Q{q.id}</span>
          {q.title}
        </h3>
        <div className="flex items-center gap-2 text-xs">
          {rating && (
            <span className={cn("rounded-full px-2 py-0.5 font-medium", ratingMeta[rating].className)}>
              {ratingMeta[rating].label}
            </span>
          )}
          {q.chapter && (
            <Link href={`/learn/${q.chapter.slug}`} className="text-muted-foreground hover:text-foreground">
              Ch. {q.chapter.number} {q.chapter.shortTitle}
            </Link>
          )}
        </div>
      </div>
      <p className="mt-3 text-[0.95rem] leading-7 text-foreground/85">{q.prompt}</p>

      <Textarea
        className="mt-4 min-h-28 text-[0.95rem] leading-7"
        placeholder="Write your answer from memory before revealing. Saved in this browser."
        value={progress.drafts[key] ?? ""}
        onChange={(e) => setDraft(key, e.target.value)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant={open ? "outline" : "default"} size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? <EyeOff /> : <Eye />}
          {open ? "Hide model answer" : "Reveal model answer"}
        </Button>
        {open && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">How did you do?</span>
            <ToggleGroup
              value={rating ? [rating] : []}
              onValueChange={(v) => setRating(key, (v[0] as Rating | undefined) ?? null)}
              variant="outline"
              size="sm"
            >
              {ratings.map((r) => (
                <ToggleGroupItem key={r} value={r}>
                  {ratingMeta[r].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </div>

      {open && <div className="mt-5 border-t pt-5">{q.answer}</div>}
    </article>
  )
}
