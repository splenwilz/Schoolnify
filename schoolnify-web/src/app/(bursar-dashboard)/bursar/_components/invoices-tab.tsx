"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  FileDown,
  Send,
  CheckSquare,
  Calendar,
  User,
  CreditCard,
  ArrowUpRight,
  Receipt,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { invoices } from "@/lib/demo-data";

// ── Types ─────────────────────────────────────────────────────────────

type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";
type SortField = "student" | "total" | "dueDate" | null;
type SortDir = "asc" | "desc";

type Invoice = (typeof invoices)[number];

// ── Helpers ───────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Status Styles ─────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  InvoiceStatus,
  { bg: string; dot: string; color: string }
> = {
  paid: {
    bg: "bg-[#10B981]/10 text-[#10B981]",
    dot: "bg-[#10B981]",
    color: "#10B981",
  },
  pending: {
    bg: "bg-[#F59E0B]/10 text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    color: "#F59E0B",
  },
  overdue: {
    bg: "bg-[#EF4444]/10 text-[#EF4444]",
    dot: "bg-[#EF4444]",
    color: "#EF4444",
  },
  draft: {
    bg: "bg-[#6B7280]/10 text-[#6B7280]",
    dot: "bg-[#6B7280]",
    color: "#6B7280",
  },
};

// ── Sort Icon ─────────────────────────────────────────────────────────

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" />
  );
}

const fmtCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// ── Invoice Metrics ──────────────────────────────────────────────────

function useInvoiceMetrics() {
  return useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);

    const paid = invoices.filter((inv) => inv.status === "paid");
    const paidSum = paid.reduce((sum, inv) => sum + inv.total, 0);

    const pending = invoices.filter((inv) => inv.status === "pending");
    const pendingSum = pending.reduce((sum, inv) => sum + inv.total, 0);

    const overdue = invoices.filter((inv) => inv.status === "overdue");
    const overdueSum = overdue.reduce((sum, inv) => sum + inv.total, 0);

    const draft = invoices.filter((inv) => inv.status === "draft");

    const collectionRate = totalInvoiced > 0 ? (paidSum / totalInvoiced) * 100 : 0;

    // Avg days to payment for paid invoices
    const avgDaysToPay = paid.length > 0
      ? Math.round(paid.reduce((sum, inv) => {
          if (!inv.paidDate) return sum;
          const issued = new Date(inv.issuedDate).getTime();
          const paidAt = new Date(inv.paidDate).getTime();
          return sum + (paidAt - issued) / (1000 * 60 * 60 * 24);
        }, 0) / paid.length)
      : 0;

    // Status breakdown for donut
    const statusBreakdown = [
      { label: "Paid", count: paid.length, color: "#10B981" },
      { label: "Pending", count: pending.length, color: "#F59E0B" },
      { label: "Overdue", count: overdue.length, color: "#EF4444" },
      { label: "Draft", count: draft.length, color: "#6B7280" },
    ].filter((s) => s.count > 0);

    // Total discounts given
    const totalDiscounts = invoices.reduce((sum, inv) => sum + (inv.discount?.amount ?? 0), 0);

    return {
      totalInvoiced,
      paidCount: paid.length,
      paidSum,
      pendingCount: pending.length,
      pendingSum,
      overdueCount: overdue.length,
      overdueSum,
      collectionRate,
      avgDaysToPay,
      statusBreakdown,
      totalDiscounts,
      totalCount: invoices.length,
    };
  }, []);
}

// ── Invoice Detail Modal ──────────────────────────────────────────────

