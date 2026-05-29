"use client";

import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { financialTransactions } from "@/lib/demo-data";

const METHOD_COLORS: Record<string, string> = {
  "Credit Card": "#0891B2",
  "Bank Transfer": "#10B981",
  Cash: "#F59E0B",
  Pending: "#EF4444",
};

// Group transactions by method
const methodCounts = financialTransactions.reduce<Record<string, number>>(
  (acc, t) => {
    acc[t.method] = (acc[t.method] || 0) + 1;
    return acc;
  },
  {}
);

const methods = Object.entries(methodCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / financialTransactions.length) * 100),
    color: METHOD_COLORS[name] || "#0891B2",
  }));

export function PaymentMethodsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Payment Methods
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {methods.map((method, i) => (
          <div key={method.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-[var(--muted)] font-medium">
                {method.name}
              </span>
              <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
                {method.count}{" "}
                <span className="text-[var(--muted)] font-normal">
                  ({method.percentage}%)
                </span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: method.color }}
                initial={{ width: 0 }}
                animate={{ width: `${method.percentage}%` }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.08,
                  ease: "easeOut" as const,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
