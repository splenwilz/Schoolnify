/**
 * Today's date in the user's *local* timezone, formatted YYYY-MM-DD.
 *
 * Why this exists: `new Date().toISOString().slice(0, 10)` returns the UTC
 * date, which prefills tomorrow for users west of UTC late in the day.
 * Use this whenever a `<input type="date">` is being defaulted to "today".
 */
export function todayLocalISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
