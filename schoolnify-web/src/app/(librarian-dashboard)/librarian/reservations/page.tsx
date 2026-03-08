"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  FileDown,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { libraryReservations } from "@/lib/demo-data";

type ResFilter = "all" | "pending" | "fulfilled" | "cancelled" | "expired";

const STATUS_STYLES: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  pending: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B", label: "Pending" },
  fulfilled: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981", label: "Fulfilled" },
  cancelled: { dot: "#9CA3AF", bg: "rgba(156,163,175,0.1)", text: "#9CA3AF", label: "Cancelled" },
  expired: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444", label: "Expired" },
};

const ITEMS_PER_PAGE = 8;

export default function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState<ResFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const statusCounts = useMemo(() => ({
    all: libraryReservations.length,
    pending: libraryReservations.filter(r => r.status === "pending").length,
    fulfilled: libraryReservations.filter(r => r.status === "fulfilled").length,
    cancelled: libraryReservations.filter(r => r.status === "cancelled").length,
    expired: libraryReservations.filter(r => r.status === "expired").length,
  }), []);

  const filtered = useMemo(() => {
    let data = [...libraryReservations];
    if (statusFilter !== "all") data = data.filter(r => r.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r => r.bookTitle.toLowerCase().includes(q) || r.memberName.toLowerCase().includes(q));
    }
    return data;
  }, [statusFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            href="/librarian"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Book Reservations</h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">Manage book reservation queue and fulfillments</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] transition-all">
          <FileDown className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Pending", count: statusCounts.pending, color: "#F59E0B" },
          { label: "Fulfilled", count: statusCounts.fulfilled, color: "#10B981" },
          { label: "Cancelled", count: statusCounts.cancelled, color: "#9CA3AF" },
          { label: "Expired", count: statusCounts.expired, color: "#EF4444" },
        ].map(card => (
          <div key={card.label} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{card.label}</p>
            <p className="text-[22px] font-bold" style={{ color: card.color }}>{card.count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "pending", "fulfilled", "cancelled", "expired"] as ResFilter[]).map(f => (
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
                {["Book", "Member", "Grade", "Reserved Date", "Queue Position", "Notified", "Status", ""].map(label => (
                  <th key={label} className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(res => {
                const ss = STATUS_STYLES[res.status];
                return (
                  <tr key={res.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{res.bookTitle}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{res.memberName}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{res.grade}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(res.reservedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{res.queuePosition > 0 ? `#${res.queuePosition}` : "—"}</td>
                    <td className="py-3 px-3">
                      {res.notified ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <span className="text-[12px] text-[var(--muted)]">No</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {ss.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === res.id ? null : res.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === res.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View</button>
                            {res.status === "pending" && (
                              <>
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#10B981] hover:bg-[var(--background-secondary)]"><CheckCircle2 className="w-3.5 h-3.5" /> Fulfill</button>
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Bell className="w-3.5 h-3.5" /> Notify</button>
                                <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[var(--background-secondary)]"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
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
            <p className="text-[11px] text-[var(--muted)]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
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
    </motion.div>
  );
}
