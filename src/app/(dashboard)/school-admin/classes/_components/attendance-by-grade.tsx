"use client";

import { classes } from "@/lib/demo-data";
import { classBand, compareClasses } from "@/types/class";

// Group attendance by grade band (Nursery / Primary / JSS / SSS, or whatever
// bands the school's grade levels resolve to). Country-agnostic: derived from
// the data, not a hardcoded US grade list. Only classes with a real attendance
// figure contribute.
const bandAttendance = [...classes].sort(compareClasses).reduce<
  Record<string, { total: number; count: number }>
>((acc, cls) => {
  if (cls.averageAttendance == null) return acc;
  const band = classBand(cls.gradeLevel);
  if (!acc[band]) acc[band] = { total: 0, count: 0 };
  acc[band].total += cls.averageAttendance;
  acc[band].count += 1;
  return acc;
}, {});

// Preserve band ordering as it first appears in conventional sort order.
const bandOrder: string[] = [];
for (const cls of [...classes].sort(compareClasses)) {
  const band = classBand(cls.gradeLevel);
  if (!bandOrder.includes(band)) bandOrder.push(band);
}

const bands = bandOrder
  .filter((name) => bandAttendance[name])
  .map((name) => {
    const { total, count } = bandAttendance[name];
    return {
      name,
      rate: Math.round((total / count) * 10) / 10,
      percentage: Math.round(total / count),
    };
  });

// Fade the bar opacity as bands descend, keeping a single brand hue.
function bandOpacity(index: number, len: number): number {
  return 1 - (index / Math.max(len - 1, 1)) * 0.45;
}

export function AttendanceByGrade() {
  return (
    <div className="surface p-6 h-full">
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-5">
        Attendance by level
      </p>

      {bands.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <p className="text-[13px] text-[var(--muted)]">
            No attendance recorded yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {bands.map((band, i) => (
            <div key={band.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[var(--muted)] font-medium">
                  {band.name}
                </span>
                <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
                  {band.rate}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--background-elevated)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: `${band.percentage}%`, opacity: bandOpacity(i, bands.length) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
