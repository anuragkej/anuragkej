import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MarkStudied, StudiedBadge } from "@/components/chapter-actions"
import { Markdown } from "@/components/markdown"
import { chapterBySlug, chapters } from "@/content/course"
import { getChapter } from "@/lib/content"

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const meta = chapterBySlug((await params).slug)
  return { title: meta ? `${meta.number}. ${meta.shortTitle}` : "Not found" }
}

export default async function ChapterPage({ params }: PageProps<"/learn/[slug]">) {
  const meta = chapterBySlug((await params).slug)
  if (!meta) notFound()
  const chapter = getChapter(meta)
  const index = chapters.indexOf(meta)
  const prev = chapters[index - 1]
  const next = chapters[index + 1]
  const recall = chapter.recall

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-12 px-5 py-10 sm:px-8">
      <article className="min-w-0 max-w-3xl flex-1">
        <header className="mb-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">Chapter {chapter.number}</span>
            <span aria-hidden>·</span>
            <span className="font-mono">{chapter.lectures}</span>
            <StudiedBadge slug={chapter.slug} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{chapter.title}</h1>
          {chapter.sources && <p className="text-sm text-muted-foreground">Sources: {chapter.sources}</p>}
          {chapter.questions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
              <span className="text-muted-foreground">Bank questions:</span>
              {chapter.questions.map((q) => (
                <Link
                  key={q}
                  href={`/questions#q${q}`}
                  className="rounded-md border px-2 py-0.5 font-mono text-xs hover:border-primary hover:text-primary"
                >
                  Q{q}
                </Link>
              ))}
            </div>
          )}
        </header>

        <Markdown>{chapter.markdown}</Markdown>

        {recall.length > 0 && (
          <section className="mt-14 rounded-xl border bg-muted/40 p-5">
            <h2 className="text-base font-semibold">Recall before moving on</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Close the page and produce each of these from memory, then check what you omitted.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-[0.95rem] leading-7">
              {recall.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <MarkStudied slug={chapter.slug} />
          <nav className="flex gap-2 text-sm">
            {prev && (
              <Link href={`/learn/${prev.slug}`} className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-muted">
                <ArrowLeft className="size-4" />
                {prev.number}. {prev.shortTitle}
              </Link>
            )}
            {next && (
              <Link href={`/learn/${next.slug}`} className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-muted">
                {next.number}. {next.shortTitle}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </nav>
        </div>
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <nav className="sticky top-24 space-y-1 text-sm">
          <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</div>
          {chapter.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="block py-1 leading-snug text-muted-foreground hover:text-foreground">
              {s.title}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}
