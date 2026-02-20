"use client";

import Link from "next/link";
import { Edit3, Mail, ChevronRight } from "lucide-react";
import { useSchoolConfig } from "@/lib/school-config-context";
import { Avatar } from "../../_components/avatar";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  status: "active" | "inactive";
  gpa: number;
  attendanceRate: number;
  feeStatus: "paid" | "pending" | "overdue";
  avatar?: string | null;
}

interface ProfileHeaderProps {
  student: Student;
}

export function ProfileHeader({ student }: ProfileHeaderProps) {
  const { fmtGrade } = useSchoolConfig();

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
              {student.status === "active" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#10B981]/10 text-[#10B981]">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                  </span>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-[var(--background-secondary)] text-[var(--muted)]">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">{student.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[var(--background-secondary)] text-[var(--foreground)]">
                {fmtGrade(student.grade)}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[#0891B2]/10 text-[#0891B2]">
                GPA {student.gpa.toFixed(1)}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[#10B981]/10 text-[#10B981]">
                {student.attendanceRate}% Attend.
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/20 transition-all">
            <Mail className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
