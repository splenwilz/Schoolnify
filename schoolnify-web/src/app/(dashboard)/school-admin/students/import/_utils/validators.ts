import type { StudentField } from "../_constants/student-fields";
import { GENDER_MAP, RELATIONSHIP_MAP, BOARDING_MAP } from "../_constants/student-fields";

export interface RowError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: RowError[];
  /** Normalized row with cleaned values */
  normalized: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Date parsing -- accept multiple formats, normalize to YYYY-MM-DD
// ---------------------------------------------------------------------------

/**
 * Date format hint provided by school setup. Determines how ambiguous numeric
 * dates like "01/02/2026" are interpreted. ISO is always accepted regardless.
 */
export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

const ISO_RE = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const NUMERIC_RE = /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/;

function isoFromParts(year: string, month: string, day: string): string | null {
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : iso;
}

/**
 * Parse `value` to YYYY-MM-DD using the school's configured date format to
 * disambiguate numeric forms. ISO ("YYYY-MM-DD") is always accepted; numeric
 * separators "/" or "-" are interpreted by the supplied format.
 *
 * Falls through to `new Date(value)` for free-form strings (e.g., "Jan 5, 2026")
 * but only when no other parser matches. Returns null when nothing parses.
 */
export function parseDate(value: string, dateFormat: DateFormat = "DD/MM/YYYY"): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // ISO first -- unambiguous and always preferred.
  const iso = trimmed.match(ISO_RE);
  if (iso) {
    const result = isoFromParts(iso[1], iso[2], iso[3]);
    if (result) return result;
  }

  const numeric = trimmed.match(NUMERIC_RE);
  if (numeric) {
    const [, a, b, year] = numeric;
    if (dateFormat === "MM/DD/YYYY") {
      const result = isoFromParts(year, a, b);
      if (result) return result;
    } else {
      // DD/MM/YYYY (default and YYYY-MM-DD form falls back here as DD/MM)
      const result = isoFromParts(year, b, a);
      if (result) return result;
    }
  }

  // Last resort: native Date parser. Locale-dependent but better than rejecting
  // values like "Jan 5 2026" that humans clearly intend as dates.
  const native = new Date(trimmed);
  if (!isNaN(native.getTime())) {
    const yyyy = native.getFullYear();
    const mm = String(native.getMonth() + 1).padStart(2, "0");
    const dd = String(native.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Validate a single row
// ---------------------------------------------------------------------------

export function validateRow(
  row: Record<string, string>,
  mapping: Record<string, string>, // CSV column -> system field key
  fields: StudentField[],
  gradeLevels: string[],
  existingAdmissionNumbers: Set<string>,
  dateFormat: DateFormat = "DD/MM/YYYY",
): ValidationResult {
  const errors: RowError[] = [];
  const normalized: Record<string, string> = {};

  // 1) Project CSV columns onto system field keys.
  for (const [csvCol, fieldKey] of Object.entries(mapping)) {
    if (!fieldKey || fieldKey === "_ignore") continue;
    normalized[fieldKey] = row[csvCol] ?? "";
  }

  // 2) Apply alias normalization BEFORE enum validation. User-entered values
  //    like "boarder", "dad", "mom" are valid aliases that map to canonical
  //    enum values; validating raw input rejects them with a confusing error.
  if (normalized.gender) {
    const mapped = GENDER_MAP[normalized.gender.toLowerCase().trim()];
    if (mapped) normalized.gender = mapped;
  }
  for (const key of ["guardian1_relationship", "guardian2_relationship"]) {
    if (normalized[key]) {
      const mapped = RELATIONSHIP_MAP[normalized[key].toLowerCase().trim()];
      if (mapped) normalized[key] = mapped;
    }
  }
  if (normalized.boarding_status) {
    const mapped = BOARDING_MAP[normalized.boarding_status.toLowerCase().trim()];
    if (mapped) normalized.boarding_status = mapped;
  }

  // 3) Validate each mapped field against the (now-normalized) value.
  for (const field of fields) {
    const value = normalized[field.key] ?? "";

    if (field.required && !value.trim()) {
      errors.push({ field: field.key, message: `${field.label} is required` });
      continue;
    }
    if (!value.trim()) continue;

    switch (field.type) {
      case "date": {
        const parsed = parseDate(value, dateFormat);
        if (!parsed) {
          errors.push({ field: field.key, message: `Invalid date format: "${value}"` });
        } else {
          normalized[field.key] = parsed;
        }
        break;
      }
      case "enum": {
        const lower = value.toLowerCase().trim();
        // An empty / undefined enumValues list means "free-text", not "reject all".
        if (field.enumValues && field.enumValues.length > 0 && !field.enumValues.includes(lower)) {
          errors.push({ field: field.key, message: `"${value}" is not valid. Expected: ${field.enumValues.join(", ")}` });
        }
        break;
      }
    }
  }

  // 4) Cross-field checks.
  const grade = normalized.grade_level?.trim();
  if (grade && gradeLevels.length > 0 && !gradeLevels.includes(grade)) {
    errors.push({ field: "grade_level", message: `"${grade}" is not in the school's grade levels` });
  }

  const admNo = normalized.admission_number?.trim();
  if (admNo && existingAdmissionNumbers.has(admNo)) {
    errors.push({ field: "admission_number", message: `Duplicate admission number: "${admNo}"` });
  }

  return { valid: errors.length === 0, errors, normalized };
}

// ---------------------------------------------------------------------------
// Validate all rows
// ---------------------------------------------------------------------------

export interface BatchValidationResult {
  totalRows: number;
  validCount: number;
  errorCount: number;
  results: (ValidationResult & { rowIndex: number })[];
}

export function validateAllRows(
  rows: Record<string, string>[],
  mapping: Record<string, string>,
  fields: StudentField[],
  gradeLevels: string[],
  dateFormat: DateFormat = "DD/MM/YYYY",
): BatchValidationResult {
  const results: (ValidationResult & { rowIndex: number })[] = [];
  const seenAdmissionNumbers = new Set<string>();
  let validCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const result = validateRow(rows[i], mapping, fields, gradeLevels, seenAdmissionNumbers, dateFormat);
    results.push({ ...result, rowIndex: i });
    if (result.valid) {
      validCount++;
    } else {
      errorCount++;
    }
    const admNo = result.normalized.admission_number?.trim();
    if (admNo) seenAdmissionNumbers.add(admNo);
  }

  return { totalRows: rows.length, validCount, errorCount, results };
}
