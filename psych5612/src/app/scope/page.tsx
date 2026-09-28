import type { Metadata } from "next"

import { Markdown } from "@/components/markdown"
import { exam } from "@/content/course"
import { getGuideDoc, getSourceIndex } from "@/lib/content"

export const metadata: Metadata = { title: "Exam scope & sources" }

export default function ScopePage() {
  const scope = getGuideDoc(1)
  const audit = getGuideDoc(18)
  const contents = [
    ...scope.sections,
    ...audit.sections,
    { id: "source-appendix-index", title: "Source appendix index" },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-12 px-5 py-10 sm:px-8">
      <article className="min-w-0 max-w-3xl flex-1">
        <header className="mb-8 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Exam scope & sources</h1>
          <dl className="grid gap-x-6 gap-y-2 rounded-xl border p-5 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="text-muted-foreground">When</dt>
            <dd>{exam.when}</dd>
            <dt className="text-muted-foreground">Where</dt>
            <dd>{exam.where}</dd>
            <dt className="text-muted-foreground">Format</dt>
            <dd>{exam.format}</dd>
            <dt className="text-muted-foreground">Bring</dt>
            <dd>{exam.bring}</dd>
          </dl>
        </header>
        <Markdown>{scope.markdown}</Markdown>
        <h2 className="mt-16 mb-6 text-2xl font-semibold tracking-tight">Source audit and exact reading map</h2>
        <Markdown>{audit.markdown}</Markdown>
        <h2 id="source-appendix-index" className="mt-14 mb-4 scroll-mt-24 border-b pb-2 text-xl font-semibold tracking-tight">
          Source appendix index
        </h2>
        <Markdown>{getSourceIndex()}</Markdown>
      </article>
      <aside className="hidden w-56 shrink-0 xl:block">
        <nav className="sticky top-24 space-y-1 text-sm">
          <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</div>
          {contents.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="block py-1 leading-snug text-muted-foreground hover:text-foreground">
              {s.title}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}
