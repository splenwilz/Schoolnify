"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Shield,
  DollarSign,
  FileText,
  Receipt,
  Users,
  Settings,
  Tag,
  Bell,
  Search,
  X,
  ChevronDown,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { financialReportData, auditTrail, feeSummary } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportType = "collection" | "revenue" | "outstanding" | "audit";

type EntityType = "all" | "invoice" | "expense" | "payroll" | "fee" | "budget";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

const fmtCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const REPORT_TYPES: {
  key: ReportType;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}[] = [
  {
    key: "collection",
    label: "Collection Summary",
    icon: BarChart3,
    color: "#0891B2",
    description: "Fee collection overview by grade and type",
  },
  {
    key: "revenue",
    label: "Revenue & Expenses",
    icon: TrendingUp,
    color: "#10B981",
    description: "Income vs expenditure analysis",
  },
  {
    key: "outstanding",
    label: "Outstanding Fees",
    icon: AlertTriangle,
    color: "#EF4444",
    description: "Overdue accounts and aging analysis",
  },
  {
    key: "audit",
    label: "Audit Trail",
    icon: Shield,
    color: "#A855F7",
    description: "Complete transaction activity log",
  },
];

const AGING_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "0-30 days": {
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
    text: "#10B981",
  },
  "31-60 days": {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    text: "#F59E0B",
  },
  "61-90 days": {
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.25)",
    text: "#F97316",
  },
  "90+ days": {
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    text: "#EF4444",
  },
};

