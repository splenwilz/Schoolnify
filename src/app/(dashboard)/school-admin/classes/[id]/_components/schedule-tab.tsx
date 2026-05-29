"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Clock, BookOpen } from "lucide-react";
import type { Class } from "@/types/class";
import { classSubjects, staff } from "@/lib/demo-data";

/**
 * Schedule tab.
 *
 * A full weekly timetable (period x day grid) will render from the school's
 * schedule template once that's wired. Until then we show the real, useful
 * thing we DO have: the subjects linked to this class and who teaches each.
 */
export function ScheduleTab({ classData }: { classData: Class }) {
  const subjects = useMemo(
    () => classSubjects.filter((cs) => cs.classId === classData.id),
    [classData.id]
  );

  const teacherNames = (ids: string[]): string => {
    if (ids.length === 0) return classData.teacher; // falls back to the class (homeroom) teacher
    const names = ids
      .map((id) => {
        const s = staff.find((m) => m.id === id);
        return s ? `${s.firstName} ${s.lastName}` : null;
      })
      .filter(Boolean) as string[];
    return names.length > 0 ? names.join(", ") : classData.teacher;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Weekly pattern summary */}
      <div className="flex items-center gap-3 rounded-2xl bg-[var(--card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-9 h-9 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
          <Clock className="w-4 h-4 text-[#0891B2]" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-[var(--foreground)]">{classData.schedule}</p>
          <p className="text-[12px] text-[var(--muted)]">Room {classData.room} · {classData.academicSession}</p>
        </div>
      </div>

      {/* Subjects taught */}
      <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--muted)]" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Subjects</h3>
          <span className="text-[12px] text-[var(--muted)]">{subjects.length}</span>
        </div>
        {subjects.length === 0 ? (
          <p className="px-5 pb-5 text-[13px] text-[var(--muted)]">No subjects linked to this class yet.</p>
        ) : (
          <div className="border-t border-[var(--border)]">
            {subjects.map((cs) => (
              <div
                key={cs.subjectId}
                className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]/50 last:border-b-0"
              >
                <span className="text-[13px] font-medium text-[var(--foreground)] flex items-center gap-2">
                  {cs.subjectId}
                  {!cs.isCore && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-elevated)] text-[var(--muted)] border border-[var(--border)]">
                      Elective
                    </span>
                  )}
                </span>
                <span className="text-[12px] text-[var(--muted)]">{teacherNames(cs.teacherIds)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] px-1">
        <CalendarClock className="w-3.5 h-3.5" />
        The full weekly timetable will render here from the school schedule template once it&apos;s wired.
      </div>
    </motion.div>
  );
}
