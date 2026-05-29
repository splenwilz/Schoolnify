"use client";

/**
 * Timetable Grid Tab
 * Weekly timetable view with class selector and color-coded cells
 */

import { useState } from "react";

interface TimetableSlot {
  id: string;
  classId: string;
  className: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  time: string;
}

interface TimetableTabProps {
  slots: TimetableSlot[];
  classes: string[];
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = [1, 2, 3, 4, 5, 6];

// Map subjects to department colors for visual coding
const subjectDepartment: Record<string, string> = {
  Mathematics: "Mathematics",
  "Further Mathematics": "Mathematics",
  "English Language": "Languages",
  French: "Languages",
  "Literature in English": "Languages",
  Physics: "Science",
  Chemistry: "Science",
  Biology: "Science",
  "Computer Science": "Science",
  History: "Arts",
  Geography: "Arts",
  "Art & Design": "Arts",
  "Physical Education": "Arts",
  Economics: "Arts",
  "Civic Education": "Arts",
};

const departmentCellColors: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Mathematics: {
    bg: "rgba(8,145,178,0.08)",
    border: "rgba(8,145,178,0.2)",
    text: "#0891B2",
  },
  Languages: {
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
    text: "#A855F7",
  },
  Science: {
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    text: "#10B981",
  },
  Arts: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    text: "#F59E0B",
  },
};

export function TimetableTab({ slots, classes }: TimetableTabProps) {
  const [selectedClass, setSelectedClass] = useState(
    classes[0] || "Grade 10A"
  );

  const classSlots = slots.filter((s) => s.className === selectedClass);

  // Get the time string for a period from any matching slot
  function getPeriodTime(period: number): string {
    const slot = classSlots.find((s) => s.period === period);
    return slot?.time || "";
  }

  // Find the slot for a given day + period
  function getSlot(day: string, period: number): TimetableSlot | undefined {
    return classSlots.find((s) => s.day === day && s.period === period);
  }

  return (
    <div className="space-y-4">
      {/* Class Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Edit Timetable
        </button>
      </div>

      {/* Color Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs">
        {Object.entries(departmentCellColors).map(([dept, colors]) => (
          <div key={dept} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
              }}
            />
            <span className="text-[var(--muted)]">{dept}</span>
          </div>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-3 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider w-[120px] bg-[var(--background-secondary)]">
                  Period
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="text-center px-3 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider bg-[var(--background-secondary)]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const time = getPeriodTime(period);
                return (
                  <tr
                    key={period}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    {/* Period + Time */}
                    <td className="px-3 py-2 bg-[var(--background-secondary)]">
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        Period {period}
                      </div>
                      <div className="text-xs text-[var(--muted)]">{time}</div>
                    </td>

                    {/* Day Cells */}
                    {days.map((day) => {
                      const slot = getSlot(day, period);
                      if (!slot) {
                        return (
                          <td
                            key={day}
                            className="px-2 py-2 text-center"
                          >
                            <div className="text-xs text-[var(--muted)]">-</div>
                          </td>
                        );
                      }

                      const dept =
                        subjectDepartment[slot.subject] || "Arts";
                      const colors = departmentCellColors[dept] || departmentCellColors.Arts;

                      return (
                        <td key={day} className="px-2 py-2">
                          <div
                            className="rounded-lg px-2.5 py-2 text-center"
                            style={{
                              backgroundColor: colors.bg,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <p
                              className="text-xs font-semibold"
                              style={{ color: colors.text }}
                            >
                              {slot.subject}
                            </p>
                            <p className="text-[11px] text-[var(--muted)] mt-0.5">
                              {slot.teacher}
                            </p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break indicator */}
      <div className="text-xs text-[var(--muted)] text-center">
        Break: 09:30 - 09:45 (after Period 2) | Lunch: 01:00 - 02:00 (after Period 6)
      </div>
    </div>
  );
}
