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
  RotateCcw,
  CheckCircle2,
  Bell,
  BookOpen,
  BookMarked,
  ArrowDownUp,
  Clock,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { libraryLoans, librarySummary } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "bookTitle" | "memberName" | "issueDate" | "dueDate";
type SortDirection = "asc" | "desc";
type LoanFilter = "all" | "checked_out" | "overdue" | "renewed";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 8;

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CirculationTab() {
  const [statusFilter, setStatusFilter] = useState<LoanFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Active loans (exclude returned)
  const activeLoans = useMemo(() => libraryLoans.filter(l => l.status !== "returned"), []);

  // Summary metrics
  const metrics = useMemo(() => {
    const today = "2026-03-03";
    const issuedToday = libraryLoans.filter(l => l.issueDate === today).length;
    const returnedToday = libraryLoans.filter(l => l.returnDate === today).length;
    const overdue = activeLoans.filter(l => l.status === "overdue").length;
    const renewedThisWeek = libraryLoans.filter(l => l.status === "renewed" || l.renewals > 0).length;
    return { issuedToday, returnedToday, overdue, renewedThisWeek };
  }, [activeLoans]);

  // Status counts for active loans
  const statusCounts = useMemo(() => ({
    all: activeLoans.length,
    checked_out: activeLoans.filter(l => l.status === "checked_out").length,
    overdue: activeLoans.filter(l => l.status === "overdue").length,
    renewed: activeLoans.filter(l => l.status === "renewed").length,
  }), [activeLoans]);

  // Filtered & sorted
  const filteredLoans = useMemo(() => {
    let data = [...activeLoans];
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
  }, [activeLoans, statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
  const paginatedLoans = filteredLoans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
    setCurrentPage(1);
  };

  // Upcoming due dates (within 7 days)
  const upcomingDue = useMemo(() => {
    const now = new Date("2026-03-03");
    return activeLoans
      .filter(l => l.status !== "overdue")
      .map(l => ({ ...l, daysLeft: Math.ceil((new Date(l.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) }))
      .filter(l => l.daysLeft >= 0 && l.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [activeLoans]);

  function daysLeftColor(days: number): string {
    if (days <= 2) return "#EF4444";
    if (days <= 4) return "#F59E0B";
    return "#10B981";
  }

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Issued Today", value: metrics.issuedToday, icon: BookOpen, color: "#3B82F6" },
          { label: "Returned Today", value: metrics.returnedToday, icon: CheckCircle2, color: "#10B981" },
          { label: "Currently Overdue", value: metrics.overdue, icon: Clock, color: "#EF4444" },
          { label: "Renewals This Week", value: metrics.renewedThisWeek, icon: RotateCcw, color: "#F59E0B" },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-6 translate-x-6" style={{ background: `radial-gradient(circle, ${card.color}08, transparent)` }} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{card.label}</p>
                <p className="text-[22px] font-bold text-[var(--foreground)]">{card.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main Content: Table + Sidebar ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Loans Table */}
        <div className="lg:col-span-8 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Active Loans</h3>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
              {(["all", "checked_out", "overdue", "renewed"] as LoanFilter[]).map(f => (
                <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                  {f === "all" ? "All" : STATUS_LABELS[f]} ({statusCounts[f]})
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-48 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {([["bookTitle", "Book"], ["memberName", "Member"], ["grade", "Grade"], ["issueDate", "Issued"], ["dueDate", "Due"], ["renewals", "Renewals"], ["status", "Status"], ["actions", ""]] as const).map(([key, label]) => (
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
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-3.5 h-3.5 flex-shrink-0" style={{ color: sc.dot }} />
                          <span className="text-[12px] font-medium text-[var(--foreground)] truncate max-w-[150px]">{loan.bookTitle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{loan.memberName}</td>
                      <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{loan.grade}</td>
                      <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(loan.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(loan.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{loan.renewals}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: sc.bg, color: sc.text }}>
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
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View Details</button>
                              {(loan.status === "checked_out" || loan.status === "renewed") && loan.renewals < 2 && (
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><RotateCcw className="w-3.5 h-3.5" /> Renew</button>
                              )}
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><CheckCircle2 className="w-3.5 h-3.5" /> Mark Returned</button>
                              {loan.status === "overdue" && (
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Bell className="w-3.5 h-3.5" /> Send Reminder</button>
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
              <p className="text-[11px] text-[var(--muted)]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredLoans.length)} of {filteredLoans.length}</p>
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

        {/* Upcoming Due Dates Sidebar */}
        <div className="lg:col-span-4 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-4 h-4 text-[var(--muted)]" />
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Upcoming Due</h3>
          </div>
          {upcomingDue.length === 0 ? (
            <p className="text-[12px] text-[var(--muted)] text-center py-8">No books due in the next 7 days</p>
          ) : (
            <div className="space-y-3">
              {upcomingDue.map(loan => (
                <div key={loan.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background-secondary)]">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${daysLeftColor(loan.daysLeft)}15` }}>
                    <Clock className="w-4 h-4" style={{ color: daysLeftColor(loan.daysLeft) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[var(--foreground)] truncate">{loan.bookTitle}</p>
                    <p className="text-[11px] text-[var(--muted)]">{loan.memberName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] font-semibold" style={{ color: daysLeftColor(loan.daysLeft) }}>
                        {loan.daysLeft === 0 ? "Due today" : `${loan.daysLeft} day${loan.daysLeft > 1 ? "s" : ""} left`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
