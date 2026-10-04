"use client";

import { CheckCircle2, TriangleAlert } from "lucide-react";
import { staff, classes, staffAssignments } from "@/lib/demo-data";
import { Sparkline } from "./sparkline";

const REF_YEAR = 2026;

const academic = staff.filter((s) => s.staffCategory === "academic").length;
const support = staff.length - academic;
const onLeave = staff.filter((s) => s.status === "on_leave").length;

const staffIds = new Set(staff.map((s) => s.id));
const unassignedTeachers = staff.filter(
  (s) => s.isTeacher && staffAssignments(s.id).length === 0
).length;
// Active or draft classes whose homeroom teacher is missing or invalid.
const classesNoTeacher = classes.filter(
  (c) => c.status !== "archived" && (!c.classTeacherId || !staffIds.has(c.classTeacherId))
).length;

// Cumulative headcount by hire year, for the Total-staff trend sparkline.
const headcountSeries = (() => {
  const perYear: Record<number, number> = {};
  for (const s of staff) {
    const y = new Date(s.hireDate).getFullYear();
    perYear[y] = (perYear[y] || 0) + 1;
  }
  const years = Object.keys(perYear).map(Number).sort((a, b) => a - b);
  const out: number[] = [];
  let cumulative = 0;
  for (let y = years[0]; y <= REF_YEAR; y++) {
    cumulative += perYear[y] || 0;
    out.push(cumulative);
  }
  return out;
})();

// Headcount a year ago vs now, derived from the same series.
const priorHeadcount = headcountSeries[headcountSeries.length - 2] ?? staff.length;
const hiredThisYear = staff.length - priorHeadcount;

export function StaffStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total staff — trend card with sparkline + comparison delta */}
      <div className="surface-flat p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Total staff</span>
          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
        </div>
        <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">
          {staff.length}
        </div>
        <div className="flex items-center gap-1.5 text-xs mt-1">
          <span className="text-[var(--success)] font-medium">
            {hiredThisYear >= 0 ? "+" : ""}
            {hiredThisYear}
          </span>
          <span className="text-[var(--muted)]">vs {priorHeadcount} last year</span>
        </div>
        <div className="mt-3">
          <Sparkline data={headcountSeries.slice(-8)} height={40} />
        </div>
        <p className="text-[11px] text-[var(--muted)] mt-2">
          {academic} teaching · {support} support
        </p>
      </div>

      {/* On leave — count, no trend data */}
      <div className="surface-flat p-4 flex flex-col">
        <span className="text-sm font-medium text-[var(--foreground)] mb-2">On leave</span>
        <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">{onLeave}</div>
        <p className="text-[11px] text-[var(--muted)] mt-auto pt-2">currently away</p>
      </div>

      {/* Operational alert: unassigned teachers */}
      <AlertCard
        label="Unassigned teachers"
        value={unassignedTeachers}
        sub={unassignedTeachers === 0 ? "all teachers assigned" : "eligible, no class"}
      />

      {/* Operational alert: classes without a teacher */}
      <AlertCard
        label="Classes without a teacher"
        value={classesNoTeacher}
        sub="need a homeroom teacher"
      />
    </div>
  );
}

function AlertCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  const warn = value > 0;
  return (
    <div className="surface-flat p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        {warn && <TriangleAlert className="w-4 h-4 text-[var(--warning)]" />}
      </div>
      <div
        className={
          warn
            ? "text-2xl font-semibold text-[var(--warning)] tabular-nums"
            : "text-2xl font-semibold text-[var(--foreground)] tabular-nums"
        }
      >
        {value}
      </div>
      <p className="text-[11px] text-[var(--muted)] mt-auto pt-2">{sub}</p>
    </div>
  );
}
