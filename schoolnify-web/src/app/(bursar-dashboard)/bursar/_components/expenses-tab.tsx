"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingDown,
  Clock,
  CheckCircle,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { expenses, expenseCategories, budgetSummary } from "@/lib/demo-data";

// ── Types ─────────────────────────────────────────────────────────────

type ExpenseStatus = "approved" | "pending";
type StatusFilter = "all" | "approved" | "pending";
type SortField = "amount" | "date" | null;
type SortDir = "asc" | "desc";

type Expense = (typeof expenses)[number];

// ── Constants ─────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const fmtCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const fmtFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const STATUS_STYLES: Record<ExpenseStatus, { bg: string; dot: string; text: string }> = {
  approved: {
    bg: "rgba(16,185,129,0.1)",
    dot: "#10B981",
    text: "#10B981",
  },
  pending: {
    bg: "rgba(245,158,11,0.1)",
    dot: "#F59E0B",
    text: "#F59E0B",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  salaries: "#0891B2",
  supplies: "#A855F7",
  utilities: "#F59E0B",
  maintenance: "#EF4444",
  technology: "#10B981",
  transport: "#3B82F6",
  events: "#EC4899",
};

const CATEGORY_LABELS: Record<string, string> = {
  salaries: "Salaries",
  supplies: "Supplies",
  utilities: "Utilities",
  maintenance: "Maintenance",
  technology: "Technology",
  transport: "Transport",
  events: "Events",
};

// ── Helpers ───────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Sort Icon ─────────────────────────────────────────────────────────

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

// ── Donut Chart ───────────────────────────────────────────────────────

