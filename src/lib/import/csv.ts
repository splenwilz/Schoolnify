import Papa from "papaparse";

/**
 * CSV only. Excel parsing is deliberately not offered here: the `xlsx`
 * package on npm has unpatched prototype-pollution and ReDoS advisories and
 * import files are untrusted input. Users export to CSV first.
 */

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
  errors: string[];
}

/** Hard ceilings for a browser-side import; parsing is on the main thread and larger inputs would freeze the tab. */
export const MAX_IMPORT_ROWS = 2000;
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

export interface ParseOptions {
  maxRows?: number;
  maxBytes?: number;
}

const BOM = "﻿";

export function parseCsvText(text: string, options: ParseOptions = {}): ParsedCsv {
  const maxRows = options.maxRows ?? MAX_IMPORT_ROWS;
  const maxBytes = options.maxBytes ?? MAX_IMPORT_BYTES;
  if (text.length > maxBytes) {
    return { headers: [], rows: [], errors: [`The input is larger than ${Math.round(maxBytes / 1024 / 1024)} MB; split it and import in parts`] };
  }
  const source = text.startsWith(BOM) ? text.slice(1) : text;
  if (source.trim() === "") return { headers: [], rows: [], errors: ["No rows found in the file"] };

  const result = Papa.parse<Record<string, string>>(source, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h: string) => h.trim(),
  });
  const headers = (result.meta.fields ?? []).filter((h) => h !== "");
  const truncated = result.data.length > maxRows;
  const rows = result.data.slice(0, maxRows).map((row) => {
    const cleaned: Record<string, string> = {};
    for (const h of headers) {
      const v = row[h];
      cleaned[h] = typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
    }
    return cleaned;
  });

  // Papa's `row` is the index into the parsed data (blank lines are skipped
  // before numbering), so notices use 1-based data rows, not file lines.
  const errors: string[] = [];
  const tooManyRows: number[] = [];
  for (const e of result.errors) {
    // A one-column file has no delimiter to detect; Papa falls back to a comma, which is fine.
    if (e.code === "UndetectableDelimiter") continue;
    if (e.row != null && e.row >= maxRows) continue; // never read; the cap notice covers it
    if (e.type === "FieldMismatch") {
      // Missing cells become blanks (fine); extra cells would be lost silently (not fine).
      if (e.code === "TooManyFields" && e.row != null) tooManyRows.push(e.row + 1);
      continue;
    }
    errors.push(`Row ${e.row == null ? "?" : e.row + 1}: ${e.message}`);
  }
  if (tooManyRows.length === 1) {
    errors.push(`Row ${tooManyRows[0]} has more values than columns; the extra values were ignored`);
  } else if (tooManyRows.length > 1) {
    const shown = tooManyRows.slice(0, 5).join(", ");
    const more = tooManyRows.length - Math.min(5, tooManyRows.length);
    errors.push(`${tooManyRows.length} rows have more values than columns; the extra values were ignored (rows ${shown}${more > 0 ? ` and ${more} more` : ""})`);
  }
  if (truncated) errors.push(`Only the first ${maxRows} rows were read; split the file to import the rest`);
  if (rows.length === 0) errors.unshift("No rows found in the file");
  return { headers, rows, errors };
}

export async function parseCsvFile(file: File, options: ParseOptions = {}): Promise<ParsedCsv> {
  const maxBytes = options.maxBytes ?? MAX_IMPORT_BYTES;
  if (file.size > maxBytes) {
    return { headers: [], rows: [], errors: [`The file is larger than ${Math.round(maxBytes / 1024 / 1024)} MB; split it and import in parts`] };
  }
  return parseCsvText(await file.text(), options);
}

/**
 * Escape one cell: CSV quoting plus a formula-injection guard, so a value like
 * "=HYPERLINK(...)" or "+234..." renders as text when opened in Excel or Sheets.
 */
export function escapeCsvCell(input: unknown): string {
  if (input == null) return "";
  const v = String(input);
  const guarded = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return /[",\n\r]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

/** CSV text with a UTF-8 BOM so Excel detects the encoding. */
export function buildCsv(headers: readonly string[], rows: readonly Record<string, unknown>[]): string {
  const lines = [headers.map(escapeCsvCell).join(","), ...rows.map((r) => headers.map((h) => escapeCsvCell(r[h])).join(","))];
  return BOM + lines.join("\n");
}
