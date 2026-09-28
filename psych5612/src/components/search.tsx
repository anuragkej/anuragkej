"use client"

import { Search as SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"

export type SearchItem = { group: string; title: string; detail?: string; href: string }

export function Search({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const groups = [...new Set(items.map((i) => i.group))]

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full max-w-64 justify-start gap-2 text-muted-foreground"
      >
        <SearchIcon />
        <span className="flex-1 text-left">Search the guide</span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search the guide" description="Jump to a section, question, or person">
        <Command>
          <CommandInput placeholder="Try “register”, “Q16”, or “Zasetsky”" />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            {groups.map((g) => (
              <CommandGroup key={g} heading={g}>
                {items
                  .filter((i) => i.group === g)
                  .map((i) => (
                    <CommandItem
                      key={i.href + i.title}
                      value={`${i.title} ${i.detail ?? ""} ${i.group}`}
                      onSelect={() => {
                        setOpen(false)
                        router.push(i.href)
                      }}
                    >
                      <span className="truncate">{i.title}</span>
                      {i.detail && <span className="ml-auto truncate pl-3 text-xs text-muted-foreground">{i.detail}</span>}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
