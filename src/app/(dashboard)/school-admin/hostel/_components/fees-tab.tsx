"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  blockName: string;
  roomNumber: string;
  amount: number;
  period: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
}

interface Block {
  id: string;
  name: string;
  type: "boys" | "girls";
  totalRooms: number;
  occupiedRooms: number;
  capacity: number;
  currentOccupancy: number;
  warden: string;
}

interface FeesTabProps {
  fees: Fee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  blockFilter: string;
  onBlockChange: (block: string) => void;
  blocks: Block[];
}

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  paid: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", label: "Paid" },
  pending: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Pending",
  },
  overdue: {
    bg: "bg-[#EF4444]/10",
    text: "text-[#EF4444]",
    label: "Overdue",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "\u20A6");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FeesTab({
  fees,
  searchQuery,
  onSearchChange,
  blockFilter,
  onBlockChange,
  blocks,
}: FeesTabProps) {
  const summary = useMemo(() => {
    const paid = fees
      .filter((f) => f.status === "paid")
      .reduce((sum, f) => sum + f.amount, 0);
    const pending = fees
      .filter((f) => f.status === "pending")
      .reduce((sum, f) => sum + f.amount, 0);
    const overdue = fees
      .filter((f) => f.status === "overdue")
      .reduce((sum, f) => sum + f.amount, 0);
    return { paid, pending, overdue };
  }, [fees]);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      if (blockFilter && fee.blockName !== blockFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !fee.studentName.toLowerCase().includes(query) &&
          !fee.grade.toLowerCase().includes(query) &&
          !fee.roomNumber.toLowerCase().includes(query)
        )
          return false;
      }
      return true;
    });
  }, [fees, blockFilter, searchQuery]);

  const summaryCards = [
    {
      label: "Total Collected",
      value: formatCurrency(summary.paid),
      color: "#10B981",
    },
    {
      label: "Pending",
      value: formatCurrency(summary.pending),
      color: "#F59E0B",
    },
    {
      label: "Overdue",
      value: formatCurrency(summary.overdue),
      color: "#EF4444",
    },
  ];

  // Extract unique block names for the filter dropdown
  const blockNames = [...new Set(fees.map((f) => f.blockName))];

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 200,
              delay: i * 0.05,
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <p className="text-[12px] text-[var(--muted)] mb-1">
              {card.label}
            </p>
            <p
              className="text-lg font-bold tabular-nums"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Search + Block Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, grade, or room..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={blockFilter}
            onChange={(e) => onBlockChange(e.target.value)}
            className={cn(
              "appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-transparent transition-all cursor-pointer",
              "bg-[var(--background-secondary)] text-[var(--foreground)]",
              "focus:outline-none focus:border-[var(--border)]",
              !blockFilter && "text-[var(--muted)]"
            )}
          >
            <option value="">All Blocks</option>
            {blockNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
        </div>
      </div>

      {/* Fees Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Block
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                  Period
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-sm text-[var(--muted)]">
                      No fee records found.
                    </p>
                    <button
                      onClick={() => {
                        onSearchChange("");
                        onBlockChange("");
                      }}
                      className="mt-2 text-sm text-[#0891B2] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => {
                  const config = statusConfig[fee.status];
                  return (
                    <tr
                      key={fee.id}
                      className="border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                    >
                      {/* Student */}
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-[var(--foreground)]">
                          {fee.studentName}
                        </p>
                        <p className="text-[12px] text-[var(--muted)] mt-0.5">
                          {fee.grade}
                        </p>
                      </td>

                      {/* Block */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-[var(--foreground)]">
                          {fee.blockName}
                        </span>
                      </td>

                      {/* Room */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-[var(--foreground)]">
                          {fee.roomNumber}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                          {formatCurrency(fee.amount)}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-[12px] text-[var(--muted)]">
                          {fee.period}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                            config.bg,
                            config.text
                          )}
                        >
                          {config.label}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-[13px] text-[var(--muted)]">
                          {formatDate(fee.dueDate)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
