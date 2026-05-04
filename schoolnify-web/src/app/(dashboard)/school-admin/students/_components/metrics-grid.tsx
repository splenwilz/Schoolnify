"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAllStudents } from "@/hooks/use-students";

export function MetricsGrid() {
  const { data } = useAllStudents();
  const students = useMemo(() => data?.students ?? [], [data?.students]);

  const metrics = useMemo(() => {
    if (students.length === 0) {
      return [
        { label: "Fees Paid", value: "—", sub: "no data yet", color: "#10B981" },
        { label: "Fees Pending", value: "—", sub: "no data yet", color: "#F59E0B" },
        { label: "Fees Overdue", value: "—", sub: "no data yet", color: "#EF4444" },
        { label: "Male Students", value: "—", sub: "no data yet", color: "#3B82F6" },
        { label: "Female Students", value: "—", sub: "no data yet", color: "#A855F7" },
        { label: "Avg Age", value: "—", sub: "no data yet", color: "#0891B2" },
      ];
    }
    const feesPaid = students.filter((s) => s.feeStatus === "paid").length;
    const feesPending = students.filter((s) => s.feeStatus === "pending").length;
    const feesOverdue = students.filter((s) => s.feeStatus === "overdue").length;
    const maleCount = students.filter((s) => s.gender === "Male").length;
    const femaleCount = students.filter((s) => s.gender === "Female").length;
    const thisYear = new Date().getFullYear();
    const avgAge = students.reduce((sum, s) => {
      const birthYear = new Date(s.dateOfBirth).getFullYear();
      return sum + (thisYear - birthYear);
    }, 0) / students.length;
    const total = students.length;
    return [
      { label: "Fees Paid", value: feesPaid.toString(), sub: `${((feesPaid / total) * 100).toFixed(0)}% of total`, color: "#10B981" },
      { label: "Fees Pending", value: feesPending.toString(), sub: "Awaiting payment", color: "#F59E0B" },
      { label: "Fees Overdue", value: feesOverdue.toString(), sub: "Requires follow-up", color: "#EF4444" },
      { label: "Male Students", value: maleCount.toString(), sub: `${((maleCount / total) * 100).toFixed(0)}% of total`, color: "#3B82F6" },
      { label: "Female Students", value: femaleCount.toString(), sub: `${((femaleCount / total) * 100).toFixed(0)}% of total`, color: "#A855F7" },
      { label: "Avg Age", value: avgAge.toFixed(1), sub: "Years old", color: "#0891B2" },
    ];
  }, [students]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl bg-[var(--card)] px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-5">Quick Overview</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + idx * 0.05 }}
            className={cn(
              "px-4 py-3",
              idx > 0 && "lg:border-l lg:border-[var(--border)]",
              idx === 0 && "pl-0",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: metric.color }}
              />
              <p className="text-[12px] text-[var(--muted)] font-medium">{metric.label}</p>
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums leading-none">
              {metric.value}
            </p>
            <p className="text-[11px] text-[var(--muted)] mt-1.5">{metric.sub}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
