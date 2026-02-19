"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PerformanceChartProps {
  gpa: number;
}

const periods = ["1T", "2T", "1Y", "ALL"] as const;

// Mock GPA progression data per period
const gpaData: Record<string, { label: string; value: number }[]> = {
  "1T": [
    { label: "Week 1", value: 3.4 },
    { label: "Week 4", value: 3.5 },
    { label: "Week 8", value: 3.6 },
    { label: "Week 12", value: 3.7 },
    { label: "Week 16", value: 3.8 },
  ],
  "2T": [
    { label: "T1 Start", value: 3.2 },
    { label: "T1 Mid", value: 3.4 },
    { label: "T1 End", value: 3.5 },
    { label: "T2 Start", value: 3.5 },
    { label: "T2 Mid", value: 3.6 },
    { label: "T2 End", value: 3.8 },
  ],
  "1Y": [
    { label: "Sep", value: 3.0 },
    { label: "Oct", value: 3.1 },
    { label: "Nov", value: 3.3 },
    { label: "Dec", value: 3.4 },
    { label: "Jan", value: 3.8 },
  ],
  ALL: [
    { label: "2023", value: 2.8 },
    { label: "", value: 3.0 },
    { label: "2024", value: 3.2 },
    { label: "", value: 3.4 },
    { label: "2025", value: 3.5 },
    { label: "", value: 3.6 },
    { label: "2026", value: 3.8 },
  ],
};

function buildSmoothPath(data: { value: number }[], width: number, height: number, padding: number) {
  const min = Math.min(...data.map((d) => d.value)) * 0.92;
  const max = Math.max(...data.map((d) => d.value)) * 1.05;
  const range = max - min;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (d.value - min) / range) * (height - padding * 2),
  }));

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = path + ` L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

  return { linePath: path, areaPath, points };
}

export function PerformanceChart({ gpa }: PerformanceChartProps) {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("1Y");

  const data = gpaData[activePeriod];
  const width = 480;
  const height = 140;
  const padding = 8;
  const { linePath, areaPath, points } = buildSmoothPath(data, width, height, padding);

  const startVal = data[0].value;
  const endVal = data[data.length - 1].value;
  const changeVal = (endVal - startVal).toFixed(1);
  const isUp = endVal >= startVal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[13px] text-[var(--muted)] font-medium">GPA Progression</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {gpa.toFixed(2)}
            </p>
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md",
                isUp ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
              )}
            >
              {isUp ? "+" : ""}
              {changeVal}
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">Cumulative GPA trend over time</p>
        </div>
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--background-secondary)]">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                activePeriod === p
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 -mx-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={areaPath}
            fill="url(#gpaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4"
            fill="#3B82F6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="8"
            fill="#3B82F6"
            opacity="0.2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          />
        </svg>
      </div>

      <div className="flex justify-between px-2 mt-1">
        {data
          .filter((d) => d.label)
          .map((d, i) => (
            <span key={i} className="text-[10px] text-[var(--muted)]">
              {d.label}
            </span>
          ))}
      </div>
    </motion.div>
  );
}
