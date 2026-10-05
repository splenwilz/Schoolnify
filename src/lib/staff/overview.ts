import type { Staff } from "@/types/staff";
import { awayStaffIds, type AbsenceLike } from "./leave";
import {
  averageTenureYears,
  headcountOn,
  newHiresBetween,
  rangeWindow,
  seriesDates,
  totalFte,
  type Granularity,
  type RangeKey,
  type SeriesPoint,
} from "./metrics";

/**
 * "Your overview" widgets, every number derived from the staff roster and
 * approved leave for an explicit reference date. Stock metrics are evaluated
 * at a date; flow metrics are counted inside a window.
 */

export type WidgetFormat = "count" | "years" | "fte";
export type WidgetKind = "stock" | "flow";

export interface WidgetDefinition {
  id: string;
  label: string;
  description: string;
  format: WidgetFormat;
  kind: WidgetKind;
}

export const OVERVIEW_WIDGETS: readonly WidgetDefinition[] = [
  { id: "headcount", label: "Headcount", description: "Staff on the books", format: "count", kind: "stock" },
  { id: "new_hires", label: "New hires", description: "Hire dates inside the period", format: "count", kind: "flow" },
  { id: "away", label: "Away", description: "On approved leave", format: "count", kind: "stock" },
  { id: "onboarding", label: "Onboarding", description: "Upcoming or not yet activated", format: "count", kind: "stock" },
  { id: "avg_tenure", label: "Avg tenure", description: "Average years of service", format: "years", kind: "stock" },
  { id: "fte", label: "Full-time equivalent", description: "Total FTE on the books", format: "fte", kind: "stock" },
];

export const DEFAULT_VISIBLE_WIDGETS = OVERVIEW_WIDGETS.map((w) => w.id);

export interface OverviewWidget extends WidgetDefinition {
  value: number;
  previous: number;
  spark: SeriesPoint[];
  /** Same shape over the previous window, for the compare toggle. */
  compare: SeriesPoint[];
}

export interface OverviewInput {
  today: string;
  range: RangeKey;
  granularity: Granularity;
  absences: readonly AbsenceLike[];
  termStart?: string;
}

/** Upcoming hires on the date, plus staff flagged onboarding who have already started. */
export function onboardingOn(staff: readonly Staff[], dateISO: string): number {
  return staff.reduce((n, s) => {
    if (s.employmentStatus === "inactive") return n;
    const upcoming = s.hireDate > dateISO;
    const startedNotActivated = s.employmentStatus === "onboarding" && s.hireDate <= dateISO;
    return n + (upcoming || startedNotActivated ? 1 : 0);
  }, 0);
}

type StockFn = (staff: readonly Staff[], dateISO: string, input: OverviewInput) => number;

const STOCK: Record<string, StockFn> = {
  headcount: (s, d) => headcountOn(s, d),
  away: (s, d, input) => awayStaffIds(input.absences, d).size,
  onboarding: (s, d) => onboardingOn(s, d),
  avg_tenure: (s, d) => averageTenureYears(s, d),
  fte: (s, d) => totalFte(s, d),
};

type FlowFn = (staff: readonly Staff[], fromISO: string, toISO: string) => number;

const FLOW: Record<string, FlowFn> = {
  new_hires: (s, from, to) => newHiresBetween(s, from, to),
};

function stockSeries(staff: readonly Staff[], dates: string[], fn: StockFn, input: OverviewInput): SeriesPoint[] {
  return dates.map((date) => ({ date, value: fn(staff, date, input) }));
}

/** Each bucket counts from the day after the previous series date up to and including its own date. */
function flowSeries(staff: readonly Staff[], from: string, dates: string[], fn: FlowFn): SeriesPoint[] {
  let bucketStart = from;
  return dates.map((date, i) => {
    const start = i === 0 ? from : bucketStart;
    const value = fn(staff, start, date);
    bucketStart = nextDay(date);
    return { date, value };
  });
}

function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function computeOverview(staff: readonly Staff[], input: OverviewInput): OverviewWidget[] {
  const win = rangeWindow(input.range, input.today, { termStart: input.termStart });
  const dates = seriesDates(win.from, win.to, input.granularity);
  const prevDates = seriesDates(win.prevFrom, win.prevTo, input.granularity);

  return OVERVIEW_WIDGETS.map((def) => {
    if (def.kind === "flow") {
      const fn = FLOW[def.id];
      return {
        ...def,
        value: fn(staff, win.from, win.to),
        previous: fn(staff, win.prevFrom, win.prevTo),
        spark: flowSeries(staff, win.from, dates, fn),
        compare: flowSeries(staff, win.prevFrom, prevDates, fn),
      };
    }
    const fn = STOCK[def.id];
    return {
      ...def,
      value: fn(staff, win.to, input),
      previous: fn(staff, win.prevTo, input),
      spark: stockSeries(staff, dates, fn, input),
      compare: stockSeries(staff, prevDates, fn, input),
    };
  });
}
