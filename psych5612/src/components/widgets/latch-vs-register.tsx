"use client"

import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"

type Bit = 0 | 1

const CLK: readonly Bit[] = [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0]
const INITIAL_D: readonly Bit[] = [
  0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
]
const INITIAL_Q: Bit = 0

const isRisingEdge = (t: number) => CLK[t] === 1 && (CLK[t - 1] ?? 0) === 0
const RISING_EDGES = CLK.flatMap((_, t) => (isRisingEdge(t) ? [t] : []))

function sampleWhen(
  d: readonly Bit[],
  samples: (t: number) => boolean
): Bit[] {
  const q: Bit[] = []
  d.forEach((bit, t) => q.push(samples(t) ? bit : (q[t - 1] ?? INITIAL_Q)))
  return q
}

const latchQ = (d: readonly Bit[]) => sampleWhen(d, (t) => CLK[t] === 1)
const registerQ = (d: readonly Bit[]) => sampleWhen(d, isRisingEdge)

const STEP_W = 30
const STRIP_W = CLK.length * STEP_W
const STRIP_H = 30
const HIGH_Y = 5
const LOW_Y = 25

const level = (bit: Bit) => (bit === 1 ? HIGH_Y : LOW_Y)

function wavePath(bits: readonly Bit[]) {
  return bits.reduce(
    (d, bit, t) =>
      `${d}${t > 0 && bit !== bits[t - 1] ? ` V${level(bit)}` : ""} H${(t + 1) * STEP_W}`,
    `M0 ${level(bits[0] ?? 0)}`
  )
}

function Waveform({ bits, label }: { bits: readonly Bit[]; label: string }) {
  return (
    <svg
      viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
      role="img"
      aria-label={`${label}: ${bits.join(" ")}`}
      className="block h-auto w-full"
    >
      {bits.map((bit, t) => (
        <g key={t}>
          <line
            x1={t * STEP_W}
            x2={t * STEP_W}
            y1={0}
            y2={STRIP_H}
            className="stroke-border"
          />
          {bit === 1 && (
            <rect
              x={t * STEP_W}
              y={HIGH_Y}
              width={STEP_W}
              height={LOW_Y - HIGH_Y}
              className="fill-emerald-500/15"
            />
          )}
        </g>
      ))}
      {RISING_EDGES.map((t) => (
        <line
          key={t}
          x1={t * STEP_W}
          x2={t * STEP_W}
          y1={0}
          y2={STRIP_H}
          strokeDasharray="3 3"
          strokeWidth={1.5}
          className="stroke-primary"
        />
      ))}
      <path
        d={wavePath(bits)}
        strokeWidth={2}
        className="fill-none stroke-foreground"
      />
    </svg>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

const LATCH_LABEL = "Latch Q (transparent while CLK = 1 in this sketch)"
const REGISTER_LABEL = "Register Q (captures on rising edge)"

export function LatchVsRegister() {
  const [d, setD] = useState<readonly Bit[]>(INITIAL_D)

  function flipAt(step: number) {
    setD((prev) =>
      prev.map((bit, t): Bit => (t === step ? (bit === 1 ? 0 : 1) : bit))
    )
  }

  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-2">
        <Row label="CLK">
          <Waveform bits={CLK} label="CLK" />
        </Row>
        <Row label="D (click a step to flip it)">
          <div className="relative">
            <Waveform bits={d} label="D" />
            <div className="absolute inset-0 grid grid-cols-16">
              {d.map((bit, t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`D at step ${t} is ${bit}. Flip to ${bit === 1 ? 0 : 1}`}
                  onClick={() => flipAt(t)}
                  className="cursor-pointer rounded-sm outline-none hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring"
                />
              ))}
            </div>
          </div>
        </Row>
        <Row label={LATCH_LABEL}>
          <Waveform bits={latchQ(d)} label={LATCH_LABEL} />
        </Row>
        <Row label={REGISTER_LABEL}>
          <Waveform bits={registerQ(d)} label={REGISTER_LABEL} />
        </Row>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg viewBox="0 0 10 16" aria-hidden="true" className="h-4 w-2.5">
            <line
              x1={5}
              x2={5}
              y1={0}
              y2={16}
              strokeDasharray="3 3"
              strokeWidth={1.5}
              className="stroke-primary"
            />
          </svg>
          rising edges (steps {RISING_EDGES.join(" and ")})
        </p>
        <Button size="sm" variant="outline" onClick={() => setD(INITIAL_D)}>
          Reset pattern
        </Button>
      </div>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        A latch is level-sensitive: during its transparent phase, changes in
        input pass through. A register captures its data input on the rising
        clock edge and retains it between rising edges, provided setup/hold
        timing is met. Do not say it changes for the whole time the clock is
        HIGH.
      </figcaption>
    </figure>
  )
}
