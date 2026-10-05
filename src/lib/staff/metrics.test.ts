import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import {
  averageTenureYears,
  headcountOn,
  headcountSeries,
  isOnBooksOn,
  newHiresBetween,
  rangeWindow,
  seriesDates,
  tenureYears,
  totalFte,
} from "./metrics";

const TODAY = "2026-10-04";

describe("isOnBooksOn", () => {
  it("counts people hired on or before the date who have not exited", () => {
    expect(isOnBooksOn(makeStaff({ hireDate: "2026-10-04" }), TODAY)).toBe(true);
    expect(isOnBooksOn(makeStaff({ hireDate: "2026-10-05", employmentStatus: "onboarding" }), TODAY)).toBe(false);
    expect(isOnBooksOn(makeStaff({ hireDate: "2020-01-01", exitDate: "2026-10-04", employmentStatus: "inactive" }), TODAY)).toBe(false);
    expect(isOnBooksOn(makeStaff({ hireDate: "2020-01-01", exitDate: "2026-10-05", employmentStatus: "inactive" }), TODAY)).toBe(true);
  });
  it("treats inactive without an exit date as off the books", () => {
    expect(isOnBooksOn(makeStaff({ employmentStatus: "inactive", exitDate: null }), TODAY)).toBe(false);
  });
  it("keeps suspended staff on the books", () => {
    expect(isOnBooksOn(makeStaff({ employmentStatus: "suspended" }), TODAY)).toBe(true);
  });
  it("takes a lapsed contract off the books even without an exit event", () => {
    expect(isOnBooksOn(makeStaff({ contractLapsed: true }), TODAY)).toBe(false);
  });
});

describe("headcountOn / newHiresBetween", () => {
  const staff = [
    makeStaff({ hireDate: "2019-01-01" }),
    makeStaff({ hireDate: "2026-09-20" }),
    makeStaff({ hireDate: "2026-10-01" }),
    makeStaff({ hireDate: "2026-11-01", employmentStatus: "onboarding" }),
    makeStaff({ hireDate: "2015-01-01", exitDate: "2026-06-30", employmentStatus: "inactive" }),
  ];
  it("headcount excludes future hires and leavers", () => {
    expect(headcountOn(staff, TODAY)).toBe(3);
    expect(headcountOn(staff, "2026-06-01")).toBe(2);
  });
  it("new hires are inclusive of both bounds", () => {
    expect(newHiresBetween(staff, "2026-09-20", "2026-10-01")).toBe(2);
    expect(newHiresBetween(staff, "2026-09-21", "2026-09-30")).toBe(0);
  });
});

describe("malformed hire dates", () => {
  it("count as zero tenure and are not on the books", () => {
    expect(tenureYears("bad", TODAY)).toBe(0);
    expect(isOnBooksOn(makeStaff({ hireDate: "2026-13-01" }), TODAY)).toBe(false);
    expect(averageTenureYears([makeStaff({ hireDate: "nope" })], TODAY)).toBe(0);
  });
});

describe("tenure and FTE", () => {
  it("computes tenure in years with a quarter-day leap allowance", () => {
    expect(tenureYears("2016-10-04", TODAY)).toBeCloseTo(10, 1);
  });
  it("averages tenure over staff on the books only", () => {
    const staff = [
      makeStaff({ hireDate: "2016-10-04" }),
      makeStaff({ hireDate: "2024-10-04" }),
      makeStaff({ hireDate: "2027-01-01", employmentStatus: "onboarding" }),
    ];
    expect(averageTenureYears(staff, TODAY)).toBeCloseTo(6, 1);
    expect(averageTenureYears([], TODAY)).toBe(0);
  });
  it("sums FTE as a fraction of full time", () => {
    const staff = [
      makeStaff({ ftePercent: 100 }),
      makeStaff({ ftePercent: 60 }),
      makeStaff({ ftePercent: 50, hireDate: "2027-01-01", employmentStatus: "onboarding" }),
    ];
    expect(totalFte(staff, TODAY)).toBeCloseTo(1.6);
  });
});

describe("rangeWindow", () => {
  it("builds current and previous windows of equal length", () => {
    expect(rangeWindow("7d", TODAY)).toEqual({
      from: "2026-09-28",
      to: "2026-10-04",
      prevFrom: "2026-09-21",
      prevTo: "2026-09-27",
    });
    expect(rangeWindow("30d", TODAY).from).toBe("2026-09-05");
    expect(rangeWindow("90d", TODAY).from).toBe("2026-07-07");
  });
  it("ignores a malformed term start instead of throwing", () => {
    expect(rangeWindow("term", TODAY, { termStart: "Sept 2026" }).from).toBe("2026-07-07");
  });

  it("uses the term start when given", () => {
    const w = rangeWindow("term", TODAY, { termStart: "2026-09-07" });
    expect(w.from).toBe("2026-09-07");
    expect(w.to).toBe(TODAY);
    expect(diff(w.prevFrom, w.prevTo)).toBe(diff(w.from, w.to));
  });
});

describe("seriesDates", () => {
  it("steps by the granularity and always ends on the last date", () => {
    expect(seriesDates("2026-10-01", "2026-10-04", "daily")).toEqual([
      "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04",
    ]);
    expect(seriesDates("2026-09-01", "2026-10-04", "weekly")).toEqual([
      "2026-09-01", "2026-09-08", "2026-09-15", "2026-09-22", "2026-09-29", "2026-10-04",
    ]);
    expect(seriesDates("2026-06-15", "2026-10-04", "monthly")).toEqual([
      "2026-06-15", "2026-07-15", "2026-08-15", "2026-09-15", "2026-10-04",
    ]);
  });
});

describe("headcountSeries", () => {
  it("evaluates headcount at each series date", () => {
    const staff = [makeStaff({ hireDate: "2026-10-02" }), makeStaff({ hireDate: "2020-01-01" })];
    expect(headcountSeries(staff, ["2026-10-01", "2026-10-02", "2026-10-03"])).toEqual([
      { date: "2026-10-01", value: 1 },
      { date: "2026-10-02", value: 2 },
      { date: "2026-10-03", value: 2 },
    ]);
  });
});

function diff(a: string, b: string): number {
  return (Date.parse(b) - Date.parse(a)) / 86_400_000;
}
