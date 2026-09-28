"use client"

import { BookOpenCheck, CircleCheck, Circle, House, Layers, ListChecks, ScrollText, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { chapters, parts } from "@/content/course"
import { useProgress } from "@/lib/progress"

const practice = [
  { href: "/questions", label: "Question bank Q1-23", icon: BookOpenCheck },
  { href: "/drill", label: "Drills & mistakes", icon: ListChecks },
  { href: "/people", label: "Hall of Fame & videos", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const progress = useProgress()
  const { setOpenMobile } = useSidebar()
  const studiedCount = chapters.filter((c) => progress.studied[c.slug]).length
  const ratedCount = Object.keys(progress.ratings).filter((k) => /^q\d+$/.test(k)).length
  const close = () => setOpenMobile(false)

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-4 pb-2">
        <Link href="/" onClick={close} className="block">
          <div className="font-mono text-xs tracking-wider text-muted-foreground">PSYCH 5612</div>
          <div className="text-base font-semibold">Midterm 1 study guide</div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/"} render={<Link href="/" onClick={close} />}>
                  <House />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/scope"} render={<Link href="/scope" onClick={close} />}>
                  <ScrollText />
                  <span>Exam scope & sources</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {parts.map((part) => (
          <SidebarGroup key={part.id}>
            <SidebarGroupLabel className="flex justify-between">
              <span>{part.title}</span>
              <span className="font-mono">{part.lectures}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chapters
                  .filter((c) => c.part === part.id)
                  .map((c) => {
                    const href = `/learn/${c.slug}`
                    const done = progress.studied[c.slug]
                    return (
                      <SidebarMenuItem key={c.slug}>
                        <SidebarMenuButton isActive={pathname === href} render={<Link href={href} onClick={close} />}>
                          {done ? <CircleCheck className="text-emerald-600 dark:text-emerald-400" /> : <Circle className="text-muted-foreground/50" />}
                          <span className="font-mono text-xs text-muted-foreground">{c.number}</span>
                          <span className="truncate">{c.shortTitle}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>
            <Layers className="mr-1 size-3.5" />
            Practice
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {practice.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href} render={<Link href={item.href} onClick={close} />}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-3 px-4 pb-4 text-xs text-muted-foreground">
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span>Chapters studied</span>
            <span className="font-mono">{studiedCount}/{chapters.length}</span>
          </div>
          <Progress value={(studiedCount / chapters.length) * 100} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span>Questions self-rated</span>
            <span className="font-mono">{ratedCount}/23</span>
          </div>
          <Progress value={(ratedCount / 23) * 100} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
