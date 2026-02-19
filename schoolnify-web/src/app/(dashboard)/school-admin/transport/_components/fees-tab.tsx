"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, Clock, AlertTriangle } from "lucide-react";

interface Fee {
  id: string;
  studentName: string;
  grade: string;
  routeName: string;
  amount: number;
  period: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidDate?: string;
}

interface FeesTabProps {
  fees: Fee[];
}

const statusColors: Record<string, string> = {
  paid: "#10B981",
  pending: "#F59E0B",
  overdue: "#EF4444",
};

export function FeesTab({ fees }: FeesTabProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG").format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const summaryCards = [
    {
      label: "Total Collected",
      value: summary.paid,
      color: "#10B981",
      icon: DollarSign,
    },
    {
      label: "Pending",
      value: summary.pending,
      color: "#F59E0B",
      icon: Clock,
    },
    {
      label: "Overdue",
      value: summary.overdue,
      color: "#EF4444",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
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
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: card.color }}
                  />
                </div>
                <span className="text-[12px] text-[var(--muted)]">
                  {card.label}
                </span>
              </div>
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: card.color }}
              >
                {"\u20A6"}{formatCurrency(card.value)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Fees Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          delay: 0.15,
        }}
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Student
                </th>
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Route
                </th>
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Period
                </th>
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Status
                </th>
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Due Date
                </th>
                <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                  Paid Date
                </th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee, i) => (
                <motion.tr
                  key={fee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {fee.studentName}
                      </p>
                      <p className="text-[11px] text-[var(--muted)]">
                        {fee.grade}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--foreground)]">
                      {fee.routeName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                      {"\u20A6"}{formatCurrency(fee.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--muted)]">
                      {fee.period}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
                      style={{
                        color: statusColors[fee.status],
                        backgroundColor: `${statusColors[fee.status]}15`,
                      }}
                    >
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--muted)]">
                      {formatDate(fee.dueDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--muted)]">
                      {fee.paidDate ? formatDate(fee.paidDate) : "—"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
