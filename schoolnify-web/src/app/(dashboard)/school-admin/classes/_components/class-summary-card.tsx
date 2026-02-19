"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { classes } from "@/lib/demo-data";

const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
const avgAttendance = (
  classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length
).toFixed(1);
const bestClass = classes.reduce((best, c) =>
  c.attendanceRate > best.attendanceRate ? c : best
);
const topGPA = classes.reduce((best, c) =>
  c.avgGrade > best.avgGrade ? c : best
);

// Normalize classes into scatter positions (attendance vs GPA)
const minAtt = Math.min(...classes.map((c) => c.attendanceRate));
const maxAtt = Math.max(...classes.map((c) => c.attendanceRate));
const minGPA = Math.min(...classes.map((c) => c.avgGrade));
const maxGPA = Math.max(...classes.map((c) => c.avgGrade));

const dots = classes.map((c) => ({
  id: c.id,
  name: c.name.replace("Grade ", ""),
  x: ((c.attendanceRate - minAtt) / (maxAtt - minAtt)) * 100,
  y: 100 - ((c.avgGrade - minGPA) / (maxGPA - minGPA)) * 100,
  size: 4 + (c.students / 35) * 6,
  attendance: c.attendanceRate,
  gpa: c.avgGrade,
}));

export function ClassSummaryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(8,145,178,0.06) 0%, rgba(8,145,178,0.02) 60%, var(--card) 100%)",
      }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <div className="mb-3">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">
            Academic Overview
          </p>
          <p className="text-[12px] text-[var(--muted)] mt-0.5">
            Your classes are performing well this term
          </p>
        </div>

        {/* Scatter visualization */}
        <div className="flex-1 relative min-h-[120px]">
          {/* Axis labels */}
          <span className="absolute -left-0.5 top-0 text-[9px] text-[var(--muted)]">
            GPA
          </span>
          <span className="absolute right-0 bottom-[-14px] text-[9px] text-[var(--muted)]">
            Attendance
          </span>

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {[25, 50, 75].map((pct) => (
              <line
                key={`h-${pct}`}
                x1="0"
                y1={`${pct}%`}
                x2="100%"
                y2={`${pct}%`}
                stroke="var(--border)"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="4 4"
              />
            ))}
            {[25, 50, 75].map((pct) => (
              <line
                key={`v-${pct}`}
                x1={`${pct}%`}
                y1="0"
                x2={`${pct}%`}
                y2="100%"
                stroke="var(--border)"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="4 4"
              />
            ))}
          </svg>

          {/* Dots */}
          {dots.map((dot, i) => (
            <motion.div
              key={dot.id}
              className="absolute rounded-full bg-[#0891B2] flex items-center justify-center"
              style={{
                left: `${5 + dot.x * 0.9}%`,
                top: `${5 + dot.y * 0.9}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                opacity: 0.4 + (dot.attendance / 100) * 0.6,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.04, type: "spring" }}
              title={`${dot.name}: ${dot.attendance}% att, ${dot.gpa} GPA`}
            />
          ))}
        </div>

        {/* Bottom key metrics */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex-1">
            <p className="text-[20px] font-bold text-[#0891B2] tabular-nums leading-tight">
              {bestClass.attendanceRate}%
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Best Attendance ({bestClass.name})
            </p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div className="flex-1">
            <p className="text-[20px] font-bold text-[#0891B2] tabular-nums leading-tight">
              {topGPA.avgGrade.toFixed(2)}
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Top GPA ({topGPA.name})
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
