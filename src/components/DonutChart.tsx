import type { CategoryExpense } from "#/data/finance";
import { formatCurrency } from "#/data/finance";

interface DonutChartProps {
	data: CategoryExpense[];
}

const CX = 100;
const CY = 100;
const OUTER_R = 80;
const INNER_R = 52;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
	const rad = ((angleDeg - 90) * Math.PI) / 180;
	return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function annularSectorPath(startDeg: number, endDeg: number): string {
	const gap = 1.5;
	const s = startDeg + gap / 2;
	const e = endDeg - gap / 2;
	const os = polarToCartesian(CX, CY, OUTER_R, s);
	const oe = polarToCartesian(CX, CY, OUTER_R, e);
	const is = polarToCartesian(CX, CY, INNER_R, s);
	const ie = polarToCartesian(CX, CY, INNER_R, e);
	const large = e - s > 180 ? 1 : 0;

	return [
		`M ${os.x} ${os.y}`,
		`A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${oe.x} ${oe.y}`,
		`L ${ie.x} ${ie.y}`,
		`A ${INNER_R} ${INNER_R} 0 ${large} 0 ${is.x} ${is.y}`,
		"Z",
	].join(" ");
}

export function DonutChart({ data }: DonutChartProps) {
	const total = data.reduce((s, d) => s + d.amount, 0);

	let cumulativeDeg = 0;
	const segments = data.map((d) => {
		const deg = (d.amount / total) * 360;
		const start = cumulativeDeg;
		cumulativeDeg += deg;
		return { ...d, startDeg: start, endDeg: cumulativeDeg };
	});

	return (
		<div className="flex items-center gap-8">
			<svg
				viewBox="0 0 200 200"
				className="w-48 h-48 shrink-0"
				aria-label="Expense breakdown donut chart"
			>
				{segments.map((seg) => (
					<path
						key={seg.category}
						d={annularSectorPath(seg.startDeg, seg.endDeg)}
						fill={seg.color}
					/>
				))}
				<text
					x={CX}
					y={CY - 6}
					textAnchor="middle"
					fontSize="9"
					fill="#94a3b8"
					fontWeight="500"
				>
					TOTAL
				</text>
				<text
					x={CX}
					y={CY + 8}
					textAnchor="middle"
					fontSize="12"
					fill="#1e293b"
					fontWeight="700"
				>
					{formatCurrency(total)}
				</text>
			</svg>

			<div className="flex flex-col gap-2.5 flex-1">
				{data.map((d) => (
					<div key={d.category} className="flex items-center gap-2">
						<span
							className="w-2.5 h-2.5 rounded-full shrink-0"
							style={{ backgroundColor: d.color }}
						/>
						<span className="text-sm text-slate-600 flex-1">{d.category}</span>
						<span className="text-sm font-semibold text-slate-800">
							{formatCurrency(d.amount)}
						</span>
						<span className="text-xs text-slate-400 w-10 text-right">
							{((d.amount / total) * 100).toFixed(0)}%
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
