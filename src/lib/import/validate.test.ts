import { describe, expect, it } from "vitest";
import type { ImportField } from "./types";
import { parseDate, validateRows } from "./validate";

const fields: ImportField[] = [
  { key: "first_name", label: "First name", required: true, type: "text", aliases: [] },
  { key: "email", label: "Email", required: true, type: "email", aliases: [], unique: true },
  { key: "employee_number", label: "Employee number", required: false, type: "text", aliases: [], unique: true },
  { key: "hire_date", label: "Hire date", required: true, type: "date", aliases: [] },
  { key: "employment_type", label: "Employment type", required: false, type: "enum", aliases: [], enumValues: ["full_time", "part_time"], defaultValue: "full_time" },
  { key: "fte_percent", label: "FTE", required: false, type: "number", aliases: [], min: 1, max: 100 },
];
const mapping = { Name: "first_name", Mail: "email", No: "employee_number", Joined: "hire_date", Type: "employment_type", FTE: "fte_percent" };
const base = { Name: "Ada", Mail: "ADA@x.test", No: "", Joined: "01/09/2026", Type: "", FTE: "" };

describe("parseDate", () => {
  it("parses the configured format into ISO and passes ISO through", () => {
    expect(parseDate("01/09/2026", "DD/MM/YYYY")).toBe("2026-09-01");
    expect(parseDate("09/01/2026", "MM/DD/YYYY")).toBe("2026-09-01");
    expect(parseDate("2026-09-01", "DD/MM/YYYY")).toBe("2026-09-01");
    expect(parseDate("1/9/2026", "DD/MM/YYYY")).toBe("2026-09-01");
    expect(parseDate("31/02/2026", "DD/MM/YYYY")).toBeNull();
    expect(parseDate("soon", "DD/MM/YYYY")).toBeNull();
  });
});

describe("validateRows", () => {
  const ctx = { dateFormat: "DD/MM/YYYY" as const, existing: { email: new Set(["ben@x.test"]), employee_number: new Set(["EMP-9"]) } };

  it("normalises a valid row: trims, lower-cases email, ISO dates, enum defaults", () => {
    const r = validateRows([base], mapping, fields, ctx);
    expect(r.validCount).toBe(1);
    expect(r.rows[0]).toMatchObject({ valid: true, match: "new" });
    expect(r.rows[0].normalized).toEqual({ first_name: "Ada", email: "ada@x.test", employee_number: "", hire_date: "2026-09-01", employment_type: "full_time", fte_percent: "" });
  });

  it("flags required, format, enum and range errors per field", () => {
    const r = validateRows([{ ...base, Name: " ", Mail: "nope", Joined: "yesterday", Type: "Freelance", FTE: "150" }], mapping, fields, ctx);
    expect(r.rows[0].valid).toBe(false);
    expect(r.rows[0].errors.map((e) => e.field).sort()).toEqual(["email", "employment_type", "first_name", "fte_percent", "hire_date"]);
  });

  it("accepts enum values case-insensitively with spaces", () => {
    const r = validateRows([{ ...base, Type: "Part Time" }], mapping, fields, ctx);
    expect(r.rows[0].normalized.employment_type).toBe("part_time");
  });

  it("detects duplicates inside the file and matches existing records for upsert", () => {
    const rows = [base, { ...base, Name: "Ada2" }, { ...base, Mail: "ben@x.test" }, { ...base, Mail: "c@x.test", No: "EMP-9" }];
    const r = validateRows(rows, mapping, fields, ctx);
    expect(r.rows[1].errors[0]).toMatchObject({ field: "email", message: expect.stringMatching(/duplicate/i) });
    expect(r.rows[2]).toMatchObject({ valid: true, match: "existing" });
    expect(r.rows[3]).toMatchObject({ valid: true, match: "existing" });
    expect(r.summary).toEqual({ total: 4, valid: 3, invalid: 1, create: 1, update: 2 });
  });

  it("reports an unmapped required field once, at batch level", () => {
    const r = validateRows([base], { ...mapping, Joined: "" }, fields, ctx);
    expect(r.unmappedRequired).toEqual(["hire_date"]);
    expect(r.rows[0].valid).toBe(false);
  });
});

