"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  MinusCircle,
  CheckCircle,
  Users,
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  FileDown,
  Printer,
  Calendar,
  Briefcase,
  Building2,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { payrollRecords, payrollSummary } from "@/lib/demo-data";

// ── Types ────────────────────────────────────────────────────────────

type PayrollRecord = (typeof payrollRecords)[number];
type SortField = "staffName" | "netPay" | "baseSalary" | null;
type SortDir = "asc" | "desc";

// ── Helpers ──────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const fmtFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Bar chart colors per department ──────────────────────────────────

const DEPT_COLORS: Record<string, string> = {
  Mathematics: "#0891B2",
  Administration: "#8B5CF6",
  English: "#F59E0B",
  Science: "#10B981",
  History: "#EF4444",
  "Student Services": "#EC4899",
};

function getDeptColor(dept: string): string {
  return DEPT_COLORS[dept] ?? "#6B7280";
}

// ── Sort Icon ────────────────────────────────────────────────────────

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" />
  );
}

// ── Payslip Detail Modal ─────────────────────────────────────────────

function PayslipModal({
  record,
  onClose,
}: {
  record: PayrollRecord;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const totalDeductions =
    record.deductions.tax + record.deductions.pension + record.deductions.insurance;
  const monthlyBase = record.baseSalary / 12;

  const handleDownload = () => {
    const lines = [
      `=== PAYSLIP - ${payrollSummary.month} ===`,
      "",
      "EMPLOYEE INFORMATION",
      `  Name:       ${record.staffName}`,
      `  Role:       ${record.role}`,
      `  Department: ${record.department}`,
      "",
      "EARNINGS",
      `  Base Salary (Monthly): ${fmtFull.format(monthlyBase)}`,
      `  Monthly Gross:         ${fmtFull.format(record.monthlyGross)}`,
      "",
      "DEDUCTIONS",
      `  Tax:       ${fmtFull.format(record.deductions.tax)}`,
      `  Pension:   ${fmtFull.format(record.deductions.pension)}`,
      `  Insurance: ${fmtFull.format(record.deductions.insurance)}`,
      `  ─────────────────────`,
      `  Total:     ${fmtFull.format(totalDeductions)}`,
      "",
      `NET PAY: ${fmtFull.format(record.netPay)}`,
      "",
      "PAYMENT INFORMATION",
      `  Method: ${record.paymentMethod}`,
      `  Date:   ${formatDate(record.paidDate)}`,
      `  Status: ${record.status}`,
      "",
      `Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${record.staffName.replace(/\s+/g, "-").toLowerCase()}-${payrollSummary.month.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--card)] shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--foreground)]">
              Payslip &mdash; {payrollSummary.month}
            </h2>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {record.staffName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Employee Info */}
          <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
              Employee Information
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Name</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {record.staffName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Role</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {record.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Department</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {record.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
              Earnings
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--muted)]">
                  Base Salary (Monthly)
                </span>
                <span className="text-[13px] text-[var(--foreground)] tabular-nums">
                  {fmtFull.format(monthlyBase)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-[13px] font-semibold text-[var(--foreground)]">
                  Monthly Gross
                </span>
                <span className="text-[14px] font-bold text-[var(--foreground)] tabular-nums">
                  {fmtFull.format(record.monthlyGross)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
                Deductions
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]/50">
                  <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)]">
                    Tax
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)] text-right tabular-nums">
                    {fmtFull.format(record.deductions.tax)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border)]/50">
                  <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)]">
                    Pension
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)] text-right tabular-nums">
                    {fmtFull.format(record.deductions.pension)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border)]/50 last:border-0">
                  <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)]">
                    Insurance
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)] text-right tabular-nums">
                    {fmtFull.format(record.deductions.insurance)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-[var(--border)] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[var(--foreground)]">
                  Total Deductions
                </span>
                <span className="text-[14px] font-bold text-[#EF4444] tabular-nums">
                  -{fmtFull.format(totalDeductions)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="rounded-xl border-2 border-[#10B981]/30 bg-[#10B981]/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--foreground)]">
                Net Pay
              </span>
              <span className="text-[22px] font-bold text-[#10B981] tabular-nums">
                {fmtFull.format(record.netPay)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
              Payment Information
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Method</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {record.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Paid Date</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {formatDate(record.paidDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Status</p>
                  <p className="text-[13px] font-medium text-[#10B981] capitalize">
                    {record.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
            >
              <FileDown className="w-3.5 h-3.5" />
              Download Payslip
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export function PayrollTab() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

  // ── Derived data ──

  const departments = useMemo(
    () =>
      Array.from(new Set(payrollRecords.map((r) => r.department))).sort(),
    []
  );

  // Department salary distribution for chart
  const deptDistribution = useMemo(() => {
    const map = new Map<string, number>();
    payrollRecords.forEach((r) => {
      map.set(r.department, (map.get(r.department) ?? 0) + r.monthlyGross);
    });
    return Array.from(map.entries())
      .map(([dept, total]) => ({ dept, total }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const maxDeptSalary = Math.max(...deptDistribution.map((d) => d.total), 1);

  // Deductions totals
  const deductionsTotals = useMemo(() => {
    let tax = 0;
    let pension = 0;
    let insurance = 0;
    payrollRecords.forEach((r) => {
      tax += r.deductions.tax;
      pension += r.deductions.pension;
      insurance += r.deductions.insurance;
    });
    const total = tax + pension + insurance;
    return { tax, pension, insurance, total };
  }, []);

  // Filtered + sorted records
  const filteredRecords = useMemo(() => {
    let data = [...payrollRecords];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((r) => r.staffName.toLowerCase().includes(q));
    }

    if (deptFilter) {
      data = data.filter((r) => r.department === deptFilter);
    }

    if (sortField) {
      const mul = sortDir === "asc" ? 1 : -1;
      data.sort((a, b) => {
        switch (sortField) {
          case "staffName":
            return mul * a.staffName.localeCompare(b.staffName);
          case "netPay":
            return mul * (a.netPay - b.netPay);
          case "baseSalary":
            return mul * (a.baseSalary - b.baseSalary);
          default:
            return 0;
        }
      });
    }

    return data;
  }, [searchQuery, deptFilter, sortField, sortDir]);

  // ── Handlers ──

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // ── Chart dimensions ──
  const chartW = 560;
  const chartH = 220;
  const barPadding = 24;
  const barGap = 16;
  const labelAreaH = 48;
  const valueAreaH = 24;
  const drawableH = chartH - labelAreaH - valueAreaH;
  const totalBarsWidth = chartW - barPadding * 2;
  const barWidth =
    (totalBarsWidth - barGap * (deptDistribution.length - 1)) /
    deptDistribution.length;

  // ── Summary cards data ──
  const summaryCards = [
    {
      label: "Gross Payroll",
      value: fmt.format(payrollSummary.totalGrossPayroll),
      icon: DollarSign,
      color: "#0891B2",
      sub: payrollSummary.month,
    },
    {
      label: "Total Deductions",
      value: fmt.format(payrollSummary.totalDeductions),
      icon: MinusCircle,
      color: "#EF4444",
      sub: `${payrollSummary.staffCount} staff`,
    },
    {
      label: "Net Payroll",
      value: fmt.format(payrollSummary.totalNetPay),
      icon: CheckCircle,
      color: "#10B981",
      sub: payrollSummary.month,
    },
    {
      label: "Staff Count",
      value: payrollSummary.staffCount,
      icon: Users,
      color: "#8B5CF6",
      sub: `Next pay: ${new Date(payrollSummary.nextPayDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200,
                delay: i * 0.05,
              }}
              className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              style={{ borderLeft: `3px solid ${card.color}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  {card.label}
                </span>
              </div>
              <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">
                {card.value}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-1">
                {card.sub}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Salary Distribution (2/3) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-8 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-5">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              Salary by Department
            </h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              Monthly gross distribution &mdash; {payrollSummary.month}
            </p>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full"
              style={{ minWidth: 400 }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
                <line
                  key={frac}
                  x1={barPadding}
                  y1={valueAreaH + drawableH * (1 - frac)}
                  x2={chartW - barPadding}
                  y2={valueAreaH + drawableH * (1 - frac)}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
              ))}

              {/* Bars */}
              {deptDistribution.map((d, i) => {
                const x = barPadding + i * (barWidth + barGap);
                const barH = (d.total / maxDeptSalary) * drawableH;
                const y = valueAreaH + drawableH - barH;
                const color = getDeptColor(d.dept);

                return (
                  <g key={d.dept}>
                    {/* Bar */}
                    <motion.rect
                      x={x}
                      y={y}
                      width={barWidth}
                      rx={4}
                      fill={color}
                      initial={{ height: 0, y: valueAreaH + drawableH }}
                      animate={{ height: barH, y }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2 + i * 0.08,
                        ease: "easeOut",
                      }}
                      opacity={0.85}
                    />
                    {/* Value label above bar */}
                    <motion.text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="var(--foreground)"
                      className="tabular-nums select-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                    >
                      {fmt.format(d.total)}
                    </motion.text>
                    {/* Department label below bar */}
                    <text
                      x={x + barWidth / 2}
                      y={chartH - labelAreaH + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--muted)"
                      className="select-none"
                    >
                      {d.dept.length > 12
                        ? d.dept.slice(0, 11) + "..."
                        : d.dept}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {deptDistribution.map((d) => (
              <div key={d.dept} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: getDeptColor(d.dept) }}
                />
                <span className="text-[11px] text-[var(--muted)]">
                  {d.dept}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deductions Breakdown (1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-5">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              Deductions Breakdown
            </h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              Total: {fmtFull.format(deductionsTotals.total)}
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                label: "Tax",
                amount: deductionsTotals.tax,
                color: "#EF4444",
              },
              {
                label: "Pension",
                amount: deductionsTotals.pension,
                color: "#F59E0B",
              },
              {
                label: "Insurance",
                amount: deductionsTotals.insurance,
                color: "#3B82F6",
              },
            ].map((item, idx) => {
              const pct =
                deductionsTotals.total > 0
                  ? (item.amount / deductionsTotals.total) * 100
                  : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="text-[13px] font-medium text-[var(--foreground)]">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
                        {fmtFull.format(item.amount)}
                      </span>
                      <span className="text-[11px] text-[var(--muted)] ml-1.5">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden bg-[var(--background-secondary)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.3 + idx * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini summary */}
          <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--muted)]">
                Avg. Deduction / Staff
              </span>
              <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                {fmtFull.format(
                  deductionsTotals.total / payrollSummary.staffCount
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--muted)]">
                Deduction Rate
              </span>
              <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                {(
                  (deductionsTotals.total / payrollSummary.totalGrossPayroll) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Staff Payroll Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          delay: 0.25,
        }}
        className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                Staff Payroll &mdash; {payrollSummary.month}
              </h3>
              <p className="text-[12px] text-[var(--muted)] mt-0.5">
                {filteredRecords.length} staff member
                {filteredRecords.length !== 1 ? "s" : ""}
                {sortField && (
                  <span>
                    {" "}
                    &middot; Sorted by{" "}
                    {sortField === "staffName"
                      ? "name"
                      : sortField === "netPay"
                        ? "net pay"
                        : "base salary"}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search by staff name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Department filter */}
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className={cn(
                  "appearance-none pl-3 pr-7 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                  "bg-[var(--background-secondary)] text-[var(--foreground)]",
                  "focus:outline-none focus:border-[var(--border)]",
                  !deptFilter && "text-[var(--muted)]"
                )}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--muted)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-[var(--border)]">
                <th
                  onClick={() => handleSort("staffName")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Staff Name
                    <SortIcon
                      field="staffName"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Department
                </th>
                <th
                  onClick={() => handleSort("baseSalary")}
                  className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5 justify-end">
                    Base Salary
                    <SortIcon
                      field="baseSalary"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Monthly Gross
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Deductions
                </th>
                <th
                  onClick={() => handleSort("netPay")}
                  className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5 justify-end">
                    Net Pay
                    <SortIcon
                      field="netPay"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-[13px] text-[var(--muted)]"
                  >
                    No staff found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const totalDed =
                    rec.deductions.tax +
                    rec.deductions.pension +
                    rec.deductions.insurance;

                  return (
                    <motion.tr
                      key={rec.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className="group transition-colors border-b border-[var(--border)]/50 last:border-b-0 hover:bg-[var(--background-secondary)]/30"
                    >
                      {/* Staff Name */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-medium text-[var(--foreground)]">
                          {rec.staffName}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--muted)]">
                          {rec.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full"
                          style={{
                            backgroundColor: `${getDeptColor(rec.department)}15`,
                            color: getDeptColor(rec.department),
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: getDeptColor(rec.department),
                            }}
                          />
                          {rec.department}
                        </span>
                      </td>

                      {/* Base Salary (annual) */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-[13px] text-[var(--foreground)] tabular-nums">
                          {fmt.format(rec.baseSalary)}
                        </span>
                      </td>

                      {/* Monthly Gross */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-[13px] text-[var(--foreground)] tabular-nums">
                          {fmtFull.format(rec.monthlyGross)}
                        </span>
                      </td>

                      {/* Deductions (total) */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-[13px] text-[#EF4444] tabular-nums">
                          -{fmtFull.format(totalDed)}
                        </span>
                      </td>

                      {/* Net Pay */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-[13px] font-semibold text-[#10B981] tabular-nums">
                          {fmtFull.format(rec.netPay)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full capitalize bg-[#10B981]/10 text-[#10B981]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          {rec.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg text-[#0891B2] hover:bg-[#0891B2]/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Payslip
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filteredRecords.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
            <p className="text-[12px] text-[var(--muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {filteredRecords.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--foreground)]">
                {payrollRecords.length}
              </span>{" "}
              staff members
            </p>
            <p className="text-[12px] text-[var(--muted)]">
              Total Net:{" "}
              <span className="font-semibold text-[#10B981] tabular-nums">
                {fmtFull.format(
                  filteredRecords.reduce((sum, r) => sum + r.netPay, 0)
                )}
              </span>
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Payslip Modal ── */}
      <AnimatePresence>
        {selectedRecord && (
          <PayslipModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