function DonutChart({
  data,
}: {
  data: { name: string; spent: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.spent, 0);
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 68;
  const strokeWidth = 28;

  // Build arc segments
  let cumulativeAngle = -90; // start at top
  const segments = data.map((d) => {
    const angle = total > 0 ? (d.spent / total) * 360 : 0;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return { ...d, startAngle, angle };
  });

  function polarToCartesian(
    centerX: number,
    centerY: number,
    r: number,
    angleDeg: number
  ) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  }

  function describeArc(
    x: number,
    y: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Data segments */}
        {segments.map((seg, i) => {
          if (seg.angle < 0.5) return null;
          const endAngle = seg.startAngle + Math.max(seg.angle - 1, 0.5);
          return (
            <motion.path
              key={seg.name}
              d={describeArc(cx, cy, radius, seg.startAngle, endAngle)}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: "easeOut" }}
            />
          );
        })}
        {/* Center text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="700"
          fill="var(--foreground)"
        >
          {fmtCompact.format(total)}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="var(--muted)"
        >
          Total Spent
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 space-y-2 w-full">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-[11px] text-[var(--muted)] flex-1 truncate">
              {d.name}
            </span>
            <span className="text-[11px] font-medium text-[var(--foreground)] tabular-nums">
              {fmt.format(d.spent)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────

export function ExpensesTab() {
  // ── State ──
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    }
    if (categoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [categoryDropdownOpen]);

  // ── Budget summary cards ──
  const spentPct = ((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100).toFixed(1);
  const remainingPct = ((budgetSummary.remainingBudget / budgetSummary.totalBudget) * 100).toFixed(1);

  const summaryCards = [
    {
      label: "Total Budget",
      value: fmtCompact.format(budgetSummary.totalBudget),
      sub: `FY ${budgetSummary.fiscalYear}`,
      icon: Wallet,
      color: "#0891B2",
      progress: 100,
    },
    {
      label: "Total Spent",
      value: fmtCompact.format(budgetSummary.totalSpent),
      sub: `${spentPct}% of budget`,
      icon: TrendingDown,
      color: "#EF4444",
      progress: parseFloat(spentPct),
    },
    {
      label: "Committed",
      value: fmtCompact.format(budgetSummary.totalCommitted),
      sub: "Pending approval",
      icon: Clock,
      color: "#F59E0B",
      progress: (budgetSummary.totalCommitted / budgetSummary.totalBudget) * 100,
    },
    {
      label: "Remaining",
      value: fmtCompact.format(budgetSummary.remainingBudget),
      sub: `${remainingPct}% remaining`,
      icon: CheckCircle,
      color: "#10B981",
      progress: parseFloat(remainingPct),
    },
  ];

  // ── Tab counts ──
  const tabCounts = useMemo(() => {
    return {
      all: expenses.length,
      approved: expenses.filter((e) => e.status === "approved").length,
      pending: expenses.filter((e) => e.status === "pending").length,
    };
  }, []);

  // ── Categories sorted by budget desc ──
  const sortedCategories = useMemo(() => {
    return [...expenseCategories].sort((a, b) => b.budget - a.budget);
  }, []);

  // ── Donut chart data ──
  const donutData = useMemo(() => {
    return sortedCategories.map((cat) => ({
      name: cat.name,
      spent: cat.spent,
      color: cat.color,
    }));
  }, [sortedCategories]);

  // ── Unique categories for filter ──
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.category))).sort();
  }, []);

  // ── Filtered + sorted expenses ──
  const filteredExpenses = useMemo(() => {
    let data = [...expenses];

    // Tab filter
    if (activeTab !== "all") {
      data = data.filter((e) => e.status === activeTab);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.vendor.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter) {
      data = data.filter((e) => e.category === categoryFilter);
    }

    // Sort
    if (sortField) {
      const mul = sortDir === "asc" ? 1 : -1;
      data.sort((a, b) => {
        if (sortField === "amount") return mul * (a.amount - b.amount);
        if (sortField === "date")
          return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
        return 0;
      });
    }

    return data;
  }, [activeTab, searchQuery, categoryFilter, sortField, sortDir]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedExpenses = filteredExpenses.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, categoryFilter]);

  // ── Sort handler ──
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ================================================================ */}
      {/* ROW 1: Budget Summary Cards                                      */}
      {/* ================================================================ */}
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
              <p className="text-[11px] text-[var(--muted)] mt-1">{card.sub}</p>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: card.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(card.progress, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* ROW 2: Budget by Category (2/3) | Donut Chart (1/3)              */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ---------- Budget Allocation by Category ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-8 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-5">
            Budget Allocation by Category
          </h3>

          <div className="space-y-4">
            {sortedCategories.map((cat, idx) => {
              const pct = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + idx * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-[var(--foreground)]">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[var(--muted)] tabular-nums">
                        {fmt.format(cat.spent)} / {fmt.format(cat.budget)}
                      </span>
                      <span
                        className="text-[11px] font-medium tabular-nums min-w-[40px] text-right"
                        style={{ color: cat.color }}
                      >
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-[var(--background-secondary)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2 + idx * 0.08,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ---------- Spending Distribution Donut ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-5">
            Spending Distribution
          </h3>
          <DonutChart data={donutData} />
        </motion.div>
      </div>

      {/* ================================================================ */}
      {/* ROW 3: Expense Table                                             */}
      {/* ================================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          delay: 0.2,
        }}
        className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                Expenses
              </h3>
              <p className="text-[12px] text-[var(--muted)] mt-0.5">
                {filteredExpenses.length} expense
                {filteredExpenses.length !== 1 ? "s" : ""}
                {sortField && (
                  <span>
                    {" "}
                    &middot; Sorted by {sortField}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() =>
                alert("Add Expense form would open here.")
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-xl bg-[#0891B2] text-white hover:bg-[#0891B2]/90 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Expense
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tab Pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
              {(
                [
                  { key: "all" as StatusFilter, label: "All" },
                  { key: "approved" as StatusFilter, label: "Approved" },
                  { key: "pending" as StatusFilter, label: "Pending" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                    activeTab === tab.key
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {tab.label}
                  <span className="ml-1 tabular-nums opacity-60">
                    {tabCounts[tab.key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search by description or vendor..."
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

            {/* Category filter dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                  "bg-[var(--background-secondary)]",
                  "focus:outline-none focus:border-[var(--border)]",
                  categoryFilter
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)]"
                )}
              >
                <span>
                  {categoryFilter
                    ? CATEGORY_LABELS[categoryFilter] || categoryFilter
                    : "All Categories"}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {categoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-20 py-1"
                  >
                    <button
                      onClick={() => {
                        setCategoryFilter("");
                        setCategoryDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-[12px] transition-colors",
                        !categoryFilter
                          ? "text-[#0891B2] bg-[rgba(8,145,178,0.06)]"
                          : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                      )}
                    >
                      All Categories
                    </button>
                    {uniqueCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategoryFilter(cat);
                          setCategoryDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-[12px] transition-colors flex items-center gap-2",
                          categoryFilter === cat
                            ? "text-[#0891B2] bg-[rgba(8,145,178,0.06)]"
                            : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                        )}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: CATEGORY_COLORS[cat] || "var(--muted)",
                          }}
                        />
                        {CATEGORY_LABELS[cat] || cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-[var(--border)]">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Category
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5 justify-end">
                    Amount
                    <SortIcon
                      field="amount"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Date
                    <SortIcon
                      field="date"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden xl:table-cell">
                  Approved By
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                  Receipt Ref
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-[13px] text-[var(--muted)]"
                  >
                    No expenses found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((expense, index) => {
                  const catColor =
                    CATEGORY_COLORS[expense.category] || "var(--muted)";
                  const statusStyle = STATUS_STYLES[expense.status];

                  return (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className="group border-b border-[var(--border)]/50 last:border-b-0 hover:bg-[var(--background-secondary)]/30 transition-colors"
                    >
                      {/* Description */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-medium text-[var(--foreground)]">
                          {expense.description}
                        </span>
                      </td>

                      {/* Category badge */}
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                          style={{
                            background: `${catColor}15`,
                            color: catColor,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: catColor }}
                          />
                          {CATEGORY_LABELS[expense.category] || expense.category}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
                          {fmtFull.format(expense.amount)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--muted)] tabular-nums whitespace-nowrap">
                          {formatDate(expense.date)}
                        </span>
                      </td>

                      {/* Vendor */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-[13px] text-[var(--muted)]">
                          {expense.vendor}
                        </span>
                      </td>

                      {/* Approved By */}
                      <td className="px-4 py-4 hidden xl:table-cell">
                        <span className="text-[13px] text-[var(--muted)]">
                          {expense.approvedBy}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: statusStyle.dot }}
                          />
                          {expense.status}
                        </span>
                      </td>

                      {/* Receipt Ref */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-[13px] font-mono text-[var(--muted)]">
                          {expense.receiptRef}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredExpenses.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
            <p className="text-[12px] text-[var(--muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {(safePage - 1) * ITEMS_PER_PAGE + 1}&ndash;
                {Math.min(safePage * ITEMS_PER_PAGE, filteredExpenses.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--foreground)]">
                {filteredExpenses.length}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <div className="flex items-center gap-0.5 mx-1">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 text-[12px] rounded-lg font-medium transition-all tabular-nums",
                      page === safePage
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
