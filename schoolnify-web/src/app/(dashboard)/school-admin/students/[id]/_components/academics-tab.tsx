"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Academics tab.
 *
 * The grades module isn't shipped yet, so the data source is empty by default.
 * When the module lands, replace `gradeHistory` below with a real hook call,
 * e.g. `const { data: gradeHistory = [] } = useStudentGrades(studentId)`.
 * The layout below is already wired and matches the design that appeared in
 * earlier prototypes — leaving it intact avoids re-doing the UI work later.
 */

interface GradeEntry {
  subject: string;
  grade: string; // letter grade, e.g. "A", "B+", "C-"
  score: number; // 0-100
  teacher: string;
}

const gradeColorMap: Record<string, string> = {
  A: "bg-[#10B981]/10 text-[#10B981]",
  B: "bg-[#0891B2]/10 text-[#0891B2]",
  C: "bg-[#F59E0B]/10 text-[#F59E0B]",
  D: "bg-[#EF4444]/10 text-[#EF4444]",
};

export function AcademicsTab() {
  // TODO: replace with real grades data once the grades module ships.
  const gradeHistory: GradeEntry[] = [];

  if (gradeHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-10 flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <GraduationCap className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No grades recorded yet</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-md">
          Subject scores and term grades will appear here once the grades module is wired.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gradeHistory.map((item, idx) => (
          <motion.div
            key={item.subject}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{item.subject}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{item.teacher}</p>
              </div>
              <span
                className={cn(
                  "px-2.5 py-1 text-sm font-bold rounded-lg",
                  gradeColorMap[item.grade[0]] || gradeColorMap["C"]
                )}
              >
                {item.grade}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    item.score >= 90
                      ? "bg-[#10B981]"
                      : item.score >= 80
                        ? "bg-[#0891B2]"
                        : "bg-[#F59E0B]"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 + 0.2 }}
                />
              </div>
              <span className="text-xs font-mono text-[var(--muted)] w-8 text-right">
                {item.score}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
