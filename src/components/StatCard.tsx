import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  trend?: number
  icon: ReactNode
  accent?: string
}

export function StatCard({ label, value, sub, trend, icon, accent = 'bg-indigo-500' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`${accent} p-2 rounded-lg text-white`}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">vs last period</span>
        </div>
      )}
    </div>
  )
}
