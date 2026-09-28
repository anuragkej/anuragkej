"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Bit = 0 | 1
type State = "S0" | "S1" | "S2" | "S3"
type Light = "green" | "yellow" | "red"
type Sensors = { ta: Bit; tb: Bit }

type Edge = {
  from: State
  to: State
  label: string
  path: string
  labelAt: { x: number; y: number; anchor: "start" | "middle" | "end" }
}

const EDGES = {
  s0Stay: {
    from: "S0",
    to: "S0",
    label: "TA = 1",
    path: "M85.6 59.2 C70 12, 130 12, 114.4 59.2",
    labelAt: { x: 100, y: 16, anchor: "middle" },
  },
  s0Go: {
    from: "S0",
    to: "S1",
    label: "TA = 0",
    path: "M134 90 H266",
    labelAt: { x: 200, y: 83, anchor: "middle" },
  },
  s1Go: {
    from: "S1",
    to: "S2",
    label: "any",
    path: "M300 124 V181",
    labelAt: { x: 308, y: 156, anchor: "start" },
  },
  s2Stay: {
    from: "S2",
    to: "S2",
    label: "TB = 1",
    path: "M314.4 245.8 C330 293, 270 293, 285.6 245.8",
    labelAt: { x: 300, y: 300, anchor: "middle" },
  },
  s2Go: {
    from: "S2",
    to: "S3",
    label: "TB = 0",
    path: "M266 215 H134",
    labelAt: { x: 200, y: 231, anchor: "middle" },
  },
  s3Go: {
    from: "S3",
    to: "S0",
    label: "any",
    path: "M100 181 V124",
    labelAt: { x: 92, y: 156, anchor: "end" },
  },
} as const satisfies Record<string, Edge>

type EdgeId = keyof typeof EDGES

const TRANSITIONS: Record<State, (sensors: Sensors) => EdgeId> = {
  S0: ({ ta }) => (ta === 1 ? "s0Stay" : "s0Go"),
  S1: () => "s1Go",
  S2: ({ tb }) => (tb === 1 ? "s2Stay" : "s2Go"),
  S3: () => "s3Go",
}

const OUTPUTS: Record<State, { a: Light; b: Light }> = {
  S0: { a: "green", b: "red" },
  S1: { a: "yellow", b: "red" },
  S2: { a: "red", b: "green" },
  S3: { a: "red", b: "yellow" },
}

const NOTES: Record<State, string> = {
  S0: "Only TA matters for the next state",
  S1: "Sensors do not affect the next state",
  S2: "Only TB matters for the next state",
  S3: "Sensors do not affect the next state",
}

const RESET_STATE: State = "S0"
const TRACE_LENGTH = 8

const flip = (bit: Bit): Bit => (bit === 1 ? 0 : 1)

function currentState(trace: readonly EdgeId[]): State {
  const last = trace.at(-1)
  return last === undefined ? RESET_STATE : EDGES[last].to
}

function tick(trace: readonly EdgeId[], sensors: Sensors): EdgeId[] {
  const edge = TRANSITIONS[currentState(trace)](sensors)
  return [...trace, edge].slice(-TRACE_LENGTH)
}

function traceLine(edge: EdgeId) {
  const { from, to, label } = EDGES[edge]
  return `${from} --${label.replaceAll(" ", "")}--> ${to}`
}

const POSITIONS: Record<State, { x: number; y: number }> = {
  S0: { x: 100, y: 90 },
  S1: { x: 300, y: 90 },
  S2: { x: 300, y: 215 },
  S3: { x: 100, y: 215 },
}

const STATES: readonly State[] = ["S0", "S1", "S2", "S3"]

const LAMP_ON: Record<Light, string> = {
  red: "bg-rose-500",
  yellow: "bg-amber-400",
  green: "bg-emerald-500",
}

const LAMP_ORDER: readonly Light[] = ["red", "yellow", "green"]

function TrafficLight({ name, light }: { name: string; light: Light }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        role="img"
        aria-label={`Light ${name}: ${light}`}
        className="flex flex-col gap-1 rounded-md border bg-muted p-1.5"
      >
        {LAMP_ORDER.map((lamp) => (
          <span
            key={lamp}
            className={cn(
              "size-4 rounded-full",
              lamp === light ? LAMP_ON[lamp] : "bg-foreground/10"
            )}
          />
        ))}
      </div>
      <span className="font-mono text-xs whitespace-nowrap">
        {name}: {light}
      </span>
    </div>
  )
}

