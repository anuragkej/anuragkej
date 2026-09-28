import "server-only"

import fs from "node:fs"
import path from "node:path"

import { chapters, type ChapterMeta, type QuestionId } from "@/content/course"
import { slugify } from "@/lib/slug"

type GuideMeta = { number: number; title: string; sources: string; recall: string; sections: string[] }

const guideDir = path.join(process.cwd(), "src/content/guide")

const guideMeta: GuideMeta[] = JSON.parse(fs.readFileSync(path.join(guideDir, "meta.json"), "utf8"))

function readGuide(number: number) {
  return fs.readFileSync(path.join(guideDir, `${String(number).padStart(2, "0")}.md`), "utf8")
}

export type Section = { id: string; title: string }

export function sectionsOf(markdown: string): Section[] {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((m) => ({ id: slugify(m[1]), title: m[1] }))
}

function splitSections(markdown: string) {
  const parts = markdown.split(/^## /m)
  return {
    intro: parts[0].trim(),
    sections: parts.slice(1).map((part) => {
      const newline = part.indexOf("\n")
      return { title: part.slice(0, newline).trim(), body: part.slice(newline + 1).trim() }
    }),
  }
}

export type Chapter = ChapterMeta & { sources: string; recall: string[]; markdown: string; sections: Section[] }

export function getChapter(meta: ChapterMeta): Chapter {
  const markdown = readGuide(meta.number)
  const g = guideMeta.find((m) => m.number === meta.number)
  if (!g) throw new Error(`missing guide meta for chapter ${meta.number}`)
  return {
    ...meta,
    sources: g.sources.replace(/^Sources?:\s*/, ""),
    recall: g.recall.split(/(?<=\.)\s+(?=[A-Z])/).filter(Boolean),
    markdown,
    sections: sectionsOf(markdown),
  }
}

export function getAllChapters() {
  return chapters.map(getChapter)
}

export function getGuideDoc(number: number) {
  const markdown = readGuide(number)
  return { markdown, sections: sectionsOf(markdown) }
}

export function getSourceIndex() {
  return fs.readFileSync(path.join(guideDir, "source-index.md"), "utf8")
}

export type ModelAnswer = { id: QuestionId; title: string; answer: string }

export function getModelAnswers(): Record<QuestionId, ModelAnswer> {
  const { sections } = splitSections(readGuide(16))
  const answers: Record<QuestionId, ModelAnswer> = {}
  for (const s of sections) {
    const m = s.title.match(/^Q(\d+)\. (.+)$/)
    if (!m) throw new Error(`unexpected answer heading: ${s.title}`)
    const id = Number(m[1])
    answers[id] = { id, title: m[2], answer: s.body }
  }
  if (Object.keys(answers).length !== 23) throw new Error("expected 23 model answers")
  return answers
}

export function getAnswerPreamble() {
  return splitSections(readGuide(16)).intro
}

export type Person = { name: string; depth: "paragraph" | "sentences"; text: string }

export function getPeople(): Person[] {
  const { sections } = splitSections(readGuide(15))
  const people: Person[] = []
  for (const s of sections) {
    const para = s.title.match(/^(.+): paragraph-level preparation$/)
    if (para) {
      people.push({ name: para[1], depth: "paragraph", text: s.body })
      continue
    }
    if (s.title === "Two-sentence preparation for the other six names") {
      for (const block of s.body.split(/\n\n/)) {
        const m = block.match(/^\*\*(.+?):\*\* ([\s\S]+)$/)
        if (m) people.push({ name: m[1], depth: "sentences", text: m[2] })
      }
    }
  }
  const order = ["René Descartes", "Alan Turing", "Noam Chomsky"]
  return people.sort((a, b) => {
    const rank = (p: Person) => (p.depth === "paragraph" ? order.indexOf(p.name) : 10)
    return rank(a) - rank(b)
  })
}

export function getVideoCoverage() {
  const { sections } = splitSections(readGuide(15))
  const pick = (title: string) => {
    const s = sections.find((x) => x.title === title)
    if (!s) throw new Error(`missing section ${title}`)
    return s.body
  }
  const twoSentence = pick("Two-sentence preparation for the other six names")
  return {
    index: pick("Video index"),
    tribute: pick("Tribute details and how they connect to the course"),
    instruction: twoSentence.split(/\n\n/).filter((b) => !b.startsWith("**")).join("\n\n"),
  }
}
