"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useStudent } from "@/hooks/use-students";
import { NewStudentForm } from "../../new/_components/new-student-form";

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: student, isLoading, error } = useStudent(id);

  if (isLoading) {
    return (
      <div className="max-w-[860px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-[#0891B2] animate-spin" />
        <p className="text-[13px] text-[var(--muted)]">Loading student...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-[860px] mx-auto py-16 text-center">
        <p className="text-[15px] font-medium text-[var(--foreground)] mb-1">Student Not Found</p>
        <p className="text-[13px] text-[var(--muted)] mb-4">
          {error ? (error as Error).message : "The student you're looking for doesn't exist."}
        </p>
        <Link
          href="/school-admin/students"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0891B2] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[860px] mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/school-admin/students/${student.id}`}
          className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            Edit {student.firstName} {student.lastName}
          </h1>
          <p className="text-[14px] text-[var(--muted)]">{student.admissionNumber}</p>
        </div>
      </div>

      <NewStudentForm initialStudent={student} />
    </motion.div>
  );
}
