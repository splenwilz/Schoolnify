"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, Mail, ChevronRight, Phone, Calendar, Briefcase, BookOpen } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Staff, EmploymentStatus } from "@/types/staff";
import { CONTRACT_TYPE_LABEL, EMPLOYER_LABEL, EMPLOYMENT_STATUS_LABEL, staffFullName } from "@/types/staff";
import { formatDate } from "@/lib/staff/dates";

interface ProfileHeaderProps {
  staff: Staff;
  classCount: number;
  awayToday: boolean;
}

const STATUS_STYLE: Record<EmploymentStatus, { dot: string; pill: string }> = {
  active: { dot: "bg-[var(--success)]", pill: "bg-[var(--success)]/10 text-[var(--success)]" },
  onboarding: { dot: "bg-[var(--brand)]", pill: "bg-[var(--brand)]/10 text-[var(--brand)]" },
  suspended: { dot: "bg-[var(--warning)]", pill: "bg-[var(--warning)]/10 text-[var(--warning)]" },
  inactive: { dot: "bg-[var(--muted)]", pill: "bg-[var(--background-secondary)] text-[var(--muted)]" },
};

// One accent for every department; the department name itself carries the meaning.
const DEPT_COLOR = "#0891B2";

export function ProfileHeader({ staff: member, classCount, awayToday }: ProfileHeaderProps) {
  const deptColor = DEPT_COLOR;
  const status = STATUS_STYLE[member.employmentStatus];
  const name = staffFullName(member);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/school-admin/staff" className="hover:text-[var(--foreground)] transition-colors">
          Staff
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--foreground)]">{name}</span>
      </div>

      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-8"
      >
        {/* Gradient stripe - uses department color */}
        <div
          className="absolute inset-x-0 top-0 h-28"
          style={{
            background: `linear-gradient(135deg, ${deptColor}15 0%, ${deptColor}08 50%, transparent 100%)`,
          }}
        />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-x-0 top-0 h-28 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative p-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            {/* Avatar with status ring */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <Avatar
                firstName={member.firstName}
                lastName={member.lastName}
                size="lg"
                className="rounded-2xl w-20 h-20 text-2xl shadow-lg"
              />
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-[var(--card)]",
                  awayToday ? "bg-[var(--warning)]" : status.dot
                )}
                aria-hidden="true"
              />
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-[var(--foreground)]">{name}</h1>
                <span className={cn("inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full", status.pill)}>
                  {EMPLOYMENT_STATUS_LABEL[member.employmentStatus]}
                </span>
                {member.contractLapsed && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--error)]/10 text-[var(--error)]">
                    Contract ended
                  </span>
                )}
                {awayToday && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--warning)]/10 text-[var(--warning)]">
                    Away today
                  </span>
                )}
              </div>

              {/* Role & department */}
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="px-2 py-0.5 text-[11px] font-semibold rounded-md"
                  style={{ backgroundColor: `${deptColor}15`, color: deptColor }}
                >
                  {member.designation}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: deptColor }}
                  />
                  {member.department}
                </span>
              </div>

              {/* Contact row */}
              <div className="flex items-center gap-4 mt-3 text-[12px] text-[var(--muted)] flex-wrap">
                {member.email ? (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    {member.email}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    No work email
                  </span>
                )}
                {member.phone ? (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    {member.phone}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    No phone
                  </span>
                )}
              </div>

              {/* Stat pills */}
              <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                {member.isTeacher && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                    <BookOpen className="w-3.5 h-3.5 text-[#0891B2]" />
                    {classCount} {classCount === 1 ? "class" : "classes"}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                  <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
                  {CONTRACT_TYPE_LABEL[member.contractType]}
                  {member.ftePercent < 100 ? ` · ${member.ftePercent}%` : ""}
                  {member.isTermTimeOnly ? " · term time" : ""}
                </span>
                {member.employer !== "school" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                    Paid by {EMPLOYER_LABEL[member.employer]}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-[#0891B2]" />
                  Joined {formatDate(member.hireDate, "monthYear")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/school-admin/staff/${member.id}/edit`}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
              >
                <Edit3 className="w-4 h-4" aria-hidden="true" />
                Edit profile
              </Link>
              {(member.email || member.phone) && (
                <a
                  href={member.email ? `mailto:${member.email}` : `sms:${member.phone}`}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/20 transition-all"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Message
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
