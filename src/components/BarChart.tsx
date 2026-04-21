import type { MonthlyDataPoint } from '#/data/finance'
import { formatCurrencyShort } from '#/data/finance'

interface BarChartProps {
  data: MonthlyDataPoint[]
}

const W = 700
const H = 300
const PAD = { top: 20, right: 20, bottom: 40, left: 72 }
const CHART_W = W - PAD.left - PAD.right
const CHART_H = H - PAD.top - PAD.bottom
const TICK_COUNT = 5

export function BarChart({ data }: BarChartProps) {
  const maxVal = Math.max(...data.flatMap((d) => [d.inflow, d.outflow])) * 1.1
  const groupW = CHART_W / data.length
  const barW = Math.max(8, (groupW - 12) / 2)

  const barH = (v: number) => (v / maxVal) * CHART_H
  const barX1 = (i: number) => PAD.left + i * groupW + (groupW - barW * 2 - 3) / 2
  const barX2 = (i: number) => barX1(i) + barW + 3
  const barY = (v: number) => PAD.top + CHART_H - barH(v)

  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => (maxVal / TICK_COUNT) * (TICK_COUNT - i))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-label="Monthly cashflow bar chart">
      <defs>
        <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="1" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y-axis ticks */}
      {ticks.map((tick, i) => {
        const y = PAD.top + (i / TICK_COUNT) * CHART_H
        return (
          <g key={tick}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {formatCurrencyShort(tick)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => (
        <g key={d.month}>
          {/* Inflow bar */}
          <rect
            x={barX1(i)}
            y={barY(d.inflow)}
            width={barW}
            height={barH(d.inflow)}
            fill="url(#inflowGrad)"
            rx="2"
          />
          {/* Outflow bar */}
          <rect
            x={barX2(i)}
            y={barY(d.outflow)}
            width={barW}
            height={barH(d.outflow)}
            fill="url(#outflowGrad)"
            rx="2"
          />
          {/* X label */}
          <text
            x={PAD.left + i * groupW + groupW / 2}
            y={H - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#94a3b8"
          >
            {d.month}
          </text>
        </g>
      ))}

      {/* Axis line */}
      <line
        x1={PAD.left}
        y1={PAD.top + CHART_H}
        x2={W - PAD.right}
        y2={PAD.top + CHART_H}
        stroke="#e2e8f0"
        strokeWidth="1"
      />

      {/* Legend */}
      <g transform={`translate(${W - PAD.right - 130}, ${PAD.top})`}>
        <rect width="10" height="10" fill="#10b981" rx="2" />
        <text x="14" y="9" fontSize="10" fill="#64748b">Inflow</text>
        <rect x="60" width="10" height="10" fill="#f43f5e" rx="2" />
        <text x="74" y="9" fontSize="10" fill="#64748b">Outflow</text>
      </g>
    </svg>
  )
}
