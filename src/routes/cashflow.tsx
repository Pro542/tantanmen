import { createFileRoute } from '@tanstack/react-router'
import { TrendingDown, TrendingUp, Wallet, DollarSign } from 'lucide-react'
import { BarChart } from '#/components/BarChart'
import { AreaChart } from '#/components/AreaChart'
import { StatCard } from '#/components/StatCard'
import {
  monthlyData2025,
  getCashPositionData,
  formatCurrency,
} from '#/data/finance'

export const Route = createFileRoute('/cashflow')({
  loader: async () => {
    await new Promise<void>((r) => setTimeout(r, 180))
    const data = monthlyData2025
    const cashPosition = getCashPositionData(data)
    const totalInflow = data.reduce((s, d) => s + d.inflow, 0)
    const totalOutflow = data.reduce((s, d) => s + d.outflow, 0)
    const netCashflow = totalInflow - totalOutflow
    const currentBalance = cashPosition[cashPosition.length - 1]!.balance
    return { data, cashPosition, totalInflow, totalOutflow, netCashflow, currentBalance }
  },
  component: CashflowPage,
})

function CashflowPage() {
  const { data, cashPosition, totalInflow, totalOutflow, netCashflow, currentBalance } =
    Route.useLoaderData()

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <header className="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cash Flow</h1>
          <p className="text-sm text-slate-500 mt-0.5">FY 2025 — Full Year Overview</p>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">
          Live
        </span>
      </header>

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalInflow)}
            sub="All inflows YTD"
            trend={14.2}
            icon={<TrendingUp size={16} />}
            accent="bg-emerald-500"
          />
          <StatCard
            label="Total Expenses"
            value={formatCurrency(totalOutflow)}
            sub="All outflows YTD"
            trend={9.8}
            icon={<TrendingDown size={16} />}
            accent="bg-rose-500"
          />
          <StatCard
            label="Net Cash Flow"
            value={formatCurrency(netCashflow)}
            sub="Revenue minus expenses"
            trend={22.5}
            icon={<DollarSign size={16} />}
            accent="bg-indigo-500"
          />
          <StatCard
            label="Cash Balance"
            value={formatCurrency(currentBalance)}
            sub="End-of-period balance"
            trend={6.1}
            icon={<Wallet size={16} />}
            accent="bg-violet-500"
          />
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Monthly Cash Flow</h2>
            <p className="text-xs text-slate-400">Inflows vs outflows by month</p>
          </div>
          <div className="h-64">
            <BarChart data={data} />
          </div>
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Cash Position</h2>
            <p className="text-xs text-slate-400">Running cash balance over the year</p>
          </div>
          <div className="h-48">
            <AreaChart data={cashPosition} />
          </div>
        </div>
      </div>
    </div>
  )
}
