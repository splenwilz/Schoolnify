"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { upcomingPaymentDues } from "@/lib/demo-data";

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
  });
}

function getDaysLabel(days: number) {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d`;
}

function getBorderColor(days: number) {
  if (days < 5) return "#EF4444";
  if (days < 14) return "#F59E0B";
  return "var(--border)";
}

export function UpcomingPaymentsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Upcoming Payments
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {upcomingPaymentDues.map((due, i) => (
          <motion.div
            key={due.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.4 + i * 0.06 }}
            className="flex gap-3 rounded-xl p-3 bg-[var(--background-secondary)]/50 border-l-[3px]"
            style={{ borderLeftColor: getBorderColor(due.daysUntil) }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                {due.studentName}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {formatCurrency(due.amount)} · {due.type}
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                Due: {formatDate(due.dueDate)}
              </p>
            </div>
            <span
              className="text-[11px] font-semibold flex-shrink-0 self-center px-2 py-0.5 rounded-md"
              style={{
                color: getBorderColor(due.daysUntil),
                backgroundColor:
                  due.daysUntil < 5
                    ? "rgba(239,68,68,0.08)"
                    : due.daysUntil < 14
                      ? "rgba(245,158,11,0.08)"
                      : "transparent",
              }}
            >
              {getDaysLabel(due.daysUntil)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
