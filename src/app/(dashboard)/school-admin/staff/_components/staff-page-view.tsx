"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileDown, Upload, UserPlus } from "lucide-react";
import type { Staff } from "@/types/staff";
import type { AbsenceLike } from "@/lib/staff/leave";
import type { CoverageSummary } from "@/lib/staff/coverage";
import type { ComplianceInput } from "@/lib/staff/rows";
import { StaffToday } from "./staff-today";
import { StaffOverview } from "./staff-overview";
import { StaffDirectory } from "./staff-directory";

export interface StaffPageViewProps {
  today: string;
  staff: Staff[];
  compliance: ComplianceInput;
  absences: AbsenceLike[];
  coverage: CoverageSummary;
  school: { name: string; currentTerm: string; academicYear: string };
  termStart?: string;
}

const secondaryButton =
  "flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all";

export function StaffPageView({ today, staff, compliance, absences, coverage, school, termStart }: StaffPageViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Staff</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">Manage and track staff members</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className={secondaryButton + " disabled:opacity-50 disabled:cursor-not-allowed"} disabled title="Export is not available yet">
            <FileDown className="w-4 h-4" aria-hidden="true" />
            Export
          </button>
          <Link href="/school-admin/staff/import" className={secondaryButton}>
            <Upload className="w-4 h-4" aria-hidden="true" />
            Import
          </Link>
          <Link
            href="/school-admin/staff/new"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)] shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            Add staff
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <StaffToday today={today} staff={staff} absences={absences} compliance={compliance} coverage={coverage} school={school} />
        <hr className="border-[var(--border)]" />
        <StaffOverview staff={staff} absences={absences} today={today} termStart={termStart} />
        <hr className="border-[var(--border)]" />
        <StaffDirectory staff={staff} compliance={compliance} absences={absences} today={today} />
      </div>
    </motion.div>
  );
}
