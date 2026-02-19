"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  status: "active" | "inactive";
  gpa: number;
  attendanceRate: number;
  feeStatus: "paid" | "pending" | "overdue";
  avatar?: string | null;
}

interface StudentGridProps {
  students: Student[];
}

export function StudentGrid({ students }: StudentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student, index) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
        >
          <Link
            href={`/school-admin/students/${student.id}`}
            className="block p-5 rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar firstName={student.firstName} lastName={student.lastName} avatar={student.avatar} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[#0891B2] transition-colors truncate">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-[11px] text-[var(--muted)] truncate">{student.email}</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md",
                  student.status === "active"
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[var(--background-secondary)] text-[var(--muted)]"
                )}
              >
                <span
                  className={cn(
                    "w-1 h-1 rounded-full",
                    student.status === "active" ? "bg-[#10B981]" : "bg-gray-400"
                  )}
                />
                {student.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-[var(--background-secondary)] text-[var(--foreground)]">
                Grade {student.grade}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md",
                  student.feeStatus === "paid" && "bg-[#10B981]/10 text-[#10B981]",
                  student.feeStatus === "pending" && "bg-[#F59E0B]/10 text-[#F59E0B]",
                  student.feeStatus === "overdue" && "bg-[#EF4444]/10 text-[#EF4444]"
                )}
              >
                {student.feeStatus.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">
                    {student.gpa.toFixed(1)}
                  </p>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1 py-0.5 rounded",
                      student.gpa >= 3.5
                        ? "text-[#10B981] bg-[#10B981]/10"
                        : student.gpa >= 3.0
                          ? "text-[#0891B2] bg-[#0891B2]/10"
                          : "text-[#F59E0B] bg-[#F59E0B]/10"
                    )}
                  >
                    {student.gpa >= 3.5 ? "A" : student.gpa >= 3.0 ? "B" : "C"}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">
                  GPA
                </p>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold text-[var(--foreground)] tabular-nums">
                    {student.attendanceRate}%
                  </p>
                </div>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">
                  Attendance
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
