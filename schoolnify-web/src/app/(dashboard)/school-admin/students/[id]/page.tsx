"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { students } from "@/lib/demo-data";
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
  const student = students.find((s) => s.id === resolvedParams.id);

  if (!student) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
            <ArrowLeft className="w-6 h-6 text-[var(--muted)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Student Not Found</h1>
          <p className="text-[var(--muted)] mt-2">
            The student you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/school-admin/students"
            className="mt-4 inline-flex items-center gap-2 text-[#0891B2] hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Link>
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
            displayValue={student.gpa.toFixed(1)}
            color="#0891B2"
          />
          <StatRing
            label="Attendance"
            value={student.attendanceRate}
            maxValue={100}
            displayValue={`${student.attendanceRate}%`}
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
