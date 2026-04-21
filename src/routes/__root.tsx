import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { BarChart2, CreditCard, LayoutDashboard } from 'lucide-react'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

const navItems = [
  { to: '/cashflow', label: 'Cash Flow', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/payables', label: 'Payables', icon: CreditCard },
] as const

function RootComponent() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col bg-slate-900 border-r border-slate-800 shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">FinanceOS</p>
              <p className="text-[10px] text-slate-400 leading-tight">TechCorp Inc.</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 text-sm hover:bg-slate-800 hover:text-slate-100 transition-colors"
              activeProps={{ className: 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-500' }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              TC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">TechCorp Admin</p>
              <p className="text-[10px] text-slate-500 truncate">finance@techcorp.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <Outlet />
      </div>

      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[{ name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> }]}
      />
    </div>
  )
}
