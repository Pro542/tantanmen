export interface MonthlyDataPoint {
	month: string;
	inflow: number;
	outflow: number;
}

export interface CashPosition {
	month: string;
	balance: number;
}

export interface CategoryExpense {
	category: string;
	amount: number;
	color: string;
}

export type PayableStatus = "pending" | "paid" | "overdue";

export interface Payable {
	id: number;
	vendor: string;
	amount: number;
	dueDate: string;
	status: PayableStatus;
	category: string;
	invoiceNo: string;
}

export const monthlyData2025: MonthlyDataPoint[] = [
	{ month: "Jan", inflow: 480000, outflow: 310000 },
	{ month: "Feb", inflow: 520000, outflow: 350000 },
	{ month: "Mar", inflow: 610000, outflow: 420000 },
	{ month: "Apr", inflow: 590000, outflow: 380000 },
	{ month: "May", inflow: 650000, outflow: 410000 },
	{ month: "Jun", inflow: 720000, outflow: 490000 },
	{ month: "Jul", inflow: 680000, outflow: 460000 },
	{ month: "Aug", inflow: 750000, outflow: 510000 },
	{ month: "Sep", inflow: 810000, outflow: 540000 },
	{ month: "Oct", inflow: 780000, outflow: 520000 },
	{ month: "Nov", inflow: 860000, outflow: 580000 },
	{ month: "Dec", inflow: 920000, outflow: 610000 },
];

export const monthlyData2024: MonthlyDataPoint[] = monthlyData2025.map((d) => ({
	...d,
	inflow: Math.round(d.inflow * 0.82),
	outflow: Math.round(d.outflow * 0.78),
}));

export function getCashPositionData(
	data: MonthlyDataPoint[],
	startBalance = 1_500_000,
): CashPosition[] {
	return data.reduce<CashPosition[]>((acc, item, i) => {
		const prev = i === 0 ? startBalance : (acc[i - 1]?.balance ?? startBalance);
		acc.push({ month: item.month, balance: prev + item.inflow - item.outflow });
		return acc;
	}, []);
}

export const categoryExpenses: CategoryExpense[] = [
	{ category: "Operations", amount: 2_450_000, color: "#6366f1" },
	{ category: "Marketing", amount: 890_000, color: "#8b5cf6" },
	{ category: "R&D", amount: 1_200_000, color: "#06b6d4" },
	{ category: "HR", amount: 780_000, color: "#10b981" },
	{ category: "Infrastructure", amount: 560_000, color: "#f59e0b" },
];

export const payables: Payable[] = [
	{
		id: 1,
		vendor: "AWS Cloud Services",
		amount: 48500,
		dueDate: "2026-04-25",
		status: "pending",
		category: "Infrastructure",
		invoiceNo: "INV-2026-0401",
	},
	{
		id: 2,
		vendor: "Salesforce Inc.",
		amount: 12000,
		dueDate: "2026-04-20",
		status: "overdue",
		category: "Operations",
		invoiceNo: "INV-2026-0402",
	},
	{
		id: 3,
		vendor: "Google Workspace",
		amount: 3600,
		dueDate: "2026-04-30",
		status: "pending",
		category: "Operations",
		invoiceNo: "INV-2026-0403",
	},
	{
		id: 4,
		vendor: "Adobe Creative Cloud",
		amount: 5400,
		dueDate: "2026-03-31",
		status: "paid",
		category: "Marketing",
		invoiceNo: "INV-2026-0404",
	},
	{
		id: 5,
		vendor: "Stripe Payment Processing",
		amount: 8750,
		dueDate: "2026-04-15",
		status: "overdue",
		category: "Operations",
		invoiceNo: "INV-2026-0405",
	},
	{
		id: 6,
		vendor: "GitHub Enterprise",
		amount: 6000,
		dueDate: "2026-05-01",
		status: "pending",
		category: "R&D",
		invoiceNo: "INV-2026-0406",
	},
	{
		id: 7,
		vendor: "Slack Technologies",
		amount: 4200,
		dueDate: "2026-04-10",
		status: "paid",
		category: "Operations",
		invoiceNo: "INV-2026-0407",
	},
	{
		id: 8,
		vendor: "HubSpot CRM",
		amount: 15000,
		dueDate: "2026-04-28",
		status: "pending",
		category: "Marketing",
		invoiceNo: "INV-2026-0408",
	},
	{
		id: 9,
		vendor: "Datadog Monitoring",
		amount: 22000,
		dueDate: "2026-04-18",
		status: "overdue",
		category: "Infrastructure",
		invoiceNo: "INV-2026-0409",
	},
	{
		id: 10,
		vendor: "Figma Design",
		amount: 4500,
		dueDate: "2026-04-22",
		status: "pending",
		category: "R&D",
		invoiceNo: "INV-2026-0410",
	},
	{
		id: 11,
		vendor: "Office Space Lease",
		amount: 85000,
		dueDate: "2026-05-01",
		status: "pending",
		category: "Operations",
		invoiceNo: "INV-2026-0411",
	},
	{
		id: 12,
		vendor: "Corporate Insurance",
		amount: 32000,
		dueDate: "2026-03-15",
		status: "paid",
		category: "Operations",
		invoiceNo: "INV-2026-0412",
	},
	{
		id: 13,
		vendor: "PwC Audit Services",
		amount: 120000,
		dueDate: "2026-04-30",
		status: "pending",
		category: "Operations",
		invoiceNo: "INV-2026-0413",
	},
	{
		id: 14,
		vendor: "LinkedIn Recruiter",
		amount: 18000,
		dueDate: "2026-04-12",
		status: "paid",
		category: "HR",
		invoiceNo: "INV-2026-0414",
	},
	{
		id: 15,
		vendor: "Zoom Communications",
		amount: 7200,
		dueDate: "2026-04-17",
		status: "overdue",
		category: "Operations",
		invoiceNo: "INV-2026-0415",
	},
	{
		id: 16,
		vendor: "MongoDB Atlas",
		amount: 14000,
		dueDate: "2026-05-05",
		status: "pending",
		category: "Infrastructure",
		invoiceNo: "INV-2026-0416",
	},
	{
		id: 17,
		vendor: "SEMrush Marketing",
		amount: 6000,
		dueDate: "2026-04-08",
		status: "paid",
		category: "Marketing",
		invoiceNo: "INV-2026-0417",
	},
	{
		id: 18,
		vendor: "Legal Counsel LLP",
		amount: 45000,
		dueDate: "2026-04-23",
		status: "pending",
		category: "Operations",
		invoiceNo: "INV-2026-0418",
	},
	{
		id: 19,
		vendor: "Cloudflare CDN",
		amount: 9500,
		dueDate: "2026-04-11",
		status: "paid",
		category: "Infrastructure",
		invoiceNo: "INV-2026-0419",
	},
	{
		id: 20,
		vendor: "Workday HR System",
		amount: 28000,
		dueDate: "2026-04-14",
		status: "overdue",
		category: "HR",
		invoiceNo: "INV-2026-0420",
	},
];

export function formatCurrency(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
	if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
	return `$${value.toLocaleString()}`;
}

export function formatCurrencyShort(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
	return `$${value}`;
}
