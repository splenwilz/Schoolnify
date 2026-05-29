"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Assignments tab.
 *
 * The assignments module isn't wired yet, so the source defaults to empty and
 * the honest empty state renders. The full table design is preserved below the
 * guard -- when the backend ships, replace the default with
 * `useClassAssignments(classId)` and it lights up. (Same pattern as the
 * student-profile tabs.)
 */

interface Assignment {
  id: number | string;
  title: string;
  dueDate: string;
  status: "upcoming" | "active" | "graded";
  submissions: number;
  total: number;
}

const statusStyles: Record<string, string> = {
  upcoming: "bg-[#F59E0B]/10 text-[#F59E0B]",
  active: "bg-[#0891B2]/10 text-[#0891B2]",
  graded: "bg-[#10B981]/10 text-[#10B981]",
};

export function AssignmentsTab() {
  // TODO: replace with `useClassAssignments(classId)` once the module ships.
  const recentAssignments: Assignment[] = [];

  if (recentAssignments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <BookOpen className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No assignments yet</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-md">
          Assignments and submission tracking will appear here once the assignments module is wired.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create assignment
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="px-6 pt-5 pb-4">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
          Assignments
        </h3>
        <p className="text-[12px] text-[var(--muted)] mt-0.5">
          {recentAssignments.length} assignments
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-[var(--border)]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Submissions
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recentAssignments.map((assignment, index) => {
              const progress = assignment.total > 0 ? (assignment.submissions / assignment.total) * 100 : 0;

              return (
                <motion.tr
                  key={assignment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="group border-b border-[var(--border)]/50 last:border-b-0 hover:bg-[var(--background-secondary)]/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-semibold text-[var(--foreground)]">
                      {assignment.title}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">
                      {assignment.dueDate}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full capitalize",
                        statusStyles[assignment.status]
                      )}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-16 h-[5px] rounded-full bg-[var(--border)]/60 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[#0891B2]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, delay: index * 0.03 }}
                        />
                      </div>
                      <span className="text-[13px] tabular-nums text-[var(--muted)]">
                        {assignment.submissions}/{assignment.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-[12px] font-medium text-[#0891B2] hover:text-[#0E7490] transition-colors">
                      View
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
