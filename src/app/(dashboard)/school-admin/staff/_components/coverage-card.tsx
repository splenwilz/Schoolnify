"use client";

import Link from "next/link";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import { staff, classes, staffAssignments } from "@/lib/demo-data";
import { staffFullName } from "@/types/staff";

const staffIds = new Set(staff.map((s) => s.id));

// Teachers eligible to teach but with no class assignment.
const unassignedTeachers = staff.filter(
  (s) => s.isTeacher && staffAssignments(s.id).length === 0
);

// Active/draft classes whose homeroom teacher is missing or invalid.
const classesNeedingTeacher = classes.filter(
  (c) => c.status !== "archived" && (!c.classTeacherId || !staffIds.has(c.classTeacherId))
);

export function CoverageCard() {
  const allClear = unassignedTeachers.length === 0 && classesNeedingTeacher.length === 0;

  return (
    <div className="surface-flat p-5">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Teaching coverage
        </p>
      </div>

      {allClear ? (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <CheckCircle2 className="w-6 h-6 text-[var(--success)] mb-2" />
          <p className="text-[13px] text-[var(--muted)]">
            Every class has a teacher and every teacher is assigned.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {classesNeedingTeacher.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                Classes without a teacher
              </p>
              <div className="flex flex-col gap-1.5">
                {classesNeedingTeacher.map((c) => (
                  <Link
                    key={c.id}
                    href={`/school-admin/classes/${c.id}`}
                    className="flex items-center justify-between gap-2 text-[13px] text-[var(--foreground)] hover:text-[var(--brand)] transition-colors"
                  >
                    <span className="truncate">{c.name}</span>
                    {c.status === "draft" && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-secondary)] text-[var(--muted)] flex-shrink-0">
                        Draft
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {unassignedTeachers.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                Teachers without a class
              </p>
              <div className="flex flex-col gap-1.5">
                {unassignedTeachers.map((s) => (
                  <Link
                    key={s.id}
                    href={`/school-admin/staff/${s.id}`}
                    className="text-[13px] text-[var(--foreground)] hover:text-[var(--brand)] transition-colors truncate"
                  >
                    {staffFullName(s)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
