"use client";

import { staff } from "@/lib/demo-data";
import { EMPLOYMENT_TYPE_LABEL, type EmploymentType } from "@/types/staff";

const counts = staff.reduce<Record<string, number>>((acc, s) => {
  acc[s.employmentType] = (acc[s.employmentType] || 0) + 1;
  return acc;
}, {});

const ORDER: EmploymentType[] = ["full_time", "part_time", "contract", "term_time"];
const rows = ORDER.filter((t) => counts[t]).map((type) => ({
  type,
  label: EMPLOYMENT_TYPE_LABEL[type],
  count: counts[type],
  percentage: Math.round((counts[type] / staff.length) * 100),
}));

// Total full-time-equivalent headcount across the workforce.
const fte = (staff.reduce((sum, s) => sum + s.ftePercent, 0) / 100).toFixed(1);

export function EmploymentMixCard() {
  return (
    <div className="surface-flat p-6 h-full">
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
        Employment mix
      </p>

      <div className="flex flex-col gap-3.5">
        {rows.map((row, i) => (
          <div key={row.type}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-[var(--muted)] font-medium">{row.label}</span>
              <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
                {row.count}{" "}
                <span className="text-[var(--muted)] font-normal">({row.percentage}%)</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--background-elevated)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--brand)]"
                style={{
                  width: `${row.percentage}%`,
                  opacity: 1 - (i / Math.max(rows.length - 1, 1)) * 0.5,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
        <span className="text-[12px] text-[var(--muted)] font-medium">Full-time equivalent</span>
        <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
          {fte} FTE
        </span>
      </div>
    </div>
  );
}
