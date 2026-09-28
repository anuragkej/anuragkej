"use client"

import { useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Bit = 0 | 1
type Inputs = { a: Bit; b: Bit }

const toBit = (value: boolean): Bit => (value ? 1 : 0)

const flip = (bit: Bit): Bit => (bit === 1 ? 0 : 1)
const and = (a: Bit, b: Bit) => toBit(a === 1 && b === 1)
const or = (a: Bit, b: Bit) => toBit(a === 1 || b === 1)
const xor = (a: Bit, b: Bit) => toBit(a !== b)

const GATES = [
  { name: "AND", apply: and },
  { name: "OR", apply: or },
  { name: "XOR", apply: xor },
  { name: "NAND", apply: (a: Bit, b: Bit) => flip(and(a, b)) },
  { name: "NOR", apply: (a: Bit, b: Bit) => flip(or(a, b)) },
  { name: "XNOR", apply: (a: Bit, b: Bit) => flip(xor(a, b)) },
] as const

const ROWS: readonly Inputs[] = [
  { a: 0, b: 0 },
  { a: 0, b: 1 },
  { a: 1, b: 0 },
  { a: 1, b: 1 },
]

function halfAdder({ a, b }: Inputs) {
  return { sum: xor(a, b), carry: and(a, b) }
}

function InputPill({
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
      aria-label={`Input ${name}`}
      onClick={onFlip}
      className="rounded-full px-3 font-mono"
    >
      {name} = {value}
    </Button>
  )
}

export function GateExplorer() {
  const [inputs, setInputs] = useState<Inputs>({ a: 0, b: 0 })
  const { sum, carry } = halfAdder(inputs)

  function selectOnKey(event: KeyboardEvent, row: Inputs) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setInputs(row)
    }
  }

  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <InputPill
          name="A"
          value={inputs.a}
          onFlip={() => setInputs((prev) => ({ ...prev, a: flip(prev.a) }))}
        />
        <InputPill
          name="B"
          value={inputs.b}
          onFlip={() => setInputs((prev) => ({ ...prev, b: flip(prev.b) }))}
        />
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-center font-mono text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-2 py-1.5 font-medium">A</th>
              <th className="px-2 py-1.5 font-medium">B</th>
              {GATES.map((gate) => (
                <th key={gate.name} className="px-2 py-1.5 font-medium">
                  {gate.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const selected = row.a === inputs.a && row.b === inputs.b
              return (
                <tr
                  key={`${row.a}${row.b}`}
                  tabIndex={0}
                  aria-selected={selected}
                  aria-label={`Set A = ${row.a}, B = ${row.b}`}
                  onClick={() => setInputs(row)}
                  onKeyDown={(event) => selectOnKey(event, row)}
                  className={cn(
                    "cursor-pointer border-b outline-none last:border-b-0 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "bg-primary/10 hover:bg-primary/10"
                  )}
                >
                  <td className="px-2 py-1.5">{row.a}</td>
                  <td className="px-2 py-1.5">{row.b}</td>
                  {GATES.map((gate) => {
                    const out = gate.apply(row.a, row.b)
                    return (
                      <td key={gate.name} className="px-1 py-1">
                        <span
                          className={cn(
                            "inline-flex min-w-7 justify-center rounded-md px-1.5 py-0.5",
                            out === 1
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "text-muted-foreground"
                          )}
                        >
                          {out}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div
        className="mt-3 grid gap-1 rounded-lg bg-muted px-3 py-2 font-mono text-sm"
        aria-live="polite"
      >
        <p>Sum S = A XOR B = {sum}</p>
        <p>Carry C = A AND B = {carry}</p>
        <p>
          A + B = 2C + S → {inputs.a} + {inputs.b} = 2·{carry} + {sum}
        </p>
      </div>

      <figcaption className="mt-4 text-sm text-muted-foreground">
        XOR is true for two inputs when they differ. A half-adder adds two
        bits: S = A XOR B, C = A AND B. For 1 + 1 the result is binary 10:
        carry 1, sum 0.
      </figcaption>
    </figure>
  )
}
