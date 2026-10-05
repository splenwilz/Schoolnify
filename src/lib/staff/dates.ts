/**
 * Calendar-date helpers for YYYY-MM-DD strings.
 *
 * Everything is computed in UTC so a date never shifts by a day depending on
 * the viewer's timezone or a daylight-saving transition. Lexical comparison of
 * two valid ISO dates is also chronological, which the rest of the staff
 * domain relies on.
 */

const DAY_MS = 86_400_000;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidISODate(iso: string): boolean {
  const m = ISO_RE.exec(iso);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** UTC midnight timestamp for a valid ISO date. Throws on malformed input. */
export function parseISODate(iso: string): number {
  if (!isValidISODate(iso)) throw new RangeError(`Invalid ISO date: ${JSON.stringify(iso)}`);
  const [y, mo, d] = iso.split("-").map(Number);
  return Date.UTC(y, mo - 1, d);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return toISODate(new Date(parseISODate(iso) + days * DAY_MS));
}

/** Adds calendar months, clamping to the last day of the target month. */
export function addMonths(iso: string, months: number): string {
  const [y, mo, d] = iso.split("-").map(Number);
  if (!isValidISODate(iso)) throw new RangeError(`Invalid ISO date: ${JSON.stringify(iso)}`);
  const first = new Date(Date.UTC(y, mo - 1 + months, 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return toISODate(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(d, lastDay))));
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function diffDays(from: string, to: string): number {
  return Math.round((parseISODate(to) - parseISODate(from)) / DAY_MS);
}

export type DateStyle = "short" | "long" | "monthYear";

export const UNKNOWN_DATE = "Unknown date";

// Fixed tables rather than Intl: this text is server-rendered and hydrated in
// the browser, and ICU month abbreviations differ across runtimes ("Sep" vs
// "Sept"), which would surface as hydration mismatches.
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Day-month-year display. Never throws: a malformed value renders as a fallback. */
export function formatDate(iso: string, style: DateStyle = "short"): string {
  if (!isValidISODate(iso)) return UNKNOWN_DATE;
  const [y, mo, d] = iso.split("-").map(Number);
  if (style === "monthYear") return `${MONTH_SHORT[mo - 1]} ${y}`;
  const month = style === "long" ? MONTH_LONG[mo - 1] : MONTH_SHORT[mo - 1];
  return `${d} ${month} ${y}`;
}
