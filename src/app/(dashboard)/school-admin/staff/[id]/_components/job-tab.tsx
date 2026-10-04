"use client";

import { motion } from "framer-motion";
import { Briefcase, Lock } from "lucide-react";
import type { Staff } from "@/types/staff";
import {
  EMPLOYMENT_TYPE_LABEL,
  PERMISSION_ROLE_LABEL,
  staffFullName,
} from "@/types/staff";
import { staff } from "@/lib/demo-data";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function JobTab({ staff: member }: { staff: Staff }) {
  const manager = member.reportsToId
    ? staff.find((s) => s.id === member.reportsToId)
    : null;

  const fields: { label: string; value: string }[] = [
    { label: "Employee number", value: member.employeeNumber },
    { label: "Designation", value: member.designation },
    {
      label: "Category",
      value: member.staffCategory === "academic" ? "Academic" : "Support",
    },
    { label: "Teaching eligibility", value: member.isTeacher ? "Eligible to teach" : "Not a teacher" },
    { label: "Permission role", value: PERMISSION_ROLE_LABEL[member.permissionRole] },
    { label: "Department", value: member.department },
    {
      label: "Employment type",
      value: `${EMPLOYMENT_TYPE_LABEL[member.employmentType]}${
        member.ftePercent < 100 ? ` · ${member.ftePercent}% FTE` : ""
      }`,
    },
    { label: "Hire date", value: formatDate(member.hireDate) },
    { label: "Reports to", value: manager ? staffFullName(manager) : "No manager" },
    { label: "Grade band", value: member.gradeBand ?? "Not set" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
            Employment
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col">
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-medium mb-0.5">
                {f.label}
              </span>
              <span className="text-[13px] text-[var(--foreground)]">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compensation is gated. Amount + currency + statutory deductions live in
          the Payroll module; only the grade band is surfaced here. */}
      <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[var(--muted)]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
            Compensation
          </h3>
          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-secondary)] text-[var(--muted)]">
            Restricted
          </span>
        </div>
        <p className="text-[13px] text-[var(--muted)]">
          Grade band <span className="text-[var(--foreground)] font-medium">{member.gradeBand ?? "Not set"}</span>.
          Salary, currency, and statutory deductions are managed in the Payroll module.
        </p>
      </div>
    </motion.div>
  );
}
