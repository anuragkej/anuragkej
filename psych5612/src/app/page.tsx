import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Countdown, RatingSummary, StudyPath } from "@/components/home-progress"
import { chapterByNumber, exam } from "@/content/course"
import { uncoveredTopics } from "@/content/drills"

const reviewSteps = [
  {
    title: "Reproduce Q9-20's definitions and diagrams",
    body: "Errors there often expose missing prerequisites.",
    href: "/questions",
    cta: "Question bank",
  },
  {
    title: "Answer Q1-8 and Q21-23",
    body: "Make every requested distinction.",
    href: "/questions",
    cta: "Question bank",
  },
  {
    title: "Finish with the extra-topics checklist and the nine people",
    body: "A bank-only cram can miss required multiple-choice material.",
    href: "/people",
    cta: "Hall of Fame",
  },
]

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">PSYCH 5612 · Introduction to Cognitive Science</span>
          <Countdown />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          Midterm 1: from the mind-body problem to universal computation and AI
        </h1>
        <p className="max-w-2xl leading-7 text-muted-foreground">
          Lectures 1-10, their required readings and videos, the L11 required-source summary, and the Gage/Zasetsky
          discussion materials. Required reading and video material is examinable even if not discussed in class.
        </p>
        <dl className="grid gap-4 border-y py-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">When</dt>
            <dd className="mt-1 font-medium">{exam.when}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Where</dt>
            <dd className="mt-1 font-medium">{exam.where}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Format</dt>
            <dd className="mt-1 font-medium">Closed book · 100 pts · MC + 7-10 short answer</dd>
          </div>
        </dl>
        <p className="text-sm text-muted-foreground">
          Bring {exam.bring.charAt(0).toLowerCase() + exam.bring.slice(1)}{" "}
          <Link href="/scope" className="underline underline-offset-4 hover:text-foreground">
            Full scope and easy-to-miss details
          </Link>
        </p>
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">Study path</h2>
          <p className="mt-1 mb-5 text-sm leading-6 text-muted-foreground">
            Follow the dependency chain. For each chapter, read the explanation, close it, explain the idea aloud, write or
            draw the requested answer, then check what you omitted.
          </p>
          <StudyPath />
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Question bank</h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">Your self-ratings. Click a number to jump to it.</p>
            <RatingSummary />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">Final review sequence</h2>
            <ol className="mt-4 space-y-4">
              {reviewSteps.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs">
                    {i + 1}
                  </span>
                  <div className="text-sm leading-6">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-muted-foreground">{s.body}</div>
                    <Link href={s.href} className="inline-flex items-center gap-1 text-primary hover:underline">
                      {s.cta}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-base font-semibold">Topics with no bank question</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {uncoveredTopics.map((t) => {
                const c = t.chapter === null ? null : chapterByNumber(t.chapter)
                return (
                  <li key={t.topic}>
                    <Link
                      href={c ? `/learn/${c.slug}` : "/people"}
                      className="flex justify-between gap-3 text-muted-foreground hover:text-foreground"
                    >
                      <span>{t.topic}</span>
                      <span className="font-mono text-xs">{c ? `Ch. ${c.number}` : "People"}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
