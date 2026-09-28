"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const VOL = 0.1
const VIL = 0.3
const VIH = 0.7
const VOH = 0.9

type Interpretation = "low" | "undefined" | "high"

function interpret(volts: number): Interpretation {
  if (volts <= VIL) return "low"
  if (volts >= VIH) return "high"
  return "undefined"
}

const READOUT: Record<
  Interpretation,
  { input: string; output: string; tone: string }
> = {
  low: {
    input: "valid LOW",
    output: "buffer drives ≤ 0.1 V (logical 0, margin restored)",
    tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  undefined: {
    input: "undefined: no guaranteed Boolean interpretation",
    output: "no logical guarantee",
    tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  high: {
    input: "valid HIGH",
    output: "buffer drives ≥ 0.9 V (logical 1, margin restored)",
    tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
}

const PRESETS = [
  { volts: 0.75, label: "0.75 V · 0.9 V HIGH that lost 0.15 V" },
  { volts: 0.5, label: "0.5 V" },
  { volts: 0.2, label: "0.2 V" },
] as const

const TOP = 30
const HEIGHT = 240
const AXIS_X = 50
const SENDER = { x: 58, width: 70 }
const RECEIVER = { x: 208, width: 80 }
const GAP_X = SENDER.x + SENDER.width
const MARGIN_X = (GAP_X + RECEIVER.x) / 2 + 4

function y(volts: number) {
  return TOP + (1 - volts) * HEIGHT
}

const TICKS = [
  { volts: 1, label: "1.0" },
  { volts: VOH, label: "VOH 0.9" },
  { volts: VIH, label: "VIH 0.7" },
  { volts: 0.5, label: "0.5" },
  { volts: VIL, label: "VIL 0.3" },
  { volts: VOL, label: "VOL 0.1" },
  { volts: 0, label: "0.0" },
] as const

function Band({
  x,
  width,
  from,
  to,
  label,
  className,
}: {
  x: number
  width: number
  from: number
  to: number
  label: string
  className: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y(to)}
        width={width}
        height={y(from) - y(to)}
        className={cn("stroke-border", className)}
      />
      <text
        x={x + width / 2}
        y={(y(from) + y(to)) / 2 + 3}
        textAnchor="middle"
        className="fill-foreground text-[9px]"
      >
        {label}
      </text>
    </g>
  )
}

function MarginBracket({
  from,
  to,
  label,
}: {
  from: number
  to: number
  label: string
}) {
  const top = y(to)
  const bottom = y(from)
  return (
    <g>
      <rect
        x={GAP_X}
        y={top}
        width={RECEIVER.x - GAP_X}
        height={bottom - top}
        className="fill-muted"
      />
      <path
        d={`M${GAP_X + 9} ${top + 1} H${GAP_X + 4} V${bottom - 1} H${GAP_X + 9}`}
        className="fill-none stroke-muted-foreground"
      />
      <text
        x={MARGIN_X}
        y={(top + bottom) / 2 - 2}
        textAnchor="middle"
        className="fill-foreground text-[9px]"
      >
        {label}
      </text>
      <text
        x={MARGIN_X}
        y={(top + bottom) / 2 + 9}
        textAnchor="middle"
        className="fill-foreground font-mono text-[9px]"
      >
        0.2 V
      </text>
    </g>
  )
}

function VoltageDiagram({ volts }: { volts: number }) {
  return (
    <svg
      viewBox="0 0 296 285"
      role="img"
      aria-label={`Voltage axis from 0 to 1 V. Sender output guarantees LOW 0 to 0.1 V and HIGH 0.9 to 1.0 V. Receiver input reads valid LOW 0 to 0.3 V, undefined 0.3 to 0.7 V, valid HIGH 0.7 to 1.0 V. Marker at ${volts.toFixed(2)} V.`}
      className="h-auto w-full"
    >
      <text
        x={SENDER.x + SENDER.width / 2}
        y={16}
        textAnchor="middle"
        className="fill-foreground text-[10px] font-medium"
      >
        Sender output
      </text>
      <text
        x={RECEIVER.x + RECEIVER.width / 2}
        y={16}
        textAnchor="middle"
        className="fill-foreground text-[10px] font-medium"
      >
        Receiver input
      </text>

      <line
        x1={AXIS_X}
        x2={AXIS_X}
        y1={y(1)}
        y2={y(0)}
        className="stroke-muted-foreground"
      />
      {TICKS.map((tick) => (
        <g key={tick.label}>
          <line
            x1={AXIS_X - 3}
            x2={RECEIVER.x + RECEIVER.width}
            y1={y(tick.volts)}
            y2={y(tick.volts)}
            strokeDasharray="2 3"
            className="stroke-border"
          />
          <text
            x={AXIS_X - 5}
            y={y(tick.volts) + 3}
            textAnchor="end"
            className="fill-muted-foreground font-mono text-[9px]"
          >
            {tick.label}
          </text>
        </g>
      ))}

      <rect
        x={SENDER.x}
        y={y(VOH)}
        width={SENDER.width}
        height={y(VOL) - y(VOH)}
        strokeDasharray="3 3"
        className="fill-none stroke-border"
      />
      <Band
        {...SENDER}
        from={VOH}
        to={1}
        label="HIGH output"
        className="fill-emerald-500/20"
      />
      <Band
        {...SENDER}
        from={0}
        to={VOL}
        label="LOW output"
        className="fill-rose-500/20"
      />

      <MarginBracket from={VIH} to={VOH} label="HIGH margin" />
      <MarginBracket from={VOL} to={VIL} label="LOW margin" />

      <Band
        {...RECEIVER}
        from={VIH}
        to={1}
        label="valid HIGH"
        className="fill-emerald-500/20"
      />
      <Band
        {...RECEIVER}
        from={VIL}
        to={VIH}
        label="undefined"
        className="fill-amber-500/20"
      />
      <Band
        {...RECEIVER}
        from={0}
        to={VIL}
        label="valid LOW"
        className="fill-rose-500/20"
      />

      <line
        x1={AXIS_X}
        x2={RECEIVER.x + RECEIVER.width}
        y1={y(volts)}
        y2={y(volts)}
        strokeWidth={2}
        className="stroke-primary"
      />
      <path
        d={`M${AXIS_X} ${y(volts)} l-7 -5 v10 z`}
        className="fill-primary"
      />
    </svg>
  )
}

export function NoiseMargins() {
  const sliderId = useId()
  const [volts, setVolts] = useState(0.75)
  const readout = READOUT[interpret(volts)]

  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,17rem)_1fr] sm:items-center">
        <VoltageDiagram volts={volts} />
        <div className="flex flex-col gap-3 text-sm">
          <label htmlFor={sliderId} className="flex flex-col gap-1.5">
            <span>
              Voltage arriving at a buffer input:{" "}
              <span className="font-mono font-medium">
                {volts.toFixed(2)} V
              </span>
            </span>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volts}
              onChange={(event) => setVolts(Number(event.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <Button
                key={preset.volts}
                size="sm"
                variant={volts === preset.volts ? "default" : "outline"}
                onClick={() => setVolts(preset.volts)}
                className="font-mono"
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <dl className="grid gap-2" aria-live="polite">
            <div className={cn("rounded-lg px-3 py-2", readout.tone)}>
              <dt className="text-xs opacity-80">Interpreted input</dt>
              <dd className="font-medium">{readout.input}</dd>
            </div>
            <div className="rounded-lg bg-muted px-3 py-2">
              <dt className="text-xs text-muted-foreground">Buffer output</dt>
              <dd className="font-medium">{readout.output}</dd>
            </div>
          </dl>
          <p className="font-mono text-xs text-muted-foreground">
            LOW margin = VIL − VOL = 0.2 V · HIGH margin = VOH − VIH = 0.2 V
          </p>
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        Practice values, not the course&apos;s fixed hardware parameters. A
        buffer restores output margins while preserving a valid logical value.
      </figcaption>
    </figure>
  )
}
