"use client";

import { staff } from "@/lib/demo-data";

// Reference year for tenure. Constant (not new Date()) to stay SSR-safe and
// deterministic; tracks the active academic session.
const REF_YEAR = 2026;

const academic = staff.filter((s) => s.staffCategory === "academic").length;
const support = staff.length - academic;
const male = staff.filter((s) => s.gender === "male").length;
const female = staff.filter((s) => s.gender === "female").length;
const avgTenure = (
  staff.reduce((sum, s) => sum + (REF_YEAR - new Date(s.hireDate).getFullYear()), 0) /
  staff.length
).toFixed(1);

function Split({ label, a, b, aLabel, bLabel }: { label: string; a: number; b: number; aLabel: string; bLabel: string }) {
  const total = a + b || 1;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] text-[var(--muted)] font-medium">{label}</span>
        <span className="text-[11px] text-[var(--muted)] tabular-nums">
          {aLabel} {a} · {bLabel} {b}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-[var(--background-elevated)]">
        <div className="h-full bg-[var(--brand)]" style={{ width: `${(a / total) * 100}%` }} />
        <div
          className="h-full bg-[var(--brand)]"
          style={{ width: `${(b / total) * 100}%`, opacity: 0.45 }}
        />
      </div>
    </div>
  );
}

export function WorkforceSnapshotCard() {
  return (
    <div className="surface p-6">
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
        Workforce snapshot
      </p>
      <div className="flex flex-col gap-4">
        <Split label="Academic vs support" a={academic} b={support} aLabel="Acad" bLabel="Supp" />
        <Split label="Gender balance" a={male} b={female} aLabel="M" bLabel="F" />
        <div className="flex items-center justify-between pt-1">
          <span className="text-[12px] text-[var(--muted)] font-medium">Average tenure</span>
          <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
            {avgTenure} yrs
          </span>
        </div>
      </div>
    </div>
  );
}
