"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { monthlyRevenue } from "@/lib/demo-data";

type Period = keyof typeof monthlyRevenue;
const periods: Period[] = ["6M", "1Y", "ALL"];

function buildCurvePath(
  data: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
) {
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (width - padX * 2),
    y: padY + (1 - (v - min) / range) * (height - padY * 2),
  }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cx1 = p.x + (c.x - p.x) * 0.4;
    const cx2 = c.x - (c.x - p.x) * 0.4;
    line += ` C ${cx1} ${p.y}, ${cx2} ${c.y}, ${c.x} ${c.y}`;
  }

  const area =
    line + ` L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;
  return { line, area, pts };
}

const formatCompact = (n: number) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
};

export function RevenueTrendChart() {
  const [period, setPeriod] = useState<Period>("6M");
  const data = monthlyRevenue[period];

  const W = 500;
  const H = 180;
  const padX = 10;
  const padY = 8;

  const collectedValues = data.map((d) => d.collected);
  const totalValues = data.map((d) => d.collected + d.outstanding);

  const collected = buildCurvePath(collectedValues, W, H, padX, padY);
  const total = buildCurvePath(totalValues, W, H, padX, padY);

  // Build the "gap" area between total and collected
  const gapArea = (() => {
    const topLine = total.line;
    // Reverse the collected points for the bottom edge
    const collectedPts = collected.pts;
    let bottomReversed = `L ${collectedPts[collectedPts.length - 1].x} ${collectedPts[collectedPts.length - 1].y}`;
    for (let i = collectedPts.length - 2; i >= 0; i--) {
      const c = collectedPts[i];
      const n = collectedPts[i + 1];
      const cx1 = n.x - (n.x - c.x) * 0.4;
      const cx2 = c.x + (n.x - c.x) * 0.4;
      bottomReversed += ` C ${cx1} ${n.y}, ${cx2} ${c.y}, ${c.x} ${c.y}`;
    }
    return topLine + bottomReversed + " Z";
  })();

  const latestCollected = data[data.length - 1].collected;
  const prevCollected = data.length > 1 ? data[data.length - 2].collected : latestCollected;
  const changeRate = (((latestCollected - prevCollected) / prevCollected) * 100).toFixed(1);
  const isUp = latestCollected >= prevCollected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Revenue Trend
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[24px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {formatCompact(latestCollected)}
            </p>
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md",
                isUp
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "bg-[#EF4444]/10 text-[#EF4444]"
              )}
            >
              {isUp ? "+" : ""}
              {changeRate}%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            vs previous period
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--background-secondary)]">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all whitespace-nowrap",
                  period === p
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Collected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              Outstanding
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-4 -mx-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient
              id="outstandingGapGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Collected area fill */}
          <motion.path
            key={`ca-${period}`}
            d={collected.area}
            fill="url(#collectedGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Outstanding gap fill (area between total and collected) */}
          <motion.path
            key={`ga-${period}`}
            d={gapArea}
            fill="url(#outstandingGapGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />

          {/* Total line (top edge) */}
          <motion.path
            key={`tl-${period}`}
            d={total.line}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="5 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          />

          {/* Collected line */}
          <motion.path
            key={`cl-${period}`}
            d={collected.line}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Collected dots */}
          {collected.pts.map((pt, i) => (
            <motion.circle
              key={`cd-${period}-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#10B981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.04, type: "spring" }}
            />
          ))}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between px-2 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[10px] text-[var(--muted)]">{d.month}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