function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) {
  const statusStyle = STATUS_STYLES[invoice.status as InvoiceStatus];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-start justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Slide-over panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full max-w-lg overflow-y-auto bg-[var(--card)] shadow-2xl"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold text-[var(--foreground)]">
              {invoice.invoiceNumber}
            </h2>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full capitalize",
                statusStyle.bg
              )}
            >
              <span
                className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)}
              />
              {invoice.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Student</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {invoice.studentName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Grade</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {invoice.grade}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <User className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">
                    Parent / Guardian
                  </p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {invoice.parentName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
                Line Items
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[var(--border)]/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)]">
                      {item.description}
                    </td>
                    <td className="px-4 py-2.5 text-[13px] text-[var(--foreground)] text-right tabular-nums">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-[var(--border)] px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--muted)]">
                  Subtotal
                </span>
                <span className="text-[13px] text-[var(--foreground)] tabular-nums">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              {invoice.discount && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#10B981]">
                    Discount ({invoice.discount.name})
                  </span>
                  <span className="text-[13px] text-[#10B981] tabular-nums">
                    -{formatCurrency(invoice.discount.amount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-[14px] font-bold text-[var(--foreground)]">
                  Total
                </span>
                <span className="text-[18px] font-bold text-[var(--foreground)] tabular-nums">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {invoice.status === "paid" && (
            <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
              <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <div>
                    <p className="text-[11px] text-[var(--muted)]">
                      Payment Method
                    </p>
                    <p className="text-[13px] font-medium text-[var(--foreground)]">
                      {invoice.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <div>
                    <p className="text-[11px] text-[var(--muted)]">Paid Date</p>
                    <p className="text-[13px] font-medium text-[var(--foreground)]">
                      {invoice.paidDate ? formatDate(invoice.paidDate) : "---"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
              Dates
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Issue Date</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {formatDate(invoice.issuedDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
                <div>
                  <p className="text-[11px] text-[var(--muted)]">Due Date</p>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const lines = [
                  `Invoice: ${invoice.invoiceNumber}`,
                  `Student: ${invoice.studentName}`,
                  `Grade: ${invoice.grade}`,
                  `Parent: ${invoice.parentName}`,
                  "",
                  "Items:",
                  ...invoice.items.map(
                    (item) =>
                      `  ${item.description}: ${formatCurrency(item.amount)}`
                  ),
                  "",
                  `Subtotal: ${formatCurrency(invoice.subtotal)}`,
                  ...(invoice.discount
                    ? [
                        `Discount (${invoice.discount.name}): -${formatCurrency(invoice.discount.amount)}`,
                      ]
                    : []),
                  `Total: ${formatCurrency(invoice.total)}`,
                  "",
                  `Status: ${invoice.status}`,
                  `Issued: ${formatDate(invoice.issuedDate)}`,
                  `Due: ${formatDate(invoice.dueDate)}`,
                  ...(invoice.paidDate
                    ? [
                        `Paid: ${formatDate(invoice.paidDate)}`,
                        `Method: ${invoice.paymentMethod}`,
                      ]
                    : []),
                ];
                const blob = new Blob([lines.join("\n")], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${invoice.invoiceNumber}-receipt.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
            >
              <FileDown className="w-3.5 h-3.5" />
              Download Receipt
            </button>
            {invoice.status !== "paid" && invoice.status !== "draft" && (
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors">
                <Send className="w-3.5 h-3.5" />
                Send Reminder
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-medium rounded-xl border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────

export function InvoicesTab() {
  const metrics = useInvoiceMetrics();

  // ── State ──
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 5;

  // ── Click outside for menus ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  // ── Tabs ──
  const tabs = useMemo(() => {
    return [
      { id: "all", label: "All", count: invoices.length },
      {
        id: "paid",
        label: "Paid",
        count: invoices.filter((i) => i.status === "paid").length,
      },
      {
        id: "pending",
        label: "Pending",
        count: invoices.filter((i) => i.status === "pending").length,
      },
      {
        id: "overdue",
        label: "Overdue",
        count: invoices.filter((i) => i.status === "overdue").length,
      },
      {
        id: "draft",
        label: "Draft",
        count: invoices.filter((i) => i.status === "draft").length,
      },
    ];
  }, []);

  // ── Unique grades ──
  const grades = useMemo(
    () =>
      Array.from(new Set(invoices.map((inv) => inv.grade))).sort(),
    []
  );

  // ── Filtered + sorted data ──
  const filteredInvoices = useMemo(() => {
    let data = [...invoices];

    // Tab filter
    if (activeTab !== "all") {
      data = data.filter((inv) => inv.status === activeTab);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.studentName.toLowerCase().includes(q)
      );
    }

    // Grade filter
    if (gradeFilter) {
      data = data.filter((inv) => inv.grade === gradeFilter);
    }

    // Sort
    if (sortField) {
      const mul = sortDir === "asc" ? 1 : -1;
      data.sort((a, b) => {
        switch (sortField) {
          case "student":
            return mul * a.studentName.localeCompare(b.studentName);
          case "total":
            return mul * (a.total - b.total);
          case "dueDate":
            return (
              mul *
              (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            );
          default:
            return 0;
        }
      });
    }

    return data;
  }, [activeTab, searchQuery, gradeFilter, sortField, sortDir]);

  // ── Pagination ──
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, gradeFilter]);

  // ── Selection ──
  const allSelected =
    selectedInvoices.length === filteredInvoices.length &&
    filteredInvoices.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((inv) => inv.id));
    }
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ── Sort handler ──
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invoiced — with status donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #0891B2, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(8,145,178,0.1)" }}>
                <Receipt className="w-4.5 h-4.5" style={{ color: "#0891B2" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Total Invoiced</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {fmtCompact.format(metrics.totalInvoiced)}
              </p>
            </div>
            {/* Mini status donut */}
            <div className="flex-shrink-0">
              <svg width="44" height="44" viewBox="0 0 44 44">
                {(() => {
                  const r = 16;
                  const circ = 2 * Math.PI * r;
                  let offset = 0;
                  return metrics.statusBreakdown.map((seg) => {
                    const pct = seg.count / metrics.totalCount;
                    const dashLen = circ * pct;
                    const dashOff = circ - dashLen;
                    const rotation = (offset / circ) * 360 - 90;
                    offset += dashLen;
                    return (
                      <circle
                        key={seg.label}
                        cx="22" cy="22" r={r}
                        fill="none" stroke={seg.color} strokeWidth="4"
                        strokeDasharray={`${dashLen} ${dashOff}`}
                        transform={`rotate(${rotation} 22 22)`}
                      />
                    );
                  });
                })()}
                <text x="22" y="23" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="var(--foreground)">
                  {metrics.totalCount}
                </text>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
            {metrics.statusBreakdown.slice(0, 3).map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: seg.color }} />
                <span className="text-[10px] text-[var(--muted)]">
                  <span className="font-semibold text-[var(--foreground)]">{seg.count}</span> {seg.label.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 2: Paid — with collection rate progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.05 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #10B981, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(16,185,129,0.1)" }}>
                <CheckCircle className="w-4.5 h-4.5" style={{ color: "#10B981" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Collected</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {fmtCompact.format(metrics.paidSum)}
              </p>
            </div>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[rgba(16,185,129,0.1)] text-[#10B981] mt-1">
              <ArrowUpRight size={10} />
              {metrics.paidCount} paid
            </span>
          </div>
          {/* Collection rate bar */}
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[var(--muted)]">Collection rate</span>
              <span className="text-[10px] font-semibold text-[#10B981]">
                {metrics.collectionRate.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #10B981, #34D399)" }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.collectionRate}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Clock size={10} className="text-[var(--muted)]" />
              <span className="text-[10px] text-[var(--muted)]">
                Avg <span className="font-semibold text-[var(--foreground)]">{metrics.avgDaysToPay}d</span> to collect
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Pending — with countdown feel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #F59E0B, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(245,158,11,0.1)" }}>
                <Clock className="w-4.5 h-4.5" style={{ color: "#F59E0B" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Pending</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {fmtCompact.format(metrics.pendingSum)}
              </p>
            </div>
            {/* Pending count ring */}
            <div className="flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="14" fill="none" stroke="var(--border)" strokeWidth="3" opacity="0.2" />
                <motion.circle
                  cx="20" cy="20" r="14" fill="none"
                  stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  transform="rotate(-90 20 20)"
                  initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - metrics.pendingCount / metrics.totalCount) }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
                <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="#F59E0B">
                  {metrics.pendingCount}
                </text>
              </svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--muted)]">
                {metrics.pendingCount} invoice{metrics.pendingCount !== 1 ? "s" : ""} awaiting payment
              </span>
              <span className="text-[10px] font-semibold text-[#F59E0B]">
                {metrics.totalCount > 0 ? ((metrics.pendingCount / metrics.totalCount) * 100).toFixed(0) : 0}%
              </span>
            </div>
            {metrics.totalDiscounts > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <DollarSign size={10} className="text-[var(--muted)]" />
                <span className="text-[10px] text-[var(--muted)]">
                  {formatCurrency(metrics.totalDiscounts)} in discounts applied
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 4: Overdue — with urgency indicator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.15 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #EF4444, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(239,68,68,0.1)" }}>
                <AlertTriangle className="w-4.5 h-4.5" style={{ color: "#EF4444" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Overdue</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {fmtCompact.format(metrics.overdueSum)}
              </p>
            </div>
            {metrics.overdueCount > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[rgba(239,68,68,0.1)] text-[#EF4444] mt-1">
                <TrendingDown size={10} />
                At risk
              </span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            {/* Overdue proportion bar */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[var(--muted)]">{metrics.overdueCount} overdue invoice{metrics.overdueCount !== 1 ? "s" : ""}</span>
              <span className="text-[10px] font-semibold text-[#EF4444]">
                {metrics.totalInvoiced > 0 ? ((metrics.overdueSum / metrics.totalInvoiced) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #F87171, #EF4444)" }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.totalInvoiced > 0 ? (metrics.overdueSum / metrics.totalInvoiced) * 100 : 0}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Invoice Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          delay: 0.2,
        }}
        className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                Invoices
              </h3>
              <p className="text-[12px] text-[var(--muted)] mt-0.5">
                {filteredInvoices.length} invoice
                {filteredInvoices.length !== 1 ? "s" : ""}
                {sortField && <span> &middot; Sorted by {sortField === "dueDate" ? "due date" : sortField}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {selectedInvoices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[12px] font-medium text-[var(--muted)]">
                      {selectedInvoices.length} selected
                    </span>
                    <button className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
                      Mark Paid
                    </button>
                    <button className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#0891B2]/10 text-[#0891B2] hover:bg-[#0891B2]/20 transition-colors">
                      Send Reminders
                    </button>
                    <button className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                      Download
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-[12px] text-[var(--muted)] tabular-nums">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tab Pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {tab.label}
                  <span className="ml-1 tabular-nums opacity-60">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search by invoice # or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Grade Dropdown */}
            <div className="relative">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className={cn(
                  "appearance-none pl-3 pr-7 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                  "bg-[var(--background-secondary)] text-[var(--foreground)]",
                  "focus:outline-none focus:border-[var(--border)]",
                  !gradeFilter && "text-[var(--muted)]"
                )}
              >
                <option value="">All Grades</option>
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--muted)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-[var(--border)]">
                <th className="w-14 px-6 py-3">
                  <div
                    onClick={handleSelectAll}
                    className={cn(
                      "w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all",
                      allSelected
                        ? "bg-[var(--foreground)] border-[var(--foreground)]"
                        : "border-[var(--border)] hover:border-[var(--muted)]"
                    )}
                  >
                    {allSelected && (
                      <svg
                        className="w-2.5 h-2.5 text-[var(--background)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Invoice #
                </th>
                <th
                  onClick={() => handleSort("student")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Student
                    <SortIcon
                      field="student"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Items
                </th>
                <th
                  onClick={() => handleSort("total")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Total
                    <SortIcon
                      field="total"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Issued
                </th>
                <th
                  onClick={() => handleSort("dueDate")}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Due
                    <SortIcon
                      field="dueDate"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </span>
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-12 text-center text-[13px] text-[var(--muted)]"
                  >
                    No invoices found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv, index) => {
                  const isSelected = selectedInvoices.includes(inv.id);
                  const statusStyle =
                    STATUS_STYLES[inv.status as InvoiceStatus];

                  return (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className={cn(
                        "group transition-colors",
                        "border-b border-[var(--border)]/50 last:border-b-0",
                        isSelected
                          ? "bg-[var(--background-secondary)]/60"
                          : "hover:bg-[var(--background-secondary)]/30"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4">
                        <div
                          onClick={() => handleSelectInvoice(inv.id)}
                          className={cn(
                            "w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all",
                            isSelected
                              ? "bg-[var(--foreground)] border-[var(--foreground)]"
                              : "border-[var(--border)] group-hover:border-[var(--muted)]"
                          )}
                        >
                          {isSelected && (
                            <svg
                              className="w-2.5 h-2.5 text-[var(--background)]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </td>

                      {/* Invoice # */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-mono font-medium text-[var(--foreground)]">
                          {inv.invoiceNumber}
                        </span>
                      </td>

                      {/* Student */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--foreground)]">
                          {inv.studentName}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--muted)]">
                          {inv.grade}
                        </span>
                      </td>

                      {/* Items count */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--muted)] tabular-nums">
                          {inv.items.length}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
                          {formatCurrency(inv.total)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full capitalize",
                            statusStyle.bg
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              statusStyle.dot
                            )}
                          />
                          {inv.status}
                        </span>
                      </td>

                      {/* Issued */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--muted)]">
                          {formatDate(inv.issuedDate)}
                        </span>
                      </td>

                      {/* Due */}
                      <td className="px-4 py-4">
                        <span className="text-[13px] text-[var(--muted)]">
                          {formatDate(inv.dueDate)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div
                          className="relative"
                          ref={
                            openMenuId === inv.id ? menuRef : undefined
                          }
                        >
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === inv.id ? null : inv.id
                              )
                            }
                            className="p-1.5 rounded-lg text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--background-secondary)] transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {openMenuId === inv.id && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  scale: 0.95,
                                  y: -4,
                                }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.95,
                                  y: -4,
                                }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 w-44 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden"
                              >
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDetailInvoice(inv);
                                  }}
                                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[var(--muted)]" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    const lines = [
                                      `Invoice: ${inv.invoiceNumber}`,
                                      `Student: ${inv.studentName}`,
                                      `Total: ${formatCurrency(inv.total)}`,
                                      `Status: ${inv.status}`,
                                      `Due: ${formatDate(inv.dueDate)}`,
                                    ];
                                    const blob = new Blob(
                                      [lines.join("\n")],
                                      { type: "text/plain" }
                                    );
                                    const url =
                                      URL.createObjectURL(blob);
                                    const a =
                                      document.createElement("a");
                                    a.href = url;
                                    a.download = `${inv.invoiceNumber}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                  <FileDown className="w-3.5 h-3.5 text-[var(--muted)]" />
                                  Download
                                </button>
                                {inv.status !== "paid" &&
                                  inv.status !== "draft" && (
                                    <button
                                      onClick={() => setOpenMenuId(null)}
                                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                    >
                                      <Send className="w-3.5 h-3.5 text-[var(--muted)]" />
                                      Send Reminder
                                    </button>
                                  )}
                                <div className="border-t border-[var(--border)]" />
                                {inv.status !== "paid" && (
                                  <button
                                    onClick={() => setOpenMenuId(null)}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[#10B981] hover:bg-[var(--background-secondary)] transition-colors"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Mark as Paid
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
            <p className="text-[12px] text-[var(--muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}&ndash;
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredInvoices.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--foreground)]">
                {filteredInvoices.length}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <div className="flex items-center gap-0.5 mx-1">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 text-[12px] rounded-lg font-medium transition-all",
                      page === currentPage
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Invoice Detail Modal ── */}
      <AnimatePresence>
        {detailInvoice && (
          <InvoiceDetailModal
            invoice={detailInvoice}
            onClose={() => setDetailInvoice(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
