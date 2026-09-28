import type { Metadata } from "next"

import { Markdown } from "@/components/markdown"
import { QuestionBank } from "@/components/question-bank"
import { chapterForQuestion, questionGroups, questionPrompts } from "@/content/course"
import { getAnswerPreamble, getModelAnswers } from "@/lib/content"

export const metadata: Metadata = { title: "Question bank Q1-23" }

export default function QuestionsPage() {
  const answers = getModelAnswers()
  const groups = questionGroups.map((g) => ({
    title: g.title,
    questions: g.ids.map((id) => {
      const chapter = chapterForQuestion(id)
      return {
        id,
        title: answers[id].title,
        prompt: questionPrompts[id],
        answer: <Markdown>{answers[id].answer}</Markdown>,
        chapter: chapter ? { slug: chapter.slug, number: chapter.number, shortTitle: chapter.shortTitle } : null,
      }
    }),
  }))

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <header className="mb-6 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Question bank Q1-23</h1>
        <p className="leading-7 text-muted-foreground">
          The prompts are the current 2026S2 bank, word for word. Several of these will appear in the short-answer
          section of Midterm 1 (7-10 questions). The instructor may modify, combine, or split them.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">{getAnswerPreamble()}</p>
      </header>
      <QuestionBank groups={groups} />
    </div>
  )
}
