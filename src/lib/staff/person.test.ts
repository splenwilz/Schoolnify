import { describe, expect, it } from "vitest";
import { makeEmergencyContact } from "@/test/factories/staff";
import { normalizeToE164, phoneErrorMessage, primaryPhone, supportsNationalNumbers, validateEmergencyContacts } from "./person";

describe("normalizeToE164", () => {
  it("passes E.164 through and strips spaces, dashes and brackets", () => {
    expect(normalizeToE164("+234 803 123 4567", "NG")).toBe("+2348031234567");
    expect(normalizeToE164("+44 (0)7700 900123", "GB")).toBe("+447700900123");
  });
  it("accepts an international number typed without the plus", () => {
    expect(normalizeToE164("2348031234567", "NG")).toBe("+2348031234567");
    expect(normalizeToE164("447700900123", "GB")).toBe("+447700900123");
    expect(normalizeToE164("12133734253", "US")).toBe("+12133734253");
  });
  it("converts a national number using the country's dialling code", () => {
    expect(normalizeToE164("0803 123 4567", "NG")).toBe("+2348031234567");
    expect(normalizeToE164("07700 900123", "GB")).toBe("+447700900123");
    expect(normalizeToE164("(213) 373-4253", "US")).toBe("+12133734253");
  });
  it("returns null for anything it cannot make valid", () => {
    expect(normalizeToE164("", "NG")).toBeNull();
    expect(normalizeToE164("12345", "NG")).toBeNull();
    expect(normalizeToE164("+0123456789", "NG")).toBeNull();
    expect(normalizeToE164("call me", "NG")).toBeNull();
  });
});

describe("supportsNationalNumbers / phoneErrorMessage", () => {
  it("knows which countries can take national numbers and says so in the message", () => {
    expect(supportsNationalNumbers("ng")).toBe(true);
    expect(supportsNationalNumbers("FR")).toBe(false);
    expect(phoneErrorMessage("NG")).toMatch(/country code if outside/i);
    expect(phoneErrorMessage("FR")).toMatch(/international format.*FR/i);
    expect(normalizeToE164("0612345678", "FR")).toBeNull();
  });
});

describe("primaryPhone", () => {
  it("prefers the primary mobile, then any primary, then the first number", () => {
    expect(primaryPhone([])).toBeNull();
    expect(primaryPhone([{ type: "home", number: "+1", isPrimary: false, verifiedAt: null }])).toBe("+1");
    expect(primaryPhone([{ type: "home", number: "+1", isPrimary: true, verifiedAt: null }, { type: "mobile", number: "+2", isPrimary: true, verifiedAt: null }])).toBe("+2");
  });
});

describe("validateEmergencyContacts", () => {
  it("requires exactly one primary when any contacts exist", () => {
    expect(validateEmergencyContacts([])).toBeNull();
    expect(validateEmergencyContacts([makeEmergencyContact({ isPrimary: true })])).toBeNull();
    expect(validateEmergencyContacts([{ isPrimary: false }])).toMatch(/one primary/i);
    expect(validateEmergencyContacts([makeEmergencyContact({ isPrimary: true }), makeEmergencyContact({ isPrimary: true })])).toMatch(/only one/i);
  });
});
