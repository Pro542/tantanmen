import type { CashPosition } from '#/data/finance'
import { formatCurrencyShort } from '#/data/finance'

interface AreaChartProps {
  data: CashPosition[]
}

const W = 700
const H = 200
const PAD = { top: 20, right: 20, bottom: 30, left: 72 }
const CHART_W = W - PAD.left - PAD.right
const CHART_H = H - PAD.top - PAD.bottom
const TICK_COUNT = 4

export function AreaChart({ data }: AreaChartProps) {
  const maxVal = Math.max(...data.map((d) => d.balance)) * 1.1
  const minVal = Math.min(...data.map((d) => d.balance)) * 0.9

  const range = maxVal - minVal
  const xPos = (i: number) => PAD.left + (i / (data.length - 1)) * CHART_W
  const yPos = (v: number) => PAD.top + CHART_H - ((v - minVal) / range) * CHART_H

  const points = data.map((d, i) => ({ x: xPos(i), y: yPos(d.balance) }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath =
    `M ${points[0]!.x} ${PAD.top + CHART_H} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1]!.x} ${PAD.top + CHART_H} Z`

  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => minVal + (range / TICK_COUNT) * (TICK_COUNT - i))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-label="Cash position area chart">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y ticks */}
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

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#6366f1" stroke="white" strokeWidth="1.5" />
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text
          key={d.month}
          x={xPos(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize="10"
          fill="#94a3b8"
        >
          {d.month}
        </text>
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
    </svg>
  )
}
