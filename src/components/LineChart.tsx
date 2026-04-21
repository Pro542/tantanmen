import type { MonthlyDataPoint } from '#/data/finance'
import { formatCurrencyShort } from '#/data/finance'

interface LineChartProps {
  data: MonthlyDataPoint[]
}

const W = 700
const H = 240
const PAD = { top: 20, right: 20, bottom: 36, left: 72 }
const CHART_W = W - PAD.left - PAD.right
const CHART_H = H - PAD.top - PAD.bottom
const TICK_COUNT = 5

export function LineChart({ data }: LineChartProps) {
  const maxVal = Math.max(...data.flatMap((d) => [d.inflow, d.outflow])) * 1.08

  const xPos = (i: number) => PAD.left + (i / (data.length - 1)) * CHART_W
  const yPos = (v: number) => PAD.top + CHART_H - (v / maxVal) * CHART_H

  const inflowPoints = data.map((d, i) => ({ x: xPos(i), y: yPos(d.inflow) }))
  const outflowPoints = data.map((d, i) => ({ x: xPos(i), y: yPos(d.outflow) }))

  const toPath = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const toAreaPath = (pts: Array<{ x: number; y: number }>, color: string) => {
    const line = toPath(pts)
    const bottom = PAD.top + CHART_H
    return { d: `${line} L ${pts[pts.length - 1]!.x} ${bottom} L ${pts[0]!.x} ${bottom} Z`, color }
  }

  const inflowArea = toAreaPath(inflowPoints, 'inflowAreaGrad')
  const outflowArea = toAreaPath(outflowPoints, 'outflowAreaGrad')

  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => (maxVal / TICK_COUNT) * (TICK_COUNT - i))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" aria-label="Revenue vs expenses line chart">
      <defs>
        <linearGradient id="inflowAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="outflowAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
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

      {/* Area fills */}
      <path d={inflowArea.d} fill={`url(#${inflowArea.color})`} />
      <path d={outflowArea.d} fill={`url(#${outflowArea.color})`} />

      {/* Lines */}
      <path d={toPath(inflowPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={toPath(outflowPoints)} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Data dots */}
      {inflowPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10b981" stroke="white" strokeWidth="1.5" />
      ))}
      {outflowPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#f43f5e" stroke="white" strokeWidth="1.5" />
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={d.month} x={xPos(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">
          {d.month}
        </text>
      ))}

      {/* Axis */}
      <line x1={PAD.left} y1={PAD.top + CHART_H} x2={W - PAD.right} y2={PAD.top + CHART_H} stroke="#e2e8f0" strokeWidth="1" />

      {/* Legend */}
      <g transform={`translate(${W - PAD.right - 150}, ${PAD.top})`}>
        <line x1="0" y1="5" x2="16" y2="5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        <text x="20" y="9" fontSize="10" fill="#64748b">Revenue</text>
        <line x1="80" y1="5" x2="96" y2="5" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
        <text x="100" y="9" fontSize="10" fill="#64748b">Expenses</text>
      </g>
    </svg>
  )
}
