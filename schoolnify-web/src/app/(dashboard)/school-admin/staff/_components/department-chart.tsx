"use client";

import { motion } from "framer-motion";
import { staff } from "@/lib/demo-data";

const COLORS = [
  "#0891B2",
  "#0891B2CC",
  "#0891B2AA",
  "#0891B288",
  "#0891B266",
  "#0891B244",
];

// Count staff per department
const deptCounts = staff.reduce<Record<string, number>>((acc, s) => {
  acc[s.department] = (acc[s.department] || 0) + 1;
  return acc;
}, {});

// Sort by count descending, group small ones into "Other"
const sorted = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
const MAX_SLICES = 6;
const segments =
  sorted.length <= MAX_SLICES
    ? sorted.map(([name, count], i) => ({ name, count, color: COLORS[i % COLORS.length] }))
    : [
        ...sorted.slice(0, MAX_SLICES - 1).map(([name, count], i) => ({
          name,
          count,
          color: COLORS[i % COLORS.length],
        })),
        {
          name: "Other",
          count: sorted.slice(MAX_SLICES - 1).reduce((sum, [, c]) => sum + c, 0),
          color: COLORS[(MAX_SLICES - 1) % COLORS.length],
        },
      ];

const total = staff.length;
const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DepartmentChart() {
  let cumulativeOffset = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full flex flex-col"
    >
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
        Department Distribution
      </p>

      <div className="flex items-center gap-6 flex-1">
        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke="var(--border)"
              strokeWidth="14"
              opacity="0.3"
            />
            {/* Segments */}
            {segments.map((seg, i) => {
              const segLength = (seg.count / total) * CIRCUMFERENCE;
              const offset = CIRCUMFERENCE - cumulativeOffset;
              cumulativeOffset += segLength;

              return (
                <motion.circle
                  key={seg.name}
                  cx="70"
                  cy="70"
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeLinecap="butt"
                  strokeDasharray={`${segLength} ${CIRCUMFERENCE - segLength}`}
                  strokeDashoffset={offset}
                  transform="rotate(-90 70 70)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                />
              );
            })}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5, type: "spring" }}
            >
              {total}
            </motion.span>
            <span className="text-[10px] text-[var(--muted)] font-medium mt-1">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.35 + i * 0.06 }}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[12px] text-[var(--muted)] truncate">
                  {seg.name}
                </span>
              </div>
              <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums flex-shrink-0">
                {seg.count}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