function StateDiagram({
  current,
  lastEdge,
}: {
  current: State
  lastEdge: EdgeId | undefined
}) {
  const markerId = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  return (
    <svg
      viewBox="0 0 400 305"
      role="img"
      aria-label={`Traffic-light state diagram. Current state ${current}.${lastEdge ? ` Last transition ${traceLine(lastEdge)}.` : ""}`}
      className="h-auto w-full max-w-[360px]"
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

      {Object.entries(EDGES).map(([id, edge]) => {
        const active = id === lastEdge
        return (
          <g key={id}>
            <path
              d={edge.path}
              markerEnd={`url(#${markerId}-${active ? "active" : "idle"})`}
              className={cn(
                "fill-none",
                active
                  ? "stroke-primary stroke-[2.5]"
                  : "stroke-muted-foreground stroke-[1.5]"
              )}
            />
            <text
              x={edge.labelAt.x}
              y={edge.labelAt.y}
              textAnchor={edge.labelAt.anchor}
              className={cn(
                "font-mono text-[11px]",
                active ? "fill-primary font-semibold" : "fill-foreground"
              )}
            >
              {edge.label}
            </text>
          </g>
        )
      })}

      {STATES.map((state) => {
        const { x, y } = POSITIONS[state]
        const active = state === current
        return (
          <g key={state}>
            <circle
              cx={x}
              cy={y}
              r={34}
              className={cn(
                active
                  ? "fill-primary/15 stroke-primary stroke-[3]"
                  : "fill-muted stroke-muted-foreground stroke-1"
              )}
            />
            <text
              x={x}
              y={y - 4}
              textAnchor="middle"
              className="fill-foreground font-mono text-[13px] font-semibold"
            >
              {state}
            </text>
            <text
              x={x}
              y={y + 9}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              A: {OUTPUTS[state].a}
            </text>
            <text
              x={x}
              y={y + 20}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              B: {OUTPUTS[state].b}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function SensorToggle({
  name,
  value,
  onFlip,
}: {
  name: string
  value: Bit
  onFlip: () => void
}) {
  return (
    <Button
      size="sm"
      variant={value === 1 ? "default" : "outline"}
      aria-pressed={value === 1}
      aria-label={`Sensor ${name}`}
      onClick={onFlip}
      className="rounded-full px-3 font-mono"
    >
      {name} = {value}
    </Button>
  )
}

export function TrafficFsm() {
  const [sensors, setSensors] = useState<Sensors>({ ta: 0, tb: 0 })
  const [trace, setTrace] = useState<EdgeId[]>([])
  const current = currentState(trace)
  const output = OUTPUTS[current]

  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <StateDiagram current={current} lastEdge={trace.at(-1)} />
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-wrap gap-1.5">
            <SensorToggle
              name="TA"
              value={sensors.ta}
              onFlip={() => setSensors((prev) => ({ ...prev, ta: flip(prev.ta) }))}
            />
            <SensorToggle
              name="TB"
              value={sensors.tb}
              onFlip={() => setSensors((prev) => ({ ...prev, tb: flip(prev.tb) }))}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              onClick={() => setTrace((prev) => tick(prev, sensors))}
            >
              Clock tick
            </Button>
            <Button size="sm" variant="outline" onClick={() => setTrace([])}>
              Reset
            </Button>
          </div>
          <div className="flex gap-4">
            <TrafficLight name="A" light={output.a} />
            <TrafficLight name="B" light={output.b} />
          </div>
          <p className="text-xs" aria-live="polite">
            <span className="font-mono font-semibold">{current}</span>:{" "}
            {NOTES[current]}
          </p>
          <ol
            aria-label="Trace of recent transitions"
            className="min-h-10 rounded-lg bg-muted px-3 py-2 font-mono text-xs leading-5"
          >
            {trace.length === 0 ? (
              <li className="text-muted-foreground">Reset → S0</li>
            ) : (
              trace.map((edge, index) => (
                <li
                  key={`${index}-${edge}`}
                  className={cn(
                    index === trace.length - 1
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {traceLine(edge)}
                </li>
              ))
            )}
          </ol>
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        Reset selects S0. The same pair of sensor values can produce different
        next states depending on current state, demonstrating the importance of
        memory. Original diagrams: L08 pp. 11-15.
      </figcaption>
    </figure>
  )
}
