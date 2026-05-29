"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  CalendarClock,
  ChevronDown,
  ClipboardCheck,
  Clock,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { examSchedule, examSummary } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "subject" | "class" | "date" | "venue";
type SortDirection = "asc" | "desc";
type ExamFilter = "all" | "completed" | "in_progress" | "scheduled" | "postponed";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  completed: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  in_progress: { dot: "#3B82F6", bg: "rgba(59,130,246,0.1)", text: "#3B82F6" },
  scheduled: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  postponed: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444" },
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  scheduled: "Scheduled",
  postponed: "Postponed",
};

const ITEMS_PER_PAGE = 8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExamsTab() {
  const [statusFilter, setStatusFilter] = useState<ExamFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const statusCounts = useMemo(() => ({
    all: examSchedule.length,
    completed: examSchedule.filter(e => e.status === "completed").length,
    in_progress: examSchedule.filter(e => e.status === "in_progress").length,
    scheduled: examSchedule.filter(e => e.status === "scheduled").length,
    postponed: examSchedule.filter(e => e.status === "postponed").length,
  }), []);

  const filtered = useMemo(() => {
    let data = [...examSchedule];
    if (statusFilter !== "all") data = data.filter(e => e.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e => e.subject.toLowerCase().includes(q) || e.class.toLowerCase().includes(q) || e.invigilator.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const m = sortDirection === "asc" ? 1 : -1;
      return a[sortField] < b[sortField] ? -m : a[sortField] > b[sortField] ? m : 0;
    });
    return data;
  }, [statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDirection("asc"); }
  };

  const summaryCards = [
    { label: "Total Exams", value: examSummary.totalExams, icon: ClipboardCheck, color: "#6366F1" },
    { label: "Scheduled", value: examSummary.scheduledExams, icon: Clock, color: "#F59E0B" },
    { label: "In Progress", value: examSummary.inProgressExams, icon: PlayCircle, color: "#3B82F6" },
    { label: "Completed", value: examSummary.completedExams, icon: CheckCircle2, color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-[11px] font-medium text-[var(--muted)] mb-0.5">{card.label}</p>
            <p className="text-[22px] font-bold text-[var(--foreground)]">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "scheduled", "in_progress", "completed", "postponed"] as ExamFilter[]).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                {f === "all" ? "All" : STATUS_LABELS[f]} ({statusCounts[f]})
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-48 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {(
                  [
                    { key: "subject", label: "Subject" },
                    { key: "class", label: "Class" },
                    { key: "date", label: "Date" },
                    { key: "venue", label: "Venue" },
                    { key: "time", label: "Time" },
                    { key: "invigilator", label: "Invigilator" },
                    { key: "students", label: "Students" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "" },
                  ] as const
                ).map(col => (
                  <th
                    key={col.key}
                    onClick={() => (col.key === "subject" || col.key === "class" || col.key === "date" || col.key === "venue") && handleSort(col.key)}
                    className={cn("py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider", (col.key === "subject" || col.key === "class" || col.key === "date" || col.key === "venue") && "cursor-pointer hover:text-[var(--foreground)]")}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && <ChevronDown className={cn("w-3 h-3 transition-transform", sortDirection === "asc" && "rotate-180")} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(exam => {
                const ss = STATUS_COLORS[exam.status];
                return (
                  <tr key={exam.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{exam.subject}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{exam.class}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(exam.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{exam.venue}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{exam.startTime} - {exam.endTime}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{exam.invigilator}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{exam.submitted}/{exam.totalStudents}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {STATUS_LABELS[exam.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === exam.id ? null : exam.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === exam.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View Details</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                            {exam.status === "scheduled" && (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[var(--background-secondary)]"><CalendarClock className="w-3.5 h-3.5" /> Postpone</button>
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
            <p className="text-[11px] text-[var(--muted)]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-[var(--muted)]" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-7 h-7 rounded-lg text-[11px] font-medium transition-all", p === currentPage ? "bg-[#6366F1] text-white" : "text-[var(--muted)] hover:bg-[var(--background-secondary)]")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40"><ChevronRight className="w-4 h-4 text-[var(--muted)]" /></button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
