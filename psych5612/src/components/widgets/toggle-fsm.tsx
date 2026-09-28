"use client"

import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Bit = 0 | 1
type State = "OFF" | "ON"
type Step = { x: Bit; q: State }
type Machine = { trace: Step[]; pending: Bit[] }

const STATE_BIT: Record<State, Bit> = { OFF: 0, ON: 1 }
const BIT_STATE: Record<Bit, State> = { 0: "OFF", 1: "ON" }

const RESET_STATE: State = "OFF"
const DEMO_INPUTS: readonly Bit[] = [1, 0, 1, 1]
const DEMO_STEP_MS = 500
const TRACE_LENGTH = 10

function nextState(q: State, x: Bit): State {
  return BIT_STATE[STATE_BIT[q] === x ? 0 : 1]
}

function currentState(trace: readonly Step[]): State {
  return trace.at(-1)?.q ?? RESET_STATE
}

function applyInput(trace: readonly Step[], x: Bit): Step[] {
  return [...trace, { x, q: nextState(currentState(trace), x) }]
}

function applyPending(machine: Machine): Machine {
  const [x, ...rest] = machine.pending
  if (x === undefined) return machine
  return { trace: applyInput(machine.trace, x), pending: rest }
}

const RESET: Machine = { trace: [], pending: [] }

type EdgeId = "reset" | "OFF-0" | "OFF-1" | "ON-0" | "ON-1"

function lastEdge(trace: readonly Step[]): EdgeId {
  const last = trace.at(-1)
  if (last === undefined) return "reset"
  const from = trace.at(-2)?.q ?? RESET_STATE
  return `${from}-${last.x}`
}

const POSITIONS: Record<State, { x: number; y: number }> = {
  OFF: { x: 120, y: 100 },
  ON: { x: 290, y: 100 },
}

const EDGES: readonly {
  id: EdgeId
  path: string
  label: string
  labelAt: { x: number; y: number }
}[] = [
  { id: "reset", path: "M28 100 H84", label: "reset", labelAt: { x: 50, y: 92 } },
  {
    id: "OFF-0",
    path: "M105.6 69.2 C90 22, 150 22, 134.4 69.2",
    label: "x=0",
    labelAt: { x: 120, y: 26 },
  },
  {
    id: "ON-0",
    path: "M275.6 69.2 C260 22, 320 22, 304.4 69.2",
    label: "x=0",
    labelAt: { x: 290, y: 26 },
  },
  {
    id: "OFF-1",
    path: "M150 82 Q205 45 260 82",
    label: "x=1",
    labelAt: { x: 205, y: 56 },
  },
  {
    id: "ON-1",
    path: "M260 118 Q205 155 150 118",
    label: "x=1",
    labelAt: { x: 205, y: 154 },
  },
]

const STATES: readonly State[] = ["OFF", "ON"]

function ToggleDiagram({
  current,
  active,
}: {
  current: State
  active: EdgeId
}) {
  const markerId = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  return (
    <svg
      viewBox="0 0 360 170"
      role="img"
      aria-label={`Toggle FSM diagram with states OFF (y=0) and ON (y=1). x=0 keeps the state, x=1 switches it, reset selects OFF. Current state ${current}.`}
      className="h-auto w-full max-w-[400px]"
    >
      <defs>
        {(["idle", "active"] as const).map((kind) => (
          <marker
            key={kind}
            id={`${markerId}-${kind}`}
            viewBox="0 0 8 8"
            refX={7}
            refY={4}
            markerWidth={8}
            markerHeight={8}
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path
              d="M0 0 L8 4 L0 8 z"
              className={
                kind === "active" ? "fill-primary" : "fill-muted-foreground"
              }
            />
          </marker>
        ))}
      </defs>

      {EDGES.map((edge) => {
        const isActive = edge.id === active
        return (
          <g key={edge.id}>
            <path
              d={edge.path}
              markerEnd={`url(#${markerId}-${isActive ? "active" : "idle"})`}
              className={cn(
                "fill-none",
                isActive
                  ? "stroke-primary stroke-[2.5]"
                  : "stroke-muted-foreground stroke-[1.5]"
              )}
            />
            <text
              x={edge.labelAt.x}
              y={edge.labelAt.y}
              textAnchor="middle"
              className={cn(
                "font-mono text-[11px]",
                isActive ? "fill-primary font-semibold" : "fill-foreground"
              )}
            >
              {edge.label}
            </text>
          </g>
        )
      })}

      {STATES.map((state) => {
        const { x, y } = POSITIONS[state]
        const isCurrent = state === current
        return (
          <g key={state}>
            <circle
              cx={x}
              cy={y}
              r={34}
              className={cn(
                isCurrent
                  ? "fill-primary/15 stroke-primary stroke-[3]"
                  : "fill-muted stroke-muted-foreground stroke-1"
              )}
            />
            <text
              x={x}
              y={y - 2}
              textAnchor="middle"
              className="fill-foreground font-mono text-[14px] font-semibold"
            >
              {state}
            </text>
            <text
              x={x}
              y={y + 14}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[10px]"
            >
              y={STATE_BIT[state]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function ToggleFsm() {
  const [machine, setMachine] = useState<Machine>(RESET)
  const current = currentState(machine.trace)
  const running = machine.pending.length > 0
  const visibleSteps = machine.trace.slice(-TRACE_LENGTH)
  const hiddenSteps = machine.trace.length - visibleSteps.length

  useEffect(() => {
    if (machine.pending.length === 0) return
    const timer = setTimeout(
      () => setMachine((prev) => applyPending(prev)),
      DEMO_STEP_MS
    )
    return () => clearTimeout(timer)
  }, [machine.pending])

  function input(x: Bit) {
    setMachine((prev) => ({ ...prev, trace: applyInput(prev.trace, x) }))
  }

  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col items-center gap-3">
        <ToggleDiagram current={current} active={lastEdge(machine.trace)} />
        <p className="text-sm">
          This FSM has 2 states.{" "}
          <span className="text-muted-foreground">Current:</span>{" "}
          <span className="font-mono font-semibold">
            {current} (y={STATE_BIT[current]})
          </span>
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={running}
            onClick={() => input(0)}
            className="font-mono"
          >
            Input x = 0
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={running}
            onClick={() => input(1)}
            className="font-mono"
          >
            Input x = 1
          </Button>
          <Button
            size="sm"
            disabled={running}
            onClick={() => setMachine({ trace: [], pending: [...DEMO_INPUTS] })}
            className="font-mono"
          >
            Run 1, 0, 1, 1
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMachine(RESET)}>
            Reset
          </Button>
        </div>
        <ol
          aria-label="Trace of inputs and states"
          aria-live="polite"
          className="flex min-h-9 w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-muted px-3 py-2 font-mono text-xs"
        >
          <li className="text-muted-foreground">
            {hiddenSteps > 0 ? `… ${hiddenSteps} earlier` : `reset → ${RESET_STATE}`}
          </li>
          {visibleSteps.map((step, index) => (
            <li
              key={hiddenSteps + index}
              className={cn(
                index === visibleSteps.length - 1
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              x={step.x} → {step.q}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        Practice example created for the study guide. q_next = q XOR x; output
        y = q. Count circles, not arrows, to count states.
      </figcaption>
    </figure>
  )
}
