"use client";

import { useId, useMemo, useState } from "react";
import type { Staff } from "@/types/staff";
import type { AbsenceLike } from "@/lib/staff/leave";
import {
  EMPTY_FILTERS,
  departmentsOf,
  filterStaff,
  lapsedCount,
  paginate,
  sortStaff,
  tabCounts,
  type DirectoryFilters,
} from "@/lib/staff/directory";
import { buildDirectoryRows, type ComplianceInput } from "@/lib/staff/rows";
import { StaffToolbar, statusTabId } from "./staff-toolbar";
import { StaffTable, type SortState } from "./staff-table";
import { EmptyState } from "./empty-state";
import { BulkActionsBar } from "./bulk-actions-bar";

const ITEMS_PER_PAGE = 10;

interface StaffDirectoryProps {
  staff: readonly Staff[];
  compliance: ComplianceInput;
  absences: readonly AbsenceLike[];
  today: string;
}

/**
 * Directory container: owns filter, sort, page and selection state and
 * derives everything else with the pure helpers in lib/staff.
 */
export function StaffDirectory({ staff, compliance, absences, today }: StaffDirectoryProps) {
  const [filters, setFilters] = useState<DirectoryFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortState>({ field: "name", dir: "asc" });
  const panelId = useId();
  // Page and selection are keyed by the filter signature: changing a filter
  // returns to page 1 and drops the selection, without a setState-in-effect.
  const filterKey = JSON.stringify(filters);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const currentPage = pageState.key === filterKey ? pageState.page : 1;
  const [selection, setSelection] = useState<{ key: string; ids: string[] }>({ key: filterKey, ids: [] });
  const selectedIds = selection.key === filterKey ? selection.ids : [];
  const setSelectedIds = (ids: string[]) => setSelection({ key: filterKey, ids });

  const rows = useMemo(() => buildDirectoryRows(staff, compliance, absences, today), [staff, compliance, absences, today]);
  const counts = useMemo(() => tabCounts(rows), [rows]);
  const lapsed = useMemo(() => lapsedCount(rows), [rows]);
  const departments = useMemo(() => departmentsOf(rows), [rows]);
  const filtered = useMemo(() => sortStaff(filterStaff(rows, filters), sort.field, sort.dir), [rows, filters, sort]);
  const page = useMemo(() => paginate(filtered, currentPage, ITEMS_PER_PAGE), [filtered, currentPage]);

  const toggleOne = (id: string) =>
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

  /** Select-all is scoped to the rows on the current page, matching the header checkbox. */
  const toggleAll = (pageIds: string[]) => {
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !pageIds.includes(id)) : [...new Set([...selectedIds, ...pageIds])]);
  };

  return (
    <section aria-labelledby="staff-directory-heading">
      <div className="surface-flat overflow-hidden">
        <div className="px-6 pt-5">
          <h2 id="staff-directory-heading" className="text-[15px] font-semibold text-[var(--foreground)]">
            Staff directory
          </h2>
          <p className="text-[12px] text-[var(--muted)] mt-0.5">
            {filtered.length} of {rows.length} people
          </p>
        </div>
        <StaffToolbar counts={counts} lapsed={lapsed} filters={filters} departments={departments} onFiltersChange={setFilters} panelId={panelId} />
        <div role="tabpanel" id={panelId} aria-labelledby={statusTabId(panelId, filters.tab)}>
          {filtered.length === 0 ? (
            <EmptyState onClearFilters={() => setFilters(EMPTY_FILTERS)} />
          ) : (
            <StaffTable
              page={page}
              selectedIds={selectedIds}
              sort={sort}
              onSortChange={setSort}
              onPageChange={(p) => setPageState({ key: filterKey, page: p })}
              onToggleOne={toggleOne}
              onToggleAll={toggleAll}
            />
          )}
        </div>
      </div>
      <BulkActionsBar count={selectedIds.length} onClear={() => setSelectedIds([])} />
    </section>
  );
}
