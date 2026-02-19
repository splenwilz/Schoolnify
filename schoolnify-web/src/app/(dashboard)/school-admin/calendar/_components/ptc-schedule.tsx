"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ptcSchedules } from "@/lib/demo-data";
import { CalendarDays, Plus } from "lucide-react";

interface PtcSchedule {
  id: string;
  teacherName: string;
  parentName: string;
  studentName: string;
  grade: string;
  date: string;
  time: string;
  duration: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  scheduled: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    label: "Scheduled",
  },
  completed: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-[#6B7280]/10",
    text: "text-[#6B7280]",
    label: "Cancelled",
  },
  no_show: {
    bg: "bg-[#EF4444]/10",
    text: "text-[#EF4444]",
    label: "No Show",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PtcSchedule() {
  const [schedules] = useState<PtcSchedule[]>(
    ptcSchedules as PtcSchedule[]
  );

  const handleScheduleConference = () => {
    alert("Schedule Conference: This feature is coming soon.");
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#0891B2]" />
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Parent-Teacher Conferences
            </h3>
          </div>
          <button
            onClick={handleScheduleConference}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-[#0891B2] hover:bg-[#0E7490] transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule Conference
          </button>
        </div>
        <p className="text-[12px] text-[var(--muted)] mt-1">
          {schedules.length} conference{schedules.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-[var(--border)]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Parent
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-[13px] text-[var(--muted)]">
                    No conferences scheduled.
                  </p>
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => {
                const config = statusConfig[schedule.status];
                return (
                  <tr
                    key={schedule.id}
                    className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">
                        {schedule.teacherName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {schedule.parentName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {schedule.studentName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[var(--muted)]">
                        {schedule.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(schedule.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {schedule.time}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[var(--muted)]">
                        {schedule.duration}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                          config.bg,
                          config.text
                        )}
                      >
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
