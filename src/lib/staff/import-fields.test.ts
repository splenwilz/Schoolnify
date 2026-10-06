import { describe, expect, it } from "vitest";
import { validateRows } from "@/lib/import/validate";
import { STAFF_IMPORT_FIELDS, rowToStaffInput, staffImportRowRules, staffImportTemplate } from "./import-fields";

const TODAY = "2026-10-04";
const ctx = { dateFormat: "DD/MM/YYYY" as const, country: "NG", rowRules: staffImportRowRules(TODAY) };
const mapping = { f: "first_name", l: "last_name", e: "email", p: "phone", d: "designation", c: "category", dep: "department", h: "hire_date", ct: "contract_type", end: "contract_end_date", dob: "date_of_birth", ecn: "emergency_contact_name", ecp: "emergency_contact_phone", ecr: "emergency_contact_relationship" };
const good = { f: "Ada", l: "Lovelace", e: "", p: "0803 123 4567", d: "Teacher", c: "academic", dep: "Maths", h: "2026-09-01", ct: "permanent", end: "", dob: "1990-05-05", ecn: "", ecp: "", ecr: "" };
const errorsOf = (row: Record<string, string>) => validateRows([row], mapping, STAFF_IMPORT_FIELDS, ctx).rows[0].errors.map((e) => e.field);

describe("STAFF_IMPORT_FIELDS", () => {
  it("requires the creation fields; email is optional because many staff only have a phone", () => {
    const required = STAFF_IMPORT_FIELDS.filter((f) => f.required).map((f) => f.key).sort();
    expect(required).toEqual(["category", "department", "designation", "first_name", "hire_date", "last_name"]);
    for (const k of ["title", "date_of_birth", "employer", "contract_type", "contract_end_date", "emergency_contact_name", "emergency_contact_phone", "emergency_contact_relationship", "grade_level", "step", "state_payroll_number"]) {
      expect(STAFF_IMPORT_FIELDS.some((f) => f.key === k)).toBe(true);
    }
    expect(STAFF_IMPORT_FIELDS.find((f) => f.key === "email")?.unique).toBe(true);
    expect(STAFF_IMPORT_FIELDS.find((f) => f.key === "employee_number")?.unique).toBe(true);
    expect(STAFF_IMPORT_FIELDS.find((f) => f.key === "reports_to_email")?.mustExistIn).toBe("email");
  });
  it("has no status column: status is projected from events", () => {
    expect(STAFF_IMPORT_FIELDS.some((f) => f.key === "status")).toBe(false);
  });
  it("only takes whole numbers for FTE and step", () => {
    expect(STAFF_IMPORT_FIELDS.find((f) => f.key === "fte_percent")?.integer).toBe(true);
    expect(STAFF_IMPORT_FIELDS.find((f) => f.key === "step")?.integer).toBe(true);
  });
});

describe("staffImportRowRules: the same rules as the form", () => {
  it("accepts a national phone number and normalises it", () => {
    const r = validateRows([good], mapping, STAFF_IMPORT_FIELDS, ctx).rows[0];
    expect(r.valid).toBe(true);
    expect(r.normalized.phone).toBe("+2348031234567");
  });
  it("needs an email or a phone", () => {
    expect(errorsOf({ ...good, p: "" })).toEqual(["phone"]);
  });
  it("needs an end date for dated contract types, on or after the hire date", () => {
    expect(errorsOf({ ...good, ct: "corps_member" })).toEqual(["contract_end_date"]);
    expect(errorsOf({ ...good, ct: "corps_member", end: "2026-08-31" })).toEqual(["contract_end_date"]);
    expect(errorsOf({ ...good, ct: "corps_member", end: "2027-08-31" })).toEqual([]);
  });
  it("applies the age rule to date of birth", () => {
    expect(errorsOf({ ...good, dob: "2015-01-01" })).toEqual(["date_of_birth"]);
  });
  it("rejects a person reporting to themselves", () => {
    const m = { ...mapping, b: "reports_to_email" };
    const r = validateRows([{ ...good, e: "ada@x.test", b: "ADA@x.test" }], m, STAFF_IMPORT_FIELDS, ctx).rows[0];
    expect(r.errors).toEqual([{ field: "reports_to_email", message: expect.stringMatching(/themselves/i) }]);
  });
  it("rejects self-reporting through an employee-number match with a different or blank email", () => {
    const m = { ...mapping, b: "reports_to_email", n: "employee_number" };
    const resolver = { dateFormat: "DD/MM/YYYY" as const, country: "NG", existing: { email: new Set(["ada@x.test"]), employee_number: new Set(["EMP-1"]) }, existingIds: { email: new Map([["ada@x.test", "stf_1"]]), employee_number: new Map([["EMP-1", "stf_1"]]) }, rowRules: staffImportRowRules(TODAY, { staffIdByEmail: new Map([["ada@x.test", "stf_1"]]) }) };
    const r = validateRows([{ ...good, e: "", n: "EMP-1", b: "ada@x.test" }], m, STAFF_IMPORT_FIELDS, resolver).rows[0];
    expect(r.errors).toEqual([{ field: "reports_to_email", message: expect.stringMatching(/themselves/i) }]);
  });
  it("requires a phone and relationship once an emergency contact is named", () => {
    expect(errorsOf({ ...good, ecn: "Grace" }).sort()).toEqual(["emergency_contact_phone", "emergency_contact_relationship"]);
    expect(errorsOf({ ...good, ecn: "Grace", ecp: "0803 000 0001", ecr: "Sister" })).toEqual([]);
  });
});

