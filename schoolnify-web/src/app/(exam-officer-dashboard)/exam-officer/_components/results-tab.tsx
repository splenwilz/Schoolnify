"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Download,
  ChevronDown,
  Users,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  examResults,
  subjectPerformance,
  classPerformance,
  examSummary,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "studentName" | "avgScore" | "gpa" | "classPosition";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "published" | "draft";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  published: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  draft: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
};

const ITEMS_PER_PAGE = 8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ResultsTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("classPosition");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const statusCounts = useMemo(() => ({
    all: examResults.length,
    published: examResults.filter(e => e.status === "published").length,
    draft: examResults.filter(e => e.status === "draft").length,
  }), []);

  const filtered = useMemo(() => {
    let data = [...examResults];
    if (statusFilter !== "all") data = data.filter(e => e.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e => e.studentName.toLowerCase().includes(q) || e.class.toLowerCase().includes(q) || e.studentId.toLowerCase().includes(q));
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
    { label: "Students Assessed", value: examSummary.studentsAssessed, icon: Users, color: "#6366F1" },
    { label: "Pass Rate", value: `${examSummary.passRate}%`, icon: TrendingUp, color: "#10B981" },
    { label: "Highest Score", value: examSummary.highestScore, icon: Award, color: "#F59E0B" },
    { label: "Class Average", value: `${examSummary.classAverage}%`, icon: BarChart3, color: "#3B82F6" },
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

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Subject Performance Bars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-8 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-0.5">Subject Performance</h3>
          <p className="text-[11px] text-[var(--muted)] mb-5">Average score by subject</p>
          <div className="space-y-3">
            {subjectPerformance.map((sp, idx) => (
              <div key={sp.subject} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-[var(--foreground)] w-28 shrink-0 truncate">{sp.subject}</span>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: "rgba(99,102,241,0.15)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sp.avgScore}%` }}
                    transition={{ delay: 0.3 + 0.05 * idx, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "#6366F1" }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground)] w-8 text-right">{sp.avgScore}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Class Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-12 lg:col-span-4 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-[14px] font-semibold text-[var(--foreground)] mb-0.5">Class Comparison</h3>
          <p className="text-[11px] text-[var(--muted)] mb-5">Average scores by class</p>
          <div className="space-y-3">
            {classPerformance.map((cp, idx) => (
              <div key={cp.class} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-[var(--foreground)] w-12 shrink-0">{cp.class}</span>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cp.avgScore}%` }}
                    transition={{ delay: 0.35 + 0.05 * idx, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "#10B981" }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground)] w-8 text-right">{cp.avgScore}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "published", "draft"] as StatusFilter[]).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search student..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-48 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {(
                  [
                    { key: "studentName", label: "Student" },
                    { key: "class", label: "Class" },
                    { key: "totalScore", label: "Total Score" },
                    { key: "avgScore", label: "Average" },
                    { key: "overallGrade", label: "Grade" },
                    { key: "classPosition", label: "Position" },
                    { key: "gpa", label: "GPA" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "" },
                  ] as const
                ).map(col => (
                  <th
                    key={col.key}
                    onClick={() => (col.key === "studentName" || col.key === "avgScore" || col.key === "gpa" || col.key === "classPosition") && handleSort(col.key)}
                    className={cn("py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider", (col.key === "studentName" || col.key === "avgScore" || col.key === "gpa" || col.key === "classPosition") && "cursor-pointer hover:text-[var(--foreground)]")}
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
              {paginated.map(result => {
                const ss = STATUS_COLORS[result.status];
                const gradeColor = result.overallGrade === "A" ? "#10B981" : result.overallGrade === "B" ? "#3B82F6" : result.overallGrade === "C" ? "#F59E0B" : result.overallGrade === "D" ? "#F97316" : result.overallGrade === "E" ? "#EF4444" : "#6B7280";
                return (
                  <tr key={result.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <p className="text-[12px] font-medium text-[var(--foreground)]">{result.studentName}</p>
                        <p className="text-[10px] text-[var(--muted)]">{result.studentId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{result.class}</td>
                    <td className="py-3 px-3 text-[12px] font-semibold text-[var(--foreground)]">{result.totalScore}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{result.avgScore}%</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: gradeColor }}>{result.overallGrade}</span>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">#{result.classPosition}</td>
                    <td className="py-3 px-3 text-[12px] font-semibold text-[var(--foreground)]">{result.gpa}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === result.id ? null : result.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === result.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Download className="w-3.5 h-3.5" /> Download Report</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[13px] text-[var(--muted)]">No results found</td>
                </tr>
              )}
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
