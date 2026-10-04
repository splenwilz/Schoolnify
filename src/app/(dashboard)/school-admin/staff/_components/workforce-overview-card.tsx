"use client";

import { Users } from "lucide-react";
import { staff } from "@/lib/demo-data";
import { Avatar } from "../../students/_components/avatar";

// Reference year for tenure. Constant (not new Date()) to stay SSR-safe and
// deterministic; tracks the active academic session.
const REF_YEAR = 2026;

const total = staff.length;
const teachers = staff.filter((s) => s.isTeacher).length;
const support = total - teachers;
const departments = new Set(staff.map((s) => s.department)).size;
const avgTenure = (
  staff.reduce((sum, s) => sum + (REF_YEAR - new Date(s.hireDate).getFullYear()), 0) / total
).toFixed(1);

const displayStaff = staff.slice(0, 6);

export function WorkforceOverviewCard() {
  return (
    <div className="surface-flat p-6 h-full flex flex-col justify-between min-h-[200px]">
      {/* Top: identity + avatar stack */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--background-elevated)] flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--muted)]" />
            </div>
            <p className="text-[13px] font-medium text-[var(--muted)]">Team overview</p>
          </div>
          <h2 className="text-[22px] font-semibold text-[var(--foreground)] mt-2 tabular-nums">
            {total} members
          </h2>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Across {departments} departments
          </p>
        </div>

        <div className="flex items-center">
          {displayStaff.map((member, i) => (
            <div
              key={member.id}
              className="relative rounded-full border-2 border-[var(--card)]"
              style={{ marginLeft: i > 0 ? "-10px" : "0", zIndex: displayStaff.length - i }}
            >
              <Avatar
                firstName={member.firstName}
                lastName={member.lastName}
                size="sm"
                className="rounded-full"
              />
            </div>
          ))}
          {total > displayStaff.length && (
            <div
              className="relative w-7 h-7 rounded-full bg-[var(--background-elevated)] border-2 border-[var(--card)] flex items-center justify-center"
              style={{ marginLeft: "-10px", zIndex: 0 }}
            >
              <span className="text-[10px] font-semibold text-[var(--muted)]">
                +{total - displayStaff.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: split metrics */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[var(--border)]">
        <div>
          <p className="text-[20px] font-semibold text-[var(--foreground)] tabular-nums leading-tight">
            {teachers}
          </p>
          <p className="text-[11px] text-[var(--muted)] font-medium">Teachers</p>
        </div>
        <div className="w-px h-8 bg-[var(--border)]" />
        <div>
          <p className="text-[20px] font-semibold text-[var(--foreground)] tabular-nums leading-tight">
            {support}
          </p>
          <p className="text-[11px] text-[var(--muted)] font-medium">Support</p>
        </div>
        <div className="w-px h-8 bg-[var(--border)]" />
        <div>
          <p className="text-[20px] font-semibold text-[var(--foreground)] tabular-nums leading-tight">
            {avgTenure}
          </p>
          <p className="text-[11px] text-[var(--muted)] font-medium">Avg tenure (yrs)</p>
        </div>
      </div>
    </div>
  );
}
