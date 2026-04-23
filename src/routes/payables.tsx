import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Search,
} from "lucide-react";
import { useState } from "react";
import type { Payable, PayableStatus } from "#/data/finance";
import { formatCurrency, payables } from "#/data/finance";

type SortKey = "vendor" | "amount" | "dueDate" | "status";
type SortDir = "asc" | "desc";

interface PayablesSearch {
	status: PayableStatus | "all";
	sortBy: SortKey;
	sortDir: SortDir;
	page: number;
}

const PAGE_SIZE = 7;

export const Route = createFileRoute("/payables")({
	validateSearch: (search: Record<string, unknown>): PayablesSearch => ({
		status: (["pending", "paid", "overdue"].includes(search.status as string)
			? (search.status as PayableStatus)
			: "all") as PayableStatus | "all",
		sortBy: (["vendor", "amount", "dueDate", "status"].includes(
			search.sortBy as string,
		)
			? (search.sortBy as SortKey)
			: "dueDate") as SortKey,
		sortDir: search.sortDir === "desc" ? "desc" : "asc",
		page:
			typeof search.page === "number" && search.page > 0
				? Math.floor(search.page)
				: 1,
	}),
	loader: async () => {
		await new Promise<void>((r) => setTimeout(r, 100));
		const outstanding = payables
			.filter((p) => p.status !== "paid")
			.reduce((s, p) => s + p.amount, 0);
		const overdue = payables
			.filter((p) => p.status === "overdue")
			.reduce((s, p) => s + p.amount, 0);
		const dueSoon = payables
			.filter((p) => p.status === "pending")
			.reduce((s, p) => s + p.amount, 0);
		return { outstanding, overdue, dueSoon };
	},
	component: PayablesPage,
});

const statusConfig: Record<
	PayableStatus,
	{ label: string; cls: string; icon: typeof Clock }
> = {
	pending: {
		label: "Pending",
		cls: "bg-amber-50 text-amber-700 border-amber-200",
		icon: Clock,
	},
	paid: {
		label: "Paid",
		cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
		icon: CheckCircle2,
	},
	overdue: {
		label: "Overdue",
		cls: "bg-rose-50 text-rose-700 border-rose-200",
		icon: AlertCircle,
	},
};

const tabs: Array<{ key: PayableStatus | "all"; label: string }> = [
	{ key: "all", label: "All" },
	{ key: "pending", label: "Pending" },
	{ key: "paid", label: "Paid" },
	{ key: "overdue", label: "Overdue" },
];

const columns: Array<{ key: SortKey; label: string; width?: string }> = [
	{ key: "vendor", label: "Vendor" },
	{ key: "amount", label: "Amount", width: "w-32" },
	{ key: "dueDate", label: "Due Date", width: "w-32" },
	{ key: "status", label: "Status", width: "w-28" },
];

function SortIcon({
	col,
	sortBy,
	sortDir,
}: {
	col: SortKey;
	sortBy: SortKey;
	sortDir: SortDir;
}) {
	if (col !== sortBy) return <ChevronUp size={12} className="text-slate-300" />;
	return sortDir === "asc" ? (
		<ChevronUp size={12} className="text-indigo-500" />
	) : (
		<ChevronDown size={12} className="text-indigo-500" />
	);
}

