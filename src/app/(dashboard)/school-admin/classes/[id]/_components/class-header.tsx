"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Plus } from "lucide-react";

interface ClassData {
  id: string;
  name: string;
  students: number;
  teacher: string;
  room: string;
  schedule: string;
  avgGrade: number;
  attendanceRate: number;
  status: string;
}

interface ClassHeaderProps {
  classData: ClassData;
}

export function ClassHeader({ classData }: ClassHeaderProps) {
  const gradeLabel = classData.name.replace("Grade ", "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      {/* Breadcrumb */}
      <Link
        href="/school-admin/classes"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Classes
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891B2] to-[#22D3EE] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#0891B2]/25">
            {gradeLabel}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                {classData.name}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#10B981]/10 text-[#10B981]">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                Active
              </span>
            </div>
            <p className="text-[13px] text-[var(--muted)] mt-1">
              {classData.teacher} · Room {classData.room} · {classData.schedule}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <Edit className="w-4 h-4" />
            Edit Class
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all">
            <Plus className="w-4 h-4" />
            Add Assignment
          </button>
        </div>
      </div>
    </motion.div>
  );
}
