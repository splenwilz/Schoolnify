"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { periodAttendance } from "@/lib/demo-data";

type PeriodRecord = (typeof periodAttendance)[number];
type Period = PeriodRecord["periods"][number];

export default function PeriodAttendanceTab() {
  const [selectedClassId, setSelectedClassId] = useState<string>("all");

  const filteredData = useMemo(() => {
    if (selectedClassId === "all") return periodAttendance;
    return periodAttendance.filter((r) => r.classId === selectedClassId);
  }, [selectedClassId]);

  // Gather unique class options
  const classOptions = useMemo(() => {
    return periodAttendance.map((r) => ({
      id: r.classId,
      name: r.className,
    }));
  }, []);

  // Determine max periods across all visible classes
  const maxPeriods = useMemo(() => {
    let max = 0;
    for (const record of filteredData) {
      if (record.periods.length > max) max = record.periods.length;
    }
    return max;
  }, [filteredData]);

  const getCellBg = (type: "present" | "absent" | "late", value: number) => {
    if (value === 0) return "";
    switch (type) {
      case "present":
        return "bg-[#10B981]/10 text-[#10B981]";
      case "absent":
        return "bg-[#EF4444]/10 text-[#EF4444]";
      case "late":
        return "bg-[#F59E0B]/10 text-[#F59E0B]";
    }
  };

  return (
    <div>
      {/* Class Selector */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-[var(--foreground)]">
          Class
        </label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
        >
          <option value="all">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Period Attendance Grid */}
      <div className="space-y-4">
        {filteredData.map((record) => (
          <div
            key={record.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
          >
            {/* Class header */}
            <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[var(--foreground)]">
                  {record.className}
                </h4>
                <span className="text-xs text-[var(--muted)]">
                  {record.date}
                </span>
              </div>
            </div>

            {/* Period grid table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider w-24">
                      Metric
                    </th>
                    {record.periods.map((p: Period) => (
                      <th
                        key={p.period}
                        className="px-3 py-2.5 text-center text-xs font-medium text-[var(--muted)] uppercase tracking-wider min-w-[100px]"
                      >
                        <div>Period {p.period}</div>
                        <div className="font-normal normal-case text-[10px] mt-0.5 truncate max-w-[100px]">
                          {p.subject}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {/* Teacher Row */}
                  <tr>
                    <td className="px-4 py-2 text-xs font-medium text-[var(--muted)]">
                      Teacher
                    </td>
                    {record.periods.map((p: Period) => (
                      <td
                        key={p.period}
                        className="px-3 py-2 text-center text-xs text-[var(--foreground)]"
                      >
                        {p.teacher}
                      </td>
                    ))}
                  </tr>
                  {/* Present Row */}
                  <tr>
                    <td className="px-4 py-2 text-xs font-medium text-[var(--muted)]">
                      Present
                    </td>
                    {record.periods.map((p: Period) => (
                      <td key={p.period} className="px-3 py-2 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-6 text-xs font-semibold rounded",
                            getCellBg("present", p.present)
                          )}
                        >
                          {p.present}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Absent Row */}
                  <tr>
                    <td className="px-4 py-2 text-xs font-medium text-[var(--muted)]">
                      Absent
                    </td>
                    {record.periods.map((p: Period) => (
                      <td key={p.period} className="px-3 py-2 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-6 text-xs font-semibold rounded",
                            p.absent > 0
                              ? getCellBg("absent", p.absent)
                              : "text-[var(--muted)]"
                          )}
                        >
                          {p.absent}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Late Row */}
                  <tr>
                    <td className="px-4 py-2 text-xs font-medium text-[var(--muted)]">
                      Late
                    </td>
                    {record.periods.map((p: Period) => (
                      <td key={p.period} className="px-3 py-2 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-6 text-xs font-semibold rounded",
                            p.late > 0
                              ? getCellBg("late", p.late)
                              : "text-[var(--muted)]"
                          )}
                        >
                          {p.late}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="py-12 text-center rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <svg
            className="w-12 h-12 mx-auto text-[var(--muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
            No period data found
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Select a different class to view period-wise attendance.
          </p>
        </div>
      )}
    </div>
  );
}
