"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface PerformanceChartProps {
  /** Current cumulative GPA, or null if grades have not been recorded yet. */
  gpa: number | null;
}

/**
 * GPA progression chart placeholder.
 *
 * The grades module is not shipped yet, so we don't have a per-term GPA series.
 * This component renders the current value (when present) and a clear empty
 * state. When grades land, it will accept a series prop and draw the trend.
 */
export function PerformanceChart({ gpa }: PerformanceChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div>
        <p className="text-[13px] text-[var(--muted)] font-medium">GPA Progression</p>
        <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-1">
          {gpa === null ? "—" : gpa.toFixed(2)}
        </p>
        <p className="text-[11px] text-[var(--muted)] mt-0.5">
          {gpa === null
            ? "No grades recorded yet"
            : "Latest cumulative GPA"}
        </p>
      </div>

      <div className="mt-6 py-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <TrendingUp className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[13px] font-medium text-[var(--foreground)]">
          Term-over-term trend will appear here
        </p>
        <p className="text-[12px] text-[var(--muted)] mt-1">
          Available once the grades module is wired
        </p>
      </div>
    </motion.div>
  );
}
