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
  UserX,
  UserCheck,
  Users,
  UserMinus,
  Star,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { libraryMembers } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "name" | "totalBorrowed" | "booksCheckedOut" | "lastActivity";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "active" | "suspended";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const STATUS_STYLES: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  active: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981", label: "Active" },
  suspended: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444", label: "Suspended" },
  expired: { dot: "#9CA3AF", bg: "rgba(156,163,175,0.1)", text: "#9CA3AF", label: "Expired" },
};

const ITEMS_PER_PAGE = 8;

// Grade activity data for chart
const GRADE_ACTIVITY = [
  { grade: "7A", members: 45, borrowed: 320 },
  { grade: "7B", members: 42, borrowed: 280 },
  { grade: "8A", members: 50, borrowed: 410 },
  { grade: "8B", members: 48, borrowed: 370 },
  { grade: "9A", members: 55, borrowed: 450 },
  { grade: "9B", members: 52, borrowed: 390 },
  { grade: "10A", members: 60, borrowed: 520 },
  { grade: "10B", members: 58, borrowed: 480 },
  { grade: "11A", members: 48, borrowed: 380 },
  { grade: "12A", members: 40, borrowed: 350 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MembersTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalBorrowed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const metrics = useMemo(() => ({
    active: libraryMembers.filter(m => m.status === "active").length,
    suspended: libraryMembers.filter(m => m.status === "suspended").length,
    topBorrowers: libraryMembers.filter(m => m.totalBorrowed >= 25).length,
    withFines: libraryMembers.filter(m => m.fineBalance > 0).length,
  }), []);

  const filteredMembers = useMemo(() => {
    let data = [...libraryMembers];
    if (statusFilter !== "all") data = data.filter(m => m.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(m => m.name.toLowerCase().includes(q) || m.grade.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * dir;
      if (sortField === "totalBorrowed") return (a.totalBorrowed - b.totalBorrowed) * dir;
      if (sortField === "booksCheckedOut") return (a.booksCheckedOut - b.booksCheckedOut) * dir;
      if (sortField === "lastActivity") return (new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()) * dir;
      return 0;
    });
    return data;
  }, [statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("desc"); }
    setCurrentPage(1);
  };

  // Chart max
  const maxBorrowed = Math.max(...GRADE_ACTIVITY.map(g => g.borrowed));

  // Borrowing frequency for donut
  const freqData = [
    { label: "Heavy (20+)", count: 3, color: "#10B981" },
    { label: "Regular (10-19)", count: 4, color: "#3B82F6" },
    { label: "Light (1-9)", count: 2, color: "#F59E0B" },
    { label: "Inactive (0)", count: 1, color: "#9CA3AF" },
  ];
  const freqTotal = freqData.reduce((s, f) => s + f.count, 0);

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Members", value: metrics.active, icon: Users, color: "#10B981" },
          { label: "Suspended", value: metrics.suspended, icon: UserMinus, color: "#EF4444" },
          { label: "Top Borrowers", value: metrics.topBorrowers, icon: Star, color: "#8B5CF6" },
          { label: "Members with Fines", value: metrics.withFines, icon: AlertTriangle, color: "#F59E0B" },
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

      {/* ── Charts Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Member Activity by Grade */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Borrowing Activity by Grade</h3>
          <div className="space-y-2.5">
            {GRADE_ACTIVITY.map(g => (
              <div key={g.grade} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-[var(--muted)] w-10">{g.grade}</span>
                <div className="flex-1 h-5 rounded-md bg-[var(--background-secondary)] relative overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(g.borrowed / maxBorrowed) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-md" style={{ background: "linear-gradient(90deg, #10B981, #34D399)" }} />
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground)] w-10 text-right">{g.borrowed}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Borrowing Frequency */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Borrowing Frequency</h3>
          <div className="flex justify-center mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {(() => {
                const r = 45; const circ = 2 * Math.PI * r;
                let offset = 0;
                return freqData.map((f, i) => {
                  const pct = f.count / freqTotal;
                  const dash = pct * circ;
                  const el = <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={f.color} strokeWidth="12" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)" />;
                  offset += dash;
                  return el;
                });
              })()}
              <circle cx="60" cy="60" r="32" fill="var(--card)" />
              <text x="60" y="62" textAnchor="middle" className="text-[14px] font-bold" fill="var(--foreground)">{freqTotal}</text>
              <text x="60" y="74" textAnchor="middle" className="text-[8px]" fill="var(--muted)">members</text>
            </svg>
          </div>
          <div className="space-y-2">
            {freqData.map(f => (
              <div key={f.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                  <span className="text-[11px] text-[var(--muted)]">{f.label}</span>
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground)]">{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Members Table ──────────────────────────────────────── */}
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
            {(["all", "active", "suspended"] as StatusFilter[]).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                {f === "all" ? `All (${libraryMembers.length})` : `${STATUS_STYLES[f].label} (${f === "active" ? metrics.active : metrics.suspended})`}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search members..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-56 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {([["name", "Name"], ["grade", "Grade"], ["booksCheckedOut", "Books Out"], ["totalBorrowed", "Total Borrowed"], ["overdueCount", "Overdue"], ["fineBalance", "Fine Balance"], ["lastActivity", "Last Activity"], ["status", "Status"], ["actions", ""]] as const).map(([key, label]) => (
                  <th key={key} className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {(key === "name" || key === "totalBorrowed" || key === "booksCheckedOut" || key === "lastActivity") ? (
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
              {paginatedMembers.map(member => {
                const ss = STATUS_STYLES[member.status];
                return (
                  <tr key={member.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-[var(--foreground)]">{member.name}</p>
                          <p className="text-[10px] text-[var(--muted)]">{member.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{member.grade}</td>
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{member.booksCheckedOut}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{member.totalBorrowed}</td>
                    <td className="py-3 px-3">
                      <span className={cn("text-[12px] font-medium", member.overdueCount > 0 ? "text-[#EF4444]" : "text-[var(--muted)]")}>{member.overdueCount}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={cn("text-[12px] font-medium", member.fineBalance > 0 ? "text-[#EF4444]" : "text-[var(--muted)]")}>{fmt.format(member.fineBalance)}</span>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(member.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {ss.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === member.id ? null : member.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === member.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View Profile</button>
                            {member.status === "active" ? (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[var(--background-secondary)]"><UserX className="w-3.5 h-3.5" /> Suspend</button>
                            ) : (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#10B981] hover:bg-[var(--background-secondary)]"><UserCheck className="w-3.5 h-3.5" /> Activate</button>
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
            <p className="text-[11px] text-[var(--muted)]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length}</p>
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
