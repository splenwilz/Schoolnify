"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { staff } from "@/lib/demo-data";

// Cumulative headcount by hire year, derived from real hire dates. Parsing a
// fixed ISO string is deterministic and SSR-safe.
const series = (() => {
  const perYear: Record<number, number> = {};
  for (const s of staff) {
    const y = new Date(s.hireDate).getFullYear();
    perYear[y] = (perYear[y] || 0) + 1;
  }
  const years = Object.keys(perYear).map(Number).sort((a, b) => a - b);
  const first = years[0];
  const last = years[years.length - 1];
  const out: { year: number; value: number }[] = [];
  let cumulative = 0;
  for (let y = first; y <= last; y++) {
    cumulative += perYear[y] || 0;
    out.push({ year: y, value: cumulative });
  }
  return out;
})();

const periods = ["5Y", "ALL"] as const;

function windowFor(period: (typeof periods)[number]) {
  if (period === "ALL") return series;
  return series.slice(Math.max(series.length - 5, 0));
}

function buildPath(data: { value: number }[], width: number, height: number, padding: number) {
  const min = Math.min(...data.map((d) => d.value)) * 0.9;
  const max = Math.max(...data.map((d) => d.value)) * 1.05;
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2),
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

  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = path + ` L ${last.x} ${height} L ${first.x} ${height} Z`;
  return { linePath: path, areaPath, points };
}

export function HeadcountGrowthChart() {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("ALL");

  const data = windowFor(activePeriod);
  const width = 500;
  const height = 160;
  const padding = 8;
  const { linePath, areaPath, points } = buildPath(data, width, height, padding);

  const currentValue = data[data.length - 1].value;
  const startValue = data[0].value;
  const added = currentValue - startValue;

  return (
    <div className="surface-flat p-6 h-full">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[13px] text-[var(--muted)] font-medium">Headcount growth</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {currentValue}
            </p>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-[var(--success)]/10 text-[var(--success)]">
              +{added} hired
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            Cumulative staff over {data[0].year}&ndash;{data[data.length - 1].year}
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
            <linearGradient id="headcountGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#headcountGradient)" />
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
        {data.map((d) => (
          <span key={d.year} className="text-[10px] text-[var(--muted)] tabular-nums">
            {d.year}
          </span>
        ))}
      </div>
    </div>
  );
}
