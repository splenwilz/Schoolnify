"use client";

import { staff } from "@/lib/demo-data";

// Monochrome brand ramp: a single hue stepping down in opacity per slice.
const COLORS = [
  "var(--brand)",
  "color-mix(in srgb, var(--brand) 80%, transparent)",
  "color-mix(in srgb, var(--brand) 64%, transparent)",
  "color-mix(in srgb, var(--brand) 50%, transparent)",
  "color-mix(in srgb, var(--brand) 38%, transparent)",
  "color-mix(in srgb, var(--brand) 28%, transparent)",
];

// Count staff per department
const deptCounts = staff.reduce<Record<string, number>>((acc, s) => {
  acc[s.department] = (acc[s.department] || 0) + 1;
  return acc;
}, {});

// Sort by count descending, group small ones into "Other"
const sorted = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
const MAX_SLICES = 8;
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

// Precompute each arc's length and dash offset once at module scope so the
// render stays pure (no accumulator mutation during render).
let cumulativeOffset = 0;
const arcs = segments.map((seg) => {
  const segLength = (seg.count / total) * CIRCUMFERENCE;
  const offset = CIRCUMFERENCE - cumulativeOffset;
  cumulativeOffset += segLength;
  return { ...seg, segLength, offset };
});

export function DepartmentChart() {
  return (
    <div className="surface-flat p-6">
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
        Department Distribution
      </p>

      <div className="flex items-center gap-6">
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
            {arcs.map((seg) => (
              <circle
                key={seg.name}
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeLinecap="butt"
                strokeDasharray={`${seg.segLength} ${CIRCUMFERENCE - seg.segLength}`}
                strokeDashoffset={seg.offset}
                transform="rotate(-90 70 70)"
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-semibold text-[var(--foreground)] tabular-nums leading-none">
              {total}
            </span>
            <span className="text-[10px] text-[var(--muted)] font-medium mt-1">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {segments.map((seg) => (
            <div
              key={seg.name}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
