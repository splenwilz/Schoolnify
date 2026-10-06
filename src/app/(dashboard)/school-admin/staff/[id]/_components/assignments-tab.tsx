"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Home, LifeBuoy, Users } from "lucide-react";
import type { Staff, AssignmentRole, StaffAssignment } from "@/types/staff";
import { formatDate } from "@/lib/staff/dates";

const ROLE_LABEL: Record<AssignmentRole, string> = {
  homeroom: "Class teacher",
  subject: "Subject",
  co_teacher: "Co-teacher",
  cover: "Cover",
};

const ROLE_ICON: Record<AssignmentRole, typeof Home> = {
  homeroom: Home,
  subject: GraduationCap,
  co_teacher: Users,
  cover: LifeBuoy,
};

function windowText(a: StaffAssignment): string | null {
  if (a.role === "homeroom") return null;
  if (a.endsOn) return `${formatDate(a.startsOn, "short")} to ${formatDate(a.endsOn, "short")}`;
  return `from ${formatDate(a.startsOn, "short")}`;
}

export function AssignmentsTab({ staff: member, assignments }: { staff: Staff; assignments: StaffAssignment[] }) {

  // Group by class so a teacher's homeroom + subjects in the same class sit together.
  const byClass = useMemo(() => {
    const map = new Map<string, { classId: string; className: string; rows: typeof assignments }>();
    for (const a of assignments) {
      const entry = map.get(a.classId) ?? { classId: a.classId, className: a.className, rows: [] };
      entry.rows.push(a);
      map.set(a.classId, entry);
    }
    return [...map.values()];
  }, [assignments]);

  if (assignments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <GraduationCap className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No class assignments</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-sm">
          {member.isTeacher
            ? "This teacher is not assigned to any class yet. Assignments appear here once they are set as a homeroom or subject teacher."
            : "This staff member is not a teacher, so they have no class assignments."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="px-5 pt-4 pb-3 flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-[var(--muted)]" />
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Assignments</h3>
        <span className="text-[12px] text-[var(--muted)]">{assignments.length}</span>
      </div>
      <div className="border-t border-[var(--border)]">
        {byClass.map((group) => (
          <div
            key={group.classId}
            className="px-5 py-3 border-b border-[var(--border)]/50 last:border-b-0"
          >
            <p className="text-[13px] font-semibold text-[var(--foreground)] mb-1.5">
              {group.className}
            </p>
            <div className="flex flex-col gap-1.5">
              {group.rows.map((a) => {
                const Icon = ROLE_ICON[a.role];
                const window = windowText(a);
                return (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-[var(--foreground)]">
                      {a.subjectId ?? "Pastoral owner of the class"}
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-secondary)] text-[var(--muted)]">
                      {ROLE_LABEL[a.role]}
                    </span>
                    {a.source === "self_contained" && (
                      <span className="text-[11px]">Class teacher teaches all subjects</span>
                    )}
                    {a.periodsPerWeek !== null && <span className="text-[11px]">{a.periodsPerWeek} periods/week</span>}
                    {window && <span className="text-[11px]">{window}</span>}
                    <span className="ml-auto tabular-nums">
                      {a.academicSession} · {a.term}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
