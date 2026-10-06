import { describe, expect, it } from "vitest";
import { addDays, addMonths, diffDays, formatDate, isValidISODate, toISODate } from "./dates";

describe("isValidISODate", () => {
  it("accepts YYYY-MM-DD", () => expect(isValidISODate("2026-10-04")).toBe(true));
  it("rejects wrong shapes and impossible dates", () => {
    expect(isValidISODate("04/10/2026")).toBe(false);
    expect(isValidISODate("2026-13-01")).toBe(false);
    expect(isValidISODate("2026-02-30")).toBe(false);
    expect(isValidISODate("")).toBe(false);
  });
});

describe("diffDays", () => {
  it("counts whole days from a to b", () => {
    expect(diffDays("2026-10-01", "2026-10-04")).toBe(3);
    expect(diffDays("2026-10-04", "2026-10-01")).toBe(-3);
    expect(diffDays("2026-10-04", "2026-10-04")).toBe(0);
  });
  it("is not affected by daylight-saving transitions", () => {
    expect(diffDays("2026-03-28", "2026-03-30")).toBe(2);
  });
});

describe("addDays / addMonths", () => {
  it("rolls over month and year boundaries", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
  it("clamps month-end when adding months", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2026-10-04", -12)).toBe("2025-10-04");
  });
});

describe("toISODate", () => {
  it("formats a Date as a UTC calendar date", () => {
    expect(toISODate(new Date(Date.UTC(2026, 9, 4, 23, 59))).toString()).toBe("2026-10-04");
  });
});

describe("formatDate", () => {
  it("formats with a fixed month table so server and browser agree", () => {
    expect(formatDate("2026-10-04", "short")).toBe("4 Oct 2026");
    expect(formatDate("2026-09-01", "short")).toBe("1 Sep 2026");
    expect(formatDate("2026-10-04", "long")).toBe("4 October 2026");
    expect(formatDate("2026-10-04", "monthYear")).toBe("Oct 2026");
  });
  it("never throws on bad input; returns a fallback for display", () => {
    expect(formatDate("2026-02-30")).toBe("Unknown date");
    expect(formatDate("soon")).toBe("Unknown date");
    expect(formatDate("", "long")).toBe("Unknown date");
  });
});
