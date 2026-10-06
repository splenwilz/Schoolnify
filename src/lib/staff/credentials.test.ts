import { describe, expect, it } from "vitest";
import { makeCheck, makeRegistration, makeTraining } from "@/test/factories/staff";
import {
  CREDENTIAL_EXPIRY_WINDOW_DAYS,
  CREDENTIAL_URGENT_DAYS,
  complianceSummary,
  credentialHealth,
  credentialStatus,
  credentialsNeedingAttention,
  daysUntilExpiry,
  expiringItemsOf,
  checkNeedsReview,
} from "./credentials";

const TODAY = "2026-10-04";

describe("defaults", () => {
  it("uses a 60 day window with a 30 day urgent tier", () => {
    expect(CREDENTIAL_EXPIRY_WINDOW_DAYS).toBe(60);
    expect(CREDENTIAL_URGENT_DAYS).toBe(30);
  });
});

describe("daysUntilExpiry / credentialStatus", () => {
  it("derives status from the expiry date only", () => {
    expect(daysUntilExpiry(null, TODAY)).toBeNull();
    expect(credentialStatus(null, TODAY)).toBe("valid");
    expect(credentialStatus("2026-12-04", TODAY)).toBe("valid");
    expect(credentialStatus("2026-12-03", TODAY)).toBe("expiring");
    expect(credentialStatus("2026-10-04", TODAY)).toBe("expiring");
    expect(credentialStatus("2026-10-03", TODAY)).toBe("expired");
    expect(credentialStatus("soon", TODAY)).toBe("unknown");
  });
});

describe("expiringItemsOf", () => {
  it("a check needs review unless its outcome is clear", () => {
    expect(checkNeedsReview(makeCheck({ outcome: "clear" }))).toBe(false);
    expect(checkNeedsReview(makeCheck({ outcome: "pending" }))).toBe(true);
    expect(checkNeedsReview(makeCheck({ outcome: "concern" }))).toBe(true);
  });
  it("flattens registrations, checks and training into one list with a kind", () => {
    const items = expiringItemsOf({
      registrations: [makeRegistration({ id: "r1", expiryDate: "2026-10-10" })],
      checks: [makeCheck({ id: "k1", expiryDate: null })],
      training: [makeTraining({ id: "t1", expiryDate: "2026-01-01" })],
    });
    expect(items.map((i) => `${i.kind}:${i.id}`)).toEqual(["registration:r1", "check:k1", "training:t1"]);
  });
});

describe("credentialHealth / complianceSummary / credentialsNeedingAttention", () => {
  const items = expiringItemsOf({
    registrations: [makeRegistration({ staffId: "a", expiryDate: "2026-10-10" })],
    checks: [makeCheck({ staffId: "b", expiryDate: "2026-01-01" }), makeCheck({ staffId: "c", expiryDate: null, outcome: "pending" }), makeCheck({ staffId: "d", expiryDate: null, outcome: "concern" })],
    training: [makeTraining({ staffId: "c", expiryDate: "bad" })],
  });
  it("reports the worst state", () => {
    expect(credentialHealth([], TODAY)).toBe("none");
    expect(credentialHealth(items.filter((i) => i.staffId === "a"), TODAY)).toBe("expiring");
    expect(credentialHealth(items, TODAY)).toBe("expired");
  });
  it("counts per status; pending and concern check outcomes both need attention", () => {
    expect(complianceSummary(items, TODAY)).toEqual({ total: 5, valid: 0, expiring: 1, expired: 1, unknown: 3, staffWithIssues: 4 });
    expect(credentialHealth(items.filter((i) => i.staffId === "d"), TODAY)).toBe("unknown");
  });
  it("orders attention expired, unknown, expiring", () => {
    expect(credentialsNeedingAttention(items, TODAY).map((a) => a.status)).toEqual(["expired", "unknown", "unknown", "unknown", "expiring"]);
  });
});
