import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"

import { AppSidebar } from "@/components/app-sidebar"
import { Search, type SearchItem } from "@/components/search"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { distinctions, mistakes, practiceTasks } from "@/content/drills"
import { getAllChapters, getModelAnswers, getPeople } from "@/lib/content"
import { slugify } from "@/lib/slug"

import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "PSYCH 5612 · Midterm 1", template: "%s · PSYCH 5612" },
  description: "Study guide for PSYCH 5612 Midterm 1, built from the course master study guide.",
}

function searchItems(): SearchItem[] {
  const chapters = getAllChapters()
  const answers = getModelAnswers()
  return [
    ...chapters.map((c) => ({ group: "Chapters", title: `${c.number}. ${c.title}`, detail: c.lectures, href: `/learn/${c.slug}` })),
    ...chapters.flatMap((c) =>
      c.sections.map((s) => ({ group: "Sections", title: s.title, detail: `Ch. ${c.number}`, href: `/learn/${c.slug}#${s.id}` })),
    ),
    ...Object.values(answers).map((a) => ({ group: "Question bank", title: `Q${a.id}. ${a.title}`, href: `/questions#q${a.id}` })),
    ...getPeople().map((p) => ({ group: "People", title: p.name, href: `/people#${slugify(p.name)}` })),
    ...distinctions.map((d) => ({ group: "Drills", title: d.pair, detail: "Distinction", href: "/drill?tab=distinctions" })),
    ...practiceTasks.map((t, i) => ({ group: "Drills", title: t.task, detail: `Task ${i + 1}`, href: "/drill?tab=tasks" })),
    ...mistakes.map((m) => ({ group: "Drills", title: m.mistake, detail: "Mistake", href: "/drill?tab=mistakes" })),
  ]
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur">
                  <SidebarTrigger />
                  <div className="flex flex-1 justify-center">
                    <Search items={searchItems()} />
                  </div>
                  <ThemeToggle />
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
