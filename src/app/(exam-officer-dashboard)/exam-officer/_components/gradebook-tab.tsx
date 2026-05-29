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
  ChevronDown,
  BookOpen,
  Clock,
  Calculator,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gradebookEntries } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "studentName" | "caScore" | "examScore" | "total" | "position";
type SortDirection = "asc" | "desc";
type GradeFilter = "all" | "graded" | "pending";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  graded: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  pending: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
};

const ITEMS_PER_PAGE = 10;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GradebookTab() {
  const [statusFilter, setStatusFilter] = useState<GradeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("position");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState("SSS 1");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const classes = useMemo(() => [...new Set(gradebookEntries.map(e => e.class))], []);
  const subjects = useMemo(() => [...new Set(gradebookEntries.map(e => e.subject))], []);

  // Summary stats
  const summary = useMemo(() => {
    const classEntries = gradebookEntries.filter(e => e.class === selectedClass);
    const graded = classEntries.filter(e => e.status === "graded");
    const pendingCount = classEntries.filter(e => e.status === "pending").length;
    const avgCA = graded.length > 0 ? (graded.reduce((s, e) => s + e.caScore, 0) / graded.length).toFixed(1) : "0";
    const avgExam = graded.length > 0 ? (graded.reduce((s, e) => s + e.examScore, 0) / graded.length).toFixed(1) : "0";
    return {
      classesGraded: new Set(gradebookEntries.filter(e => e.status === "graded").map(e => e.class)).size,
      subjectsPending: pendingCount,
      avgCA,
      avgExam,
    };
  }, [selectedClass]);

  const filtered = useMemo(() => {
    let data = gradebookEntries.filter(e => e.class === selectedClass && e.subject === selectedSubject);
    if (statusFilter !== "all") data = data.filter(e => e.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e => e.studentName.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const m = sortDirection === "asc" ? 1 : -1;
      return a[sortField] < b[sortField] ? -m : a[sortField] > b[sortField] ? m : 0;
    });
    return data;
  }, [statusFilter, searchQuery, sortField, sortDirection, selectedClass, selectedSubject]);

  const statusCounts = useMemo(() => {
    const classSubjectEntries = gradebookEntries.filter(e => e.class === selectedClass && e.subject === selectedSubject);
    return {
      all: classSubjectEntries.length,
      graded: classSubjectEntries.filter(e => e.status === "graded").length,
      pending: classSubjectEntries.filter(e => e.status === "pending").length,
    };
  }, [selectedClass, selectedSubject]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDirection("asc"); }
  };

  const summaryCards = [
    { label: "Classes Graded", value: summary.classesGraded, icon: GraduationCap, color: "#6366F1" },
    { label: "Subjects Pending", value: summary.subjectsPending, icon: Clock, color: "#F59E0B" },
    { label: "Avg CA Score", value: `${summary.avgCA}/40`, icon: BookOpen, color: "#3B82F6" },
    { label: "Avg Exam Score", value: `${summary.avgExam}/60`, icon: Calculator, color: "#10B981" },
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
        {/* Class / Subject Selectors */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)] mb-1 block">Class</label>
            <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setCurrentPage(1); }} className="px-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30">
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)] mb-1 block">Subject</label>
            <select value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setCurrentPage(1); }} className="px-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30">
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Status Filters + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "graded", "pending"] as GradeFilter[]).map(f => (
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
                    { key: "caScore", label: "CA (/40)" },
                    { key: "examScore", label: "Exam (/60)" },
                    { key: "total", label: "Total (/100)" },
                    { key: "grade", label: "Grade" },
                    { key: "position", label: "Position" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "" },
                  ] as const
                ).map(col => (
                  <th
                    key={col.key}
                    onClick={() => (col.key === "studentName" || col.key === "caScore" || col.key === "examScore" || col.key === "total" || col.key === "position") && handleSort(col.key)}
                    className={cn("py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider", (col.key === "studentName" || col.key === "caScore" || col.key === "examScore" || col.key === "total" || col.key === "position") && "cursor-pointer hover:text-[var(--foreground)]")}
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
              {paginated.map(entry => {
                const ss = STATUS_COLORS[entry.status];
                const gradeColor = entry.grade === "A" ? "#10B981" : entry.grade === "B" ? "#3B82F6" : entry.grade === "C" ? "#F59E0B" : entry.grade === "D" ? "#F97316" : entry.grade === "E" ? "#EF4444" : "#6B7280";
                return (
                  <tr key={entry.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{entry.studentName}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{entry.caScore}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{entry.examScore}</td>
                    <td className="py-3 px-3 text-[12px] font-semibold text-[var(--foreground)]">{entry.total}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: gradeColor }}>{entry.grade}</span>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">#{entry.position}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === entry.id ? null : entry.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === entry.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Edit3 className="w-3.5 h-3.5" /> Edit Score</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[13px] text-[var(--muted)]">No entries found for {selectedClass} - {selectedSubject}</td>
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
