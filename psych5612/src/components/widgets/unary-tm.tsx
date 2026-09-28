"use client"

import { useEffect, useId, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type Cell = "1" | "blank"
type MachineState = "SCAN" | "HALT"
type Move = "R" | "none"
type Rule = { write: Cell; move: Move; next: MachineState }
type Config = {
  tape: readonly Cell[]
  head: number
  state: MachineState
  steps: number
}
type Run = { config: Config; applied: Cell | null }

const SCAN_RULES: Record<Cell, Rule> = {
  "1": { write: "1", move: "R", next: "SCAN" },
  blank: { write: "1", move: "none", next: "HALT" },
}

const RULE_ORDER: readonly Cell[] = ["1", "blank"]
const TAPE_LENGTH = 10
const N_CHOICES = [0, 1, 2, 3, 4, 5, 6] as const
const RUN_INTERVAL_MS = 400

function initialConfig(n: number): Config {
  return {
    tape: Array.from({ length: TAPE_LENGTH }, (_, i) => (i < n ? "1" : "blank")),
    head: 0,
    state: "SCAN",
    steps: 0,
  }
}

const HEAD_OFFSET: Record<Move, number> = { R: 1, none: 0 }

function step(run: Run): Run {
  const { config } = run
  switch (config.state) {
    case "HALT":
      return run
    case "SCAN": {
      const read = config.tape[config.head] ?? "blank"
      const rule = SCAN_RULES[read]
      return {
        config: {
          tape: config.tape.map((cell, i) =>
            i === config.head ? rule.write : cell
          ),
          head: config.head + HEAD_OFFSET[rule.move],
          state: rule.next,
          steps: config.steps + 1,
        },
        applied: read,
      }
    }
    default: {
      const unreachable: never = config.state
      return unreachable
    }
  }
}

const freshRun = (n: number): Run => ({ config: initialConfig(n), applied: null })

const showSymbol = (symbol: Cell) => (symbol === "1" ? "1" : "␣")
const showMove = (move: Move) => (move === "R" ? "Right" : "—")

export function UnaryTm() {
  const labelId = useId()
  const [n, setN] = useState(3)
  const [run, setRun] = useState<Run>(() => freshRun(3))
  const [running, setRunning] = useState(false)
  const { config, applied } = run
  const halted = config.state === "HALT"
  const autoStepping = running && !halted
  const marks = config.tape.filter((cell) => cell === "1").length

  useEffect(() => {
    if (!autoStepping) return
    const timer = setInterval(() => setRun(step), RUN_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [autoStepping])

  function reset(nextN: number) {
    setN(nextN)
    setRun(freshRun(nextN))
    setRunning(false)
  }

  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground" id={labelId}>
          Input n =
        </span>
        <ToggleGroup
          aria-labelledby={labelId}
          size="sm"
          variant="outline"
          spacing={1}
          value={[String(n)]}
          onValueChange={(value) => {
            const picked = N_CHOICES.find((choice) => String(choice) === value[0])
            if (picked !== undefined) reset(picked)
          }}
        >
          {N_CHOICES.map((choice) => (
            <ToggleGroupItem
              key={choice}
              value={String(choice)}
              aria-label={`n = ${choice}`}
              className="font-mono aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            >
              {choice}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="mt-4 overflow-x-auto">
        <ol
          aria-label={`Tape: ${config.tape.map(showSymbol).join(" ")}. Head at cell ${config.head}.`}
          className="grid w-max grid-cols-10 gap-1"
        >
          {config.tape.map((cell, i) => (
            <li key={i} className="flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-md border font-mono text-sm sm:size-9",
                  cell === "blank" && "text-muted-foreground",
                  i === config.head && "border-primary ring-2 ring-primary/40"
                )}
              >
                {showSymbol(cell)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "text-xs leading-none text-primary",
                  i !== config.head && "invisible"
                )}
              >
                ▲
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <Badge
          variant={halted ? "secondary" : "default"}
          className="font-mono"
        >
          {config.state}
        </Badge>
        <span className="font-mono text-muted-foreground">
          steps = {config.steps}
        </span>
        <div className="ml-auto flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={halted || autoStepping}
            onClick={() => setRun(step)}
          >
            Step
          </Button>
          <Button
            size="sm"
            disabled={halted || autoStepping}
            onClick={() => setRunning(true)}
          >
            Run
          </Button>
          <Button size="sm" variant="outline" onClick={() => reset(n)}>
            Reset
          </Button>
        </div>
      </div>

      <table className="mt-3 w-full border-collapse text-left font-mono text-xs">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="px-2 py-1 font-medium">State</th>
            <th className="px-2 py-1 font-medium">Read</th>
            <th className="px-2 py-1 font-medium">Write</th>
            <th className="px-2 py-1 font-medium">Move</th>
            <th className="px-2 py-1 font-medium">Next</th>
          </tr>
        </thead>
        <tbody>
          {RULE_ORDER.map((read) => {
            const rule = SCAN_RULES[read]
            return (
              <tr
                key={read}
                className={cn(
                  "border-b last:border-b-0",
                  applied === read && "bg-primary/10 font-semibold"
                )}
              >
                <td className="px-2 py-1">SCAN</td>
                <td className="px-2 py-1">{showSymbol(read)}</td>
                <td className="px-2 py-1">{showSymbol(rule.write)}</td>
                <td className="px-2 py-1">{showMove(rule.move)}</td>
                <td className="px-2 py-1">{rule.next}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div aria-live="polite" className="mt-3 min-h-10 text-sm">
        {halted && (
          <div className="rounded-lg bg-emerald-500/15 px-3 py-2 text-emerald-700 dark:text-emerald-300">
            <p>
              Halted. Tape reads n+1 marks: under unary encoding this computes
              n + 1.
            </p>
            <p className="font-mono text-xs">
              n = {n}, marks on tape = {marks}
            </p>
          </div>
        )}
      </div>

      <figcaption className="mt-4 text-sm text-muted-foreground">
        Practice TM created for the study guide. The same visible marks would
        mean something else under a different encoding: the lesson is the link
        among formal rule, step sequence, coding convention, and mathematical
        function.
      </figcaption>
    </figure>
  )
}
