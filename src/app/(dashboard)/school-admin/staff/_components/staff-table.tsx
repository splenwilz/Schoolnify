"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { CONTRACT_TYPE_LABEL, EMPLOYER_LABEL, EMPLOYMENT_STATUS_LABEL, staffFullName, type EmploymentStatus } from "@/types/staff";
import type { Page, SortDir, SortField } from "@/lib/staff/directory";
import type { DirectoryRow } from "@/lib/staff/rows";
import { formatDate } from "@/lib/staff/dates";
import { CredentialHealthDot } from "./credential-health-dot";
import { TablePagination } from "./table-pagination";

export interface SortState {
  field: SortField;
  dir: SortDir;
}

interface StaffTableProps {
  page: Page<DirectoryRow>;
  selectedIds: readonly string[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  onPageChange: (page: number) => void;
  onToggleOne: (id: string) => void;
  onToggleAll: (pageIds: string[]) => void;
}

const STATUS_DOT: Record<EmploymentStatus, string> = {
  active: "bg-[var(--success)]",
  onboarding: "bg-[var(--brand)]",
  suspended: "bg-[var(--warning)]",
  inactive: "bg-[var(--muted)]",
};

interface Column {
  field: SortField | null;
  label: string;
  className?: string;
}

const COLUMNS: Column[] = [
  { field: "name", label: "Name" },
  { field: "designation", label: "Designation" },
  { field: "department", label: "Department" },
  { field: null, label: "Reports to" },
  { field: "status", label: "Status" },
  { field: "hireDate", label: "Hire date" },
  { field: null, label: "Credentials" },
];

function ariaSort(col: Column, sort: SortState): "ascending" | "descending" | "none" | undefined {
  if (!col.field) return undefined;
  if (col.field !== sort.field) return "none";
  return sort.dir === "asc" ? "ascending" : "descending";
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-30" aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" aria-hidden="true" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" aria-hidden="true" />
  );
}

export function StaffTable({
  page,
  selectedIds,
  sort,
  onSortChange,
  onPageChange,
  onToggleOne,
  onToggleAll,
}: StaffTableProps) {
  const selected = new Set(selectedIds);
  const allOnPageSelected = page.items.length > 0 && page.items.every((r) => selected.has(r.id));

  const handleSort = (field: SortField) => {
    if (field === sort.field) onSortChange({ field, dir: sort.dir === "asc" ? "desc" : "asc" });
    else onSortChange({ field, dir: "asc" });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="w-14 px-6 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all on this page"
                  checked={allOnPageSelected}
                  onChange={() => onToggleAll(page.items.map((r) => r.id))}
                  className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] border-[var(--border)] accent-[var(--foreground)] cursor-pointer"
                />
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  scope="col"
                  aria-sort={ariaSort(col, sort)}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider"
                >
                  {col.field ? (
                    <button
                      type="button"
                      aria-label={`Sort by ${col.label.toLowerCase()}`}
                      onClick={() => handleSort(col.field!)}
                      className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors uppercase"
                    >
                      {col.label}
                      <SortIcon active={sort.field === col.field} dir={sort.dir} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.items.map((member) => {
              const isSelected = selected.has(member.id);
              const name = staffFullName(member);
              return (
                <tr
                  key={member.id}
                  className={cn(
                    "group transition-colors border-b border-[var(--border)]/50 last:border-b-0",
                    isSelected ? "bg-[var(--background-secondary)]" : "hover:bg-[var(--background-secondary)]/50"
                  )}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${name}`}
                      checked={isSelected}
                      onChange={() => onToggleOne(member.id)}
                      className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] border-[var(--border)] accent-[var(--foreground)] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/school-admin/staff/${member.id}`} className="flex items-center gap-3.5 group/link">
                      <Avatar firstName={member.firstName} lastName={member.lastName} size="md" className="rounded-xl" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--foreground)] group-hover/link:text-[var(--brand)] transition-colors truncate">
                          {name}
                        </p>
                        <p className="text-[12.5px] text-[var(--muted)] mt-0.5 truncate">{member.email ?? member.phone ?? "No contact on file"}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--foreground)]">{member.designation}</span>
                    {(member.contractType !== "permanent" || member.ftePercent < 100 || member.isTermTimeOnly) && (
                      <span className="block text-[11px] text-[var(--muted)] mt-0.5">
                        {[
                          member.contractType !== "permanent" ? CONTRACT_TYPE_LABEL[member.contractType] : null,
                          member.ftePercent < 100 ? `${member.ftePercent}%` : null,
                          member.isTermTimeOnly ? "term time" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                    {member.employer !== "school" && (
                      <span className="mt-1 inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--background-secondary)] text-[var(--muted)]">
                        {EMPLOYER_LABEL[member.employer]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">{member.department}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">{member.managerName ?? "No manager"}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                      <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[member.employmentStatus])} aria-hidden="true" />
                      {EMPLOYMENT_STATUS_LABEL[member.employmentStatus]}
                    </span>
                    {member.contractLapsed && (
                      <span className="block mt-1 w-fit px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--error)]/10 text-[var(--error)]">
                        Contract ended
                      </span>
                    )}
                    {member.awayToday && (
                      <span className="block mt-1 w-fit px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--warning)]/10 text-[var(--warning)]">
                        Away today
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)] tabular-nums">{formatDate(member.hireDate, "short")}</span>
                  </td>
                  <td className="px-4 py-4">
                    <CredentialHealthDot health={member.health} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {page.total > 0 && <TablePagination page={page} onPageChange={onPageChange} />}
    </div>
  );
}