describe("rowToStaffInput", () => {
  it("builds person, staff and contract with defaults and resolves reports_to_email", () => {
    const input = rowToStaffInput(
      { first_name: "Ada", last_name: "Lovelace", email: "ada@x.test", phone: "+2348031234567", designation: "Teacher", category: "academic", department: "Maths", hire_date: "2026-09-01", reports_to_email: "boss@x.test", employer: "pta", contract_type: "fixed_term", contract_end_date: "2027-07-31", emergency_contact_name: "Grace", emergency_contact_phone: "+2348030000001", emergency_contact_relationship: "Sister", grade_level: "GL 08", step: "2" },
      { staffIdByEmail: new Map([["boss@x.test", "stf_005"]]) }
    );
    expect(input.person).toMatchObject({ firstName: "Ada", phones: [{ number: "+2348031234567", isPrimary: true }] });
    expect(input.person.emergencyContacts[0]).toMatchObject({ name: "Grace", isPrimary: true });
    expect(input.staff).toMatchObject({ email: "ada@x.test", isTeacher: true, permissionRole: "teacher", employeeNumber: null });
    expect("employmentStatus" in input.staff).toBe(false);
    expect(input.contract.roles[0].payStructure).toMatchObject({ salaryStructure: "custom", retirementRule: "65_or_40" });
    expect(input.contract).toMatchObject({ employer: "pta", contractType: "fixed_term", endDate: "2027-07-31", fte: 1 });
    expect(input.contract.roles[0]).toMatchObject({ designation: "Teacher", department: "Maths", reportsToId: "stf_005", isPrimary: true, payStructure: { gradeLevel: "GL 08", step: 2 } });
  });
  it("support staff default to not teaching, the support role, and may have no email", () => {
    const input = rowToStaffInput({ first_name: "B", last_name: "O", phone: "+2348090000000", designation: "Driver", category: "support", department: "Transport", hire_date: "2026-09-01" }, { staffIdByEmail: new Map() });
    expect(input.staff).toMatchObject({ isTeacher: false, permissionRole: "support", staffCategory: "support", email: null });
    expect(input.contract).toMatchObject({ employer: "school", contractType: "permanent" });
    expect(input.person.emergencyContacts).toEqual([]);
  });
  it("uses the public service pay structure for government payers", () => {
    const input = rowToStaffInput({ first_name: "B", last_name: "O", phone: "+2348090000000", designation: "Teacher", category: "academic", department: "Maths", hire_date: "2026-09-01", employer: "government_board", grade_level: "GL 08", step: "3" }, { staffIdByEmail: new Map() });
    expect(input.contract.roles[0].payStructure).toMatchObject({ salaryStructure: "CONPSS", gradeLevel: "GL 08", step: 3 });
  });
});

describe("staffImportTemplate", () => {
  it("is a CSV whose header row is the field keys", () => {
    const csv = staffImportTemplate();
    expect(csv.split("\n")[0].replace("﻿", "")).toBe(STAFF_IMPORT_FIELDS.map((f) => f.key).join(","));
  });
});
