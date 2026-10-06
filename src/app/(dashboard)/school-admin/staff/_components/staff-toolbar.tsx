"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTRACT_TYPE_LABEL, EMPLOYER_LABEL, EMPLOYMENT_STATUS_LABEL, type ContractType, type Employer, type StaffCategory } from "@/types/staff";
import type { DirectoryFilters, StatusTab } from "@/lib/staff/directory";

interface StaffToolbarProps {
  counts: Record<StatusTab, number>;
  /** How many people have a lapsed contract; 0 hides the filter. */
  lapsed: number;
  filters: DirectoryFilters;
  departments: readonly string[];
  onFiltersChange: (next: DirectoryFilters) => void;
  /** id of the element the tabs control (the directory results). */
  panelId: string;
}

/** Tab id for a status, shared with the panel's aria-labelledby. */
export const statusTabId = (panelId: string, tab: StatusTab) => `${panelId}-tab-${tab}`;

const TABS: { id: StatusTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: EMPLOYMENT_STATUS_LABEL.active },
  { id: "onboarding", label: EMPLOYMENT_STATUS_LABEL.onboarding },
  { id: "suspended", label: EMPLOYMENT_STATUS_LABEL.suspended },
  { id: "inactive", label: EMPLOYMENT_STATUS_LABEL.inactive },
];

const selectClass =
  "h-9 pl-3 pr-8 text-[13px] rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30";

export function StaffToolbar({ counts, lapsed, filters, departments, onFiltersChange, panelId }: StaffToolbarProps) {
  const ids = { dept: useId(), cat: useId(), type: useId(), employer: useId() };
  const set = (patch: Partial<DirectoryFilters>) => onFiltersChange({ ...filters, ...patch });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // WAI-ARIA tabs pattern, automatic activation: arrows move focus and select.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TABS.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    set({ tab: TABS[next].id });
  };

  return (
    <div className="px-6 pt-5 pb-4 space-y-4">
      <div role="tablist" aria-label="Employment status" className="flex items-center gap-1 flex-wrap">
        {TABS.map((tab, index) => {
          const active = filters.tab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={statusTabId(panelId, tab.id)}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={active ? 0 : -1}
              ref={(el) => { tabRefs.current[index] = el; }}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              onClick={() => set({ tab: tab.id })}
              className={cn(
                "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors inline-flex items-center gap-2",
                active
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
              <span className={cn("text-[11px] tabular-nums", active ? "opacity-70" : "text-[var(--muted)]")}>
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search staff"
            placeholder="Search by name, email, employee number or designation"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            className="w-full h-9 pl-9 pr-9 text-[13px] rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
          />
          {filters.query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => set({ query: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor={ids.dept} className="sr-only">Department</label>
          <select id={ids.dept} value={filters.department} onChange={(e) => set({ department: e.target.value })} className={selectClass}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <label htmlFor={ids.cat} className="sr-only">Category</label>
          <select id={ids.cat} value={filters.category} onChange={(e) => set({ category: e.target.value as StaffCategory | "" })} className={selectClass}>
            <option value="">All categories</option>
            <option value="academic">Academic</option>
            <option value="support">Support</option>
          </select>

          <label htmlFor={ids.type} className="sr-only">Contract type</label>
          <select id={ids.type} value={filters.contractType} onChange={(e) => set({ contractType: e.target.value as ContractType | "" })} className={selectClass}>
            <option value="">All contract types</option>
            {(Object.keys(CONTRACT_TYPE_LABEL) as ContractType[]).map((t) => (
              <option key={t} value={t}>{CONTRACT_TYPE_LABEL[t]}</option>
            ))}
          </select>

          <label htmlFor={ids.employer} className="sr-only">Employer</label>
          <select id={ids.employer} value={filters.employer} onChange={(e) => set({ employer: e.target.value as Employer | "" })} className={selectClass}>
            <option value="">All employers</option>
            {(Object.keys(EMPLOYER_LABEL) as Employer[]).map((t) => (
              <option key={t} value={t}>{EMPLOYER_LABEL[t]}</option>
            ))}
          </select>

          {lapsed > 0 && (
            <button
              type="button"
              aria-pressed={filters.lapsedOnly}
              onClick={() => set({ lapsedOnly: !filters.lapsedOnly })}
              title="Last contract ended with no exit recorded; counted under their last status here but not on the books"
              className={cn(
                "h-9 px-3 text-[13px] rounded-lg border inline-flex items-center gap-2 transition-colors",
                filters.lapsedOnly
                  ? "border-[var(--error)] bg-[var(--error)]/10 text-[var(--error)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              Contract ended
              <span className="text-[11px] tabular-nums">{lapsed}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
