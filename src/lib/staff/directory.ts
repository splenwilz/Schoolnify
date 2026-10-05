import type { ContractType, Employer, EmploymentStatus, Staff, StaffCategory } from "@/types/staff";
import { staffFullName } from "@/types/staff";

export type StatusTab = "all" | EmploymentStatus;

export interface DirectoryFilters {
  tab: StatusTab;
  query: string;
  department: string; // "" = any
  category: StaffCategory | "";
  contractType: ContractType | "";
  employer: Employer | "";
  /** Only people whose last contract ended with no exit recorded. */
  lapsedOnly: boolean;
}

export const EMPTY_FILTERS: DirectoryFilters = {
  tab: "all",
  query: "",
  department: "",
  category: "",
  contractType: "",
  employer: "",
  lapsedOnly: false,
};

export function filterStaff<T extends Staff>(staff: readonly T[], f: DirectoryFilters): T[] {
  const q = f.query.trim().toLowerCase();
  return staff.filter((s) => {
    if (f.tab !== "all" && s.employmentStatus !== f.tab) return false;
    if (f.department && s.department !== f.department) return false;
    if (f.category && s.staffCategory !== f.category) return false;
    if (f.contractType && s.contractType !== f.contractType) return false;
    if (f.employer && s.employer !== f.employer) return false;
    if (f.lapsedOnly && !s.contractLapsed) return false;
    if (q) {
      const haystack = [staffFullName(s), s.email ?? "", s.phone ?? "", s.employeeNumber, s.designation]
        .join("\u0000")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export type SortField = "name" | "designation" | "department" | "hireDate" | "status";
export type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<EmploymentStatus, number> = { onboarding: 0, active: 1, suspended: 2, inactive: 3 };

function compare(a: Staff, b: Staff, field: SortField): number {
  switch (field) {
    case "name":
      return staffFullName(a).localeCompare(staffFullName(b));
    case "designation":
      return a.designation.localeCompare(b.designation);
    case "department":
      return a.department.localeCompare(b.department);
    case "hireDate":
      return a.hireDate < b.hireDate ? -1 : a.hireDate > b.hireDate ? 1 : 0;
    case "status":
      return STATUS_ORDER[a.employmentStatus] - STATUS_ORDER[b.employmentStatus];
  }
}

/** Stable, non-mutating sort. */
export function sortStaff<T extends Staff>(staff: readonly T[], field: SortField, dir: SortDir): T[] {
  const mul = dir === "asc" ? 1 : -1;
  return [...staff].sort((a, b) => mul * compare(a, b, field));
}

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  /** 1-based position of the first item shown; 0 when empty. */
  from: number;
  to: number;
  total: number;
}

export function paginate<T>(items: readonly T[], page: number, perPageRaw: number): Page<T> {
  const perPage = Math.max(1, Math.floor(perPageRaw) || 1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1), totalPages);
  const start = (current - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return {
    items: slice,
    page: current,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: total === 0 ? 0 : start + slice.length,
    total,
  };
}

export function departmentsOf(staff: readonly Staff[]): string[] {
  return [...new Set(staff.map((s) => s.department))].sort((a, b) => a.localeCompare(b));
}

/** People shown under their projected status whose contract has in fact ended; Today's tiles leave them out. */
export function lapsedCount(staff: readonly Staff[]): number {
  return staff.reduce((n, s) => n + (s.contractLapsed ? 1 : 0), 0);
}

export function tabCounts(staff: readonly Staff[]): Record<StatusTab, number> {
  const counts: Record<StatusTab, number> = { all: staff.length, onboarding: 0, active: 0, suspended: 0, inactive: 0 };
  for (const s of staff) counts[s.employmentStatus] += 1;
  return counts;
}
