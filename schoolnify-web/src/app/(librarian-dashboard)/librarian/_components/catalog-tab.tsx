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
  Edit3,
  Trash2,
  Plus,
  BookOpen,
  BookMarked,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { libraryBooks, categoryDistribution, librarySummary } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "title" | "author" | "totalCopies" | "borrowCount";
type SortDirection = "asc" | "desc";
type CategoryFilter = "all" | "fiction" | "textbook" | "reference" | "science" | "biography";
type StatusFilter = "all" | "available" | "low_stock" | "out_of_stock";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 8;

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  fiction: { bg: "rgba(59,130,246,0.1)", text: "#3B82F6" },
  textbook: { bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  reference: { bg: "rgba(139,92,246,0.1)", text: "#8B5CF6" },
  science: { bg: "rgba(8,145,178,0.1)", text: "#0891B2" },
  biography: { bg: "rgba(236,72,153,0.1)", text: "#EC4899" },
  non_fiction: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
};

const STATUS_STYLES: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  available: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981", label: "Available" },
  low_stock: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B", label: "Low Stock" },
  out_of_stock: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444", label: "Out of Stock" },
};

const CATEGORY_LABELS: Record<string, string> = {
  fiction: "Fiction",
  textbook: "Textbook",
  reference: "Reference",
  science: "Science",
  biography: "Biography",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CatalogTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Summary metrics
  const metrics = useMemo(() => {
    const totalBooks = librarySummary.totalBooks;
    const totalCopies = librarySummary.totalCopies;
    const availableCopies = totalCopies - librarySummary.booksCheckedOut;
    const lowStock = libraryBooks.filter(b => b.status === "low_stock").length;
    const addedThisMonth = librarySummary.booksAddedThisMonth;
    const totalCategories = categoryDistribution.length;
    const mandatoryCount = libraryBooks.filter(b => b.category === "textbook").length;
    const optionalCount = libraryBooks.length - mandatoryCount;
    return { totalBooks, totalCopies, availableCopies, lowStock, addedThisMonth, totalCategories, mandatoryCount, optionalCount };
  }, []);

  // Filtered & sorted
  const filteredBooks = useMemo(() => {
    let data = [...libraryBooks];
    if (categoryFilter !== "all") data = data.filter(b => b.category === categoryFilter);
    if (statusFilter !== "all") data = data.filter(b => b.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q));
    }
    data.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "title") return a.title.localeCompare(b.title) * dir;
      if (sortField === "author") return a.author.localeCompare(b.author) * dir;
      if (sortField === "totalCopies") return (a.totalCopies - b.totalCopies) * dir;
      if (sortField === "borrowCount") return (a.borrowCount - b.borrowCount) * dir;
      return 0;
    });
    return data;
  }, [categoryFilter, statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
    setCurrentPage(1);
  };

  // Donut for categories
  const totalCatBooks = categoryDistribution.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Books with mini donut */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981]/5 to-transparent -translate-y-6 translate-x-6" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-[var(--muted)] mb-1">Total Books</p>
              <p className="text-[22px] font-bold text-[var(--foreground)]">{metrics.totalBooks.toLocaleString()}</p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">{metrics.totalCopies.toLocaleString()} total copies</p>
            </div>
            <svg width="52" height="52" viewBox="0 0 52 52">
              {(() => {
                const r = 20; const circ = 2 * Math.PI * r;
                let offset = 0;
                return categoryDistribution.slice(0, 4).map((cat, i) => {
                  const pct = cat.count / totalCatBooks;
                  const dash = pct * circ;
                  const el = <circle key={i} cx="26" cy="26" r={r} fill="none" stroke={cat.color} strokeWidth="5" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} transform="rotate(-90 26 26)" />;
                  offset += dash;
                  return el;
                });
              })()}
              <circle cx="26" cy="26" r="13" fill="var(--card)" />
              <text x="26" y="28" textAnchor="middle" className="text-[10px] font-bold" fill="var(--foreground)">{metrics.totalCategories}</text>
            </svg>
          </div>
        </div>

        {/* Available Copies with progress bar */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#3B82F6]/5 to-transparent -translate-y-6 translate-x-6" />
          <p className="text-[11px] font-medium text-[var(--muted)] mb-1">Available Copies</p>
          <p className="text-[22px] font-bold text-[var(--foreground)]">{metrics.availableCopies.toLocaleString()}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--muted)]">Availability Rate</span>
              <span className="text-[10px] font-semibold text-[#3B82F6]">{Math.round((metrics.availableCopies / metrics.totalCopies) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--background-secondary)]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(metrics.availableCopies / metrics.totalCopies) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #3B82F6, #60A5FA)" }} />
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#F59E0B]/5 to-transparent -translate-y-6 translate-x-6" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-[var(--muted)] mb-1">Low Stock</p>
              <p className="text-[22px] font-bold text-[var(--foreground)]">{metrics.lowStock}</p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">books need restock</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* New This Month */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6]/5 to-transparent -translate-y-6 translate-x-6" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-[var(--muted)] mb-1">New This Month</p>
              <p className="text-[22px] font-bold text-[var(--foreground)]">{metrics.addedThisMonth}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-[#10B981]" />
                <span className="text-[11px] font-medium text-[#10B981]">+12%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#8B5CF6]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
              {(["all", "fiction", "textbook", "reference", "science", "biography"] as CategoryFilter[]).map(c => (
                <button key={c} onClick={() => { setCategoryFilter(c); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", categoryFilter === c ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                  {c === "all" ? "All" : CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
              {(["all", "available", "low_stock", "out_of_stock"] as StatusFilter[]).map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === s ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                  {s === "all" ? "All Status" : STATUS_STYLES[s].label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search by title, author, ISBN..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-64 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {([["title", "Title"], ["author", "Author"], ["isbn", "ISBN"], ["category", "Category"], ["totalCopies", "Copies"], ["condition", "Condition"], ["location", "Location"], ["status", "Status"], ["actions", ""]] as const).map(([key, label]) => (
                  <th key={key} className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {(key === "title" || key === "author" || key === "totalCopies") ? (
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
              {paginatedBooks.map(book => {
                const catStyle = CATEGORY_COLORS[book.category] || { bg: "rgba(0,0,0,0.05)", text: "var(--muted)" };
                const statusStyle = STATUS_STYLES[book.status];
                return (
                  <tr key={book.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: book.coverColor + "20" }}>
                          <BookMarked className="w-4 h-4" style={{ color: book.coverColor }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-[var(--foreground)] truncate max-w-[180px]">{book.title}</p>
                          <p className="text-[10px] text-[var(--muted)]">{book.publishedYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{book.author}</td>
                    <td className="py-3 px-3 text-[11px] text-[var(--muted)] font-mono">{book.isbn}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: catStyle.bg, color: catStyle.text }}>{CATEGORY_LABELS[book.category]}</span>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">
                      <span className="font-medium">{book.availableCopies}</span>
                      <span className="text-[var(--muted)]"> / {book.totalCopies}</span>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)] capitalize">{book.condition}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{book.location}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === book.id ? null : book.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === book.id && (
                          <div className="absolute right-0 top-8 z-20 w-36 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[var(--background-secondary)]"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredBooks.length)} of {filteredBooks.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40 transition-colors"><ChevronLeft className="w-4 h-4 text-[var(--muted)]" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-7 h-7 rounded-lg text-[11px] font-medium transition-all", p === currentPage ? "bg-[#10B981] text-white" : "text-[var(--muted)] hover:bg-[var(--background-secondary)]")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40 transition-colors"><ChevronRight className="w-4 h-4 text-[var(--muted)]" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
