"use client";

import { motion } from "framer-motion";
import { classes } from "@/lib/demo-data";

function getGradeNumber(name: string): string {
  return name.match(/\d+/)?.[0] || "0";
}

const gradeAttendance = classes.reduce<Record<string, { total: number; count: number }>>(
  (acc, cls) => {
    const grade = `Grade ${getGradeNumber(cls.name)}`;
    if (!acc[grade]) acc[grade] = { total: 0, count: 0 };
    acc[grade].total += cls.attendanceRate;
    acc[grade].count += 1;
    return acc;
  },
  {}
);

const grades = Object.entries(gradeAttendance)
  .sort(([a], [b]) => {
    const na = parseInt(a.match(/\d+/)?.[0] || "0");
    const nb = parseInt(b.match(/\d+/)?.[0] || "0");
    return na - nb;
  })
  .map(([name, { total, count }]) => ({
    name,
    rate: Math.round((total / count) * 10) / 10,
    percentage: Math.round(total / count),
  }));

const GRADE_COLORS: Record<string, string> = {
  "Grade 5": "#0891B2",
  "Grade 6": "#0891B2CC",
  "Grade 7": "#0891B2AA",
  "Grade 8": "#0891B2AA",
  "Grade 9": "#0891B288",
  "Grade 10": "#0891B288",
  "Grade 11": "#0891B266",
  "Grade 12": "#0891B2",
};

export function AttendanceByGrade() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full"
    >
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-5">
        Attendance by Grade
      </p>

      <div className="flex flex-col gap-3.5">
        {grades.map((grade, i) => (
          <div key={grade.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-[var(--muted)] font-medium">
                {grade.name}
              </span>
              <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
                {grade.rate}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: GRADE_COLORS[grade.name] || "#0891B2" }}
                initial={{ width: 0 }}
                animate={{ width: `${grade.percentage}%` }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.08,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
