"use client"

import { Check, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { RevealRow } from "@/components/reveal-row"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { chapterByNumber } from "@/content/course"
import { distinctions, mistakes, practiceTasks, sampleMultipleChoice } from "@/content/drills"
import { cn } from "@/lib/utils"

export const drillTabs = ["distinctions", "tasks", "mistakes", "recall"] as const
export type DrillTab = (typeof drillTabs)[number]

export type RecallSet = { slug: string; number: number; title: string; prompts: string[] }

function ChapterLink({ number }: { number: number | null }) {
  if (number === null) return <Link href="/scope" className="text-muted-foreground hover:text-foreground">Exam scope</Link>
  const c = chapterByNumber(number)
  if (!c) return null
  return (
    <Link href={`/learn/${c.slug}`} className="text-muted-foreground hover:text-foreground">
      Ch. {c.number} {c.shortTitle}
    </Link>
  )
}

export function Drills({ recall }: { recall: RecallSet[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const raw = params.get("tab")
  const tab: DrillTab = drillTabs.find((t) => t === raw) ?? "distinctions"
  const [showAll, setShowAll] = useState(false)

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => {
        setShowAll(false)
        router.replace(`${pathname}?tab=${v}`, { scroll: false })
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="distinctions">12 distinctions</TabsTrigger>
          <TabsTrigger value="tasks">10 practice tasks</TabsTrigger>
          <TabsTrigger value="mistakes">Mistakes & MC</TabsTrigger>
          <TabsTrigger value="recall">Chapter recall</TabsTrigger>
        </TabsList>
        {tab !== "recall" && (
          <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Hide all answers" : "Reveal all"}
          </Button>
        )}
      </div>

      <TabsContent value="distinctions" className="mt-6">
        <p className="text-sm text-muted-foreground">
          Produce the minimum contrast for each pair from memory, then open it to check.
        </p>
        <ul className="mt-2 divide-y">
          {distinctions.map((d, i) => (
            <RevealRow
              key={d.pair}
              ratingKey={`d${i}`}
              forceOpen={showAll}
              prompt={<span className="font-medium">{d.pair}</span>}
              answer={d.contrast}
              aside={<ChapterLink number={d.chapter} />}
            />
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="tasks" className="mt-6">
        <p className="text-sm text-muted-foreground">
          Work each task on paper first. The answer checks are the guide&apos;s short keys.
        </p>
        <ol className="mt-2 divide-y">
          {practiceTasks.map((t, i) => (
            <RevealRow
              key={t.task}
              ratingKey={`t${i}`}
              forceOpen={showAll}
              prompt={
                <span>
                  <span className="mr-2 font-mono text-muted-foreground">{i + 1}.</span>
                  {t.task}
                </span>
              }
              answer={t.check}
              aside={<ChapterLink number={t.chapter} />}
            />
          ))}
        </ol>
      </TabsContent>

      <TabsContent value="mistakes" className="mt-6 space-y-8">
        <SampleMc />
        <div>
          <h2 className="font-semibold">Frequent mistakes to catch</h2>
          <p className="text-sm text-muted-foreground">Each line is a wrong answer. Say why before you open it.</p>
          <ul className="mt-2 divide-y">
            {mistakes.map((m, i) => (
              <RevealRow
                key={m.mistake}
                ratingKey={`m${i}`}
                forceOpen={showAll}
                prompt={<span className="decoration-rose-500/50 decoration-2">{m.mistake}</span>}
                answer={m.correction}
                aside={<ChapterLink number={m.chapter} />}
              />
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="recall" className="mt-6">
        <p className="text-sm text-muted-foreground">
          The guide&apos;s end-of-chapter recall prompts in one list. Answer aloud or on paper, then reopen the chapter
          for anything you could not produce.
        </p>
        <div className="mt-6 space-y-8">
          {recall.map((r) => (
            <section key={r.slug}>
              <h2 className="font-semibold">
                <Link href={`/learn/${r.slug}`} className="hover:text-primary">
                  <span className="mr-2 font-mono text-muted-foreground">{r.number}</span>
                  {r.title}
                </Link>
              </h2>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-7">
                {r.prompts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function SampleMc() {
  const [choice, setChoice] = useState<number | null>(null)
  const mc = sampleMultipleChoice
  return (
    <section className="rounded-xl border p-5">
      <div className="text-xs text-muted-foreground">{mc.source}</div>
      <p className="mt-2 font-medium leading-7">{mc.stem}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {mc.options.map((o, i) => {
          const picked = choice === i
          const correct = i === mc.answer
          return (
            <button
              key={o}
              type="button"
              onClick={() => setChoice(i)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                choice !== null && correct && "border-emerald-500 bg-emerald-500/10",
                picked && !correct && "border-rose-500 bg-rose-500/10",
              )}
            >
              <span className="font-mono text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
              <span className="flex-1">{o}</span>
              {choice !== null && correct && <Check className="size-4 text-emerald-600" />}
              {picked && !correct && <X className="size-4 text-rose-600" />}
            </button>
          )
        })}
      </div>
      {choice !== null && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {mc.explanation} <ChapterLink number={mc.chapter} />
        </p>
      )}
    </section>
  )
}
