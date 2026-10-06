/**
 * "Away today" reads approved absences (the staff_absence seam). The
 * structural type also fits the older leave-request shape, so both sources
 * work while the leave module is pending.
 */
export interface AbsenceLike {
  staffId: string;
  startDate: string; // YYYY-MM-DD inclusive
  endDate: string | null; // inclusive; null = open ended
  status: string;
  /** Internal unavailability (a meeting, an exam duty): needs cover but the person is not away. */
  coverOnly?: boolean;
}

export function isAwayOn(a: AbsenceLike, dateISO: string): boolean {
  if (a.status !== "approved" || a.coverOnly) return false;
  return a.startDate <= dateISO && (a.endDate === null || a.endDate >= dateISO);
}

export function awayStaffIds(absences: readonly AbsenceLike[], dateISO: string): Set<string> {
  const ids = new Set<string>();
  for (const a of absences) if (isAwayOn(a, dateISO)) ids.add(a.staffId);
  return ids;
}
