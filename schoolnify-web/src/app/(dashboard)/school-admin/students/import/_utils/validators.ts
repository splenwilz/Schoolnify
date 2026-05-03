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

const DATE_PATTERNS: { regex: RegExp; parse: (m: RegExpMatchArray) => string }[] = [
  // YYYY-MM-DD (ISO)
  { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, parse: (m) => `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` },
  // DD/MM/YYYY or DD-MM-YYYY
  { regex: /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/, parse: (m) => `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` },
  // MM/DD/YYYY (US) -- only if month <= 12 and day > 12 to disambiguate
  // We default to DD/MM/YYYY; US format is handled via explicit date format setting
];

function parseDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  for (const pattern of DATE_PATTERNS) {
    const match = trimmed.match(pattern.regex);
    if (match) {
      const iso = pattern.parse(match);
      const d = new Date(iso);
      if (!isNaN(d.getTime())) return iso;
    }
  }
  // Try native Date parse as last resort
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
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
        const parsed = parseDate(value);
        if (!parsed) {
          errors.push({ field: field.key, message: `Invalid date format: "${value}"` });
        } else {
          normalized[field.key] = parsed;
        }
        break;
      }
      case "enum": {
        const lower = value.toLowerCase().trim();
        if (field.enumValues && !field.enumValues.includes(lower)) {
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
): BatchValidationResult {
  const results: (ValidationResult & { rowIndex: number })[] = [];
  const seenAdmissionNumbers = new Set<string>();
  let validCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const result = validateRow(rows[i], mapping, fields, gradeLevels, seenAdmissionNumbers);
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
