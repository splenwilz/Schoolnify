"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Clock, BookOpen, Wallet, Users } from "lucide-react";
import type { Class } from "@/types/class";
import { classRoster, classSubjects } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { SetupChecklist } from "./setup-checklist";

interface OverviewTabProps {
  classData: Class;
}

/**
 * Overview digest. Honest summary built from real data we have (roster, fee
 * status, subjects, class metadata). No fabricated rank / pass-rate / avg-score
 * -- those come from the grades + attendance modules once wired.
 */
export function OverviewTab({ classData }: OverviewTabProps) {
  const roster = useMemo(() => classRoster(classData.id), [classData.id]);
  const subjectCount = useMemo(
    () => classSubjects.filter((cs) => cs.classId === classData.id).length,
    [classData.id]
  );

  const fees = useMemo(() => {
    const f = { paid: 0, pending: 0, overdue: 0, unknown: 0 };
    for (const s of roster) {
      if (s.feeStatus === "paid" || s.feeStatus === "pending" || s.feeStatus === "overdue") f[s.feeStatus] += 1;
      else f.unknown += 1;
    }
    return f;
  }, [roster]);

  const gender = useMemo(() => {
    let male = 0;
    let female = 0;
    for (const s of roster) {
      if (s.gender === "Female") female += 1;
      else male += 1;
    }
    return { male, female };
  }, [roster]);

  const infoItems = [
    { icon: User, label: "Class teacher", value: classData.teacher },
    { icon: MapPin, label: "Room", value: classData.room },
    { icon: Clock, label: "Schedule", value: classData.schedule },
    { icon: BookOpen, label: "Subjects", value: String(subjectCount) },
    { icon: Users, label: "Session / Term", value: `${classData.academicSession} · ${classData.currentTerm}` },
  ];

  return (
    <div>
      <SetupChecklist
        hasTeacher={!!classData.classTeacherId}
        hasSubjects={subjectCount > 0}
        hasStudents={roster.length > 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Class Information */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Class Information</h3>
        <div className="space-y-4">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--muted)]" />
                  </div>
                  <span className="text-[13px] text-[var(--muted)]">{item.label}</span>
                </div>
                <span className="text-[13px] font-medium text-[var(--foreground)] text-right">{item.value}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center">
                <Users className="w-4 h-4 text-[var(--muted)]" />
              </div>
              <span className="text-[13px] text-[var(--muted)]">Gender split</span>
            </div>
            <span className="text-[13px] font-medium text-[var(--foreground)]">
              {gender.male} M · {gender.female} F
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fee snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-[var(--muted)]" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Fees</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Paid", value: fees.paid, color: "#10B981" },
            { label: "Pending", value: fees.pending, color: "#F59E0B" },
            { label: "Overdue", value: fees.overdue, color: "#EF4444" },
            { label: "Students", value: roster.length, color: "#0891B2" },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-xl bg-[var(--background-secondary)]">
              <p className="text-[11px] text-[var(--muted)] uppercase tracking-wider">{m.label}</p>
              <p className="text-lg font-bold tabular-nums mt-1" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>
        {(fees.pending + fees.overdue) > 0 && (
          <p className={cn("text-[12px] mt-3", fees.overdue > 0 ? "text-[#EF4444]" : "text-[#F59E0B]")}>
            {fees.pending + fees.overdue} {fees.pending + fees.overdue === 1 ? "student has" : "students have"} outstanding fees.
          </p>
        )}
      </motion.div>

      {/* Academics placeholder (honest -- grades module not wired) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="lg:col-span-2 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Academic summary</h3>
        <p className="text-[13px] text-[var(--muted)]">
          Average score, pass rate, and class ranking will appear here once the grades module records results. Use the Gradebook tab to start entering scores.
        </p>
      </motion.div>
      </div>
    </div>
  );
}
