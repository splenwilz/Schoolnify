import { describe, expect, it } from "vitest";
import { staffFormSchemaFor, staffFormDefaults, fieldErrors, toStaffInput } from "./schema";

const staffFormSchema = staffFormSchemaFor({ country: "NG", today: "2026-10-04" });

const valid = {
  title: "",
  firstName: " Ada ",
  middleName: "",
  lastName: "Lovelace",
  preferredName: "",
  email: "ADA@school.test",
  phone: "0803 123 4567",
  gender: "female",
  dateOfBirth: "1990-05-05",
  designation: "Teacher",
  staffCategory: "academic",
  isTeacher: true,
  permissionRole: "teacher",
  department: "Mathematics",
  employer: "school",
  contractType: "permanent",
  ftePercent: 100,
  isTermTimeOnly: false,
  hireDate: "2026-09-01",
  contractEndDate: "",
  probationEndDate: "",
  reportsToId: "",
  gradeLevel: "",
  responsibilities: [],
  emergencyContacts: [{ name: "Grace Hopper", relationship: "Sister", phone: "08030000001", isPrimary: true }],
  employeeNumber: "",
  sendInvite: false,
};

describe("staffFormSchema", () => {
  it("accepts a complete record, trims names, lowercases email and normalises phones to E.164", () => {
    const r = staffFormSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.firstName).toBe("Ada");
    expect(r.data.email).toBe("ada@school.test");
    expect(r.data.phone).toBe("+2348031234567");
    expect(r.data.emergencyContacts[0].phone).toBe("+2348030000001");
    expect(r.data.contractEndDate).toBeNull();
    expect(r.data.reportsToId).toBeNull();
    expect(r.data.middleName).toBeNull();
    expect(r.data.employeeNumber).toBeNull();
    expect(r.data.title).toBeNull();
  });

  it("allows a person with a phone and no email, but not neither", () => {
    expect(staffFormSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    const r = staffFormSchema.safeParse({ ...valid, email: "", phone: "" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).phone).toMatch(/email or a phone/i);
  });

  it("requires an end date for dated contract types", () => {
    const r = staffFormSchema.safeParse({ ...valid, contractType: "corps_member" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).contractEndDate).toMatch(/end date/i);
    expect(staffFormSchema.safeParse({ ...valid, contractType: "corps_member", contractEndDate: "2027-08-31" }).success).toBe(true);
  });

  it("requires one primary emergency contact when any are given and validates each", () => {
    const none = staffFormSchema.safeParse({ ...valid, emergencyContacts: [] });
    expect(none.success).toBe(true);
    const twoPrimary = staffFormSchema.safeParse({ ...valid, emergencyContacts: [...valid.emergencyContacts, { ...valid.emergencyContacts[0], isPrimary: true }] });
    expect(twoPrimary.success).toBe(false);
    const badPhone = staffFormSchema.safeParse({ ...valid, emergencyContacts: [{ ...valid.emergencyContacts[0], phone: "nope" }] });
    expect(badPhone.success).toBe(false);
    if (badPhone.success) return;
    expect(Object.keys(fieldErrors(badPhone.error))[0]).toMatch(/emergencyContacts\.0\.phone/);
  });

  it("accepts dated responsibilities with allowance codes", () => {
    const r = staffFormSchema.safeParse({ ...valid, responsibilities: [{ designation: "Head of Department", department: "Science", allowanceCode: "HOD", startDate: "2026-09-01", endDate: "" }] });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.responsibilities[0]).toMatchObject({ designation: "Head of Department", endDate: null });
    const bad = staffFormSchema.safeParse({ ...valid, responsibilities: [{ designation: "", department: "", allowanceCode: "", startDate: "2026-09-01", endDate: "2026-08-01" }] });
    expect(bad.success).toBe(false);
  });

  it("rejects a date of birth in the future or implying an age under 16", () => {
    expect(staffFormSchema.safeParse({ ...valid, dateOfBirth: "2030-01-01" }).success).toBe(false);
    expect(staffFormSchema.safeParse({ ...valid, dateOfBirth: "2010-10-05" }).success).toBe(false);
    expect(staffFormSchema.safeParse({ ...valid, dateOfBirth: "2010-10-04" }).success).toBe(true);
    expect(staffFormSchema.safeParse({ ...valid, dateOfBirth: "" }).success).toBe(true);
  });

  it("requires names, a valid email, designation, department and hire date", () => {
    const r = staffFormSchema.safeParse({ ...valid, firstName: "  ", email: "nope", designation: "", department: "", hireDate: "" });
    expect(r.success).toBe(false);
    if (r.success) return;
    const errs = fieldErrors(r.error);
    expect(Object.keys(errs).sort()).toEqual(["department", "designation", "email", "firstName", "hireDate"]);
    expect(errs.firstName).toMatch(/required/i);
    expect(errs.email).toMatch(/valid email/i);
  });

  it("rejects malformed dates and a contract end before the hire date", () => {
    expect(staffFormSchema.safeParse({ ...valid, hireDate: "01/09/2026" }).success).toBe(false);
    const r = staffFormSchema.safeParse({ ...valid, contractType: "fixed_term", contractEndDate: "2026-08-31" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).contractEndDate).toMatch(/on or after the hire date/i);
    expect(staffFormSchema.safeParse({ ...valid, contractType: "fixed_term", contractEndDate: "2026-09-01" }).success).toBe(true);
  });

  it("keeps FTE between 1 and 100", () => {
    expect(staffFormSchema.safeParse({ ...valid, ftePercent: 0 }).success).toBe(false);
    expect(staffFormSchema.safeParse({ ...valid, ftePercent: 101 }).success).toBe(false);
    expect(staffFormSchema.safeParse({ ...valid, ftePercent: 60 }).success).toBe(true);
    expect(staffFormSchema.safeParse({ ...valid, ftePercent: undefined }).data?.ftePercent).toBe(100);
  });

  it("requires a teaching-eligible person to be in the academic category", () => {
    const r = staffFormSchema.safeParse({ ...valid, staffCategory: "support", isTeacher: true });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).isTeacher).toMatch(/academic/i);
  });

  it("bounds text lengths to what the API columns accept", () => {
    const long = "x".repeat(300);
    const r = staffFormSchema.safeParse({ ...valid, firstName: long, lastName: long, designation: long, department: long, gradeLevel: long, employeeNumber: long, middleName: long });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(Object.keys(fieldErrors(r.error)).sort()).toEqual(["department", "designation", "employeeNumber", "firstName", "gradeLevel", "lastName", "middleName"]);
    expect(staffFormSchema.safeParse({ ...valid, firstName: "x".repeat(100) }).success).toBe(true);
  });

  it("rejects a phone it cannot normalise", () => {
    const r = staffFormSchema.safeParse({ ...valid, phone: "call me" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).phone).toMatch(/phone/i);
  });

  it("asks for the international format when the school's country has no national rule", () => {
    const fr = staffFormSchemaFor({ country: "FR", today: "2026-10-04" });
    const r = fr.safeParse({ ...valid, phone: "06 12 34 56 78" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error).phone).toMatch(/international format/i);
    const intl = { ...valid, phone: "+33 6 12 34 56 78", emergencyContacts: [{ ...valid.emergencyContacts[0], phone: "+33 6 00 00 00 01" }] };
    expect(fr.safeParse(intl).success).toBe(true);
  });

  it("maps a grade level to the school's own pay structure with the teachers' retirement rule", () => {
    const r = staffFormSchema.safeParse({ ...valid, gradeLevel: "T2" });
    if (!r.success) throw new Error("expected valid");
    expect(toStaffInput(r.data).contract.roles[0].payStructure).toMatchObject({ salaryStructure: "custom", gradeLevel: "T2", retirementRule: "65_or_40" });
    const gov = staffFormSchema.safeParse({ ...valid, gradeLevel: "GL 08", employer: "government_board" });
    if (!gov.success) throw new Error("expected valid");
    expect(toStaffInput(gov.data).contract.roles[0].payStructure?.salaryStructure).toBe("CONPSS");
  });
});

