import type { Staff } from "@/types/staff";
import { addDays, addMonths, diffDays, isValidISODate } from "./dates";

/**
 * Workforce metrics evaluated at a point in time. Every function takes the
 * reference date explicitly so results are reproducible and SSR-safe.
 */

/**
 * Hired on or before the date, not yet exited, not inactive without an exit
 * date, and the contract had not lapsed by that date. The lapse is judged by
 * the contract end date so series over past dates keep the person while they
 * were employed. FTE and the other projections are still "as of today"; the
 * API will supply per-date snapshots when history matters.
 */
export function isOnBooksOn(s: Staff, dateISO: string): boolean {
  if (!isValidISODate(s.hireDate) || s.hireDate > dateISO) return false;
  if (s.contractLapsed && s.contractEndDate !== null && s.contractEndDate < dateISO) return false;
  if (s.exitDate !== null) return s.exitDate > dateISO;
  return s.employmentStatus !== "inactive";
}

export function headcountOn(staff: readonly Staff[], dateISO: string): number {
  return staff.reduce((n, s) => n + (isOnBooksOn(s, dateISO) ? 1 : 0), 0);
}

/** Hire dates inside [fromISO, toISO], inclusive. */
export function newHiresBetween(staff: readonly Staff[], fromISO: string, toISO: string): number {
  return staff.reduce((n, s) => n + (s.hireDate >= fromISO && s.hireDate <= toISO ? 1 : 0), 0);
}

export function tenureYears(hireDateISO: string, dateISO: string): number {
  if (!isValidISODate(hireDateISO) || !isValidISODate(dateISO)) return 0;
  return diffDays(hireDateISO, dateISO) / 365.25;
}

export function averageTenureYears(staff: readonly Staff[], dateISO: string): number {
  const onBooks = staff.filter((s) => isOnBooksOn(s, dateISO));
  if (onBooks.length === 0) return 0;
  return onBooks.reduce((sum, s) => sum + tenureYears(s.hireDate, dateISO), 0) / onBooks.length;
}

export function totalFte(staff: readonly Staff[], dateISO: string): number {
  return staff.reduce((sum, s) => sum + (isOnBooksOn(s, dateISO) ? s.ftePercent / 100 : 0), 0);
}

export type RangeKey = "7d" | "30d" | "90d" | "term";
export type Granularity = "daily" | "weekly" | "monthly";

export interface RangeWindow {
  from: string;
  to: string;
  prevFrom: string;
  prevTo: string;
}

const RANGE_DAYS: Record<Exclude<RangeKey, "term">, number> = { "7d": 7, "30d": 30, "90d": 90 };

/** Current window ending today plus the equally long window just before it. */
export function rangeWindow(range: RangeKey, todayISO: string, opts: { termStart?: string } = {}): RangeWindow {
  const from =
    range === "term" && opts.termStart && isValidISODate(opts.termStart) && opts.termStart <= todayISO
      ? opts.termStart
      : addDays(todayISO, -(RANGE_DAYS[range === "term" ? "90d" : range] - 1));
  const length = diffDays(from, todayISO);
  const prevTo = addDays(from, -1);
  return { from, to: todayISO, prevFrom: addDays(prevTo, -length), prevTo };
}

/** Dates stepping from `from` by the granularity; always ends on `to`. */
export function seriesDates(fromISO: string, toISO: string, granularity: Granularity): string[] {
  if (fromISO >= toISO) return [toISO];
  const dates: string[] = [];
  let cursor = fromISO;
  let step = 0;
  while (cursor < toISO) {
    dates.push(cursor);
    step += 1;
    cursor =
      granularity === "monthly"
        ? addMonths(fromISO, step)
        : addDays(fromISO, step * (granularity === "weekly" ? 7 : 1));
  }
  dates.push(toISO);
  return dates;
}

export interface SeriesPoint {
  date: string;
  value: number;
}

export function headcountSeries(staff: readonly Staff[], dates: readonly string[]): SeriesPoint[] {
  return dates.map((date) => ({ date, value: headcountOn(staff, date) }));
}
