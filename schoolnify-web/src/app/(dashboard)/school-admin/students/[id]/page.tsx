"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, RefreshCcw, WifiOff } from "lucide-react";
import { useStudent } from "@/hooks/use-students";
import { ApiError } from "@/api/client";
import { ProfileHeader } from "./_components/profile-header";
import { StatRing, FeeStatusRing } from "./_components/stat-ring";
import { PerformanceChart } from "./_components/performance-chart";
import { DetailTabs } from "./_components/detail-tabs";

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: student, isLoading, error, refetch } = useStudent(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-[#0891B2] animate-spin" />
        <p className="text-[13px] text-[var(--muted)]">Loading student...</p>
      </div>
    );
  }

  if (error || !student) {
    const is404 = error instanceof ApiError && error.status === 404;
    const title = is404 ? "Student Not Found" : "Couldn't reach the server";
    const body = is404
      ? "The student you're looking for doesn't exist."
      : (error instanceof Error ? error.message : "Something went wrong loading this student.");
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
            {is404 ? <ArrowLeft className="w-6 h-6 text-[var(--muted)]" /> : <WifiOff className="w-6 h-6 text-[var(--muted)]" />}
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">{title}</h1>
          <p className="text-[var(--muted)] mt-2 max-w-md text-center">{body}</p>
          <div className="flex items-center gap-3 mt-4">
            {!is404 && (
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0E7490] transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry
              </button>
            )}
            <Link
              href="/school-admin/students"
              className="inline-flex items-center gap-2 text-[#0891B2] hover:underline text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Students
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      <ProfileHeader student={student} />

      {/* Stats + Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Stat Rings */}
        <div className="lg:col-span-1 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-center gap-6">
          <StatRing
            label="GPA"
            value={student.gpa}
            maxValue={4.0}
            displayValue={student.gpa === null ? "—" : student.gpa.toFixed(1)}
            color="#0891B2"
          />
          <StatRing
            label="Attendance"
            value={student.attendanceRate}
            maxValue={100}
            displayValue={student.attendanceRate === null ? "—" : `${student.attendanceRate}%`}
            color="#10B981"
          />
          <FeeStatusRing feeStatus={student.feeStatus} />
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart gpa={student.gpa} />
        </div>
      </div>

      {/* Tabbed Content */}
      <DetailTabs student={student} />
    </motion.div>
  );
}
