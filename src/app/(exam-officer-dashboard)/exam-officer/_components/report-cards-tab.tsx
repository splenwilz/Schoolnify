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
  Send,
  Trash2,
  ChevronDown,
  FileText,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { reportCards, examSummary } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "studentName" | "class" | "avgScore";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "draft" | "generated" | "published" | "downloaded";
type Template = "standard" | "detailed" | "minimal";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  draft: { dot: "#9CA3AF", bg: "rgba(156,163,175,0.1)", text: "#9CA3AF" },
  generated: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  published: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  downloaded: { dot: "#3B82F6", bg: "rgba(59,130,246,0.1)", text: "#3B82F6" },
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  generated: "Generated",
  published: "Published",
  downloaded: "Downloaded",
};

const TEMPLATES: { key: Template; name: string; description: string }[] = [
  { key: "standard", name: "Standard", description: "Basic report with grades and comments" },
  { key: "detailed", name: "Detailed", description: "Comprehensive report with subject analysis" },
  { key: "minimal", name: "Minimal", description: "Simplified grade summary" },
];

const ITEMS_PER_PAGE = 8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReportCardsTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("studentName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("standard");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const statusCounts = useMemo(() => ({
    all: reportCards.length,
    draft: reportCards.filter(r => r.status === "draft").length,
    generated: reportCards.filter(r => r.status === "generated").length,
    published: reportCards.filter(r => r.status === "published").length,
    downloaded: reportCards.filter(r => r.status === "downloaded").length,
  }), []);

  const filtered = useMemo(() => {
    let data = [...reportCards];
    if (statusFilter !== "all") data = data.filter(r => r.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r => r.studentName.toLowerCase().includes(q) || r.class.toLowerCase().includes(q));
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

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
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
      setSelectedRows(new Set(paginated.map(r => r.id)));
    }
  };

  const summaryCards = [
    { label: "Generated", value: examSummary.reportsGenerated, icon: FileText, color: "#10B981" },
    { label: "Pending", value: examSummary.reportsPending, icon: Clock, color: "#F59E0B" },
    { label: "Downloaded", value: examSummary.reportsDownloaded, icon: Download, color: "#3B82F6" },
    { label: "Published", value: examSummary.reportsPublished, icon: Send, color: "#6366F1" },
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

      {/* Template Selector Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map((tpl, idx) => (
            <motion.div
              key={tpl.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx + 0.15 }}
              onClick={() => setSelectedTemplate(tpl.key)}
              className={cn(
                "rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer transition-all",
              )}
              style={
                selectedTemplate === tpl.key
                  ? { outline: "2px solid #6366F1", outlineOffset: "-2px", background: "rgba(99,102,241,0.04)" }
                  : undefined
              }
            >
              <p className="text-[13px] font-semibold text-[var(--foreground)] mb-1">{tpl.name}</p>
              <p className="text-[11px] text-[var(--muted)]">{tpl.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Cards Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        {/* Status Filters + Search + Bulk Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "draft", "generated", "published", "downloaded"] as StatusFilter[]).map(f => (
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

        {/* Bulk Actions */}
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-medium text-[var(--muted)]">{selectedRows.size} selected</span>
            <button onClick={() => setSelectedRows(new Set())} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
              <Zap className="w-3.5 h-3.5" /> Generate
            </button>
            <button onClick={() => setSelectedRows(new Set())} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20 transition-colors">
              <Send className="w-3.5 h-3.5" /> Publish
            </button>
            <button onClick={() => setSelectedRows(new Set())} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-2.5 px-3 text-left">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedRows.size === paginated.length}
                    onChange={toggleAllRows}
                    className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[#6366F1]"
                  />
                </th>
                {(
                  [
                    { key: "studentName", label: "Student" },
                    { key: "class", label: "Class" },
                    { key: "term", label: "Term" },
                    { key: "avgScore", label: "Avg Score" },
                    { key: "position", label: "Position" },
                    { key: "template", label: "Template" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "" },
                  ] as const
                ).map(col => (
                  <th
                    key={col.key}
                    onClick={() => (col.key === "studentName" || col.key === "class" || col.key === "avgScore") && handleSort(col.key)}
                    className={cn("py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider", (col.key === "studentName" || col.key === "class" || col.key === "avgScore") && "cursor-pointer hover:text-[var(--foreground)]")}
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
              {paginated.map(card => {
                const ss = STATUS_COLORS[card.status];
                return (
                  <tr key={card.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(card.id)}
                        onChange={() => toggleRow(card.id)}
                        className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[#6366F1]"
                      />
                    </td>
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{card.studentName}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{card.class}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{card.term}</td>
                    <td className="py-3 px-3 text-[12px] font-semibold text-[var(--foreground)]">{card.avgScore}%</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{card.position}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)] capitalize">{card.template}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {STATUS_LABELS[card.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === card.id ? null : card.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === card.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Download className="w-3.5 h-3.5" /> Download</button>
                            {card.status === "generated" && (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Send className="w-3.5 h-3.5" /> Publish</button>
                            )}
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[var(--background-secondary)]"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[13px] text-[var(--muted)]">No report cards found</td>
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
