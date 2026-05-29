"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  FileDown,
  Plus,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Target,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Bell,
  Download,
  Send,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  financialTransactions,
  feeSummary,
  upcomingPaymentDues,
} from "@/lib/demo-data";

// ── Types ─────────────────────────────────────────────────────────────

type Transaction = (typeof financialTransactions)[number];
type PaymentStatus = Transaction["status"];
type PaymentType = Transaction["type"];
type StatusFilter = "all" | PaymentStatus;
type TypeFilter = "all" | PaymentType;
type MethodFilter = "all" | string;
type SortField = "studentName" | "amount" | "date" | null;
type SortDir = "asc" | "desc";

// ── Constants ─────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;

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

const statusColors: Record<PaymentStatus, { dot: string; bg: string; text: string }> = {
  completed: { dot: "bg-[#10B981]", bg: "bg-[#10B981]/10", text: "text-[#10B981]" },
  pending: { dot: "bg-[#F59E0B]", bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]" },
  overdue: { dot: "bg-[#EF4444]", bg: "bg-[#EF4444]/10", text: "text-[#EF4444]" },
};

const typeColors: Record<PaymentType, { bg: string; text: string }> = {
  tuition: { bg: "bg-[#0891B2]/10", text: "text-[#0891B2]" },
  activity: { bg: "bg-[#A855F7]/10", text: "text-[#A855F7]" },
  supplies: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]" },
};

