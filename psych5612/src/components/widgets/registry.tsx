import type { ComponentType } from "react"

import { GateExplorer } from "./gate-explorer"
import { LatchVsRegister } from "./latch-vs-register"
import { NoiseMargins } from "./noise-margins"
import { SetupHold } from "./setup-hold"
import { ToggleFsm } from "./toggle-fsm"
import { TrafficFsm } from "./traffic-fsm"
import { UnaryTm } from "./unary-tm"

export const widgets = {
  "noise-margins": NoiseMargins,
  "gate-explorer": GateExplorer,
  "traffic-fsm": TrafficFsm,
  "toggle-fsm": ToggleFsm,
  "setup-hold": SetupHold,
  "latch-vs-register": LatchVsRegister,
  "unary-tm": UnaryTm,
} satisfies Record<string, ComponentType>

export type WidgetName = keyof typeof widgets

export function isWidgetName(name: string): name is WidgetName {
  return name in widgets
}
