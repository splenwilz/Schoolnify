"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const staffData = {
  "6M": [
    { month: "Aug", value: 9 },
    { month: "Sep", value: 10 },
    { month: "Oct", value: 10 },
    { month: "Nov", value: 11 },
    { month: "Dec", value: 11 },
    { month: "Jan", value: 12 },
  ],
  "1Y": [
    { month: "Feb", value: 8 },
    { month: "Mar", value: 8 },
    { month: "Apr", value: 9 },
    { month: "May", value: 9 },
    { month: "Jun", value: 9 },
    { month: "Jul", value: 9 },
    { month: "Aug", value: 9 },
    { month: "Sep", value: 10 },
    { month: "Oct", value: 10 },
    { month: "Nov", value: 11 },
    { month: "Dec", value: 11 },
    { month: "Jan", value: 12 },
  ],
  ALL: [
    { month: "2023", value: 5 },
    { month: "", value: 6 },
    { month: "", value: 7 },
    { month: "2024", value: 8 },
    { month: "", value: 9 },
    { month: "", value: 9 },
    { month: "2025", value: 10 },
    { month: "", value: 11 },
    { month: "", value: 11 },
    { month: "2026", value: 12 },
  ],
};

const periods = ["6M", "1Y", "ALL"] as const;

function buildPath(data: { value: number }[], width: number, height: number, padding: number) {
  const min = Math.min(...data.map((d) => d.value)) * 0.9;
  const max = Math.max(...data.map((d) => d.value)) * 1.05;
  const range = max - min;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (d.value - min) / range) * (height - padding * 2),
  }));

  // Smooth curve using cubic bezier
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Area fill path (close at bottom)
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath =
    path +
    ` L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

  return { linePath: path, areaPath, points };
}

export function StaffGrowthChart() {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("1Y");

  const data = staffData[activePeriod];
  const width = 500;
  const height = 160;
  const padding = 8;
  const { linePath, areaPath, points } = buildPath(data, width, height, padding);

  const currentValue = data[data.length - 1].value;
  const prevValue = data[0].value;
  const changePercent = (((currentValue - prevValue) / prevValue) * 100).toFixed(1);
  const isUp = currentValue >= prevValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[13px] text-[var(--muted)] font-medium">Staff Growth</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {currentValue}
            </p>
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md",
                isUp ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
              )}
            >
              {isUp ? "+" : ""}
              {changePercent}%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            Total headcount and period over period change
          </p>
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

      {/* Chart */}
      <div className="mt-4 -mx-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="staffChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0891B2" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0891B2" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Gradient area fill */}
          <motion.path
            d={areaPath}
            fill="url(#staffChartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#0891B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {/* End dot */}
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4"
            fill="#0891B2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="8"
            fill="#0891B2"
            opacity="0.2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          />
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between px-2 mt-1">
        {data
          .filter((d) => d.month)
          .map((d, i) => (
            <span key={i} className="text-[10px] text-[var(--muted)]">
              {d.month}
            </span>
          ))}
      </div>
    </motion.div>
  );
}
