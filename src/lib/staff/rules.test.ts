import { describe, expect, it } from "vitest";
import { staffRecordIssues, type StaffRecordLike } from "./rules";

const TODAY = "2026-10-04";
const ok: StaffRecordLike = {
  email: "ada@school.test",
  phone: null,
  hireDate: "2026-09-01",
  contractType: "permanent",
  contractEndDate: null,
  dateOfBirth: "1990-05-05",
  staffCategory: "academic",
  isTeacher: true,
  emergencyContacts: [{ isPrimary: true }],
};
const paths = (v: StaffRecordLike) => staffRecordIssues(v, TODAY).map((i) => i.path);

describe("staffRecordIssues", () => {
  it("passes a complete record", () => {
    expect(staffRecordIssues(ok, TODAY)).toEqual([]);
  });
  it("needs an email or a phone, reported on phone", () => {
    expect(paths({ ...ok, email: null })).toEqual(["phone"]);
    expect(paths({ ...ok, email: null, phone: "+2348031234567" })).toEqual([]);
  });
  it("needs an end date for dated contract types, on or after the hire date", () => {
    expect(paths({ ...ok, contractType: "corps_member" })).toEqual(["contractEndDate"]);
    expect(paths({ ...ok, contractType: "corps_member", contractEndDate: "2026-08-31" })).toEqual(["contractEndDate"]);
    expect(paths({ ...ok, contractType: "corps_member", contractEndDate: "2027-08-31" })).toEqual([]);
  });
  it("ignores the end date rule when the hire date is not a valid date", () => {
    expect(paths({ ...ok, hireDate: "soon", contractEndDate: "2020-01-01" })).toEqual([]);
  });
  it("rejects a future date of birth or an age under 16, and ignores an invalid one", () => {
    expect(paths({ ...ok, dateOfBirth: "2030-01-01" })).toEqual(["dateOfBirth"]);
    expect(paths({ ...ok, dateOfBirth: "2010-10-05" })).toEqual(["dateOfBirth"]);
    expect(paths({ ...ok, dateOfBirth: "2010-10-04" })).toEqual([]);
    expect(paths({ ...ok, dateOfBirth: "yesterday" })).toEqual([]);
  });
  it("only academic staff can be marked as teachers", () => {
    expect(paths({ ...ok, staffCategory: "support" })).toEqual(["isTeacher"]);
  });
  it("requires exactly one primary emergency contact when any are given", () => {
    expect(paths({ ...ok, emergencyContacts: [] })).toEqual([]);
    expect(paths({ ...ok, emergencyContacts: [{ isPrimary: false }] })).toEqual(["emergencyContacts"]);
    expect(paths({ ...ok, emergencyContacts: [{ isPrimary: true }, { isPrimary: true }] })).toEqual(["emergencyContacts"]);
  });
});
