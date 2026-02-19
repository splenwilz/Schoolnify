"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { students } from "@/lib/demo-data";
import { Avatar } from "../../../students/_components/avatar";

const enrolledStudents = students.slice(0, 8);

export function StudentsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="px-6 pt-5 pb-4">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
          Enrolled Students
        </h3>
        <p className="text-[12px] text-[var(--muted)] mt-0.5">
          {enrolledStudents.length} students
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-[var(--border)]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                GPA
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className="group border-b border-[var(--border)]/50 last:border-b-0 hover:bg-[var(--background-secondary)]/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/school-admin/students/${student.id}`}
                    className="flex items-center gap-3 group/link"
                  >
                    <Avatar
                      firstName={student.firstName}
                      lastName={student.lastName}
                      avatar={student.avatar}
                      size="sm"
                    />
                    <span className="text-[13px] font-semibold text-[var(--foreground)] group-hover/link:text-[#0891B2] transition-colors">
                      {student.firstName} {student.lastName}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[13px] font-semibold tabular-nums text-[var(--foreground)]">
                    {student.gpa.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <div className="w-12 h-[5px] rounded-full bg-[var(--border)]/60 overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          student.attendanceRate >= 95
                            ? "bg-[#10B981]"
                            : student.attendanceRate >= 90
                              ? "bg-[#F59E0B]"
                              : "bg-[#EF4444]"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${student.attendanceRate}%` }}
                        transition={{ duration: 0.5, delay: index * 0.03 }}
                      />
                    </div>
                    <span className="text-[13px] tabular-nums text-[var(--muted)] w-11 text-right">
                      {student.attendanceRate}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full",
                      student.status === "active"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "bg-[var(--background-secondary)] text-[var(--muted)]"
                    )}
                  >
                    {student.status === "active" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
                    )}
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button className="p-1.5 rounded-lg text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--background-secondary)] transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
