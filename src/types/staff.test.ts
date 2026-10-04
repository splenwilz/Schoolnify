import { describe, expect, it } from "vitest";
import { credentialStatusFor, staffFullName } from "./staff";

describe("credentialStatusFor (toolchain smoke test)", () => {
  it("treats a null expiry as valid", () => {
    expect(credentialStatusFor(null, "2026-10-04")).toBe("valid");
  });
  it("flags a past expiry as expired", () => {
    expect(credentialStatusFor("2026-01-01", "2026-10-04")).toBe("expired");
  });
});

describe("staffFullName", () => {
  it("prefers displayName when set", () => {
    expect(staffFullName({ firstName: "A", lastName: "B", displayName: "Ms B" })).toBe("Ms B");
  });
});
