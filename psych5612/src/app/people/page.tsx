import type { Metadata } from "next"

import { Markdown } from "@/components/markdown"
import { RevealRow } from "@/components/reveal-row"
import { getPeople, getVideoCoverage } from "@/lib/content"
import { slugify } from "@/lib/slug"

export const metadata: Metadata = { title: "Hall of Fame & videos" }

export default function PeoplePage() {
  const people = getPeople()
  const videos = getVideoCoverage()
  const tiers = [
    { depth: "paragraph" as const, title: "Write a paragraph", note: "Life and work, one paragraph each." },
    { depth: "sentences" as const, title: "Write a couple of sentences", note: "Name and contribution, two sentences each." },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Midterm 1 Hall of Fame</h1>
        <p className="leading-7 text-muted-foreground">
          The exam announcement names nine people. You do not have to memorize other names or publication years unless
          a question requires them.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">{videos.instruction}</p>
      </header>

      {tiers.map((tier) => (
        <section key={tier.depth} className="mb-10">
          <h2 className="text-lg font-semibold">{tier.title}</h2>
          <p className="text-sm text-muted-foreground">{tier.note} Write yours first, then open to compare.</p>
          <ul className="mt-2 divide-y">
            {people
              .filter((p) => p.depth === tier.depth)
              .map((p) => (
                <RevealRow
                  key={p.name}
                  id={slugify(p.name)}
                  ratingKey={`p:${p.name}`}
                  prompt={<span className="font-medium">{p.name}</span>}
                  answer={<Markdown>{p.text}</Markdown>}
                />
              ))}
          </ul>
        </section>
      ))}

      <section className="mb-10">
        <h2 id="videos" className="text-lg font-semibold">Required videos</h2>
        <p className="text-sm text-muted-foreground">
          Required video material is examinable even if not discussed in class.
        </p>
        <Markdown>{videos.index}</Markdown>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Tribute to Alan Turing: details and course connections</h2>
        <Markdown className="mt-3">{videos.tribute}</Markdown>
      </section>
    </div>
  )
}
