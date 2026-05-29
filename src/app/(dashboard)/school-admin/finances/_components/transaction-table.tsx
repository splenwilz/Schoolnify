"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  ChevronDown,
  Eye,
  Send,
  FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  studentName: string;
  type: "tuition" | "activity" | "supplies";
  amount: number;
  status: "completed" | "pending" | "overdue";
  date: string;
  method: string;
}

interface Tab {
  id: string;
  label: string;
  count: number;
}

type SortField = "amount" | "date" | "student" | null;
type SortDir = "asc" | "desc";

interface TransactionTableProps {
  transactions: Transaction[];
  selectedTransactions: string[];
  onSelectAll: () => void;
  onSelectTransaction: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" />
  );
}

const TYPE_STYLES: Record<string, string> = {
  tuition: "bg-[#0891B2]/10 text-[#0891B2]",
  activity: "bg-[#A855F7]/10 text-[#A855F7]",
  supplies: "bg-[#F59E0B]/10 text-[#F59E0B]",
};

const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  completed: { bg: "bg-[#10B981]/10 text-[#10B981]", dot: "bg-[#10B981]" },
  pending: { bg: "bg-[#F59E0B]/10 text-[#F59E0B]", dot: "bg-[#F59E0B]" },
  overdue: { bg: "bg-[#EF4444]/10 text-[#EF4444]", dot: "bg-[#EF4444]" },
};

export function TransactionTable({
  transactions,
  selectedTransactions,
  onSelectAll,
  onSelectTransaction,
  currentPage,
  onPageChange,
  itemsPerPage,
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: TransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortField) return 0;
    const mul = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "amount":
        return mul * (a.amount - b.amount);
      case "date":
        return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      case "student":
        return mul * a.studentName.localeCompare(b.studentName);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginated = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const allSelected =
    selectedTransactions.length === transactions.length && transactions.length > 0;

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header with Integrated Filters */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Transactions
            </h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {transactions.length} transactions
              {sortField && <span> · Sorted by {sortField}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {selectedTransactions.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-[12px] font-medium text-[var(--muted)]"
                >
                  {selectedTransactions.length} selected
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[12px] text-[var(--muted)] tabular-nums">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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
          <div className="relative flex-1 max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8.5 pr-8 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Type dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !typeFilter && "text-[var(--muted)]"
              )}
            >
              <option value="">All Types</option>
              <option value="tuition">Tuition</option>
              <option value="activity">Activity</option>
              <option value="supplies">Supplies</option>
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
                  onClick={onSelectAll}
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
                Transaction
              </th>
              <th
                onClick={() => handleSort("student")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Student{" "}
                  <SortIcon
                    field="student"
                    sortField={sortField}
                    sortDir={sortDir}
                  />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Type
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Amount{" "}
                  <SortIcon
                    field="amount"
                    sortField={sortField}
                    sortDir={sortDir}
                  />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th
                onClick={() => handleSort("date")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Date{" "}
                  <SortIcon
                    field="date"
                    sortField={sortField}
                    sortDir={sortDir}
                  />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Method
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((txn, index) => {
              const isSelected = selectedTransactions.includes(txn.id);
              const statusStyle = STATUS_STYLES[txn.status];

              return (
                <motion.tr
                  key={txn.id}
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
                  <td className="px-6 py-4">
                    <div
                      onClick={() => onSelectTransaction(txn.id)}
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

                  <td className="px-4 py-4">
                    <span className="text-[13px] font-mono text-[var(--foreground)]">
                      {txn.id}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--foreground)]">
                      {txn.studentName}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full",
                        TYPE_STYLES[txn.type]
                      )}
                    >
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
                      {formatCurrency(txn.amount)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full",
                        statusStyle.bg
                      )}
                    >
                      <span
                        className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)}
                      />
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">
                      {formatDate(txn.date)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">
                      {txn.method}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div
                      className="relative"
                      ref={openMenuId === txn.id ? menuRef : undefined}
                    >
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === txn.id ? null : txn.id)
                        }
                        className="p-1.5 rounded-lg text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--background-secondary)] transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenuId === txn.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-1 w-44 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden"
                          >
                            <Link
                              href={`/school-admin/finances/${txn.id}`}
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[var(--muted)]" />
                              View Details
                            </Link>
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <Send className="w-3.5 h-3.5 text-[var(--muted)]" />
                              Send Reminder
                            </button>
                            <div className="border-t border-[var(--border)]" />
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                const blob = new Blob(
                                  [
                                    `Transaction Receipt\nID: ${txn.id}\nStudent: ${txn.studentName}\nType: ${txn.type}\nAmount: ${formatCurrency(txn.amount)}\nStatus: ${txn.status}\nDate: ${formatDate(txn.date)}\nMethod: ${txn.method}`,
                                  ],
                                  { type: "text/plain" }
                                );
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${txn.id}-receipt.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <FileDown className="w-3.5 h-3.5 text-[var(--muted)]" />
                              Download Receipt
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--foreground)]">
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, transactions.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--foreground)]">
              {transactions.length}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
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
                  onClick={() => onPageChange(page)}
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
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
