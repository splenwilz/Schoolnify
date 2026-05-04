"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewStudentForm } from "./_components/new-student-form";
import { EnrollFromAdmissions } from "./_components/enroll-from-admissions";

const TABS = [
  { id: "new", label: "New Student", icon: UserPlus, description: "Add a student from scratch" },
  { id: "admissions", label: "From Admissions", icon: ClipboardList, description: "Enroll an accepted applicant" },
] as const;

export default function EnrollStudentPage() {
  const [activeTab, setActiveTab] = useState<"new" | "admissions">("new");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[860px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/school-admin/students" className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Add Student</h1>
          <p className="text-[14px] text-[var(--muted)]">Add a new student or enroll from admissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-lg border transition-colors",
              activeTab === tab.id
                ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/20"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "new" ? <NewStudentForm /> : <EnrollFromAdmissions />}
    </motion.div>
  );
}
