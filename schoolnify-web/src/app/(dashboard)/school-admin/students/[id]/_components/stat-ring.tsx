"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatRingProps {
  label: string;
  /** Pass null when the metric is not yet computed (e.g., grades module not shipped). */
  value: number | null;
  maxValue: number;
  displayValue: string;
  color: string;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StatRing({ label, value, maxValue, displayValue, color }: StatRingProps) {
  const hasValue = value !== null;
  const progress = hasValue ? Math.min(value / maxValue, 1) : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          {/* Progress ring -- only render when we actually have a value */}
          {hasValue && (
            <motion.circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          )}
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[var(--foreground)] tabular-nums">
            {displayValue}
          </span>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">{label}</p>
      {!hasValue && (
        <p className="text-[10px] text-[var(--muted)] mt-0.5">no data yet</p>
      )}
    </div>
  );
}

interface FeeRingProps {
  feeStatus: "paid" | "pending" | "overdue" | "unknown";
}

export function FeeStatusRing({ feeStatus }: FeeRingProps) {
  const config = {
    paid: { color: "#10B981", bg: "bg-[#10B981]/10", label: "Paid" },
    pending: { color: "#F59E0B", bg: "bg-[#F59E0B]/10", label: "Pending" },
    overdue: { color: "#EF4444", bg: "bg-[#EF4444]/10", label: "Overdue" },
    unknown: { color: "var(--muted)", bg: "bg-[var(--background-secondary)]", label: "—" },
  } as const;

  const c = config[feeStatus];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className={cn("w-24 h-24 rounded-full flex items-center justify-center", c.bg)}
      >
        <span className="text-lg font-bold" style={{ color: c.color }}>
          {c.label}
        </span>
      </motion.div>
      <p className="text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">Fee Status</p>
      {feeStatus === "unknown" && (
        <p className="text-[10px] text-[var(--muted)] mt-0.5">no data yet</p>
      )}
    </div>
  );
}
