"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Bell,
  Download,
  CreditCard,
  Building2,
  Smartphone,
  FileText,
  Users,
  Send,
  BarChart3,
  Clock,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  feeSummary,
  financialTransactions,
  monthlyRevenue,
  upcomingPaymentDues,
  monthlyFeeBreakdown,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Transaction {
  id: string;
  studentName: string;
  type: "tuition" | "activity" | "supplies";
  amount: number;
  status: "completed" | "pending" | "overdue";
  date: string;
  method: string;
}

type SortField = "studentName" | "amount" | "date";
type SortDirection = "asc" | "desc";
type RevenuePeriod = "6M" | "1Y" | "ALL";
type TransactionFilter = "all" | "completed" | "pending" | "overdue";
type TypeFilter = "all" | "tuition" | "activity" | "supplies";

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

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  completed: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  pending: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  overdue: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  tuition: { bg: "rgba(8,145,178,0.1)", text: "#0891B2" },
  activity: { bg: "rgba(168,85,247,0.1)", text: "#A855F7" },
  supplies: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
};

const ITEMS_PER_PAGE = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a smooth Bezier SVG path from normalized [0..1] data points */
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

/** Build a small sparkline SVG path */
function buildSparkPath(values: number[], w: number, h: number): string {
  if (values.length < 2) return "";
  const max = Math.max(...values, 1);
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => ({
    x: i * step,
    y: h - (v / max) * h * 0.8 - h * 0.1,
  }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + step * 0.35;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - step * 0.35;
    const cp2y = pts[i].y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
}

function daysUntilColor(days: number): string {
  if (days < 5) return "#EF4444";
  if (days <= 10) return "#F59E0B";
  return "#10B981";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OverviewTab() {
  // Revenue chart state
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("6M");

  // Transaction table state
  const [statusFilter, setStatusFilter] = useState<TransactionFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // ---------- Collection health status ----------
  const collectionHealth = feeSummary.collectionRate >= 80
    ? { status: "on-track" as const, label: "On Track", color: "#10B981", bg: "rgba(16,185,129,0.1)" }
    : feeSummary.collectionRate >= 60
      ? { status: "attention" as const, label: "Needs Attention", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" }
      : { status: "critical" as const, label: "Critical", color: "#EF4444", bg: "rgba(239,68,68,0.1)" };

  // ---------- Alerts / Notifications ----------
  // Only surface actionable, time-sensitive items not already visible in KPI cards
  const alerts = useMemo(() => {
    const items: { id: string; severity: "critical" | "warning" | "info"; icon: typeof AlertCircle; title: string; description: string }[] = [];

    // Approaching fee deadline — not shown in KPIs
    const nearestDue = upcomingPaymentDues.filter((d) => d.daysUntil <= 7);
    if (nearestDue.length > 0) {
      const soonest = nearestDue.reduce((a, b) => (a.daysUntil < b.daysUntil ? a : b));
      items.push({
        id: "deadline-approaching",
        severity: "warning",
        icon: CalendarClock,
        title: `Fee deadline in ${soonest.daysUntil} day${soonest.daysUntil !== 1 ? "s" : ""}`,
        description: `${nearestDue.length} student${nearestDue.length !== 1 ? "s" : ""} with payments due within the week`,
      });
    }

    // Payroll processing reminder
    items.push({
      id: "payroll-reminder",
      severity: "info",
      icon: Info,
      title: "Monthly payroll processing due in 3 days",
      description: "Review and approve staff payroll before Feb 25 deadline",
    });

    // Scholarship renewal deadline
    items.push({
      id: "scholarship-renewal",
      severity: "info",
      icon: CalendarClock,
      title: "Scholarship renewals due next week",
      description: "8 students require scholarship re-evaluation for the coming term",
    });

    return items;
  }, []);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(id));
  };

  const SEVERITY_STYLES = {
    critical: { border: "#EF4444", bg: "rgba(239,68,68,0.06)", icon: "#EF4444", text: "#EF4444" },
    warning: { border: "#F59E0B", bg: "rgba(245,158,11,0.06)", icon: "#F59E0B", text: "#F59E0B" },
    info: { border: "#0891B2", bg: "rgba(8,145,178,0.06)", icon: "#0891B2", text: "#0891B2" },
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setOpenActionMenu(null);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------- Revenue data ----------
  const revenueData = monthlyRevenue[revenuePeriod];
  const currentRevenue = revenueData[revenueData.length - 1]?.collected ?? 0;
  const prevRevenue = revenueData[revenueData.length - 2]?.collected ?? 0;
  const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  // ---------- Transaction filtering & sorting ----------
  const txns = financialTransactions as Transaction[];

  const statusCounts = useMemo(() => {
    const counts = { all: txns.length, completed: 0, pending: 0, overdue: 0 };
    txns.forEach((t) => counts[t.status]++);
    return counts;
  }, [txns]);

  const filtered = useMemo(() => {
    let result = [...txns];
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    if (typeFilter !== "all") result = result.filter((t) => t.type === typeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.studentName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "studentName") cmp = a.studentName.localeCompare(b.studentName);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return result;
  }, [txns, statusFilter, typeFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const toggleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllRows = () => {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((t) => t.id)));
    }
  };

  // Sparkline mock data
  const sparkCollected = [65, 72, 80, 78, 92, 88, 95, 100];
  const sparkOutstanding = [30, 28, 35, 32, 25, 22, 28, 30];

  // Total accounts (from dashboard stats)
  const totalAccounts = 1247;

  // Chart dimensions
  const chartW = 600;
  const chartH = 200;
  const chartPad = 24;

  // ---------- Render ----------
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* ================================================================== */}
      {/* ROW 1: Financial Health Banner + KPI Cards                         */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ---------- Financial Health Banner ---------- */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 rounded-2xl h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,145,178,0.10) 0%, rgba(8,145,178,0.04) 40%, var(--card) 100%)",
          }}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Title + Health Status */}
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-[var(--foreground)]">
                  Financial Overview
                </p>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: collectionHealth.bg, color: collectionHealth.color }}
                >
                  {collectionHealth.status === "on-track" ? (
                    <CheckCircle2 size={10} />
                  ) : collectionHealth.status === "attention" ? (
                    <AlertCircle size={10} />
                  ) : (
                    <AlertTriangle size={10} />
                  )}
                  {collectionHealth.label}
                </span>
              </div>
              <p className="text-[12px] text-[var(--muted)] mt-0.5">Spring Term 2026</p>
            </div>

            {/* Arc + Decorative illustration */}
            <div className="flex-1 flex items-center justify-between gap-4 min-h-[120px] mt-2">
              {/* Semicircle Arc */}
              <div className="flex flex-col items-center">
                <svg width="120" height="72" viewBox="0 0 120 72">
                  {/* Background arc */}
                  <path
                    d="M 16 56 A 44 44 0 0 1 104 56"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                  {/* Animated foreground arc */}
                  <motion.path
                    d="M 16 56 A 44 44 0 0 1 104 56"
                    fill="none"
                    stroke="#0891B2"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 44}`}
                    strokeDashoffset={`${Math.PI * 44 * (1 - feeSummary.collectionRate / 100)}`}
                    initial={{ strokeDashoffset: Math.PI * 44 }}
                    animate={{ strokeDashoffset: Math.PI * 44 * (1 - feeSummary.collectionRate / 100) }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  />
                </svg>
                <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums -mt-6">
                  {feeSummary.collectionRate}%
                </p>
                <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
                  Collection Rate
                </p>
              </div>

              {/* Decorative abstract shapes */}
              <svg
                width="100"
                height="90"
                viewBox="0 0 100 90"
                className="flex-shrink-0 opacity-60"
              >
                <rect x="20" y="10" width="60" height="45" rx="8" fill="#0891B2" opacity="0.08" />
                <rect x="28" y="18" width="60" height="45" rx="8" fill="#0891B2" opacity="0.12" />
                <circle cx="48" cy="40" r="12" fill="#0891B2" opacity="0.15" />
                <circle cx="68" cy="36" r="8" fill="#0891B2" opacity="0.10" />
                <text x="48" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0891B2" opacity="0.25">$</text>
                <circle cx="30" cy="65" r="10" fill="#0891B2" opacity="0.10" />
                <circle cx="50" cy="68" r="8" fill="#0891B2" opacity="0.08" />
                <circle cx="66" cy="70" r="6" fill="#0891B2" opacity="0.06" />
              </svg>
            </div>

            {/* Bottom metrics */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[var(--border)]">
              <div>
                <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {fmtCompact.format(feeSummary.totalCollected)}
                </p>
                <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
                  Collected
                </p>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div>
                <p className="text-[20px] font-bold text-[#F59E0B] tabular-nums leading-tight">
                  {fmtCompact.format(feeSummary.totalOutstanding)}
                </p>
                <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
                  Outstanding
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- 3 KPI Stat Cards ---------- */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {/* KPI 1: This Month Collected */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px] px-5 py-4 flex items-center justify-between gap-3"
            style={{ borderLeftColor: "#10B981" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.08)" }}
              >
                <DollarSign className="w-5 h-5" style={{ color: "#10B981" }} />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {fmt.format(feeSummary.thisMonthCollected)}
                </p>
                <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5 truncate">This Month Collected</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">of $100K target</p>
              </div>
            </div>
            <div className="flex-shrink-0 w-[80px]">
              <svg viewBox="0 0 80 30" className="w-full h-[30px]" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bursarSpk0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={buildSparkPath(sparkCollected, 80, 30) + ` L 80,30 L 0,30 Z`}
                  fill="url(#bursarSpk0)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <motion.path
                  d={buildSparkPath(sparkCollected, 80, 30)}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                />
              </svg>
            </div>
          </motion.div>

          {/* KPI 2: Outstanding Balance */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px] px-5 py-4 flex items-center justify-between gap-3"
            style={{ borderLeftColor: "#F59E0B" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.08)" }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: "#F59E0B" }} />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {fmt.format(feeSummary.totalOutstanding)}
                </p>
                <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5 truncate">Outstanding Balance</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                  {feeSummary.overdueAccounts} overdue accounts
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-[80px]">
              <svg viewBox="0 0 80 30" className="w-full h-[30px]" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bursarSpk1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={buildSparkPath(sparkOutstanding, 80, 30) + ` L 80,30 L 0,30 Z`}
                  fill="url(#bursarSpk1)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.38 }}
                />
                <motion.path
                  d={buildSparkPath(sparkOutstanding, 80, 30)}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.38, ease: "easeOut" }}
                />
              </svg>
            </div>
          </motion.div>

          {/* KPI 3: Overdue Accounts */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px] px-5 py-4 flex items-center justify-between gap-3"
            style={{ borderLeftColor: "#EF4444" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(239,68,68,0.08)" }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "#EF4444" }} />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {feeSummary.overdueAccounts}
                </p>
                <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5 truncate">Overdue Accounts</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                  of {totalAccounts.toLocaleString()} total accounts
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="3"
                  opacity="0.3"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="14"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - feeSummary.overdueAccounts / totalAccounts)}`}
                  transform="rotate(-90 20 20)"
                  initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 14 * (1 - feeSummary.overdueAccounts / totalAccounts),
                  }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
                <text
                  x="20"
                  y="21"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#EF4444"
                >
                  {feeSummary.overdueAccounts}
                </text>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ALERTS & NOTIFICATIONS                                             */}
      {/* ================================================================== */}
      <AnimatePresence>
        {visibleAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {visibleAlerts.map((alert, idx) => {
              const style = SEVERITY_STYLES[alert.severity];
              const Icon = alert.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl border-l-[3px]"
                  style={{
                    borderLeftColor: style.border,
                    background: style.bg,
                  }}
                >
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                    style={{ background: `${style.icon}15` }}
                  >
                    <Icon size={14} style={{ color: style.icon }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--foreground)]">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-[var(--muted)] mt-0.5">
                      {alert.description}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* ROW 2: Revenue Trend Chart + Fee Type Distribution                 */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---------- Revenue Trend Chart ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                  Revenue Trend
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                    revenueChange >= 0
                      ? "bg-[rgba(16,185,129,0.1)] text-[#10B981]"
                      : "bg-[rgba(239,68,68,0.1)] text-[#EF4444]"
                  )}
                >
                  {revenueChange >= 0 ? "+" : ""}
                  {revenueChange.toFixed(1)}%
                </span>
              </div>
              <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-1">
                {fmt.format(currentRevenue)}
              </p>
            </div>

            {/* Period toggle */}
            <div className="flex items-center gap-1 rounded-lg bg-[var(--background-secondary)] p-1">
              {(["6M", "1Y", "ALL"] as RevenuePeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setRevenuePeriod(p)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    revenuePeriod === p
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#10B981" }} />
              <span className="text-xs text-[var(--muted)]">Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B" }} />
              <span className="text-xs text-[var(--muted)]">Outstanding</span>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH + 30}`}
              className="w-full"
              style={{ minWidth: 400 }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gradOutstanding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
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

              {/* Outstanding area */}
              <motion.path
                d={buildAreaPath(
                  revenueData.map((d) => d.outstanding),
                  chartW,
                  chartH,
                  chartPad
                )}
                fill="url(#gradOutstanding)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.path
                d={buildCurvePath(
                  revenueData.map((d) => d.outstanding),
                  chartW,
                  chartH,
                  chartPad
                )}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              {/* Collected area */}
              <motion.path
                d={buildAreaPath(
                  revenueData.map((d) => d.collected),
                  chartW,
                  chartH,
                  chartPad
                )}
                fill="url(#gradCollected)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.path
                d={buildCurvePath(
                  revenueData.map((d) => d.collected),
                  chartW,
                  chartH,
                  chartPad
                )}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
              />

              {/* Data points - collected */}
              {revenueData.map((d, i) => {
                const maxVal = Math.max(...revenueData.map((r) => r.collected), 1);
                const x = (i / (revenueData.length - 1)) * chartW;
                const y = chartPad + (chartH - chartPad * 2) - (d.collected / maxVal) * (chartH - chartPad * 2);
                return (
                  <motion.circle
                    key={`c-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#10B981"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                  />
                );
              })}

              {/* X-axis labels */}
              {revenueData.map((d, i) => {
                const x = (i / (revenueData.length - 1)) * chartW;
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={chartH + 20}
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

        {/* ---------- Fee Type Distribution ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-1 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
            Fee Breakdown
          </h3>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-5">
            {[
              { label: "Tuition", color: "#0891B2" },
              { label: "Activity", color: "#A855F7" },
              { label: "Supplies", color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-[11px] text-[var(--muted)]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Stacked horizontal bars */}
          <div className="space-y-4">
            {monthlyFeeBreakdown.map((m, idx) => {
              const total = m.tuition + m.activity + m.supplies;
              const tPct = (m.tuition / total) * 100;
              const aPct = (m.activity / total) * 100;
              const sPct = (m.supplies / total) * 100;

              return (
                <div key={m.month}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      {m.month}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-nums">
                      {fmtCompact.format(total)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden flex bg-[var(--background-secondary)]">
                    <motion.div
                      className="h-full rounded-l-full"
                      style={{ background: "#0891B2" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${tPct}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                    />
                    <motion.div
                      className="h-full"
                      style={{ background: "#A855F7" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${aPct}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + idx * 0.08 }}
                    />
                    <motion.div
                      className="h-full rounded-r-full"
                      style={{ background: "#F59E0B" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${sPct}%` }}
                      transition={{ duration: 0.6, delay: 0.4 + idx * 0.08 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ================================================================== */}
      {/* ROW 3: Recent Transactions Table + Sidebar Cards                   */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ---------- Recent Transactions Table ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-8 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                Recent Transactions
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1 rounded-lg bg-[var(--background-secondary)] p-1">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "completed", label: "Completed" },
                  { key: "pending", label: "Pending" },
                  { key: "overdue", label: "Overdue" },
                ] as { key: TransactionFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                    statusFilter === tab.key
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {tab.label}
                  <span className="ml-1.5 tabular-nums opacity-60">
                    {statusCounts[tab.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search + Type filter */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Type filter dropdown */}
            <div className="relative" ref={typeDropdownRef}>
              <button
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] transition-colors hover:bg-[var(--background-secondary)]",
                  typeFilter !== "all"
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)]"
                )}
              >
                <span className="text-xs">
                  {typeFilter === "all"
                    ? "All Types"
                    : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                </span>
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {typeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-20 py-1"
                  >
                    {(
                      [
                        { key: "all", label: "All Types" },
                        { key: "tuition", label: "Tuition" },
                        { key: "activity", label: "Activity" },
                        { key: "supplies", label: "Supplies" },
                      ] as { key: TypeFilter; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setTypeFilter(opt.key);
                          setTypeDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-xs transition-colors",
                          typeFilter === opt.key
                            ? "text-[#0891B2] bg-[rgba(8,145,178,0.06)]"
                            : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2.5 pr-2 text-left w-8">
                    <input
                      type="checkbox"
                      checked={
                        paginated.length > 0 && selectedRows.size === paginated.length
                      }
                      onChange={toggleAllRows}
                      className="rounded border-[var(--border)] accent-[#0891B2]"
                    />
                  </th>
                  <th className="py-2.5 px-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    ID
                  </th>
                  <th
                    className="py-2.5 px-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                    onClick={() => toggleSort("studentName")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Student
                      {sortField === "studentName" && (
                        <span className="text-[10px]">
                          {sortDirection === "asc" ? "\u2191" : "\u2193"}
                        </span>
                      )}
                    </span>
                  </th>
                  <th className="py-2.5 px-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="py-2.5 px-2 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                    onClick={() => toggleSort("amount")}
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      Amount
                      {sortField === "amount" && (
                        <span className="text-[10px]">
                          {sortDirection === "asc" ? "\u2191" : "\u2193"}
                        </span>
                      )}
                    </span>
                  </th>
                  <th className="py-2.5 px-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="py-2.5 px-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                    onClick={() => toggleSort("date")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Date
                      {sortField === "date" && (
                        <span className="text-[10px]">
                          {sortDirection === "asc" ? "\u2191" : "\u2193"}
                        </span>
                      )}
                    </span>
                  </th>
                  <th className="py-2.5 px-2 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                    Method
                  </th>
                  <th className="py-2.5 pl-2 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider w-10">
                    {/* Actions */}
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginated.map((txn) => (
                    <motion.tr
                      key={txn.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background-secondary)] transition-colors",
                        selectedRows.has(txn.id) && "bg-[rgba(8,145,178,0.04)]"
                      )}
                    >
                      <td className="py-3 pr-2">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(txn.id)}
                          onChange={() => toggleRowSelect(txn.id)}
                          className="rounded border-[var(--border)] accent-[#0891B2]"
                        />
                      </td>
                      <td className="py-3 px-2 text-xs text-[var(--muted)] tabular-nums">
                        {txn.id}
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-[var(--foreground)]">
                        {txn.studentName}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                          style={{
                            background: TYPE_COLORS[txn.type].bg,
                            color: TYPE_COLORS[txn.type].text,
                          }}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-[var(--foreground)] tabular-nums text-right font-medium">
                        {fmt.format(txn.amount)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                          style={{
                            background: STATUS_COLORS[txn.status].bg,
                            color: STATUS_COLORS[txn.status].text,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: STATUS_COLORS[txn.status].dot }}
                          />
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-[var(--muted)] tabular-nums whitespace-nowrap">
                        {new Date(txn.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-2 text-xs text-[var(--muted)] hidden md:table-cell">
                        {txn.method}
                      </td>
                      <td className="py-3 pl-2 text-right relative">
                        <button
                          onClick={() =>
                            setOpenActionMenu(openActionMenu === txn.id ? null : txn.id)
                          }
                          className="p-1 rounded-md hover:bg-[var(--background-secondary)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)]"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        <AnimatePresence>
                          {openActionMenu === txn.id && (
                            <motion.div
                              ref={actionMenuRef}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1"
                            >
                              <button
                                onClick={() => setOpenActionMenu(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <Eye size={13} />
                                View Details
                              </button>
                              <button
                                onClick={() => setOpenActionMenu(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <Bell size={13} />
                                Send Reminder
                              </button>
                              <button
                                onClick={() => setOpenActionMenu(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <Download size={13} />
                                Download Receipt
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-sm text-[var(--muted)]"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted)]">
                Page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 text-xs rounded-md transition-colors tabular-nums",
                      page === safePage
                        ? "bg-[#0891B2] text-white font-medium"
                        : "text-[var(--muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* ---------- Sidebar Cards ---------- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Upcoming Payments */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[var(--muted)]" />
              <p className="text-[15px] font-semibold text-[var(--foreground)]">
                Upcoming Payments
              </p>
            </div>

            <div className="space-y-3">
              {upcomingPaymentDues.slice(0, 5).map((due, idx) => {
                const urgencyColor = daysUntilColor(due.daysUntil);
                return (
                  <motion.div
                    key={due.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.3 + idx * 0.06 }}
                    className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-b-0"
                  >
                    <div
                      className="flex-shrink-0 w-1.5 h-10 rounded-full"
                      style={{ background: urgencyColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">
                        {due.studentName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(due.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{
                            background: `${urgencyColor}15`,
                            color: urgencyColor,
                          }}
                        >
                          {due.daysUntil}d
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: urgencyColor }}
                    >
                      {fmt.format(due.amount)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <button className="w-full mt-4 text-center text-xs font-medium text-[#0891B2] hover:text-[#0891B2]/80 transition-colors py-2 rounded-lg hover:bg-[rgba(8,145,178,0.06)]">
              View All
            </button>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[var(--muted)]" />
              <p className="text-[15px] font-semibold text-[var(--foreground)]">
                Accepted Methods
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: CreditCard,
                  label: "Credit Card",
                  desc: "Visa, Mastercard, Amex",
                  color: "#0891B2",
                },
                {
                  icon: Building2,
                  label: "Bank Transfer",
                  desc: "Direct deposit & wire",
                  color: "#10B981",
                },
                {
                  icon: Smartphone,
                  label: "Mobile Money",
                  desc: "M-Pesa, MTN, Airtel",
                  color: "#A855F7",
                },
              ].map((method, idx) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.35 + idx * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${method.color}12` }}
                  >
                    <method.icon size={16} color={method.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {method.label}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">{method.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: FileText, label: "Generate Invoices", color: "#0891B2" },
                { icon: Users, label: "Run Payroll", color: "#10B981" },
                { icon: Send, label: "Send Reminders", color: "#F59E0B" },
                { icon: BarChart3, label: "View Reports", color: "#A855F7" },
              ].map((action, idx) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.4 + idx * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${action.color}12` }}
                  >
                    <action.icon size={16} color={action.color} />
                  </div>
                  <span className="text-[11px] font-medium text-[var(--foreground)] text-center leading-tight">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
