import { describe, expect, it } from "vitest";
import { makeCheck, makeRegistration, makeStaff } from "@/test/factories/staff";
import { buildDirectoryRows } from "./rows";

const TODAY = "2026-10-04";

describe("buildDirectoryRows", () => {
  it("attaches credential health, away flag and manager name to each person", () => {
    const boss = makeStaff({ id: "boss", firstName: "Grace", lastName: "Hopper" });
    const ada = makeStaff({ id: "ada", reportsToId: "boss" });
    const ben = makeStaff({ id: "ben", reportsToId: "missing" });
    const items = { registrations: [makeRegistration({ staffId: "ada", expiryDate: "2026-10-10" })], checks: [makeCheck({ staffId: "boss", outcome: "pending" })], training: [] };
    const leave = [{ staffId: "ben", startDate: "2026-10-04", endDate: "2026-10-04", status: "approved" }];

    const rows = buildDirectoryRows([boss, ada, ben], items, leave, TODAY);
    const byId = Object.fromEntries(rows.map((r) => [r.id, r]));

    expect(byId.ada).toMatchObject({ health: "expiring", awayToday: false, managerName: "Grace Hopper" });
    expect(byId.ben).toMatchObject({ health: "none", awayToday: true, managerName: null });
    expect(byId.boss).toMatchObject({ health: "unknown", awayToday: false, managerName: null });
    expect(rows).toHaveLength(3);
  });
});
