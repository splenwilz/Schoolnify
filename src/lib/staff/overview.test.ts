import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import { computeOverview, onboardingOn, OVERVIEW_WIDGETS } from "./overview";

const TODAY = "2026-10-04";

describe("onboardingOn", () => {
  it("counts upcoming hires and started-but-not-activated staff on a date", () => {
    const staff = [
      makeStaff({ hireDate: "2026-11-01", employmentStatus: "onboarding" }),
      makeStaff({ hireDate: "2026-09-20", employmentStatus: "onboarding" }),
      makeStaff({ hireDate: "2026-09-20", employmentStatus: "active" }),
      makeStaff({ hireDate: "2020-01-01", employmentStatus: "active" }),
    ];
    expect(onboardingOn(staff, TODAY)).toBe(2);
    // Looking back to 1 Sept, the two 20 Sept hires were upcoming then.
    expect(onboardingOn(staff, "2026-09-01")).toBe(3);
  });
});

describe("computeOverview", () => {
  const staff = [
    makeStaff({ id: "a", hireDate: "2016-10-04", ftePercent: 100 }),
    makeStaff({ id: "b", hireDate: "2026-10-01", ftePercent: 50 }),
    makeStaff({ id: "c", hireDate: "2026-09-25", ftePercent: 100 }),
    makeStaff({ id: "d", hireDate: "2026-12-01", employmentStatus: "onboarding" }),
  ];
  const leave = [{ staffId: "a", startDate: "2026-10-03", endDate: "2026-10-05", status: "approved" }];

  it("derives every widget from data for the current and previous window", () => {
    const result = computeOverview(staff, { today: TODAY, range: "7d", granularity: "daily", absences: leave });
    const byId = Object.fromEntries(result.map((w) => [w.id, w]));

    expect(Object.keys(byId).sort()).toEqual([...OVERVIEW_WIDGETS.map((w) => w.id)].sort());
    expect(byId.headcount).toMatchObject({ value: 3, previous: 2 });
    expect(byId.new_hires).toMatchObject({ value: 1, previous: 1 }); // b in window, c in previous
    expect(byId.away).toMatchObject({ value: 1, previous: 0 });
    expect(byId.onboarding).toMatchObject({ value: 1, previous: 2 }); // d; and b + d before 1 Oct
    expect(byId.fte.value).toBeCloseTo(2.5);
    expect(byId.fte.previous).toBeCloseTo(2);
    expect(byId.avg_tenure.value).toBeCloseTo((10 + 3 / 365.25 + 9 / 365.25) / 3, 2);
  });

  it("gives each widget a sparkline over the series dates and a compare series", () => {
    const result = computeOverview(staff, { today: TODAY, range: "7d", granularity: "daily", absences: leave });
    const headcount = result.find((w) => w.id === "headcount")!;
    expect(headcount.spark.map((p) => p.date)).toEqual([
      "2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04",
    ]);
    expect(headcount.spark.map((p) => p.value)).toEqual([2, 2, 2, 3, 3, 3, 3]);
    expect(headcount.compare).toHaveLength(7);
    expect(headcount.compare.map((p) => p.value)).toEqual([1, 1, 1, 1, 2, 2, 2]); // c joins 25 Sept
  });

  it("accumulates flow metrics per bucket", () => {
    const result = computeOverview(staff, { today: TODAY, range: "30d", granularity: "weekly", absences: [] });
    const hires = result.find((w) => w.id === "new_hires")!;
    expect(hires.spark.reduce((s, p) => s + p.value, 0)).toBe(2); // b and c inside 30 days
  });
});
