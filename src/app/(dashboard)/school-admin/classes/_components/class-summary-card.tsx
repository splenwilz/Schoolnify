"use client";

import { classes } from "@/lib/demo-data";
import { classShortCode } from "@/types/class";

// Only classes with real metrics count. Draft/empty classes (attendance 0,
// GPA 0) aren't ranked.
const plotted = classes.filter(
  (c) => c.averageAttendance != null && c.averageGrade != null
);

const bestClass = plotted.reduce((best, c) =>
  c.attendanceRate > best.attendanceRate ? c : best
);
const topGPA = plotted.reduce((best, c) =>
  c.avgGrade > best.avgGrade ? c : best
);

// Composite rank: normalize attendance and GPA across the cohort and sum, so a
// class that's weak on both floats to the top of the "needs attention" list.
const attVals = plotted.map((c) => c.attendanceRate);
const gpaVals = plotted.map((c) => c.avgGrade);
const attMin = Math.min(...attVals);
const attMax = Math.max(...attVals);
const gpaMin = Math.min(...gpaVals);
const gpaMax = Math.max(...gpaVals);
function unit(v: number, min: number, max: number): number {
  return max === min ? 0.5 : (v - min) / (max - min);
}

const watchList = [...plotted]
  .map((c) => ({
    c,
    score: unit(c.attendanceRate, attMin, attMax) + unit(c.avgGrade, gpaMin, gpaMax),
  }))
  .sort((a, b) => a.score - b.score)
  .slice(0, 4)
  .map(({ c }) => c);

export function ClassSummaryCard() {
  return (
    <div className="surface h-full overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <div className="mb-4">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">
            Academic Overview
          </p>
          <p className="text-[12px] text-[var(--muted)] mt-0.5">
            Classes that need a closer look this term
          </p>
        </div>

        {/* Needs-attention ranking */}
        <div className="flex-1 flex flex-col gap-1.5">
          {watchList.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 py-1.5 rounded-lg"
            >
              <span className="inline-flex items-center justify-center min-w-[34px] h-6 px-1.5 rounded-md bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-secondary)] text-[10px] font-semibold flex-shrink-0">
                {classShortCode(c)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                  {c.name}
                </p>
                <p className="text-[10px] text-[var(--muted)]">
                  {c.attendanceRate}% attendance
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums leading-tight">
                  {c.avgGrade.toFixed(2)}
                </p>
                <p className="text-[9px] text-[var(--muted)] font-medium">GPA</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom key metrics */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex-1">
            <p className="text-[20px] font-semibold text-[var(--foreground)] tabular-nums leading-tight">
              {bestClass.attendanceRate}%
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Best Attendance ({bestClass.name})
            </p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div className="flex-1">
            <p className="text-[20px] font-semibold text-[var(--foreground)] tabular-nums leading-tight">
              {topGPA.avgGrade.toFixed(2)}
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Top GPA ({topGPA.name})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