describe("staffFormDefaults / toStaffInput", () => {
  it("provides blank defaults that fail validation until filled", () => {
    const d = staffFormDefaults();
    expect(d.contractType).toBe("permanent");
    expect(d.employer).toBe("school");
    expect(d.ftePercent).toBe(100);
    expect("employmentStatus" in d).toBe(false);
    expect(staffFormSchema.safeParse(d).success).toBe(false);
  });

  it("maps parsed values to a person, a contract with roles, and an invite request", () => {
    const r = staffFormSchema.safeParse({ ...valid, responsibilities: [{ designation: "Exam Officer", department: "", allowanceCode: "EXO", startDate: "2026-09-01", endDate: "" }] });
    if (!r.success) throw new Error("expected valid");
    const input = toStaffInput(r.data);
    expect(input.person).toMatchObject({ firstName: "Ada", lastName: "Lovelace", phones: [{ type: "mobile", number: "+2348031234567", isPrimary: true }] });
    expect(input.person.emergencyContacts[0]).toMatchObject({ name: "Grace Hopper", isPrimary: true });
    expect(input.staff).toMatchObject({ email: "ada@school.test", staffCategory: "academic", isTeacher: true, employeeNumber: null });
    expect("employmentStatus" in input.staff).toBe(false);
    expect(input.contract).toMatchObject({ employer: "school", contractType: "permanent", startDate: "2026-09-01", endDate: null, fte: 1 });
    expect(input.contract.roles.map((x) => `${x.roleKind}:${x.designation}:${x.isPrimary}`)).toEqual(["post:Teacher:true", "responsibility:Exam Officer:false"]);
    expect(input.sendInvite).toBe(false);
  });
});