function StatusBadge({ status }: { status: PayableStatus }) {
	const cfg = statusConfig[status];
	const Icon = cfg.icon;
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.cls}`}
		>
			<Icon size={10} />
			{cfg.label}
		</span>
	);
}

function sortPayables(items: Payable[], key: SortKey, dir: SortDir): Payable[] {
	return [...items].sort((a, b) => {
		let cmp = 0;
		if (key === "amount") cmp = a.amount - b.amount;
		else if (key === "dueDate") cmp = a.dueDate.localeCompare(b.dueDate);
		else if (key === "status") cmp = a.status.localeCompare(b.status);
		else cmp = a.vendor.localeCompare(b.vendor);
		return dir === "asc" ? cmp : -cmp;
	});
}

function PayablesPage() {
	const { status, sortBy, sortDir, page } = Route.useSearch();
	const { outstanding, overdue, dueSoon } = Route.useLoaderData();
	const navigate = useNavigate({ from: "/payables" });
	const [query, setQuery] = useState("");

	const setSearch = (partial: Partial<PayablesSearch>) =>
		navigate({ search: (prev) => ({ ...prev, ...partial }) });

	const handleSort = (col: SortKey) => {
		if (col === sortBy) {
			setSearch({ sortDir: sortDir === "asc" ? "desc" : "asc", page: 1 });
		} else {
			setSearch({ sortBy: col, sortDir: "asc", page: 1 });
		}
	};

	const filtered = payables.filter(
		(p) =>
			(status === "all" || p.status === status) &&
			(query === "" ||
				p.vendor.toLowerCase().includes(query.toLowerCase()) ||
				p.invoiceNo.toLowerCase().includes(query.toLowerCase())),
	);
	const sorted = sortPayables(filtered, sortBy, sortDir);
	const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const pageItems = sorted.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	return (
		<div className="flex flex-col h-full overflow-auto">
			{/* Header */}
			<header className="px-8 py-5 bg-white border-b border-slate-200 shrink-0">
				<h1 className="text-xl font-bold text-slate-900">Payables</h1>
				<p className="text-sm text-slate-500 mt-0.5">
					Manage vendor invoices and payments
				</p>
			</header>

			<div className="flex-1 p-8 flex flex-col gap-5">
				{/* Summary strip */}
				<div className="grid grid-cols-3 gap-4">
					{[
						{
							label: "Total Outstanding",
							value: formatCurrency(outstanding),
							cls: "border-slate-200",
						},
						{
							label: "Overdue",
							value: formatCurrency(overdue),
							cls: "border-rose-200 bg-rose-50",
						},
						{
							label: "Due Soon (Pending)",
							value: formatCurrency(dueSoon),
							cls: "border-amber-200 bg-amber-50",
						},
					].map(({ label, value, cls }) => (
						<div key={label} className={`rounded-xl border p-4 ${cls}`}>
							<p className="text-xs text-slate-500 font-medium">{label}</p>
							<p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
								{value}
							</p>
						</div>
					))}
				</div>

				{/* Table card */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
					{/* Toolbar */}
					<div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
						{/* Status tabs — stored in URL */}
						<div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
							{tabs.map((t) => (
								<button
									type="button"
									key={t.key}
									onClick={() => setSearch({ status: t.key, page: 1 })}
									className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
										status === t.key
											? "bg-white text-slate-900 shadow-sm"
											: "text-slate-500 hover:text-slate-700"
									}`}
								>
									{t.label}
									<span className="ml-1.5 text-[10px] text-slate-400">
										{t.key === "all"
											? payables.length
											: payables.filter((p) => p.status === t.key).length}
									</span>
								</button>
							))}
						</div>

						{/* Search */}
						<div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 max-w-xs">
							<Search size={13} className="text-slate-400 shrink-0" />
							<input
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setSearch({ page: 1 });
								}}
								placeholder="Search vendor or invoice…"
								className="text-xs text-slate-700 bg-transparent outline-none placeholder:text-slate-400 w-full"
							/>
						</div>

						<span className="ml-auto text-xs text-slate-400">
							{filtered.length} result{filtered.length !== 1 ? "s" : ""}
						</span>
					</div>

					{/* Table */}
					<div className="overflow-auto flex-1">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="bg-slate-50">
									<th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-28">
										Invoice
									</th>
									{columns.map((col) => (
										<th
											key={col.key}
											className={`px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700 transition-colors ${col.width ?? ""}`}
											onClick={() => handleSort(col.key)}
										>
											<span className="flex items-center gap-1">
												{col.label}
												<SortIcon
													col={col.key}
													sortBy={sortBy}
													sortDir={sortDir}
												/>
											</span>
										</th>
									))}
									<th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-24">
										Category
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{pageItems.length === 0 ? (
									<tr>
										<td
											colSpan={6}
											className="text-center py-16 text-slate-400 text-sm"
										>
											No payables match your filters.
										</td>
									</tr>
								) : (
									pageItems.map((p) => (
										<tr
											key={p.id}
											className="hover:bg-slate-50 transition-colors"
										>
											<td className="px-5 py-3 text-xs text-slate-500 font-mono">
												{p.invoiceNo}
											</td>
											<td className="px-4 py-3 font-medium text-slate-800">
												{p.vendor}
											</td>
											<td className="px-4 py-3 font-semibold text-slate-900 tabular-nums">
												{formatCurrency(p.amount)}
											</td>
											<td className="px-4 py-3 text-slate-600">{p.dueDate}</td>
											<td className="px-4 py-3">
												<StatusBadge status={p.status} />
											</td>
											<td className="px-4 py-3">
												<span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
													{p.category}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
						<span className="text-xs text-slate-400">
							Page {currentPage} of {totalPages} · {filtered.length} items
						</span>
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => setSearch({ page: currentPage - 1 })}
								disabled={currentPage <= 1}
								className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
							>
								<ChevronLeft size={15} />
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
								<button
									type="button"
									key={n}
									onClick={() => setSearch({ page: n })}
									className={`w-7 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer ${
										n === currentPage
											? "bg-indigo-600 text-white"
											: "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
									}`}
								>
									{n}
								</button>
							))}
							<button
								type="button"
								onClick={() => setSearch({ page: currentPage + 1 })}
								disabled={currentPage >= totalPages}
								className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
							>
								<ChevronRight size={15} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
