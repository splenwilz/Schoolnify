"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAllStudents } from "@/hooks/use-students";

const periods = ["6M", "1Y", "ALL"] as const;
type Period = (typeof periods)[number];

interface SeriesPoint {
  label: string;
  value: number;
}

function buildSeriesFromStudents(
  enrollmentDates: string[],
  period: Period,
): SeriesPoint[] {
  if (enrollmentDates.length === 0) return [];

  const now = new Date();
  const dates = enrollmentDates
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()) && d <= now)
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return [];

  let monthsBack: number;
  if (period === "6M") monthsBack = 6;
  else if (period === "1Y") monthsBack = 12;
  else {
    const earliest = dates[0];
    monthsBack = Math.max(
      6,
      (now.getFullYear() - earliest.getFullYear()) * 12 + (now.getMonth() - earliest.getMonth()) + 1
    );
  }

  // Build month buckets: cumulative count up to end of each month
  const points: SeriesPoint[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);
    const cumulative = dates.filter((d) => d <= endOfMonth).length;
    const monthLabel = cursor.toLocaleString("en", { month: "short" });
    const yearLabel = cursor.getFullYear().toString();
    const label = period === "ALL"
      ? (cursor.getMonth() === 0 ? yearLabel : "")
      : monthLabel;
    points.push({ label, value: cumulative });
  }
  return points;
}

function buildPath(data: SeriesPoint[], width: number, height: number, padding: number) {
  if (data.length < 2) {
    return { linePath: "", areaPath: "", points: [] as { x: number; y: number }[] };
  }
  const min = Math.min(...data.map((d) => d.value)) * 0.95;
  const max = Math.max(...data.map((d) => d.value)) * 1.02 || 1;
  const range = Math.max(max - min, 1);

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

export function EnrollmentChart() {
  const [activePeriod, setActivePeriod] = useState<Period>("1Y");
  // Unique per instance so multiple charts on the same page don't share / collide.
  const gradientId = `enrollment-gradient-${useId()}`;
  const { data } = useAllStudents();
  const students = useMemo(() => data?.students ?? [], [data?.students]);

  const series = useMemo(
    () => buildSeriesFromStudents(students.map((s) => s.enrollmentDate), activePeriod),
    [students, activePeriod]
  );

  const width = 500;
  const height = 160;
  const padding = 8;
  const { linePath, areaPath, points } = buildPath(series, width, height, padding);

  const hasData = series.length >= 2 && series[series.length - 1].value > 0;
  const currentValue = hasData ? series[series.length - 1].value : 0;
  const prevValue = hasData ? series[0].value : 0;
  const changePercent = hasData && prevValue > 0
    ? (((currentValue - prevValue) / prevValue) * 100).toFixed(1)
    : null;
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
          <p className="text-[13px] text-[var(--muted)] font-medium">Enrollment Trend</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {hasData ? currentValue.toLocaleString() : "—"}
            </p>
            {changePercent !== null && (
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md",
                  isUp ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"
                )}
              >
                {isUp ? "+" : ""}
                {changePercent}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-0.5">
            {hasData ? "Cumulative enrolled students over time" : "No enrollment data yet"}
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
      {hasData ? (
        <>
          <div className="mt-4 -mx-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891B2" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0891B2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={areaPath}
                fill={`url(#${gradientId})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
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
              {points.length > 0 && (
                <>
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
                </>
              )}
            </svg>
          </div>
          <div className="flex justify-between px-2 mt-1">
            {series
              .filter((d) => d.label)
              .map((d, i) => (
                <span key={i} className="text-[10px] text-[var(--muted)]">
                  {d.label}
                </span>
              ))}
          </div>
        </>
      ) : (
        <div className="mt-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-[var(--muted)]" />
          </div>
          <p className="text-[13px] font-medium text-[var(--foreground)]">
            Enrollment trend will appear here
          </p>
          <p className="text-[12px] text-[var(--muted)] mt-1">
            Add students to see growth over time
          </p>
        </div>
      )}
    </motion.div>
  );
}
