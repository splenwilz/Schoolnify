"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  AlertTriangle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Bell,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  AlertCircle,
  CalendarClock,
  Info,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  librarySummary,
  libraryLoans,
  monthlyCirculation,
  popularBooks,
  libraryFines,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "bookTitle" | "memberName" | "issueDate" | "dueDate";
type SortDirection = "asc" | "desc";
type CirculationPeriod = "6M" | "1Y";
type LoanFilter = "all" | "checked_out" | "returned" | "overdue" | "renewed";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  checked_out: { dot: "#3B82F6", bg: "rgba(59,130,246,0.1)", text: "#3B82F6" },
  returned: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  overdue: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444" },
  renewed: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
};

const STATUS_LABELS: Record<string, string> = {
  checked_out: "Checked Out",
  returned: "Returned",
  overdue: "Overdue",
  renewed: "Renewed",
};

const ITEMS_PER_PAGE = 5;

const SEVERITY_STYLES: Record<string, { border: string; icon: string; bg: string }> = {
  critical: { border: "#EF4444", icon: "#EF4444", bg: "rgba(239,68,68,0.06)" },
  warning: { border: "#F59E0B", icon: "#F59E0B", bg: "rgba(245,158,11,0.06)" },
  info: { border: "#3B82F6", icon: "#3B82F6", bg: "rgba(59,130,246,0.06)" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildCurvePath(points: number[], width: number, height: number, padding = 0): string {
  if (points.length < 2) return "";
  const max = Math.max(...points, 1);
  const h = height - padding * 2;
  const step = width / (points.length - 1);
  const pts = points.map((v, i) => ({ x: i * step, y: padding + h - (v / max) * h }));
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

function buildAreaPath(points: number[], width: number, height: number, padding = 0): string {
  const curve = buildCurvePath(points, width, height, padding);
  if (!curve) return "";
  return `${curve} L ${width},${height} L 0,${height} Z`;
}

function buildSparkPath(values: number[], w: number, h: number): string {
  if (values.length < 2) return "";
  const max = Math.max(...values, 1);
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => ({ x: i * step, y: h - (v / max) * h * 0.8 - h * 0.1 }));
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OverviewTab() {
  const [circulationPeriod, setCirculationPeriod] = useState<CirculationPeriod>("6M");
  const [statusFilter, setStatusFilter] = useState<LoanFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("issueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Health status
  const collectionHealth = useMemo(() => {
    const rate = librarySummary.returnRate;
    if (rate >= 85) return { label: "On Track", color: "#10B981", bg: "rgba(16,185,129,0.15)" };
    if (rate >= 70) return { label: "Needs Attention", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
    return { label: "Critical", color: "#EF4444", bg: "rgba(239,68,68,0.15)" };
  }, []);

  // Alerts
  const alerts = useMemo(() => {
    const items: { id: string; severity: "critical" | "warning" | "info"; message: string; icon: typeof AlertCircle }[] = [];
    const overdueLoans = libraryLoans.filter(l => l.status === "overdue");
    const longOverdue = overdueLoans.filter(l => {
      const due = new Date(l.dueDate);
      const now = new Date("2026-03-03");
      return (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24) > 14;
    });
    if (longOverdue.length > 0) {
      items.push({ id: "long_overdue", severity: "critical", message: `${longOverdue.length} book(s) overdue by more than 14 days. consider sending final reminders`, icon: AlertCircle });
    }
    const pendingReservations = 3;
    if (pendingReservations > 0) {
      items.push({ id: "reservations", severity: "info", message: `${pendingReservations} book reservations awaiting fulfillment`, icon: CalendarClock });
    }
    const lowStockBooks = ["World History: Patterns of Interaction"];
    if (lowStockBooks.length > 0) {
      items.push({ id: "low_stock", severity: "warning", message: `Low stock: ${lowStockBooks.join(", ")} (1 copy left)`, icon: Info });
    }
    return items;
  }, []);

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));

  // Chart data
  const chartData = circulationPeriod === "6M" ? monthlyCirculation : monthlyCirculation;
  const issuedValues = chartData.map(d => d.issued);
  const returnedValues = chartData.map(d => d.returned);

  // Table data
  const filteredLoans = useMemo(() => {
    let data = [...libraryLoans];
    if (statusFilter !== "all") data = data.filter(l => l.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(l => l.bookTitle.toLowerCase().includes(q) || l.memberName.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "bookTitle") return a.bookTitle.localeCompare(b.bookTitle) * dir;
      if (sortField === "memberName") return a.memberName.localeCompare(b.memberName) * dir;
      if (sortField === "issueDate") return (new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()) * dir;
      if (sortField === "dueDate") return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
      return 0;
    });
    return data;
  }, [statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
  const paginatedLoans = filteredLoans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const statusCounts = useMemo(() => ({
    all: libraryLoans.length,
    checked_out: libraryLoans.filter(l => l.status === "checked_out").length,
    returned: libraryLoans.filter(l => l.status === "returned").length,
    overdue: libraryLoans.filter(l => l.status === "overdue").length,
    renewed: libraryLoans.filter(l => l.status === "renewed").length,
  }), []);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedLoans.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginatedLoans.map(l => l.id)));
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  // Sparkline data for KPIs
  const booksSpark = [2800, 2810, 2820, 2830, 2840, 2847];
  const membersSpark = [820, 830, 838, 845, 850, 856];

  // Semicircle arc for return rate
  const returnRate = librarySummary.returnRate;
  const R = 44;
  const semiCircum = Math.PI * R;
  const arcLength = (returnRate / 100) * semiCircum;

  return (
    <div className="space-y-4">
      {/* ── ROW 1: Banner + KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Library Health Banner */}
        <div className="lg:col-span-5 rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.04) 100%)" }}>
          <div className="absolute inset-0 border border-[#10B981]/10 rounded-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Library Overview</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: collectionHealth.bg, color: collectionHealth.color }}>{collectionHealth.label}</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mb-3">Academic Year 2025-2026</p>
            <div className="flex items-end gap-5">
              <div className="flex flex-col items-center">
                <svg width="120" height="72" viewBox="0 0 120 72">
                  <path d="M 16,64 A 44,44 0 0,1 104,64" fill="none" stroke="var(--border)" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 16,64 A 44,44 0 0,1 104,64" fill="none" stroke="#10B981" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${arcLength} ${semiCircum}`} />
                  <text x="60" y="52" textAnchor="middle" className="text-[18px] font-bold" fill="var(--foreground)">{returnRate}%</text>
                  <text x="60" y="66" textAnchor="middle" className="text-[9px]" fill="var(--muted)">Return Rate</text>
                </svg>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--muted)]">Checked Out</span>
                  <span className="font-semibold text-[var(--foreground)]">{librarySummary.booksCheckedOut.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--muted)]">Overdue</span>
                  <span className="font-semibold text-[#EF4444]">{librarySummary.overdueBooks}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--muted)]">Daily Circulation</span>
                  <span className="font-semibold text-[var(--foreground)]">{librarySummary.dailyCirculation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 KPI Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Collection */}
          <div className="rounded-2xl bg-[var(--card)] border-l-[3px] border-l-[#10B981] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] leading-tight font-bold text-[var(--foreground)]">{librarySummary.totalBooks.toLocaleString()}</p>
                <p className="text-[11px] font-medium text-[var(--muted)]">Total Books</p>
              </div>
            </div>
            <svg width="56" height="28" className="flex-shrink-0">
              <defs><linearGradient id="spark-books" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity="0.3" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" /></linearGradient></defs>
              <path d={buildSparkPath(booksSpark, 56, 28)} fill="none" stroke="#10B981" strokeWidth="1.5" />
              <path d={`${buildSparkPath(booksSpark, 56, 28)} L 56,28 L 0,28 Z`} fill="url(#spark-books)" />
            </svg>
          </div>

          {/* Active Members */}
          <div className="rounded-2xl bg-[var(--card)] border-l-[3px] border-l-[#3B82F6] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] leading-tight font-bold text-[var(--foreground)]">{librarySummary.activeMembers.toLocaleString()}</p>
                <p className="text-[11px] font-medium text-[var(--muted)]">Active Members</p>
              </div>
            </div>
            <svg width="56" height="28" className="flex-shrink-0">
              <defs><linearGradient id="spark-members" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></linearGradient></defs>
              <path d={buildSparkPath(membersSpark, 56, 28)} fill="none" stroke="#3B82F6" strokeWidth="1.5" />
              <path d={`${buildSparkPath(membersSpark, 56, 28)} L 56,28 L 0,28 Z`} fill="url(#spark-members)" />
            </svg>
          </div>

          {/* Fines Outstanding */}
          <div className="rounded-2xl bg-[var(--card)] border-l-[3px] border-l-[#EF4444] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] leading-tight font-bold text-[var(--foreground)]">{fmt.format(librarySummary.finesOutstanding)}</p>
                <p className="text-[11px] font-medium text-[var(--muted)]">Fines Outstanding</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="14" fill="none" stroke="var(--border)" strokeWidth="3" />
                <circle cx="20" cy="20" r="14" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(librarySummary.finesOutstanding / (librarySummary.finesOutstanding + librarySummary.finesCollected)) * 2 * Math.PI * 14} ${2 * Math.PI * 14}`} transform="rotate(-90 20 20)" />
                <text x="20" y="22" textAnchor="middle" className="text-[9px] font-bold" fill="#EF4444">{Math.round((librarySummary.finesOutstanding / (librarySummary.finesOutstanding + librarySummary.finesCollected)) * 100)}%</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Circulation Chart + Popular Books ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Circulation Trend */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Monthly Circulation</h3>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
              {(["6M", "1Y"] as CirculationPeriod[]).map(p => (
                <button key={p} onClick={() => setCirculationPeriod(p)} className={cn("px-2.5 py-1 text-[11px] font-medium rounded-md transition-all", circulationPeriod === p ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>{p}</button>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[11px] text-[var(--muted)]">Issued</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /><span className="text-[11px] text-[var(--muted)]">Returned</span></div>
          </div>
          {/* Chart */}
          <div className="relative h-[180px]">
            <svg width="100%" height="180" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area-issued" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity="0.2" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" /></linearGradient>
                <linearGradient id="area-returned" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 45, 90, 135].map(y => (<line key={y} x1="0" y1={y} x2="500" y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />))}
              {/* Area fills */}
              <path d={buildAreaPath(issuedValues, 500, 180, 10)} fill="url(#area-issued)" />
              <path d={buildAreaPath(returnedValues, 500, 180, 10)} fill="url(#area-returned)" />
              {/* Lines */}
              <path d={buildCurvePath(issuedValues, 500, 180, 10)} fill="none" stroke="#10B981" strokeWidth="2.5" />
              <path d={buildCurvePath(returnedValues, 500, 180, 10)} fill="none" stroke="#3B82F6" strokeWidth="2.5" />
              {/* Dots */}
              {issuedValues.map((v, i) => {
                const max = Math.max(...issuedValues, 1);
                const x = (i / (issuedValues.length - 1)) * 500;
                const y = 10 + (180 - 20) - (v / max) * (180 - 20);
                return <circle key={`i-${i}`} cx={x} cy={y} r="3" fill="#10B981" />;
              })}
              {returnedValues.map((v, i) => {
                const max = Math.max(...returnedValues, 1);
                const x = (i / (returnedValues.length - 1)) * 500;
                const y = 10 + (180 - 20) - (v / max) * (180 - 20);
                return <circle key={`r-${i}`} cx={x} cy={y} r="3" fill="#3B82F6" />;
              })}
            </svg>
            {/* X-axis labels */}
            <div className="flex justify-between mt-1 px-1">
              {chartData.map(d => (<span key={d.month} className="text-[10px] text-[var(--muted)]">{d.month}</span>))}
            </div>
          </div>
        </div>

        {/* Most Borrowed Books */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Most Borrowed Books</h3>
          <div className="space-y-3">
            {popularBooks.map((book, i) => {
              const maxCount = popularBooks[0].borrowCount;
              const barWidth = (book.borrowCount / maxCount) * 100;
              const colors = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#0891B2"];
              return (
                <div key={book.title}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-bold text-[var(--muted)] w-4">{i + 1}</span>
                      <span className="text-[12px] font-medium text-[var(--foreground)] truncate">{book.title}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--foreground)] ml-2 flex-shrink-0">{book.borrowCount}</span>
                  </div>
                  <div className="ml-6 h-1.5 rounded-full bg-[var(--background-secondary)]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: colors[i] }} />
                  </div>
                  <span className="ml-6 text-[10px] text-[var(--muted)]">{book.category}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Alerts ──────────────────────────────────────────── */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {visibleAlerts.map(alert => {
              const style = SEVERITY_STYLES[alert.severity];
              const Icon = alert.icon;
              return (
                <motion.div key={alert.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-xl px-4 py-3 flex items-center gap-3 border-l-[3px]" style={{ borderLeftColor: style.border, background: style.bg }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: style.icon }} />
                  <p className="text-[12px] text-[var(--foreground)] flex-1">{alert.message}</p>
                  <button onClick={() => setDismissedAlerts(prev => new Set(prev).add(alert.id))} className="p-1 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"><X className="w-3.5 h-3.5 text-[var(--muted)]" /></button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── ROW 4: Recent Circulation Activity ─────────────────────── */}
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Recent Circulation Activity</h3>

        {/* Status tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "checked_out", "returned", "overdue", "renewed"] as LoanFilter[]).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                {f === "all" ? "All" : STATUS_LABELS[f]} ({statusCounts[f]})
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search books or members..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-56 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-2.5 px-3 text-left w-8">
                  <input type="checkbox" checked={selectedRows.size === paginatedLoans.length && paginatedLoans.length > 0} onChange={toggleSelectAll} className="w-3.5 h-3.5 rounded border-[var(--border)]" />
                </th>
                {([["bookTitle", "Book Title"], ["memberName", "Member"], ["grade", "Grade"], ["issueDate", "Issue Date"], ["dueDate", "Due Date"], ["status", "Status"], ["actions", ""]] as const).map(([key, label]) => (
                  <th key={key} className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {(key === "bookTitle" || key === "memberName" || key === "issueDate" || key === "dueDate") ? (
                      <button onClick={() => handleSort(key)} className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
                        {label}
                        {sortField === key && <ChevronDown className={cn("w-3 h-3", sortDirection === "asc" && "rotate-180")} />}
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.map(loan => {
                const sc = STATUS_COLORS[loan.status];
                return (
                  <tr key={loan.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <input type="checkbox" checked={selectedRows.has(loan.id)} onChange={() => toggleRow(loan.id)} className="w-3.5 h-3.5 rounded border-[var(--border)]" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sc.dot}15` }}>
                          <BookMarked className="w-3.5 h-3.5" style={{ color: sc.dot }} />
                        </div>
                        <span className="text-[12px] font-medium text-[var(--foreground)]">{loan.bookTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{loan.memberName}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{loan.grade}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(loan.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(loan.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sc.bg, color: sc.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                        {STATUS_LABELS[loan.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === loan.id ? null : loan.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === loan.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </button>
                            {loan.status === "checked_out" && (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                                <RotateCcw className="w-3.5 h-3.5" /> Renew
                              </button>
                            )}
                            {(loan.status === "checked_out" || loan.status === "overdue" || loan.status === "renewed") && (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Returned
                              </button>
                            )}
                            {loan.status === "overdue" && (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                                <Bell className="w-3.5 h-3.5" /> Send Reminder
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <p className="text-[11px] text-[var(--muted)]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredLoans.length)} of {filteredLoans.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4 text-[var(--muted)]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-7 h-7 rounded-lg text-[11px] font-medium transition-all", p === currentPage ? "bg-[#10B981] text-white" : "text-[var(--muted)] hover:bg-[var(--background-secondary)]")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
