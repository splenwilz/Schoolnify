"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarCheck, Plus, MoreHorizontal, Users, BarChart3, Wallet } from "lucide-react";
import type { Class } from "@/types/class";
import { CLASS_STATUS_LABEL } from "@/types/class";
import { classEnrollments, students } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { ClassSwitcher } from "./class-switcher";

interface ClassHeaderProps {
  classData: Class;
}

const STATUS_PILL: Record<Class["status"], string> = {
  active: "bg-[#10B981]/10 text-[#10B981]",
  draft: "bg-amber-500/10 text-amber-600",
  archived: "bg-[var(--background-secondary)] text-[var(--muted)]",
};

export function ClassHeader({ classData }: ClassHeaderProps) {
  // Roster derived from real enrollment, not a hardcoded slice.
  const enrolledIds = new Set(
    classEnrollments
      .filter((e) => e.classId === classData.id && e.status === "active")
      .map((e) => e.studentId)
  );
  const enrolled = students.filter((s) => enrolledIds.has(s.id));
  const studentCount = enrolled.length;
  const owing = enrolled.filter((s) => s.feeStatus === "pending" || s.feeStatus === "overdue").length;

  const gradeBadge = classData.arm
    ? `${classData.gradeLevel.replace(/[^0-9A-Za-z]/g, "").slice(-3)}${classData.arm}`
    : classData.gradeLevel;

  const metrics = [
    {
      icon: Users,
      label: "Students",
      value: String(studentCount),
      sub: classData.capacity ? `of ${classData.capacity} capacity` : "enrolled",
      color: "#0891B2",
    },
    {
      icon: CalendarCheck,
      label: "Attendance",
      value: classData.averageAttendance === null ? "—" : `${classData.averageAttendance}%`,
      sub: classData.averageAttendance === null ? "no data yet" : "term to date",
      color: "#10B981",
    },
    {
      icon: BarChart3,
      label: "Avg Score",
      value: classData.averageGrade === null ? "—" : classData.averageGrade.toFixed(1),
      sub: classData.averageGrade === null ? "no data yet" : "across subjects",
      color: "#8B5CF6",
    },
    {
      icon: Wallet,
      label: "Outstanding Fees",
      value: String(owing),
      sub: owing === 1 ? "student owing" : "students owing",
      color: "#F59E0B",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Link
        href="/school-admin/classes"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Classes
      </Link>

      {/* Identity + actions -- sticky so it stays visible while scrolling tabs */}
      <div className="sticky top-0 z-20 -mx-1 px-1 py-2 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0891B2] to-[#22D3EE] flex items-center justify-center text-white text-base font-bold shadow-lg shadow-[#0891B2]/25">
              {gradeBadge}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <ClassSwitcher currentId={classData.id} currentName={classData.name} />
                <span className={cn("inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full", STATUS_PILL[classData.status])}>
                  {classData.status === "active" && (
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                    </span>
                  )}
                  {CLASS_STATUS_LABEL[classData.status]}
                </span>
                {classData.stream && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-[#0891B2]/10 text-[#0891B2]">
                    {classData.stream}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[var(--muted)] mt-1">
                {classData.teacher} · Room {classData.room} · {classData.academicSession} · {classData.currentTerm} Term
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark Attendance</span>
              <span className="sm:hidden">Attendance</span>
            </button>
            <button
              type="button"
              aria-label="Add assignment"
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Assignment</span>
            </button>
            <button
              type="button"
              aria-label="More class actions"
              className="p-2 rounded-xl text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
              className="rounded-2xl bg-[var(--card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${m.color}14` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                </div>
                <p className="text-[12px] text-[var(--muted)] font-medium">{m.label}</p>
              </div>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight">{m.value}</p>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">{m.sub}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