const ACTION_ICON_MAP: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  payment_received: { icon: DollarSign, color: "#10B981" },
  invoice_generated: { icon: FileText, color: "#0891B2" },
  expense_approved: { icon: Receipt, color: "#A855F7" },
  expense_submitted: { icon: Receipt, color: "#A855F7" },
  payroll_processed: { icon: Users, color: "#3B82F6" },
  fee_structure_updated: { icon: Settings, color: "#F59E0B" },
  discount_applied: { icon: Tag, color: "#10B981" },
  reminder_sent: { icon: Bell, color: "#F59E0B" },
  budget_updated: { icon: BarChart3, color: "#0891B2" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a smooth Bezier SVG path from data points */
function buildCurvePath(
  points: number[],
  width: number,
  height: number,
  padding = 0
): string {
  if (points.length < 2) return "";
  const max = Math.max(...points, 1);
  const h = height - padding * 2;
  const step = width / (points.length - 1);

  const pts = points.map((v, i) => ({
    x: i * step,
    y: padding + h - (v / max) * h,
  }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + step * 0.4;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - step * 0.4;
    const cp2y = pts[i].y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
}

/** Build an area fill path (closed polygon with curve top) */
function buildAreaPath(
  points: number[],
  width: number,
  height: number,
  padding = 0
): string {
  const curve = buildCurvePath(points, width, height, padding);
  if (!curve) return "";
  return `${curve} L ${width},${height} L 0,${height} Z`;
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) +
    " at " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className="text-2xl font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Collection Summary Report
// ---------------------------------------------------------------------------

function CollectionSummaryReport() {
  const { collectionByGrade, monthlyTrend } = financialReportData;
  const maxCollected = Math.max(
    ...collectionByGrade.map((g) => g.collected + g.outstanding)
  );

  // Chart dimensions
  const chartW = 600;
  const chartH = 200;
  const chartPad = 24;

  const revenueValues = monthlyTrend.map((m) => m.revenue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Total Collected"
          value={fmtCompact.format(feeSummary.totalCollected)}
          color="#10B981"
          delay={0.05}
        />
        <KpiCard
          label="Collection Rate"
          value={`${feeSummary.collectionRate}%`}
          color="#0891B2"
          delay={0.1}
        />
        <KpiCard
          label="Outstanding"
          value={fmtCompact.format(feeSummary.totalOutstanding)}
          color="#F59E0B"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection by Grade - Horizontal bars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
            Collection by Grade
          </h3>
          <p className="text-xs text-[var(--muted)] mb-5">
            Collected vs outstanding fees per grade
          </p>

          {/* Legend */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#10B981" }}
              />
              <span className="text-xs text-[var(--muted)]">Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#F59E0B" }}
              />
              <span className="text-xs text-[var(--muted)]">Outstanding</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {collectionByGrade.map((g, i) => {
              const total = g.collected + g.outstanding;
              const collectedPct = (g.collected / maxCollected) * 100;
              const outstandingPct = (g.outstanding / maxCollected) * 100;

              return (
                <div key={g.grade}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[var(--foreground)] w-20 flex-shrink-0">
                      {g.grade}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-nums">
                      {fmtCompact.format(total)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden flex bg-[var(--background-secondary)]">
                    <motion.div
                      className="h-full rounded-l-full"
                      style={{ background: "#10B981" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${collectedPct}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.25 + i * 0.06,
                        ease: "easeOut",
                      }}
                    />
                    <motion.div
                      className="h-full rounded-r-full"
                      style={{ background: "#F59E0B" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${outstandingPct}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.35 + i * 0.06,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Monthly Collection Trend - SVG line chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
            Monthly Collection Trend
          </h3>
          <p className="text-xs text-[var(--muted)] mb-5">
            Revenue over the past months
          </p>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH + 36}`}
              className="w-full"
              style={{ minWidth: 380 }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="gradCollectionTrend"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
                <line
                  key={frac}
                  x1={0}
                  y1={chartPad + (chartH - chartPad * 2) * frac}
                  x2={chartW}
                  y2={chartPad + (chartH - chartPad * 2) * frac}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
              ))}

              {/* Area fill */}
              <motion.path
                d={buildAreaPath(revenueValues, chartW, chartH, chartPad)}
                fill="url(#gradCollectionTrend)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />

              {/* Line */}
              <motion.path
                d={buildCurvePath(revenueValues, chartW, chartH, chartPad)}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              />

              {/* Data points with value labels */}
              {monthlyTrend.map((d, i) => {
                const maxVal = Math.max(...revenueValues, 1);
                const x =
                  (i / (revenueValues.length - 1)) * chartW;
                const y =
                  chartPad +
                  (chartH - chartPad * 2) -
                  (d.revenue / maxVal) * (chartH - chartPad * 2);
                return (
                  <g key={`point-${i}`}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#10B981"
                      stroke="var(--card)"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.5 + i * 0.08 }}
                    />
                    <motion.text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill="#10B981"
                      className="tabular-nums"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.6 + i * 0.08 }}
                    >
                      {fmtCompact.format(d.revenue)}
                    </motion.text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {monthlyTrend.map((d, i) => {
                const x =
                  (i / (monthlyTrend.length - 1)) * chartW;
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={chartH + 24}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--muted)"
                    className="select-none"
                  >
                    {d.month}
                  </text>
                );
              })}
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Revenue & Expenses Report
// ---------------------------------------------------------------------------

function RevenueExpensesReport() {
  const { totalRevenue, totalExpenses, netIncome, monthlyTrend, expenseRatio, collectionEfficiency } =
    financialReportData;

  const chartW = 600;
  const chartH = 220;
  const chartPad = 28;

  const revenueValues = monthlyTrend.map((m) => m.revenue);
  const expenseValues = monthlyTrend.map((m) => m.expenses);

  // Normalize both to same scale
  const allValues = [...revenueValues, ...expenseValues];
  const globalMax = Math.max(...allValues, 1);

  function buildDualPath(
    points: number[],
    width: number,
    height: number,
    padding: number,
    maxVal: number
  ): string {
    if (points.length < 2) return "";
    const h = height - padding * 2;
    const step = width / (points.length - 1);
    const pts = points.map((v, i) => ({
      x: i * step,
      y: padding + h - (v / maxVal) * h,
    }));
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1].x + step * 0.4;
      const cp1y = pts[i - 1].y;
      const cp2x = pts[i].x - step * 0.4;
      const cp2y = pts[i].y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
    }
    return d;
  }

  function buildDualArea(
    points: number[],
    width: number,
    height: number,
    padding: number,
    maxVal: number
  ): string {
    const curve = buildDualPath(points, width, height, padding, maxVal);
    if (!curve) return "";
    return `${curve} L ${width},${height} L 0,${height} Z`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Total Revenue"
          value={fmtCompact.format(totalRevenue)}
          color="#10B981"
          delay={0.05}
        />
        <KpiCard
          label="Total Expenses"
          value={fmtCompact.format(totalExpenses)}
          color="#EF4444"
          delay={0.1}
        />
        <KpiCard
          label="Net Income"
          value={fmtCompact.format(netIncome)}
          color="#0891B2"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
            Revenue vs Expenses
          </h3>
          <p className="text-xs text-[var(--muted)] mb-4">
            Monthly comparison of income and expenditure
          </p>

          {/* Legend */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#10B981" }}
              />
              <span className="text-xs text-[var(--muted)]">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#EF4444" }}
              />
              <span className="text-xs text-[var(--muted)]">Expenses</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH + 36}`}
              className="w-full"
              style={{ minWidth: 400 }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="gradRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient
                  id="gradExpenses"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
                <line
                  key={frac}
                  x1={0}
                  y1={chartPad + (chartH - chartPad * 2) * frac}
                  x2={chartW}
                  y2={chartPad + (chartH - chartPad * 2) * frac}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
              ))}

              {/* Expense area + line */}
              <motion.path
                d={buildDualArea(
                  expenseValues,
                  chartW,
                  chartH,
                  chartPad,
                  globalMax
                )}
                fill="url(#gradExpenses)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.path
                d={buildDualPath(
                  expenseValues,
                  chartW,
                  chartH,
                  chartPad,
                  globalMax
                )}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              />

              {/* Revenue area + line */}
              <motion.path
                d={buildDualArea(
                  revenueValues,
                  chartW,
                  chartH,
                  chartPad,
                  globalMax
                )}
                fill="url(#gradRevenue)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.path
                d={buildDualPath(
                  revenueValues,
                  chartW,
                  chartH,
                  chartPad,
                  globalMax
                )}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.15 }}
              />

              {/* Revenue data points */}
              {revenueValues.map((v, i) => {
                const x = (i / (revenueValues.length - 1)) * chartW;
                const h = chartH - chartPad * 2;
                const y = chartPad + h - (v / globalMax) * h;
                return (
                  <motion.circle
                    key={`rv-${i}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#10B981"
                    stroke="var(--card)"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.5 + i * 0.06 }}
                  />
                );
              })}

              {/* Expense data points */}
              {expenseValues.map((v, i) => {
                const x = (i / (expenseValues.length - 1)) * chartW;
                const h = chartH - chartPad * 2;
                const y = chartPad + h - (v / globalMax) * h;
                return (
                  <motion.circle
                    key={`ex-${i}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#EF4444"
                    stroke="var(--card)"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.55 + i * 0.06 }}
                  />
                );
              })}

              {/* X-axis labels */}
              {monthlyTrend.map((d, i) => {
                const x = (i / (monthlyTrend.length - 1)) * chartW;
                return (
                  <text
                    key={`xlabel-${i}`}
                    x={x}
                    y={chartH + 24}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--muted)"
                    className="select-none"
                  >
                    {d.month}
                  </text>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-center"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-6">
            Key Metrics
          </h3>

          {/* Expense Ratio Gauge */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--muted)]">Expense Ratio</span>
              <span className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                {expenseRatio}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #EF4444, #F97316)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${expenseRatio}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-1.5">
              {expenseRatio}% of revenue goes to expenses
            </p>
          </div>

          {/* Collection Efficiency Gauge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--muted)]">
                Collection Efficiency
              </span>
              <span className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                {collectionEfficiency}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #0891B2, #10B981)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${collectionEfficiency}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-1.5">
              {collectionEfficiency}% of expected fees collected
            </p>
          </div>

          {/* Summary divider */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--muted)]">Profit Margin</span>
              <span className="text-sm font-bold text-[#10B981] tabular-nums">
                {((netIncome / totalRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Outstanding Fees Report
// ---------------------------------------------------------------------------

function OutstandingFeesReport() {
  const { agingAnalysis, collectionByGrade } = financialReportData;

  const maxOutstanding = Math.max(
    ...collectionByGrade.map((g) => g.outstanding)
  );

  // Color intensity based on outstanding amount
  function getBarColor(amount: number): string {
    const ratio = amount / maxOutstanding;
    if (ratio > 0.85) return "#EF4444";
    if (ratio > 0.65) return "#F97316";
    if (ratio > 0.4) return "#F59E0B";
    return "#0891B2";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          label="Total Outstanding"
          value={fmtCompact.format(feeSummary.totalOutstanding)}
          color="#EF4444"
          delay={0.05}
        />
        <KpiCard
          label="Overdue Accounts"
          value={String(feeSummary.overdueAccounts)}
          color="#F59E0B"
          delay={0.1}
        />
      </div>

      {/* Aging Analysis Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">
          Aging Analysis
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {agingAnalysis.map((aging, i) => {
            const colors = AGING_COLORS[aging.range] ?? AGING_COLORS["0-30 days"];
            return (
              <motion.div
                key={aging.range}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                className="rounded-2xl p-5 border"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: colors.text }}
                >
                  {aging.range}
                </p>
                <p
                  className="text-2xl font-bold tabular-nums mb-1"
                  style={{ color: colors.text }}
                >
                  {fmt.format(aging.amount)}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  <span
                    className="font-semibold tabular-nums"
                    style={{ color: colors.text }}
                  >
                    {aging.count}
                  </span>{" "}
                  accounts
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Outstanding by Grade */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
          Outstanding by Grade
        </h3>
        <p className="text-xs text-[var(--muted)] mb-5">
          Outstanding fee amounts per grade level
        </p>

        <div className="space-y-3.5">
          {collectionByGrade.map((g, i) => {
            const pct = (g.outstanding / maxOutstanding) * 100;
            const barColor = getBarColor(g.outstanding);

            return (
              <div key={g.grade}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[var(--foreground)] w-20 flex-shrink-0">
                    {g.grade}
                  </span>
                  <span
                    className="text-[11px] font-semibold tabular-nums"
                    style={{ color: barColor }}
                  >
                    {fmt.format(g.outstanding)}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: barColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + i * 0.06,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Audit Trail Report
// ---------------------------------------------------------------------------

function AuditTrailReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<EntityType>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    let result = [...auditTrail];

    if (entityFilter !== "all") {
      result = result.filter((a) => a.entityType === entityFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.description.toLowerCase().includes(q) ||
          a.performedBy.toLowerCase().includes(q)
      );
    }

    // Sort by timestamp descending
    result.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return result;
  }, [searchQuery, entityFilter]);

  const entityTypeLabels: Record<EntityType, string> = {
    all: "All Types",
    invoice: "Invoice",
    expense: "Expense",
    payroll: "Payroll",
    fee: "Fee",
    budget: "Budget",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="text"
              placeholder="Search by description or performer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Entity type filter */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] transition-colors hover:bg-[var(--background-secondary)]",
                entityFilter !== "all"
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              )}
            >
              <span className="text-xs">{entityTypeLabels[entityFilter]}</span>
              <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-20 py-1"
                >
                  {(
                    Object.entries(entityTypeLabels) as [EntityType, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setEntityFilter(key);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs transition-colors",
                        entityFilter === key
                          ? "text-[#A855F7] bg-[rgba(168,85,247,0.06)]"
                          : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Export button */}
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-[#A855F7] text-white hover:bg-[#A855F7]/90 transition-colors">
            <Download size={14} />
            Export Log
          </button>
        </div>

        <p className="text-xs text-[var(--muted)] mt-3">
          {filtered.length} entr{filtered.length !== 1 ? "ies" : "y"} found
        </p>
      </motion.div>

      {/* Timeline List */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--muted)]">
              No audit entries found.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setEntityFilter("all");
              }}
              className="mt-2 text-sm text-[#A855F7] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-5 top-2 bottom-2 w-px"
              style={{ background: "var(--border)" }}
            />

            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {filtered.map((entry, idx) => {
                  const actionConfig = ACTION_ICON_MAP[entry.action] ?? {
                    icon: Shield,
                    color: "#6B7280",
                  };
                  const Icon = actionConfig.icon;

                  return (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className="relative flex items-start gap-4 py-3.5 pl-1"
                    >
                      {/* Icon */}
                      <div
                        className="relative z-10 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${actionConfig.color}15`,
                        }}
                      >
                        <Icon size={16} color={actionConfig.color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--foreground)] leading-relaxed">
                          {entry.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-[var(--muted)]">
                            by{" "}
                            <span className="font-medium text-[var(--foreground)]">
                              {entry.performedBy}
                            </span>
                          </span>
                          <span className="text-[11px] text-[var(--muted)] tabular-nums">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                          <span
                            className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium capitalize"
                            style={{
                              background: `${actionConfig.color}12`,
                              color: actionConfig.color,
                            }}
                          >
                            {entry.entityType}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ReportsTab() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("collection");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((report, i) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.key;

          return (
            <motion.button
              key={report.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200,
                delay: i * 0.06,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReport(report.key)}
              className={cn(
                "relative text-left rounded-2xl p-5 transition-all duration-200",
                isSelected
                  ? "bg-[var(--card)] shadow-lg"
                  : "bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md"
              )}
              style={{
                border: isSelected
                  ? `2px solid ${report.color}`
                  : "2px solid transparent",
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: `${report.color}15`,
                }}
              >
                <Icon
                  size={20}
                  style={{ color: report.color }}
                />
              </div>

              {/* Label */}
              <p
                className={cn(
                  "text-sm font-semibold mb-0.5",
                  isSelected
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground)]"
                )}
              >
                {report.label}
              </p>

              {/* Description */}
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                {report.description}
              </p>

              {/* Selected indicator dot */}
              {isSelected && (
                <motion.div
                  layoutId="reportIndicator"
                  className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
                  style={{ background: report.color }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Report Content */}
      <AnimatePresence mode="wait">
        {selectedReport === "collection" && (
          <CollectionSummaryReport key="collection" />
        )}
        {selectedReport === "revenue" && (
          <RevenueExpensesReport key="revenue" />
        )}
        {selectedReport === "outstanding" && (
          <OutstandingFeesReport key="outstanding" />
        )}
        {selectedReport === "audit" && <AuditTrailReport key="audit" />}
      </AnimatePresence>
    </motion.div>
  );
}
