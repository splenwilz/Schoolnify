"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Home, Users } from "lucide-react";
import type { Staff, AssignmentRole } from "@/types/staff";
import { staffAssignments } from "@/lib/demo-data";

const ROLE_LABEL: Record<AssignmentRole, string> = {
  homeroom: "Homeroom",
  subject: "Subject",
  co_teacher: "Co-teacher",
};

export function AssignmentsTab({ staff: member }: { staff: Staff }) {
  const assignments = useMemo(() => staffAssignments(member.id), [member.id]);

  // Group by class so a teacher's homeroom + subjects in the same class sit together.
  const byClass = useMemo(() => {
    const map = new Map<string, { className: string; rows: typeof assignments }>();
    for (const a of assignments) {
      const entry = map.get(a.classId) ?? { className: a.className, rows: [] };
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
            key={group.className}
            className="px-5 py-3 border-b border-[var(--border)]/50 last:border-b-0"
          >
            <p className="text-[13px] font-semibold text-[var(--foreground)] mb-1.5">
              {group.className}
            </p>
            <div className="flex flex-col gap-1.5">
              {group.rows.map((a, i) => {
                const Icon = a.role === "homeroom" ? Home : a.role === "co_teacher" ? Users : GraduationCap;
                return (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[var(--foreground)]">
                      {a.subjectId ?? "Homeroom"}
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-secondary)] text-[var(--muted)]">
                      {ROLE_LABEL[a.role]}
                    </span>
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
