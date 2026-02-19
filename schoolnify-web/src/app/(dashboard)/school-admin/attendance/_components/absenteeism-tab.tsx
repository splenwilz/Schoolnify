"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { chronicAbsentees } from "@/lib/demo-data";

type AbsenteeRecord = (typeof chronicAbsentees)[number];

const statusConfig: Record<
  AbsenteeRecord["status"],
  { label: string; color: string; bgColor: string }
> = {
  at_risk: {
    label: "At Risk",
    color: "#F59E0B",
    bgColor: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
  critical: {
    label: "Critical",
    color: "#EF4444",
    bgColor: "bg-[#EF4444]/10 text-[#EF4444]",
  },
  improving: {
    label: "Improving",
    color: "#10B981",
    bgColor: "bg-[#10B981]/10 text-[#10B981]",
  },
};

export default function AbsenteeismTab() {
  const alertCounts = useMemo(() => {
    const atRisk = chronicAbsentees.filter((r) => r.status === "at_risk").length;
    const critical = chronicAbsentees.filter(
      (r) => r.status === "critical"
    ).length;
    return { atRisk, critical };
  }, []);

  return (
    <div>
      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-4 p-4 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-[#F59E0B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#F59E0B] uppercase tracking-wide">
              At Risk
            </p>
            <p className="text-2xl font-semibold text-[#F59E0B]">
              {alertCounts.atRisk}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Students nearing chronic threshold
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/5">
          <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-[#EF4444]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#EF4444] uppercase tracking-wide">
              Critical
            </p>
            <p className="text-2xl font-semibold text-[#EF4444]">
              {alertCounts.critical}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Students with chronic absenteeism
            </p>
          </div>
        </div>
      </div>

      {/* Absentee Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Days Absent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Total Days
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Absence Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Last Present
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Parent Notified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {chronicAbsentees.map((record) => {
                const config = statusConfig[record.status];
                return (
                  <tr
                    key={record.id}
                    className="hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {record.studentName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--foreground)]">
                        {record.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-semibold text-[#EF4444]">
                        {record.totalAbsent}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[var(--foreground)]">
                        {record.totalDays}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              record.rate >= 30
                                ? "bg-[#EF4444]"
                                : record.rate >= 20
                                ? "bg-[#F59E0B]"
                                : "bg-[#10B981]"
                            )}
                            style={{ width: `${Math.min(record.rate, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-[var(--muted)]">
                          {record.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)]">
                        {record.lastPresent}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                          config.bgColor
                        )}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.parentNotified ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#10B981]/10 text-[#10B981]">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#EF4444]/10 text-[#EF4444]">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {chronicAbsentees.length === 0 && (
          <div className="py-12 text-center">
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
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
              No chronic absentees
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              All students are attending regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
