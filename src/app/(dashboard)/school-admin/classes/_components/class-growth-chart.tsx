"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const classData = {
  "1W": [
    { month: "Mon", value: 12 },
    { month: "Tue", value: 12 },
    { month: "Wed", value: 12 },
    { month: "Thu", value: 12 },
    { month: "Fri", value: 12 },
    { month: "Sat", value: 12 },
    { month: "Sun", value: 12 },
  ],
  "1M": [
    { month: "Wk 1", value: 11 },
    { month: "Wk 2", value: 12 },
    { month: "Wk 3", value: 12 },
    { month: "Wk 4", value: 12 },
  ],
  "3M": [
    { month: "Nov", value: 11 },
    { month: "", value: 11 },
    { month: "Dec", value: 12 },
    { month: "", value: 12 },
    { month: "Jan", value: 12 },
    { month: "Feb", value: 12 },
  ],
  "6M": [
    { month: "Aug", value: 10 },
    { month: "Sep", value: 10 },
    { month: "Oct", value: 11 },
    { month: "Nov", value: 11 },
    { month: "Dec", value: 12 },
    { month: "Jan", value: 12 },
  ],
  "1Y": [
    { month: "Feb", value: 8 },
    { month: "Mar", value: 8 },
    { month: "Apr", value: 9 },
    { month: "May", value: 9 },
    { month: "Jun", value: 9 },
    { month: "Jul", value: 10 },
    { month: "Aug", value: 10 },
    { month: "Sep", value: 10 },
    { month: "Oct", value: 11 },
    { month: "Nov", value: 11 },
    { month: "Dec", value: 12 },
    { month: "Jan", value: 12 },
  ],
};

const periods = ["1W", "1M", "3M", "6M", "1Y"] as const;

function buildPath(data: { value: number }[], width: number, height: number, padding: number) {
  const min = Math.min(...data.map((d) => d.value)) * 0.9;
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

export function ClassGrowthChart() {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("6M");

  const data = classData[activePeriod];
  const width = 500;
  const height = 160;
  const padding = 8;
  const { linePath, areaPath, points } = buildPath(data, width, height, padding);

  const currentValue = data[data.length - 1].value;
  const prevValue = data[0].value;
  const changePercent = prevValue === currentValue ? "0.0" : (((currentValue - prevValue) / prevValue) * 100).toFixed(1);
  const isUp = currentValue >= prevValue;

  return (
    <div className="surface p-6 h-full">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[13px] text-[var(--muted)] font-medium">Class Growth</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {currentValue}
            </p>
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md",
                isUp
                  ? "bg-[var(--success)]/10 text-[var(--success)]"
                  : "bg-[var(--error)]/10 text-[var(--error)]"
              )}
            >
              {isUp ? "+" : ""}
              {changePercent}%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            Total classes and period over period change
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

      <div className="mt-4 -mx-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="classChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#classChartGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3.5"
            fill="var(--brand)"
          />
        </svg>
      </div>

      <div className="flex justify-between px-2 mt-1">
        {data
          .filter((d) => d.month)
          .map((d, i) => (
            <span key={i} className="text-[10px] text-[var(--muted)]">
              {d.month}
            </span>
          ))}
      </div>
    </div>
  );
}