describe("reference warnings", () => {
  it("warns, without failing the row, when a reference value is unknown", () => {
    const withRef: ImportField[] = [
      ...fields,
      { key: "reports_to_email", label: "Reports to", required: false, type: "email", aliases: [], mustExistIn: "email" },
    ];
    const ctx = { dateFormat: "DD/MM/YYYY" as const, existing: { email: new Set(["boss@x.test"]) } };
    const r = validateRows([{ ...base, Boss: "nobody@x.test" }, { ...base, Boss: "boss@x.test" }], { ...mapping, Boss: "reports_to_email" }, withRef, ctx);
    expect(r.rows[0].valid).toBe(true);
    expect(r.rows[0].warnings).toEqual([{ field: "reports_to_email", message: expect.stringMatching(/no staff member with/i) }]);
    expect(r.rows[1].warnings).toEqual([]);
  });

  it("does not warn when the referenced value is created by another row in the same file", () => {
    const withRef: ImportField[] = [
      ...fields,
      { key: "reports_to_email", label: "Reports to", required: false, type: "email", aliases: [], mustExistIn: "email" },
    ];
    const ctx = { dateFormat: "DD/MM/YYYY" as const, existing: { email: new Set<string>() } };
    const r = validateRows([{ ...base, Mail: "boss@x.test", Boss: "" }, { ...base, Mail: "new@x.test", Boss: "BOSS@x.test" }], { ...mapping, Boss: "reports_to_email" }, withRef, ctx);
    expect(r.rows[1].warnings).toEqual([]);
  });
});

describe("requireOneOf", () => {
  it("fails a row that has none of the keys in a group", () => {
    const f: ImportField[] = [
      { key: "email", label: "Email", required: false, type: "email", aliases: [] },
      { key: "phone", label: "Phone", required: false, type: "phone", aliases: [] },
    ];
    const ctx = { dateFormat: "DD/MM/YYYY" as const, requireOneOf: [["email", "phone"]] };
    expect(validateRows([{ e: "", p: "" }], { e: "email", p: "phone" }, f, ctx).rows[0].errors[0]).toMatchObject({ field: "email", message: expect.stringMatching(/email or phone/i) });
    expect(validateRows([{ e: "", p: "+2348030000000" }], { e: "email", p: "phone" }, f, ctx).rows[0].valid).toBe(true);
  });
});

describe("phones with a country", () => {
  const f: ImportField[] = [{ key: "phone", label: "Phone", required: false, type: "phone", aliases: [] }];
  it("normalises national numbers to E.164 for the school's country", () => {
    const r = validateRows([{ p: "0803 123 4567" }, { p: "+44 7700 900123" }, { p: "call me" }], { p: "phone" }, f, { dateFormat: "DD/MM/YYYY", country: "NG" });
    expect(r.rows[0].normalized.phone).toBe("+2348031234567");
    expect(r.rows[1].normalized.phone).toBe("+447700900123");
    expect(r.rows[2].errors[0]).toMatchObject({ field: "phone", message: expect.stringMatching(/valid phone/i) });
  });
  it("falls back to international-only when no country is given", () => {
    const r = validateRows([{ p: "0803 123 4567" }], { p: "phone" }, f, { dateFormat: "DD/MM/YYYY" });
    expect(r.rows[0].errors[0].message).toMatch(/international format/i);
  });
});

describe("row rules and whole numbers", () => {
  it("runs cross-field row rules after the cells validate and attaches their errors", () => {
    const rowRules = (n: Record<string, string>) => (n.employment_type === "part_time" && !n.fte_percent ? [{ field: "fte_percent", message: "Part-time staff need an FTE" }] : []);
    const r = validateRows([{ ...base, Type: "part_time" }, { ...base, Mail: "b@x.test", Type: "part_time", FTE: "50" }], mapping, fields, { dateFormat: "DD/MM/YYYY", rowRules });
    expect(r.rows[0]).toMatchObject({ valid: false, errors: [{ field: "fte_percent", message: "Part-time staff need an FTE" }] });
    expect(r.rows[1].valid).toBe(true);
  });
  it("rejects decimals for integer number fields", () => {
    const f: ImportField[] = [{ key: "fte_percent", label: "FTE", required: false, type: "number", aliases: [], min: 1, max: 100, integer: true }];
    expect(validateRows([{ FTE: "50.5" }], { FTE: "fte_percent" }, f, { dateFormat: "DD/MM/YYYY" }).rows[0].errors[0].message).toMatch(/whole number/i);
    expect(validateRows([{ FTE: "50" }], { FTE: "fte_percent" }, f, { dateFormat: "DD/MM/YYYY" }).rows[0].valid).toBe(true);
  });
});

