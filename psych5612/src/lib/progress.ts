"use client"

import { useSyncExternalStore } from "react"

export type Rating = "got" | "shaky" | "missed"

export type Progress = {
  studied: Record<string, true>
  ratings: Record<string, Rating>
  drafts: Record<string, string>
}

const KEY = "psych5612-progress-v1"
const empty: Progress = { studied: {}, ratings: {}, drafts: {} }

let cache: Progress | null = null
const listeners = new Set<() => void>()

function read(): Progress {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    cache = raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    cache = empty
  }
  return cache!
}

function write(next: Progress) {
  cache = next
  window.localStorage.setItem(KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    cache = null
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function useProgress() {
  return useSyncExternalStore(subscribe, read, () => empty)
}

export function toggleStudied(slug: string) {
  const p = read()
  const studied = { ...p.studied }
  if (studied[slug]) delete studied[slug]
  else studied[slug] = true
  write({ ...p, studied })
}

export function setRating(key: string, rating: Rating | null) {
  const p = read()
  const ratings = { ...p.ratings }
  if (rating) ratings[key] = rating
  else delete ratings[key]
  write({ ...p, ratings })
}

export function setDraft(key: string, text: string) {
  const p = read()
  write({ ...p, drafts: { ...p.drafts, [key]: text } })
}

export function resetProgress() {
  write(empty)
}

export const ratingMeta: Record<Rating, { label: string; className: string }> = {
  got: { label: "Got it", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  shaky: { label: "Shaky", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  missed: { label: "Missed", className: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
}
