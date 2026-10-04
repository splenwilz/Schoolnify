"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { staff, classes, staffAssignments, schoolInfo } from "@/lib/demo-data";
import { AreaChart } from "./area-chart";

const total = staff.length;
const onLeave = staff.filter((s) => s.status === "on_leave").length;
const onDuty = total - onLeave;
const yesterdayOnDuty = onDuty - 1;
const teachers = staff.filter((s) => s.isTeacher).length;
const support = staff.filter((s) => s.staffCategory === "support").length;
const departments = new Set(staff.map((s) => s.department)).size;

const staffIds = new Set(staff.map((s) => s.id));
const unassignedTeachers = staff.filter(
  (s) => s.isTeacher && staffAssignments(s.id).length === 0
).length;
const classesNoTeacher = classes.filter(
  (c) => c.status !== "archived" && (!c.classTeacherId || !staffIds.has(c.classTeacherId))
).length;

// Staff on duty through the day (clock-ins ramping up in the morning, then
// holding). Fabricated for the demo, like the dashboard's hourly attendance.
const onDutyByHour = [
  { time: "8:00 AM", value: Math.round(onDuty * 0.45) },
  { time: "9:00 AM", value: Math.round(onDuty * 0.82) },
  { time: "10:00 AM", value: Math.round(onDuty * 0.96) },
  { time: "11:00 AM", value: onDuty },
  { time: "12:00 PM", value: onDuty },
  { time: "1:00 PM", value: onDuty - 1 },
  { time: "2:00 PM", value: onDuty },
  { time: "3:00 PM", value: onDuty },
];

const quickStats = [
  { label: "Total staff", value: total },
  { label: "Teachers", value: teachers },
  { label: "Support staff", value: support },
  { label: "Departments", value: departments },
  { label: "On leave", value: onLeave },
];

export function StaffToday() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Today</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main chart area */}
        <div className="flex-1 space-y-4">
          {/* Metric tiles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-[var(--muted)]">Staff on duty</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
              </div>
              <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">
                {onDuty}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">of {total} · as of 2:00 PM</div>
            </div>

            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-[var(--muted)]">Yesterday</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
              </div>
              <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">
                {yesterdayOnDuty}
              </div>
            </div>
          </div>

          {/* Main area chart */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <AreaChart data={onDutyByHour} height={140} />
          </div>

          {/* Coverage summary tiles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Unassigned teachers</span>
                <Link href="/school-admin/staff" className="text-sm text-[var(--brand)] hover:underline">View</Link>
              </div>
              <div className="text-xl font-semibold text-[var(--foreground)] mt-1 tabular-nums">
                {unassignedTeachers}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Classes without a teacher</span>
                <Link href="/school-admin/classes" className="text-sm text-[var(--brand)] hover:underline">View</Link>
              </div>
              <div className="text-xl font-semibold text-[var(--foreground)] mt-1 tabular-nums">
                {classesNoTeacher}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">Quick stats</h3>
            <div className="space-y-4">
              {quickStats.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">{s.label}</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">{schoolInfo.name}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Term</span>
                <span className="text-[var(--foreground)]">{schoolInfo.currentTerm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Academic year</span>
                <span className="text-[var(--foreground)]">{schoolInfo.academicYear}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
