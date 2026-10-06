"use client";

import { motion } from "framer-motion";
import { Briefcase, FileText, Lock } from "lucide-react";
import type { StaffDetail } from "@/types/staff";
import { CONTRACT_TYPE_LABEL, EMPLOYER_LABEL, PERMISSION_ROLE_LABEL } from "@/types/staff";
import { formatDate } from "@/lib/staff/dates";
import { activeRolesOn } from "@/lib/staff/projections";
import { EmploymentTimeline } from "./employment-timeline";

interface JobTabProps {
  staff: StaffDetail;
  managerName: string | null;
  staffDirectory: readonly { id: string; name: string }[];
  today: string;
}

const card = "rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-medium mb-0.5">{label}</span>
      <span className="text-[13px] text-[var(--foreground)]">{value}</span>
    </div>
  );
}

export function JobTab({ staff: member, managerName, staffDirectory, today }: JobTabProps) {
  const names = new Map(staffDirectory.map((p) => [p.id, p.name]));
  const contracts = [...member.contracts].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const roles = activeRolesOn(member.contracts, today);
  const primary = roles.find((r) => r.isPrimary) ?? null;
  const responsibilities = roles.filter((r) => r.roleKind === "responsibility");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div className={card}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Current post</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <Field label="Employee number" value={member.employeeNumber} />
          <Field label="Designation" value={member.designation} />
          <Field label="Category" value={member.staffCategory === "academic" ? "Academic" : "Support"} />
          <Field label="Teaching eligibility" value={member.isTeacher ? "Eligible to teach" : "Not a teacher"} />
          <Field label="Department" value={member.department} />
          <Field label="Reports to" value={managerName ?? "No manager"} />
          <Field label="Employer" value={EMPLOYER_LABEL[member.employer]} />
          <Field label="Contract type" value={`${CONTRACT_TYPE_LABEL[member.contractType]} · ${member.ftePercent}% FTE${member.isTermTimeOnly ? " · term time" : ""}`} />
          <Field label="Hire date" value={formatDate(member.hireDate, "long")} />
          <Field label="Exit date" value={member.exitDate ? formatDate(member.exitDate, "long") : "Not set"} />
          <Field label="Grade level" value={primary?.payStructure ? `${primary.payStructure.gradeLevel}${primary.payStructure.step ? ` step ${primary.payStructure.step}` : ""} (${primary.payStructure.salaryStructure})` : "Not set"} />
          <Field label="Permission role" value={PERMISSION_ROLE_LABEL[member.permissionRole]} />
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Responsibilities</h3>
          <span className="text-[12px] text-[var(--muted)]">{responsibilities.length}</span>
        </div>
        {responsibilities.length === 0 ? (
          <p className="text-[13px] text-[var(--muted)]">No additional responsibilities. Head of department, form teacher, housemaster and exam officer roles appear here with their allowance codes.</p>
        ) : (
          <table className="w-full" aria-label="Responsibilities">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)]">
                <th scope="col" className="py-2 pr-4">Responsibility</th>
                <th scope="col" className="py-2 pr-4">Allowance</th>
                <th scope="col" className="py-2 pr-4">From</th>
                <th scope="col" className="py-2">Until</th>
              </tr>
            </thead>
            <tbody>
              {responsibilities.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border)]/50 last:border-b-0 text-[13px]">
                  <th scope="row" className="py-2.5 pr-4 text-left font-medium text-[var(--foreground)]">{r.designation}</th>
                  <td className="py-2.5 pr-4 text-[var(--muted)] font-mono">{r.allowanceCode ?? "None"}</td>
                  <td className="py-2.5 pr-4 text-[var(--muted)] tabular-nums">{formatDate(r.startDate, "short")}</td>
                  <td className="py-2.5 text-[var(--muted)] tabular-nums">{r.endDate ? formatDate(r.endDate, "short") : "Open"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={card}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Contracts</h3>
          <span className="text-[12px] text-[var(--muted)]">{contracts.length}</span>
        </div>
        <ul className="divide-y divide-[var(--border)]/50">
          {contracts.map((c) => (
            <li key={c.id} className="py-3 flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
              <div>
                <span className="font-medium text-[var(--foreground)]">{CONTRACT_TYPE_LABEL[c.contractType]}</span>
                <span className="text-[var(--muted)]"> · {EMPLOYER_LABEL[c.employer]} · {Math.round(c.fte * 100)}% FTE</span>
                {c.probationEndDate && <span className="block text-[11px] text-[var(--muted)]">Probation ends {formatDate(c.probationEndDate, "short")}</span>}
              </div>
              <span className="text-[var(--muted)] tabular-nums">
                {formatDate(c.startDate, "short")} to {c.endDate ? formatDate(c.endDate, "short") : "open"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <EmploymentTimeline events={member.events} names={names} />

      <div className={card}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[var(--muted)]" aria-hidden="true" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Compensation</h3>
          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-secondary)] text-[var(--muted)]">Restricted</span>
        </div>
        <p className="text-[13px] text-[var(--muted)]">Salary, currency, allowance amounts and statutory deductions are managed in the Payroll module. Only grade level and allowance codes are shown here.</p>
      </div>
    </motion.div>
  );
}
