import { describe, expect, it } from "vitest";
import { awayStaffIds, isAwayOn } from "./leave";

const approved = { staffId: "a", startDate: "2026-10-01", endDate: "2026-10-05", status: "approved" };

describe("isAwayOn", () => {
  it("is true inside an approved range, inclusive, and for an open-ended approved absence", () => {
    expect(isAwayOn(approved, "2026-10-01")).toBe(true);
    expect(isAwayOn(approved, "2026-10-05")).toBe(true);
    expect(isAwayOn({ ...approved, endDate: null }, "2027-01-01")).toBe(true);
  });
  it("is false outside the range, when not approved, or when cover-only", () => {
    expect(isAwayOn(approved, "2026-09-30")).toBe(false);
    expect(isAwayOn({ ...approved, status: "pending" }, "2026-10-03")).toBe(false);
    expect(isAwayOn({ ...approved, coverOnly: true }, "2026-10-03")).toBe(false);
  });
});

describe("awayStaffIds", () => {
  it("returns the distinct staff away on a date", () => {
    expect([...awayStaffIds([approved, { ...approved, staffId: "b" }, { ...approved, staffId: "c", status: "declined" }], "2026-10-04")].sort()).toEqual(["a", "b"]);
  });
});
