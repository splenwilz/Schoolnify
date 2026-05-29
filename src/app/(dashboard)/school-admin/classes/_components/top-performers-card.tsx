"use client";

import { Award } from "lucide-react";
import { classes } from "@/lib/demo-data";
import { classShortCode } from "@/types/class";

const topClasses = classes
  .filter((c) => c.averageAttendance != null)
  .sort((a, b) => (b.averageAttendance ?? 0) - (a.averageAttendance ?? 0))
  .slice(0, 5);

const maxRate = Math.max(1, ...topClasses.map((c) => c.averageAttendance ?? 0));

export function TopPerformersCard() {
  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Top Performers
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {topClasses.map((cls, i) => {
          const rate = cls.averageAttendance ?? 0;
          return (
            <div key={cls.id}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-6 rounded-md bg-[var(--background-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] text-[9px] font-semibold flex-shrink-0 px-1">
                    {classShortCode(cls)}
                  </div>
                  <span className="text-[13px] font-medium text-[var(--foreground)] truncate">
                    {cls.name}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums flex-shrink-0">
                  {rate}%
                </span>
              </div>
              <div className="h-[6px] rounded-full bg-[var(--background-elevated)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{
                    width: `${(rate / maxRate) * 100}%`,
                    opacity: 0.5 + (0.5 * (topClasses.length - i)) / topClasses.length,
                  }}
                />
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-1 truncate">
                {cls.students} students &middot; {cls.teacher}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
