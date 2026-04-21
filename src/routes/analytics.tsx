import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TrendingUp, BarChart2, Percent, ArrowUpRight } from 'lucide-react'
import { LineChart } from '#/components/LineChart'
import { DonutChart } from '#/components/DonutChart'
import { StatCard } from '#/components/StatCard'
import {
  monthlyData2025,
  monthlyData2024,
  categoryExpenses,
  formatCurrency,
} from '#/data/finance'

interface AnalyticsSearch {
  year: 2024 | 2025
}

export const Route = createFileRoute('/analytics')({
  validateSearch: (search: Record<string, unknown>): AnalyticsSearch => ({
    year: search.year === 2024 ? 2024 : 2025,
  }),
  loader: async () => {
    await new Promise<void>((r) => setTimeout(r, 120))
    return { categoryExpenses }
  },
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const { year } = Route.useSearch()
  const { categoryExpenses: categories } = Route.useLoaderData()
  const navigate = useNavigate({ from: '/analytics' })

  const data = year === 2024 ? monthlyData2024 : monthlyData2025

  const totalRevenue = data.reduce((s, d) => s + d.inflow, 0)
  const totalExpenses = data.reduce((s, d) => s + d.outflow, 0)
  const profitMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100
  const expenseRatio = (totalExpenses / totalRevenue) * 100

  const prev = year === 2025 ? monthlyData2024 : monthlyData2025
  const prevRevenue = prev.reduce((s, d) => s + d.inflow, 0)
  const revenueGrowth = ((totalRevenue - prevRevenue) / prevRevenue) * 100

  const toggleYear = (y: 2024 | 2025) => {
    navigate({ search: { year: y } })
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <header className="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Revenue trends and expense breakdown</p>
        </div>
        {/* Year selector — drives URL search params */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {([2024, 2025] as const).map((y) => (
            <button
              key={y}
              onClick={() => toggleYear(y)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                year === y
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Revenue Growth"
            value={`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`}
            sub={`vs ${year === 2025 ? '2024' : '2025'}`}
            trend={revenueGrowth}
            icon={<ArrowUpRight size={16} />}
            accent="bg-emerald-500"
          />
          <StatCard
            label="Expense Ratio"
            value={`${expenseRatio.toFixed(1)}%`}
            sub="Expenses as % of revenue"
            icon={<Percent size={16} />}
            accent="bg-amber-500"
          />
          <StatCard
            label="Profit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            sub={`Net: ${formatCurrency(totalRevenue - totalExpenses)}`}
            trend={profitMargin - 30}
            icon={<TrendingUp size={16} />}
            accent="bg-indigo-500"
          />
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Revenue vs Expenses</h2>
              <p className="text-xs text-slate-400">Monthly comparison — FY {year}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              <BarChart2 size={12} />
              12-month trend
            </div>
          </div>
          <div className="h-56">
            <LineChart data={data} />
          </div>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Expense Breakdown</h2>
            <p className="text-xs text-slate-400">Spend distribution by department</p>
          </div>
          <DonutChart data={categories} />
        </div>
      </div>
    </div>
  )
}
