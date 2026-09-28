const EDGE_X = 240
const SETUP_START = 170
const HOLD_END = 310
const DATA = { top: 34, bottom: 62, left: 50, right: 470, crossings: [90, 390] }
const CLK = { high: 128, low: 164, rise: EDGE_X, fall: 420 }
const DIMENSION_Y = 84

const dataMid = (DATA.top + DATA.bottom) / 2
const [firstCrossing, secondCrossing] = DATA.crossings
const half = 8

const DATA_SEGMENTS = [
  `M${DATA.left} ${DATA.top} H${firstCrossing - half} L${firstCrossing} ${dataMid} L${firstCrossing - half} ${DATA.bottom} H${DATA.left}`,
  `M${firstCrossing} ${dataMid} L${firstCrossing + half} ${DATA.top} H${secondCrossing - half} L${secondCrossing} ${dataMid} L${secondCrossing - half} ${DATA.bottom} H${firstCrossing + half} Z`,
  `M${DATA.right} ${DATA.top} H${secondCrossing + half} L${secondCrossing} ${dataMid} L${secondCrossing + half} ${DATA.bottom} H${DATA.right}`,
]

const CLK_PATH = `M${DATA.left} ${CLK.low} H${CLK.rise} V${CLK.high} H${CLK.fall} V${CLK.low} H${DATA.right}`

function Dimension({
  from,
  to,
  label,
}: {
  from: number
  to: number
  label: string
}) {
  return (
    <g>
      <path
        d={`M${from} ${DIMENSION_Y - 4} V${DIMENSION_Y + 4} M${from} ${DIMENSION_Y} H${to} M${to} ${DIMENSION_Y - 4} V${DIMENSION_Y + 4}`}
        className="fill-none stroke-foreground"
      />
      <text
        x={(from + to) / 2}
        y={DIMENSION_Y + 15}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-medium"
      >
        {label}
      </text>
    </g>
  )
}

export function SetupHold() {
  return (
    <figure className="not-prose my-8 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm font-medium">
        Capture requires a stable input around the edge
      </p>
      <svg
        viewBox="0 0 480 200"
        role="img"
        aria-label="Timing diagram. DATA changes well before and well after a CLK rising edge and is stable across a shaded aperture around the edge. The part of the aperture before the edge is the setup time; the part after is the hold time."
        className="mt-2 h-auto w-full"
      >
        <rect
          x={SETUP_START}
          y={22}
          width={HOLD_END - SETUP_START}
          height={156}
          className="fill-emerald-500/15"
        />
        <text
          x={(SETUP_START + HOLD_END) / 2}
          y={15}
          textAnchor="middle"
          className="fill-emerald-700 text-[11px] font-medium dark:fill-emerald-300"
        >
          stable aperture
        </text>

        <text
          x={DATA.left - 6}
          y={dataMid + 4}
          textAnchor="end"
          className="fill-foreground font-mono text-[11px]"
        >
          DATA
        </text>
        {DATA_SEGMENTS.map((d) => (
          <path
            key={d}
            d={d}
            strokeWidth={1.75}
            className="fill-none stroke-foreground"
          />
        ))}

        <Dimension from={SETUP_START} to={EDGE_X} label="setup time" />
        <Dimension from={EDGE_X} to={HOLD_END} label="hold time" />

        <text
          x={DATA.left - 6}
          y={(CLK.high + CLK.low) / 2 + 4}
          textAnchor="end"
          className="fill-foreground font-mono text-[11px]"
        >
          CLK
        </text>
        <path
          d={CLK_PATH}
          strokeWidth={1.75}
          className="fill-none stroke-foreground"
        />

        <line
          x1={EDGE_X}
          x2={EDGE_X}
          y1={22}
          y2={180}
          strokeDasharray="4 3"
          className="stroke-primary"
        />
        <text
          x={EDGE_X}
          y={194}
          textAnchor="middle"
          className="fill-primary text-[11px] font-medium"
        >
          rising edge
        </text>
      </svg>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        Setup time is the interval before the active edge during which the data
        input must be stable. Hold time is the interval after the edge during
        which it must remain stable. The aperture includes both.
      </figcaption>
    </figure>
  )
}
