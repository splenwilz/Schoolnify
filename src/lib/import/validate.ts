import { isValidISODate } from "@/lib/staff/dates";
import { normalizeToE164, phoneErrorMessage } from "@/lib/staff/person";
import type { BatchResult, ColumnMapping, DateFormat, ImportField, RowError, RowResult, ValidationContext } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164 = /^\+[1-9]\d{6,14}$/;

/** Parse a cell into YYYY-MM-DD using the chosen format; ISO input always passes through. */
export function parseDate(value: string, format: DateFormat): string | null {
  const v = value.trim();
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(v)) {
    const [y, m, d] = v.split("-");
    return finish(y, m, d);
  }
  const parts = v.split(/[/.\-]/);
  if (parts.length !== 3) return null;
  const [a, b, c] = parts;
  if (format === "YYYY-MM-DD") return finish(a, b, c);
  if (format === "MM/DD/YYYY") return finish(c, a, b);
  return finish(c, b, a);
}

function finish(y: string, m: string, d: string): string | null {
  if (!/^\d{4}$/.test(y) || !/^\d{1,2}$/.test(m) || !/^\d{1,2}$/.test(d)) return null;
  const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return isValidISODate(iso) ? iso : null;
}

export function normalizeEnum(value: string): string {
  return value.trim().toLowerCase().replace(/[\s\-]+/g, "_");
}

function validateCell(field: ImportField, raw: string, ctx: ValidationContext): { value: string; error?: string } {
  let value = raw.trim();
  if (value === "" && field.defaultValue !== undefined) value = field.defaultValue;
  if (value === "") {
    return field.required ? { value, error: `${field.label} is required` } : { value };
  }
  switch (field.type) {
    case "email": {
      const v = value.toLowerCase();
      return EMAIL.test(v) ? { value: v } : { value: v, error: "Enter a valid email address" };
    }
    case "phone": {
      if (ctx.country) {
        const normalised = normalizeToE164(value, ctx.country);
        return normalised ? { value: normalised } : { value, error: phoneErrorMessage(ctx.country) };
      }
      const v = value.replace(/[\s()-]/g, "");
      return E164.test(v) ? { value: v } : { value: v, error: "Use international format, e.g. +2348031234567" };
    }
    case "date": {
      const iso = parseDate(value, ctx.dateFormat);
      return iso ? { value: iso } : { value, error: `Use the format ${ctx.dateFormat}` };
    }
    case "enum": {
      const v = normalizeEnum(value);
      return field.enumValues?.includes(v)
        ? { value: v }
        : { value: v, error: `Must be one of: ${(field.enumValues ?? []).join(", ")}` };
    }
    case "number": {
      const n = Number(value);
      if (!Number.isFinite(n)) return { value, error: "Must be a number" };
      if (field.integer && !Number.isInteger(n)) return { value, error: "Use a whole number" };
      if (field.min !== undefined && n < field.min) return { value, error: `Must be at least ${field.min}` };
      if (field.max !== undefined && n > field.max) return { value, error: `Must be at most ${field.max}` };
      return { value: String(n) };
    }
    default:
      return { value };
  }
}

export function validateRows(
  rows: readonly Record<string, string>[],
  mapping: ColumnMapping,
  fields: readonly ImportField[],
  ctx: ValidationContext
): BatchResult {
  const columnFor = new Map<string, string>();
  for (const [column, key] of Object.entries(mapping)) if (key && !columnFor.has(key)) columnFor.set(key, column);

  const unmappedRequired = fields.filter((f) => f.required && !columnFor.has(f.key)).map((f) => f.key);
  const seen = new Map<string, Map<string, number>>();
  for (const f of fields) if (f.unique) seen.set(f.key, new Map());

  // Values this file itself provides for referenced fields (e.g. a manager
  // created a few rows up), so a reference is not flagged as unknown.
  const fieldByKey = new Map(fields.map((f) => [f.key, f]));
  const inFile = new Map<string, Set<string>>();
  for (const f of fields) {
    if (!f.mustExistIn || inFile.has(f.mustExistIn)) continue;
    const target = fieldByKey.get(f.mustExistIn);
    const column = columnFor.get(f.mustExistIn);
    const values = new Set<string>();
    if (target && column) {
      for (const row of rows) {
        const v = (row[column] ?? "").trim();
        if (v) values.add(target.type === "email" ? v.toLowerCase() : v);
      }
    }
    inFile.set(f.mustExistIn, values);
  }

  const results: RowResult[] = rows.map((row, index) => {
    const errors: RowError[] = unmappedRequired.map((key) => ({ field: key, message: "Column not mapped" }));
    const warnings: RowError[] = [];
    const normalized: Record<string, string> = {};
    let match: RowResult["match"] = "new";
    let matchedOn: string | undefined;

    for (const f of fields) {
      const column = columnFor.get(f.key);
      const raw = column ? (row[column] ?? "") : "";
      const { value, error } = validateCell(f, raw, ctx);
      normalized[f.key] = value;
      if (error) {
        if (!unmappedRequired.includes(f.key)) errors.push({ field: f.key, message: error });
        continue;
      }
      if (f.mustExistIn && value !== "" && !ctx.existing?.[f.mustExistIn]?.has(value) && !inFile.get(f.mustExistIn)?.has(value)) {
        warnings.push({ field: f.key, message: `No staff member with ${f.mustExistIn.replace(/_/g, " ")} "${value}"; left blank` });
      }
      if (f.unique && value !== "") {
        const bucket = seen.get(f.key)!;
        const firstRow = bucket.get(value);
        if (firstRow !== undefined) {
          errors.push({ field: f.key, message: `Duplicate ${f.label.toLowerCase()} in file (also on row ${firstRow + 1})` });
        } else {
          bucket.set(value, index);
        }
        if (ctx.existing?.[f.key]?.has(value) && match === "new") {
          match = "existing";
          matchedOn = f.key;
        }
      }
    }
    for (const group of ctx.requireOneOf ?? []) {
      if (!group.some((k) => normalized[k])) {
        const labels = group.map((k) => fieldByKey.get(k)?.label ?? k).join(" or ");
        errors.push({ field: group[0], message: `Give at least one of: ${labels}` });
      }
    }
    // Cross-field rules only once the cells themselves are sound, so a rule
    // never repeats a field-level error.
    if (errors.length === 0 && ctx.rowRules) errors.push(...ctx.rowRules(normalized));
    return { index, valid: errors.length === 0, errors, warnings, normalized, match, matchedOn };
  });

  const valid = results.filter((r) => r.valid);
  const summary = {
    total: results.length,
    valid: valid.length,
    invalid: results.length - valid.length,
    create: valid.filter((r) => r.match === "new").length,
    update: valid.filter((r) => r.match === "existing").length,
  };
  return { rows: results, validCount: summary.valid, invalidCount: summary.invalid, summary, unmappedRequired };
}

/** Create-only mode: rows matching an existing record become errors instead of updates. */
export function withCreateOnly(result: BatchResult): BatchResult {
  const rows = result.rows.map((r) => {
    if (!r.valid || r.match !== "existing") return r;
    return { ...r, valid: false, errors: [{ field: r.matchedOn ?? "email", message: "Already exists; switch to create and update to change it" }] };
  });
  const valid = rows.filter((r) => r.valid);
  const summary = { total: rows.length, valid: valid.length, invalid: rows.length - valid.length, create: valid.length, update: 0 };
  return { ...result, rows, validCount: summary.valid, invalidCount: summary.invalid, summary };
}
