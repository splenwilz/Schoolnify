"use client";

import { motion } from "framer-motion";
import { monthlyFeeBreakdown } from "@/lib/demo-data";

const TYPE_COLORS = {
  tuition: "#0891B2",
  activity: "#A855F7",
  supplies: "#F59E0B",
};

const formatCompact = (n: number) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
};

export function FeeTypeDistribution() {
  const data = monthlyFeeBreakdown;
  const maxTotal = Math.max(...data.map((d) => d.tuition + d.activity + d.supplies));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full"
    >
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-5">
        Fee Collection by Type
      </p>

      <div className="flex flex-col gap-4">
        {data.map((row, i) => {
          const total = row.tuition + row.activity + row.supplies;
          const tuitionPct = (row.tuition / maxTotal) * 100;
          const activityPct = (row.activity / maxTotal) * 100;
          const suppliesPct = (row.supplies / maxTotal) * 100;

          return (
            <div key={row.month}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[var(--muted)] font-medium">
                  {row.month}
                </span>
                <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
                  {formatCompact(total)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-[var(--background-secondary)] overflow-hidden flex">
                <motion.div
                  className="h-full"
                  style={{
                    backgroundColor: TYPE_COLORS.tuition,
                    borderRadius: "9999px 0 0 9999px",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${tuitionPct}%` }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.08,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: TYPE_COLORS.activity }}
                  initial={{ width: 0 }}
                  animate={{ width: `${activityPct}%` }}
                  transition={{
                    duration: 0.6,
                    delay: 0.35 + i * 0.08,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="h-full"
                  style={{
                    backgroundColor: TYPE_COLORS.supplies,
                    borderRadius: "0 9999px 9999px 0",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${suppliesPct}%` }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + i * 0.08,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[var(--border)]">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
