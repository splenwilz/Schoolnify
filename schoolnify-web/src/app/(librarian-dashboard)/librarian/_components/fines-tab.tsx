"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  CreditCard,
  XCircle,
  Bell,
  DollarSign,
  CheckCircle2,
  Clock,
  Slash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { libraryFines } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

type FineFilter = "all" | "unpaid" | "partial" | "paid" | "waived";
type SortField = "memberName" | "totalFine" | "daysOverdue" | "issuedDate";
type SortDirection = "asc" | "desc";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const ITEMS_PER_PAGE = 8;

const STATUS_STYLES: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  unpaid: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444", label: "Unpaid" },
  partial: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B", label: "Partial" },
  paid: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981", label: "Paid" },
  waived: { dot: "#9CA3AF", bg: "rgba(156,163,175,0.1)", text: "#9CA3AF", label: "Waived" },
};

// Monthly fine trend data
const FINE_TREND = [
  { month: "Sep", amount: 42.50 },
  { month: "Oct", amount: 38.00 },
  { month: "Nov", amount: 55.00 },
  { month: "Dec", amount: 28.00 },
  { month: "Jan", amount: 65.00 },
  { month: "Feb", amount: 48.50 },
];

// Grade fines for donut
const GRADE_FINES = [
  { grade: "Grade 7", amount: 15.50, color: "#3B82F6" },
  { grade: "Grade 8", amount: 8.00, color: "#10B981" },
  { grade: "Grade 9", amount: 3.50, color: "#F59E0B" },
  { grade: "Grade 10", amount: 32.50, color: "#8B5CF6" },
  { grade: "Grade 11", amount: 0, color: "#0891B2" },
  { grade: "Grade 12", amount: 0, color: "#EC4899" },
];

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FinesTab() {
  const [statusFilter, setStatusFilter] = useState<FineFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("issuedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const totalFines = libraryFines.reduce((s, f) => s + f.totalFine, 0);
    const collected = libraryFines.reduce((s, f) => s + f.amountPaid, 0);
    const outstanding = libraryFines.filter(f => f.status === "unpaid" || f.status === "partial").reduce((s, f) => s + (f.totalFine - f.amountPaid), 0);
    const waived = libraryFines.filter(f => f.status === "waived").reduce((s, f) => s + f.totalFine, 0);
    return { totalFines, collected, outstanding, waived };
  }, []);

  const statusCounts = useMemo(() => ({
    all: libraryFines.length,
    unpaid: libraryFines.filter(f => f.status === "unpaid").length,
    partial: libraryFines.filter(f => f.status === "partial").length,
    paid: libraryFines.filter(f => f.status === "paid").length,
    waived: libraryFines.filter(f => f.status === "waived").length,
  }), []);

  const filteredFines = useMemo(() => {
    let data = [...libraryFines];
    if (statusFilter !== "all") data = data.filter(f => f.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(f => f.memberName.toLowerCase().includes(q) || f.bookTitle.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "memberName") return a.memberName.localeCompare(b.memberName) * dir;
      if (sortField === "totalFine") return (a.totalFine - b.totalFine) * dir;
      if (sortField === "daysOverdue") return (a.daysOverdue - b.daysOverdue) * dir;
      if (sortField === "issuedDate") return (new Date(a.issuedDate).getTime() - new Date(b.issuedDate).getTime()) * dir;
      return 0;
    });
    return data;
  }, [statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredFines.length / ITEMS_PER_PAGE);
  const paginatedFines = filteredFines.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("desc"); }
    setCurrentPage(1);
  };

  // Chart
  const trendValues = FINE_TREND.map(f => f.amount);
  const gradeTotal = GRADE_FINES.reduce((s, g) => s + g.amount, 0);

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Fines", value: metrics.totalFines, icon: DollarSign, color: "#3B82F6", pct: 100 },
          { label: "Collected", value: metrics.collected, icon: CheckCircle2, color: "#10B981", pct: (metrics.collected / metrics.totalFines) * 100 },
          { label: "Outstanding", value: metrics.outstanding, icon: Clock, color: "#EF4444", pct: (metrics.outstanding / metrics.totalFines) * 100 },
          { label: "Waived", value: metrics.waived, icon: Slash, color: "#9CA3AF", pct: (metrics.waived / metrics.totalFines) * 100 },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-6 translate-x-6" style={{ background: `radial-gradient(circle, ${card.color}08, transparent)` }} />
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{card.label}</p>
                <p className="text-[22px] font-bold text-[var(--foreground)]">{fmt.format(card.value)}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--background-secondary)]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(card.pct, 100)}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: card.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fine Trends */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Fine Trends</h3>
          <div className="relative h-[160px]">
            <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs><linearGradient id="fine-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" /><stop offset="100%" stopColor="#EF4444" stopOpacity="0" /></linearGradient></defs>
              {[0, 40, 80, 120].map(y => (<line key={y} x1="0" y1={y} x2="500" y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />))}
              <path d={buildAreaPath(trendValues, 500, 160, 10)} fill="url(#fine-area)" />
              <path d={buildCurvePath(trendValues, 500, 160, 10)} fill="none" stroke="#EF4444" strokeWidth="2.5" />
              {trendValues.map((v, i) => {
                const max = Math.max(...trendValues, 1);
                const x = (i / (trendValues.length - 1)) * 500;
                const y = 10 + (160 - 20) - (v / max) * (160 - 20);
                return <circle key={i} cx={x} cy={y} r="3" fill="#EF4444" />;
              })}
            </svg>
            <div className="flex justify-between mt-1 px-1">
              {FINE_TREND.map(d => (<span key={d.month} className="text-[10px] text-[var(--muted)]">{d.month}</span>))}
            </div>
          </div>
        </div>

        {/* Fines by Grade */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Fines by Grade</h3>
          <div className="flex justify-center mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {(() => {
                const r = 45; const circ = 2 * Math.PI * r;
                let offset = 0;
                return GRADE_FINES.filter(g => g.amount > 0).map((g, i) => {
                  const pct = g.amount / gradeTotal;
                  const dash = pct * circ;
                  const el = <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={g.color} strokeWidth="12" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)" />;
                  offset += dash;
                  return el;
                });
              })()}
              <circle cx="60" cy="60" r="32" fill="var(--card)" />
              <text x="60" y="62" textAnchor="middle" className="text-[12px] font-bold" fill="var(--foreground)">{fmt.format(gradeTotal)}</text>
            </svg>
          </div>
          <div className="space-y-2">
            {GRADE_FINES.filter(g => g.amount > 0).map(g => (
              <div key={g.grade} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-[11px] text-[var(--muted)]">{g.grade}</span>
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground)]">{fmt.format(g.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fines Table ────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "unpaid", "partial", "paid", "waived"] as FineFilter[]).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                {f === "all" ? "All" : STATUS_STYLES[f].label} ({statusCounts[f]})
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-48 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {([["memberName", "Member"], ["bookTitle", "Book"], ["daysOverdue", "Days Overdue"], ["totalFine", "Fine"], ["amountPaid", "Paid"], ["balance", "Balance"], ["status", "Status"], ["actions", ""]] as const).map(([key, label]) => (
                  <th key={key} className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {(key === "memberName" || key === "totalFine" || key === "daysOverdue") ? (
                      <button onClick={() => handleSort(key as SortField)} className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
                        {label}
                        {sortField === key && <ChevronDown className={cn("w-3 h-3", sortDirection === "asc" && "rotate-180")} />}
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedFines.map(fine => {
                const ss = STATUS_STYLES[fine.status];
                const balance = fine.totalFine - fine.amountPaid;
                return (
                  <tr key={fine.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{fine.memberName}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)] max-w-[150px] truncate">{fine.bookTitle}</td>
                    <td className="py-3 px-3 text-[12px] font-medium text-[#EF4444]">{fine.daysOverdue}</td>
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{fmt.format(fine.totalFine)}</td>
                    <td className="py-3 px-3 text-[12px] text-[#10B981]">{fmt.format(fine.amountPaid)}</td>
                    <td className="py-3 px-3 text-[12px] font-medium" style={{ color: balance > 0 ? "#EF4444" : "var(--muted)" }}>{fmt.format(balance)}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {ss.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === fine.id ? null : fine.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === fine.id && (
                          <div className="absolute right-0 top-8 z-20 w-44 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View Details</button>
                            {(fine.status === "unpaid" || fine.status === "partial") && (
                              <>
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><CreditCard className="w-3.5 h-3.5" /> Record Payment</button>
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><XCircle className="w-3.5 h-3.5" /> Waive Fine</button>
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Bell className="w-3.5 h-3.5" /> Send Reminder</button>
                              </>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <p className="text-[11px] text-[var(--muted)]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredFines.length)} of {filteredFines.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-[var(--muted)]" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-7 h-7 rounded-lg text-[11px] font-medium transition-all", p === currentPage ? "bg-[#10B981] text-white" : "text-[var(--muted)] hover:bg-[var(--background-secondary)]")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40"><ChevronRight className="w-4 h-4 text-[var(--muted)]" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
