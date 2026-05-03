"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Student } from "@/types/student";
import { primaryGuardian } from "@/types/student";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";

interface StudentGroupedViewProps {
  students: Student[];
}

// Grade level sort order for Nigerian 6-3-3-4
const GRADE_ORDER = [
  "Nursery 1", "Nursery 2", "Nursery 3",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3",
  "SSS 1", "SSS 2", "SSS 3",
];

function gradeSort(a: string, b: string): number {
  const ai = GRADE_ORDER.indexOf(a);
  const bi = GRADE_ORDER.indexOf(b);
  if (ai === -1 && bi === -1) return a.localeCompare(b);
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
}

export function StudentGroupedView({ students }: StudentGroupedViewProps) {
  // Group by grade level
  const groups = new Map<string, Student[]>();
  for (const s of students) {
    const key = s.gradeLevel;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }

  // Sort groups by grade order
  const sortedGroups = [...groups.entries()].sort(([a], [b]) => gradeSort(a, b));

  return (
    <div className="space-y-3">
      {sortedGroups.map(([grade, gradeStudents]) => (
        <GradeGroup key={grade} grade={grade} students={gradeStudents} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GradeGroup -- collapsible group
// ---------------------------------------------------------------------------

function GradeGroup({ grade, students }: { grade: string; students: Student[] }) {
  const [open, setOpen] = useState(true);

  const feeStats = {
    paid: students.filter((s) => s.feeStatus === "paid").length,
    pending: students.filter((s) => s.feeStatus === "pending").length,
    overdue: students.filter((s) => s.feeStatus === "overdue").length,
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Group header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="w-4 h-4 text-[var(--muted)]" /> : <ChevronRight className="w-4 h-4 text-[var(--muted)]" />}
          <span className="text-[15px] font-semibold text-[var(--foreground)]">{grade}</span>
          <span className="text-[13px] text-[var(--muted)]">{students.length} student{students.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {feeStats.paid > 0 && <span className="px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-medium">{feeStats.paid} paid</span>}
          {feeStats.pending > 0 && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-medium">{feeStats.pending} pending</span>}
          {feeStats.overdue > 0 && <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">{feeStats.overdue} overdue</span>}
        </div>
      </button>

      {/* Student rows */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)]">
              {students.map((student) => {
                const guardian = primaryGuardian(student);
                return (
                  <Link
                    key={student.id}
                    href={`/school-admin/students/${student.id}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)] last:border-0"
                  >
                    <Avatar firstName={student.firstName} lastName={student.lastName} avatar={student.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[var(--foreground)] truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-[12px] text-[var(--muted)] truncate">
                        {student.admissionNumber} {student.section && `\u00b7 ${student.section}`}
                      </p>
                    </div>
                    <span className="text-[12px] text-[var(--muted)] hidden sm:inline">{student.gender}</span>
                    <span className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded hidden sm:inline",
                      student.boardingStatus === "Boarding" ? "bg-[#0891B2]/10 text-[#0891B2]" : "bg-[var(--background-secondary)] text-[var(--muted)]"
                    )}>
                      {student.boardingStatus}
                    </span>
                    <span className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded",
                      student.feeStatus === "paid" ? "bg-[#10B981]/10 text-[#10B981]"
                        : student.feeStatus === "pending" ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-500"
                    )}>
                      {student.feeStatus}
                    </span>
                    <span className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      student.status === "active" ? "bg-[#10B981]" : "bg-[var(--muted)]"
                    )} title={student.status} />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
