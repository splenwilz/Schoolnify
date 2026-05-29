"use client";

import { motion } from "framer-motion";

interface StatRingProps {
  label: string;
  value: number;
  maxValue: number;
  displayValue: string;
  color: string;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StatRing({ label, value, maxValue, displayValue, color }: StatRingProps) {
  const progress = Math.min(value / maxValue, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
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
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[var(--foreground)] tabular-nums">
            {displayValue}
          </span>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );
}
