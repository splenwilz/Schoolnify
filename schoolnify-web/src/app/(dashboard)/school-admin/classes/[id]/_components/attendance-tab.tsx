"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, AlertTriangle } from "lucide-react";

const classAttendance = [
  { date: "Jan 6", present: 26, absent: 2, late: 0 },
  { date: "Jan 4", present: 25, absent: 1, late: 2 },
  { date: "Jan 3", present: 27, absent: 1, late: 0 },
  { date: "Jan 2", present: 24, absent: 3, late: 1 },
  { date: "Dec 20", present: 28, absent: 0, late: 0 },
];

const quickActions = [
  { icon: CheckCircle, label: "Mark Today's Attendance", color: "#10B981" },
  { icon: FileText, label: "Attendance Report", color: "#0891B2" },
  { icon: AlertTriangle, label: "View Absentees", color: "#F59E0B" },
];

export function AttendanceTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
          Recent Class Sessions
        </h3>
        <div className="space-y-2.5">
          {classAttendance.map((session, idx) => {
            const total = session.present + session.absent;
            const rate = Math.round((session.present / total) * 100);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold text-[var(--foreground)] w-16 tabular-nums">
                    {session.date}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      {session.present} present
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
                      <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                      {session.absent} absent
                    </span>
                    {session.late > 0 && (
                      <span className="flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        {session.late} late
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-[#10B981] tabular-nums">
                  {rate}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--background-secondary)] transition-colors text-left"
              >
                <Icon className="w-4 h-4" style={{ color: action.color }} />
                <span className="text-[13px] text-[var(--foreground)]">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