const urgencyColor = (daysUntil: number) => {
  if (daysUntil <= 3) return { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", border: "border-[#EF4444]/20" };
  if (daysUntil <= 7) return { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", border: "border-[#F59E0B]/20" };
  return { bg: "bg-[#10B981]/10", text: "text-[#10B981]", border: "border-[#10B981]/20" };
};

// ── Dropdown hook ─────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { open, setOpen, ref };
}

// ── Component ─────────────────────────────────────────────────────────

export default function PaymentsPage() {
  // Filter / search state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Action menu state
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Dropdown refs
  const typeDropdown = useDropdown();
  const methodDropdown = useDropdown();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActionMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Derived counts
  const counts = useMemo(() => {
    const c = { all: financialTransactions.length, completed: 0, pending: 0, overdue: 0 };
    financialTransactions.forEach((t) => c[t.status]++);
    return c;
  }, []);

  // Unique methods
  const methods = useMemo(() => {
    const s = new Set(financialTransactions.map((t) => t.method));
    return Array.from(s).sort();
  }, []);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = [...financialTransactions];

    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);
    if (methodFilter !== "all") list = list.filter((t) => t.method === methodFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.studentName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      list.sort((a, b) => {
        let cmp = 0;
        if (sortField === "studentName") cmp = a.studentName.localeCompare(b.studentName);
        else if (sortField === "amount") cmp = a.amount - b.amount;
        else if (sortField === "date") cmp = a.date.localeCompare(b.date);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return list;
  }, [statusFilter, typeFilter, methodFilter, search, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paged = filtered.slice((safeP - 1) * ITEMS_PER_PAGE, safeP * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [statusFilter, typeFilter, methodFilter, search]);

  // Sorting handler
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function sortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-[#0891B2]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-[#0891B2]" />
    );
  }

  // Selection helpers
  const allOnPageSelected = paged.length > 0 && paged.every((t) => selected.has(t.id));

  function toggleAll() {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((t) => next.delete(t.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((t) => next.add(t.id));
        return next;
      });
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Progress ring for collection rate
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (feeSummary.collectionRate / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/bursar"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Payments
            </h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              Track and process fee payments across all students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all">
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Collected */}
        <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-[var(--muted)]">Total Collected</span>
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <DollarSign className="w-[18px] h-[18px] text-[#10B981]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
            {fmtCompact.format(feeSummary.totalCollected)}
          </p>
          <p className="text-[12px] text-[#10B981] mt-1">
            of {fmtCompact.format(feeSummary.totalExpected)} expected
          </p>
        </div>

        {/* Outstanding */}
        <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-[var(--muted)]">Outstanding</span>
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
              <AlertTriangle className="w-[18px] h-[18px] text-[#F59E0B]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
            {fmtCompact.format(feeSummary.totalOutstanding)}
          </p>
          <p className="text-[12px] text-[#F59E0B] mt-1">
            {feeSummary.overdueAccounts} overdue accounts
          </p>
        </div>

        {/* This Month */}
        <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-[var(--muted)]">This Month</span>
            <div className="w-9 h-9 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
              <TrendingUp className="w-[18px] h-[18px] text-[#0891B2]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
            {fmtCompact.format(feeSummary.thisMonthCollected)}
          </p>
          <p className="text-[12px] text-[#0891B2] mt-1">
            collected in January
          </p>
        </div>

        {/* Collection Rate */}
        <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-[var(--muted)]">Collection Rate</span>
            <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 flex items-center justify-center">
              <Target className="w-[18px] h-[18px] text-[#A855F7]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="5"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                fill="none"
                stroke="#A855F7"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
                {feeSummary.collectionRate}%
              </p>
              <p className="text-[12px] text-[#A855F7] mt-0.5">on target</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Collection Table */}
        <div className="lg:col-span-8 rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Table Header: Tabs + Filters */}
          <div className="p-5 pb-0">
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-4">
              Payment Collection
            </h2>

            {/* Status tabs */}
            <div className="flex items-center gap-1 mb-4">
              {(["all", "completed", "pending", "overdue"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all flex items-center gap-1.5",
                    statusFilter === s
                      ? "bg-[#0891B2]/10 text-[#0891B2]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span
                    className={cn(
                      "text-[11px] px-1.5 py-0.5 rounded-md tabular-nums",
                      statusFilter === s
                        ? "bg-[#0891B2]/15 text-[#0891B2]"
                        : "bg-[var(--background-secondary)] text-[var(--muted)]"
                    )}
                  >
                    {counts[s]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search + filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search by student or transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type filter */}
              <div className="relative" ref={typeDropdown.ref}>
                <button
                  onClick={() => typeDropdown.setOpen(!typeDropdown.open)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-xl bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--card)] transition-all"
                >
                  {typeFilter === "all" ? "All Types" : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
                </button>
                <AnimatePresence>
                  {typeDropdown.open && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-1 right-0 z-20 min-w-[160px] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden"
                    >
                      {(["all", "tuition", "activity", "supplies"] as TypeFilter[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => { setTypeFilter(t); typeDropdown.setOpen(false); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm transition-all",
                            typeFilter === t
                              ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                              : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                          )}
                        >
                          {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Method filter */}
              <div className="relative" ref={methodDropdown.ref}>
                <button
                  onClick={() => methodDropdown.setOpen(!methodDropdown.open)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-xl bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--card)] transition-all"
                >
                  {methodFilter === "all" ? "All Methods" : methodFilter}
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
                </button>
                <AnimatePresence>
                  {methodDropdown.open && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-1 right-0 z-20 min-w-[160px] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden"
                    >
                      <button
                        onClick={() => { setMethodFilter("all"); methodDropdown.setOpen(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-all",
                          methodFilter === "all"
                            ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                            : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                        )}
                      >
                        All Methods
                      </button>
                      {methods.map((m) => (
                        <button
                          key={m}
                          onClick={() => { setMethodFilter(m); methodDropdown.setOpen(false); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm transition-all",
                            methodFilter === m
                              ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                              : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                          )}
                        >
                          {m}
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b border-[var(--border)]">
                  <th className="pl-5 pr-2 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-[var(--border)] accent-[#0891B2]"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => toggleSort("studentName")}
                      className="flex items-center text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider hover:text-[var(--foreground)] transition-colors"
                    >
                      Student {sortIcon("studentName")}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => toggleSort("amount")}
                      className="flex items-center text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider hover:text-[var(--foreground)] transition-colors"
                    >
                      Amount {sortIcon("amount")}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => toggleSort("date")}
                      className="flex items-center text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider hover:text-[var(--foreground)] transition-colors"
                    >
                      Date {sortIcon("date")}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-3 pr-5 py-3 text-right text-[12px] font-medium text-[var(--muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-sm text-[var(--muted)]">
                        No transactions found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    paged.map((t) => (
                      <motion.tr
                        key={t.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "border-b border-[var(--border)] last:border-b-0 transition-colors",
                          selected.has(t.id) ? "bg-[#0891B2]/5" : "hover:bg-[var(--background-secondary)]"
                        )}
                      >
                        <td className="pl-5 pr-2 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(t.id)}
                            onChange={() => toggleOne(t.id)}
                            className="w-4 h-4 rounded border-[var(--border)] accent-[#0891B2]"
                          />
                        </td>
                        <td className="px-3 py-3 font-mono text-[12px] text-[var(--muted)]">
                          {t.id.toUpperCase()}
                        </td>
                        <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                          {t.studentName}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded-md text-[12px] font-medium",
                              typeColors[t.type].bg,
                              typeColors[t.type].text
                            )}
                          >
                            {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-medium tabular-nums text-[var(--foreground)]">
                          {fmt.format(t.amount)}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-medium",
                              statusColors[t.status].bg,
                              statusColors[t.status].text
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[t.status].dot)} />
                            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[var(--muted)] tabular-nums">
                          {new Date(t.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-3 py-3 text-[var(--muted)]">{t.method}</td>
                        <td className="px-3 pr-5 py-3 text-right">
                          <div className="relative inline-block" ref={actionMenuId === t.id ? actionMenuRef : undefined}>
                            <button
                              onClick={() => setActionMenuId(actionMenuId === t.id ? null : t.id)}
                              className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-all"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                              {actionMenuId === t.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute top-full right-0 mt-1 z-30 w-44 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden"
                                >
                                  <button
                                    onClick={() => setActionMenuId(null)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                  <button
                                    onClick={() => setActionMenuId(null)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
                                  >
                                    <Bell className="w-4 h-4" />
                                    Send Reminder
                                  </button>
                                  <button
                                    onClick={() => setActionMenuId(null)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download Receipt
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)]">
            <p className="text-[13px] text-[var(--muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {filtered.length === 0 ? 0 : (safeP - 1) * ITEMS_PER_PAGE + 1}
              </span>
              {" "}-{" "}
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {Math.min(safeP * ITEMS_PER_PAGE, filtered.length)}
              </span>
              {" "}of{" "}
              <span className="font-medium text-[var(--foreground)] tabular-nums">{filtered.length}</span>
              {" "}transactions
              {selected.size > 0 && (
                <span className="ml-2 text-[#0891B2]">({selected.size} selected)</span>
              )}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={safeP <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--background-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[13px] font-medium transition-all tabular-nums",
                    n === safeP
                      ? "bg-[#0891B2] text-white shadow-sm shadow-[#0891B2]/25"
                      : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={safeP >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--background-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Payments Sidebar */}
        <div className="lg:col-span-4 rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden h-fit">
          <div className="p-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Upcoming Payments
              </h2>
              <Clock className="w-4 h-4 text-[var(--muted)]" />
            </div>

            <div className="space-y-3">
              {upcomingPaymentDues.map((due) => {
                const uc = urgencyColor(due.daysUntil);
                return (
                  <motion.div
                    key={due.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "rounded-xl border p-3.5 transition-all",
                      uc.border,
                      "bg-[var(--background-secondary)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {due.studentName}
                      </p>
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-md",
                          uc.bg,
                          uc.text
                        )}
                      >
                        {due.daysUntil <= 0
                          ? "Overdue"
                          : due.daysUntil === 1
                          ? "Tomorrow"
                          : `${due.daysUntil} days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[11px] font-medium px-1.5 py-0.5 rounded",
                            typeColors[due.type].bg,
                            typeColors[due.type].text
                          )}
                        >
                          {due.type.charAt(0).toUpperCase() + due.type.slice(1)}
                        </span>
                        <span className="text-[12px] text-[var(--muted)]">
                          Due{" "}
                          {new Date(due.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--foreground)] tabular-nums">
                        {fmt.format(due.amount)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Send All Reminders */}
          <div className="px-5 pb-5 pt-1">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0891B2] bg-[#0891B2]/10 border border-[#0891B2]/20 rounded-xl hover:bg-[#0891B2]/15 transition-all">
              <Send className="w-4 h-4" />
              Send All Reminders
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