describe("conflicting identifiers and parse errors", () => {
  it("rejects a row whose unique fields resolve to different existing people", () => {
    const ctx = {
      dateFormat: "DD/MM/YYYY" as const,
      existing: { email: new Set(["ben@x.test"]), employee_number: new Set(["EMP-9"]) },
      existingIds: { email: new Map([["ben@x.test", "stf_1"]]), employee_number: new Map([["EMP-9", "stf_2"]]) },
    };
    const conflict = validateRows([{ ...base, Mail: "ben@x.test", No: "EMP-9" }], mapping, fields, ctx);
    expect(conflict.rows[0].valid).toBe(false);
    expect(conflict.rows[0].errors[0]).toMatchObject({ field: "employee_number", message: expect.stringMatching(/different person/i) });
    const single = validateRows([{ ...base, Mail: "other@x.test", No: "EMP-9" }], mapping, fields, ctx);
    expect(single.rows[0]).toMatchObject({ valid: true, match: "existing", matchedOn: "employee_number" });
  });
  it("fails rows the parser flagged, with the parser's message", () => {
    const r = validateRows([base, { ...base, Mail: "b@x.test" }], mapping, fields, { dateFormat: "DD/MM/YYYY", rowErrors: new Map([[1, "Row has more values than columns"]]) });
    expect(r.rows[0].valid).toBe(true);
    expect(r.rows[1].errors).toEqual([{ field: "_row", message: "Row has more values than columns" }]);
  });
  it("does not let an invalid row satisfy a same-file reference", () => {
    const withRef: ImportField[] = [...fields, { key: "reports_to_email", label: "Reports to", required: false, type: "email", aliases: [], mustExistIn: "email" }];
    const ctx = { dateFormat: "DD/MM/YYYY" as const, existing: { email: new Set<string>() } };
    const r = validateRows([{ ...base, Mail: "boss@x.test", Joined: "nope", Boss: "" }, { ...base, Mail: "new@x.test", Boss: "boss@x.test" }], { ...mapping, Boss: "reports_to_email" }, withRef, ctx);
    expect(r.rows[1].warnings).toHaveLength(1);
  });
});

describe("create-only mode", () => {
  it("turns existing matches into errors, blames the matching field and recounts", () => {
    const ctx = { dateFormat: "DD/MM/YYYY" as const, existing: { email: new Set(["ben@x.test"]), employee_number: new Set(["EMP-9"]) } };
    const upsert = validateRows([base, { ...base, Mail: "ben@x.test" }], mapping, fields, ctx);
    expect(upsert.summary.update).toBe(1);
    const c = validateRows([base, { ...base, Mail: "ben@x.test" }, { ...base, Mail: "c@x.test", No: "EMP-9" }], mapping, fields, { ...ctx, createOnly: true });
    expect(c.summary).toEqual({ total: 3, valid: 1, invalid: 2, create: 1, update: 0 });
    expect(c.rows[1].errors[0]).toMatchObject({ field: "email", message: expect.stringMatching(/already exists/i) });
    expect(c.rows[2].errors[0].field).toBe("employee_number");
  });
  it("recomputes same-file references, so a row rejected in create-only mode no longer satisfies one", () => {
    const withRef: ImportField[] = [...fields, { key: "reports_to_email", label: "Reports to", required: false, type: "email", aliases: [], mustExistIn: "email" }];
    // The manager row updates an existing person (matched by number) and gives them a new email.
    const ctx = { dateFormat: "DD/MM/YYYY" as const, existing: { email: new Set<string>(), employee_number: new Set(["EMP-9"]) } };
    const rows = [{ ...base, Mail: "boss.new@x.test", No: "EMP-9", Boss: "" }, { ...base, Mail: "new@x.test", Boss: "boss.new@x.test" }];
    expect(validateRows(rows, { ...mapping, Boss: "reports_to_email" }, withRef, ctx).rows[1].warnings).toEqual([]);
    expect(validateRows(rows, { ...mapping, Boss: "reports_to_email" }, withRef, { ...ctx, createOnly: true }).rows[1].warnings).toHaveLength(1);
  });
});

describe("row rules receive the match", () => {
  it("passes the matched record id so a rule can compare against it", () => {
    const seen: (string | undefined)[] = [];
    const ctx = {
      dateFormat: "DD/MM/YYYY" as const,
      existing: { email: new Set(["ben@x.test"]) },
      existingIds: { email: new Map([["ben@x.test", "stf_1"]]) },
      rowRules: (_n: Record<string, string>, meta: { matchedId?: string }) => {
        seen.push(meta.matchedId);
        return [];
      },
    };
    validateRows([base, { ...base, Mail: "ben@x.test" }], mapping, fields, ctx);
    expect(seen).toEqual([undefined, "stf_1"]);
  });
});
