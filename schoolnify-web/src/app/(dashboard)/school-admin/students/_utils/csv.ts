/**
 * Escape a single CSV cell.
 *
 * Handles two distinct concerns:
 * 1. CSV quoting — wrap in double quotes if the value contains comma, quote, or newline.
 * 2. Formula injection — Excel/Sheets treat values starting with =, +, -, @, tab, or CR
 *    as formulas. Prefix with a single quote so they render as literal text.
 *
 * Why: a guardian named "=HYPERLINK(...)" or a transferred-from school field starting
 * with "+1234" can otherwise execute when the school admin opens the export in Excel.
 */
export function escapeCsvCell(input: unknown): string {
  if (input == null) return "";
  const v = String(input);
  // Leading-character formula prefixes
  const needsFormulaGuard = /^[=+\-@\t\r]/.test(v);
  const guarded = needsFormulaGuard ? `'${v}` : v;
  // Standard CSV quoting
  if (/[",\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

/** Build a CSV string from rows + headers. Adds UTF-8 BOM so Excel detects encoding. */
export function buildCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const headerLine = headers.map(escapeCsvCell).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCsvCell(row[h])).join(",")
  );
  return "﻿" + [headerLine, ...dataLines].join("\n");
}
