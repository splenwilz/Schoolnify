"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit3, Mail, ChevronRight, FileText, UserCog, ArrowRightLeft } from "lucide-react";
import { useSchoolConfig } from "@/lib/school-config-context";
import { Avatar } from "../../_components/avatar";
import { StatusChangeDialog } from "../../_components/status-change-dialog";
import { ClassChangeDialog } from "../../_components/class-change-dialog";
import type { Student } from "@/types/student";

interface ProfileHeaderProps {
  student: Student;
}

const STATUS_BADGE: Record<Student["status"], { label: string; bg: string; text: string; pulse?: boolean }> = {
  active: { label: "Active", bg: "bg-[#10B981]/10", text: "text-[#10B981]", pulse: true },
  inactive: { label: "Inactive", bg: "bg-[var(--background-secondary)]", text: "text-[var(--muted)]" },
  suspended: { label: "Suspended", bg: "bg-amber-500/10", text: "text-amber-600" },
  graduated: { label: "Graduated", bg: "bg-[#8B5CF6]/10", text: "text-[#8B5CF6]" },
  transferred: { label: "Transferred", bg: "bg-blue-500/10", text: "text-blue-600" },
  withdrawn: { label: "Withdrawn", bg: "bg-red-500/10", text: "text-red-500" },
};

function StatusBadge({ status }: { status: Student["status"] }) {
  const cfg = STATUS_BADGE[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.pulse && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

export function ProfileHeader({ student }: ProfileHeaderProps) {
  const { fmtGrade } = useSchoolConfig();
  const [statusOpen, setStatusOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/school-admin/students" className="hover:text-[var(--foreground)] transition-colors">
          Students
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--foreground)]">
          {student.firstName} {student.lastName}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            firstName={student.firstName}
            lastName={student.lastName}
            avatar={student.avatar}
            size="lg"
            ring
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                {student.firstName} {student.lastName}
              </h1>
              <StatusBadge status={student.status} />
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">{student.email ?? ""}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[var(--background-secondary)] text-[var(--foreground)]">
                {fmtGrade(student.gradeLevel)}
              </span>
              {student.gpa !== null && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[#0891B2]/10 text-[#0891B2]">
                  GPA {student.gpa.toFixed(1)}
                </span>
              )}
              {student.attendanceRate !== null && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[#10B981]/10 text-[#10B981]">
                  {student.attendanceRate}% Attend.
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setClassOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Change Class
          </button>
          <button
            type="button"
            onClick={() => setStatusOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <UserCog className="w-4 h-4" />
            Change Status
          </button>
          <button
            type="button"
            disabled
            title="Available once the reports module ships"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] rounded-lg opacity-60 cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Report Card
          </button>
          <Link
            href={`/school-admin/students/${student.id}/edit`}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>
          <button
            type="button"
            disabled
            title="Messaging will be available with the comms module"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg opacity-60 cursor-not-allowed"
          >
            <Mail className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>

      <StatusChangeDialog open={statusOpen} onClose={() => setStatusOpen(false)} student={student} />
      <ClassChangeDialog open={classOpen} onClose={() => setClassOpen(false)} student={student} />
    </div>
  );
}
