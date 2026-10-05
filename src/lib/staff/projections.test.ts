import { describe, expect, it } from "vitest";
import { makeContract, makeEvent, makeRole } from "@/test/factories/staff";
import { currentContractOn, employmentStatusOn, exitOf, primaryRoleOn, projectEmployment } from "./projections";

const TODAY = "2026-10-04";

describe("currentContractOn / primaryRoleOn", () => {
  const old = makeContract({ id: "c1", startDate: "2018-01-01", endDate: "2020-08-31", roles: [makeRole({ contractId: "c1", designation: "Teacher" })] });
  const now = makeContract({
    id: "c2",
    startDate: "2020-09-01",
    roles: [
      makeRole({ contractId: "c2", designation: "Teacher", department: "Science", isPrimary: true }),
      makeRole({ contractId: "c2", designation: "Head of Department", roleKind: "responsibility", isPrimary: false, allowanceCode: "HOD" }),
      makeRole({ contractId: "c2", designation: "Housemaster", roleKind: "responsibility", isPrimary: false, startDate: "2021-01-01", endDate: "2024-12-31" }),
    ],
  });
  it("picks the contract active on the date and its primary post", () => {
    expect(currentContractOn([old, now], TODAY)?.id).toBe("c2");
    expect(currentContractOn([old, now], "2019-05-05")?.id).toBe("c1");
    expect(primaryRoleOn(now, TODAY)?.designation).toBe("Teacher");
  });
  it("returns null before the first contract or after the last ended", () => {
    expect(currentContractOn([old], "2017-01-01")).toBeNull();
    expect(currentContractOn([old], TODAY)).toBeNull();
  });
});

describe("employmentStatusOn / exitOf", () => {
  it("is onboarding before the hire date and active from it", () => {
    const events = [makeEvent({ type: "hire", effectiveDate: "2026-11-01" })];
    expect(employmentStatusOn(events, TODAY)).toBe("onboarding");
    expect(employmentStatusOn(events, "2026-11-01")).toBe("active");
  });
  it("is suspended inside a suspension window and active again after reinstatement", () => {
    const events = [
      makeEvent({ type: "hire", effectiveDate: "2020-09-01" }),
      makeEvent({ type: "suspension", effectiveDate: "2026-10-01", endDate: "2026-10-10", reason: "Investigation" }),
    ];
    expect(employmentStatusOn(events, TODAY)).toBe("suspended");
    expect(employmentStatusOn(events, "2026-10-11")).toBe("active");
    const reinstated = [...events, makeEvent({ type: "reinstatement", effectiveDate: "2026-10-05" })];
    expect(employmentStatusOn(reinstated, "2026-10-06")).toBe("active");
  });
  it("is inactive from the exit date and exposes the reason", () => {
    const events = [
      makeEvent({ type: "hire", effectiveDate: "2020-09-01" }),
      makeEvent({ type: "exit", effectiveDate: "2026-09-30", reason: "resignation", eligibleForRehire: true }),
    ];
    expect(employmentStatusOn(events, "2026-09-29")).toBe("active");
    expect(employmentStatusOn(events, TODAY)).toBe("inactive");
    expect(exitOf(events)).toMatchObject({ date: "2026-09-30", reason: "resignation", eligibleForRehire: true });
  });
  it("a rehire after an exit reopens employment", () => {
    const events = [
      makeEvent({ type: "hire", effectiveDate: "2015-01-01" }),
      makeEvent({ type: "exit", effectiveDate: "2019-12-31", reason: "resignation" }),
      makeEvent({ type: "rehire", effectiveDate: "2024-09-01" }),
    ];
    expect(employmentStatusOn(events, "2022-01-01")).toBe("inactive");
    expect(employmentStatusOn(events, TODAY)).toBe("active");
    expect(exitOf(events)).toBeNull();
  });
  it("an explicit status_change wins over the derived status", () => {
    const events = [makeEvent({ type: "hire", effectiveDate: "2020-09-01" }), makeEvent({ type: "status_change", effectiveDate: "2026-01-01", outcome: "onboarding" })];
    expect(employmentStatusOn(events, TODAY)).toBe("onboarding");
  });
});

describe("projectEmployment", () => {
  it("builds the read-model projections from contracts and events", () => {
    const contract = makeContract({
      id: "c9",
      employer: "pta",
      contractType: "fixed_term",
      startDate: "2026-01-10",
      endDate: "2026-12-31",
      fte: 0.6,
      isTermTimeOnly: true,
      roles: [makeRole({ contractId: "c9", designation: "French Teacher", department: "Languages", reportsToId: "boss", payStructure: { salaryStructure: "CONPSS", gradeLevel: "GL 08", step: 2, cadre: null, firstAppointmentDate: null, lastPromotionDate: null, retirementRule: "65_or_40" } })],
    });
    const events = [makeEvent({ type: "hire", effectiveDate: "2026-01-10" })];
    expect(projectEmployment([contract], events, TODAY)).toEqual({
      employmentStatus: "active",
      contractLapsed: false,
      hireDate: "2026-01-10",
      exitDate: null,
      exitReason: null,
      designation: "French Teacher",
      department: "Languages",
      reportsToId: "boss",
      ftePercent: 60,
      contractType: "fixed_term",
      employer: "pta",
      isTermTimeOnly: true,
      gradeLevel: "GL 08",
    });
  });
  it("falls back sensibly when there is no active contract", () => {
    const p = projectEmployment([], [], TODAY);
    expect(p).toMatchObject({ designation: "Unassigned", department: "Unassigned", ftePercent: 0, contractType: "temporary", employer: "school", employmentStatus: "onboarding", contractLapsed: false });
  });
  it("sums FTE across contracts active on the date (job share)", () => {
    const a = makeContract({ id: "a", startDate: "2020-01-01", fte: 0.5, roles: [makeRole({ contractId: "a", designation: "Teacher" })] });
    const b = makeContract({ id: "b", startDate: "2022-01-01", fte: 0.4, roles: [makeRole({ contractId: "b", designation: "Bursar", department: "Finance" })] });
    const p = projectEmployment([a, b], [makeEvent({ type: "hire", effectiveDate: "2020-01-01" })], TODAY);
    expect(p.ftePercent).toBe(90);
    expect(p.designation).toBe("Bursar");
  });
  it("flags a lapsed contract when the last contract ended with no exit event", () => {
    const ended = makeContract({ startDate: "2020-01-01", endDate: "2025-12-31", contractType: "fixed_term" });
    const p = projectEmployment([ended], [makeEvent({ type: "hire", effectiveDate: "2020-01-01" })], TODAY);
    expect(p).toMatchObject({ contractLapsed: true, employmentStatus: "active", contractType: "fixed_term" });
    expect(projectEmployment([ended], [makeEvent({ type: "hire", effectiveDate: "2020-01-01" })], "2025-06-01").contractLapsed).toBe(false);
    const exited = [makeEvent({ type: "hire", effectiveDate: "2020-01-01" }), makeEvent({ type: "exit", effectiveDate: "2025-12-31", reason: "end_of_contract" })];
    expect(projectEmployment([ended], exited, TODAY).contractLapsed).toBe(false);
  });
});
