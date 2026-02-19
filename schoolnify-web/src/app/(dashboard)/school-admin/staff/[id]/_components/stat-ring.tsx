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
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
            opacity="0.4"
          />
          {/* Progress ring */}
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
            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.2 }}
          />
          {/* Glow effect */}
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
            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.2 }}
            opacity="0.2"
            filter="blur(3px)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-bold text-[var(--foreground)] tabular-nums"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5, type: "spring" }}
          >
            {displayValue}
          </motion.span>
        </div>
      </div>
      <p className="text-[11px] text-[var(--muted)] mt-2 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}
