"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { classes } from "@/lib/demo-data";
import { ClassHeader } from "./_components/class-header";
import { StatRing } from "./_components/stat-ring";
import { ClassChart } from "./_components/class-chart";
import { DetailTabs } from "./_components/detail-tabs";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classData = classes.find((c) => c.id === resolvedParams.id);

  if (!classData) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="py-12 text-center">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Class Not Found</h1>
          <p className="text-[var(--muted)] mt-2">
            The class you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/school-admin/classes"
            className="mt-4 inline-flex items-center gap-2 text-[#0891B2] hover:underline"
          >
            Back to Classes
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
      <ClassHeader classData={classData} />

      {/* Stat Rings + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-around"
        >
          <StatRing
            label="Students"
            value={classData.students}
            maxValue={35}
            displayValue={String(classData.students)}
            color="#0891B2"
          />
          <StatRing
            label="Attendance"
            value={classData.attendanceRate}
            maxValue={100}
            displayValue={`${classData.attendanceRate}%`}
            color="#10B981"
          />
          <StatRing
            label="Avg GPA"
            value={classData.avgGrade}
            maxValue={4.0}
            displayValue={classData.avgGrade.toFixed(1)}
            color="#F59E0B"
          />
        </motion.div>
        <div className="lg:col-span-2">
          <ClassChart attendanceRate={classData.attendanceRate} />
        </div>
      </div>

      {/* Detail Tabs */}
      <DetailTabs classData={classData} />
    </motion.div>
  );
}
