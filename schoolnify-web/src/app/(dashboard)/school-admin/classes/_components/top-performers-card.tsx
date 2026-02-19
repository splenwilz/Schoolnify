"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { classes } from "@/lib/demo-data";

const topClasses = [...classes]
  .sort((a, b) => b.attendanceRate - a.attendanceRate)
  .slice(0, 5);

const maxRate = Math.max(...topClasses.map((c) => c.attendanceRate));

export function TopPerformersCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Top Performers
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {topClasses.map((cls, i) => {
          const gradeLabel = cls.name.replace("Grade ", "");
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.45 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0891B2] to-[#22D3EE] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                    {gradeLabel}
                  </div>
                  <span className="text-[13px] font-medium text-[var(--foreground)]">
                    {cls.name}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-[#0891B2] tabular-nums">
                  {cls.attendanceRate}%
                </span>
              </div>
              <div className="h-[6px] rounded-full bg-[var(--background-secondary)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#0891B2]"
                  style={{ opacity: 0.5 + (0.5 * (topClasses.length - i)) / topClasses.length }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(cls.attendanceRate / maxRate) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-1">
                {cls.students} students &middot; {cls.teacher}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
