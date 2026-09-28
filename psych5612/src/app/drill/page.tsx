import type { Metadata } from "next"
import { Suspense } from "react"

import { Drills } from "@/components/drills"
import { getAllChapters } from "@/lib/content"

export const metadata: Metadata = { title: "Drills & mistakes" }

export default function DrillPage() {
  const recall = getAllChapters()
    .filter((c) => c.recall.length > 0)
    .map((c) => ({ slug: c.slug, number: c.number, title: c.shortTitle, prompts: c.recall }))

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Drills & mistakes</h1>
        <p className="leading-7 text-muted-foreground">
          Retrieval practice from the guide. Producing an answer unaided is stronger evidence of readiness than
          recognizing it. When you miss an item, return to the exact chapter rather than rereading everything.
        </p>
      </header>
      <Suspense>
        <Drills recall={recall} />
      </Suspense>
    </div>
  )
}
