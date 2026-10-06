import { describe, expect, it } from "vitest";
import { makeContract, makeEvent, makeRole, makeStaffDetail } from "@/test/factories/staff";
import { staffDetailToFormInput } from "./form-input";

const TODAY = "2026-10-04";

describe("staffDetailToFormInput", () => {
  it("pre-fills the contract fields from the contract current on the date, not the first hire", () => {
    const d = makeStaffDetail({ hireDate: "2015-01-01" });
    d.contracts = [
      makeContract({ id: "old", startDate: "2015-01-01", endDate: "2019-12-31", fte: 1 }),
      makeContract({ id: "now", startDate: "2024-09-01", endDate: "2027-08-31", contractType: "fixed_term", fte: 0.6, probationEndDate: "2024-12-01" }),
    ];
    d.events = [makeEvent({ type: "hire", effectiveDate: "2015-01-01" }), makeEvent({ type: "exit", effectiveDate: "2019-12-31" }), makeEvent({ type: "rehire", effectiveDate: "2024-09-01" })];
    const input = staffDetailToFormInput(d, TODAY);
    expect(input.hireDate).toBe("2024-09-01");
    expect(input.contractEndDate).toBe("2027-08-31");
    expect(input.probationEndDate).toBe("2024-12-01");
    expect(input.ftePercent).toBe(60);
  });
  it("gives a usable form when the record has no contract", () => {
    const d = makeStaffDetail({ hireDate: "2020-01-01", ftePercent: 0 });
    d.contracts = [];
    const input = staffDetailToFormInput(d, TODAY);
    expect(input.ftePercent).toBe(100);
    expect(input.hireDate).toBe("2020-01-01");
    expect(input.responsibilities).toEqual([]);
  });
  it("keeps ended and future responsibilities on the contract so an unrelated edit cannot drop them", () => {
    const d = makeStaffDetail();
    const c = d.contracts[0];
    c.roles.push(
      makeRole({ contractId: c.id, designation: "Exam Officer", roleKind: "responsibility", isPrimary: false, startDate: "2022-09-01", endDate: "2024-08-31" }),
      makeRole({ contractId: c.id, designation: "Housemaster", roleKind: "responsibility", isPrimary: false, startDate: "2027-01-01", endDate: null })
    );
    const input = staffDetailToFormInput(d, TODAY);
    expect(input.responsibilities.map((r) => r.designation)).toEqual(["Exam Officer", "Housemaster"]);
    expect(input.responsibilities[0].endDate).toBe("2024-08-31");
  });
  it("does not carry a status: it is projected, never edited", () => {
    expect("employmentStatus" in staffDetailToFormInput(makeStaffDetail(), TODAY)).toBe(false);
  });
});
