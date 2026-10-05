import { describe, expect, it } from "vitest";
import { buildCsv, escapeCsvCell, parseCsvText } from "./csv";

describe("parseCsvText", () => {
  it("parses headers and rows, trimming whitespace and skipping blank lines", () => {
    const r = parseCsvText(" First Name , Email \nAda, ada@x.test \n\nBen,ben@x.test\n");
    expect(r.headers).toEqual(["First Name", "Email"]);
    expect(r.rows).toEqual([
      { "First Name": "Ada", Email: "ada@x.test" },
      { "First Name": "Ben", Email: "ben@x.test" },
    ]);
    expect(r.errors).toEqual([]);
  });

  it("handles a UTF-8 BOM and quoted commas", () => {
    const r = parseCsvText('﻿name,note\n"Lovelace, Ada","said ""hi"""\n');
    expect(r.headers).toEqual(["name", "note"]);
    expect(r.rows[0]).toEqual({ name: "Lovelace, Ada", note: 'said "hi"' });
  });

  it("reports rows with more cells than headers instead of dropping data silently", () => {
    const r = parseCsvText("a,b\n1,2,3\n4,5\n");
    expect(r.rows).toHaveLength(2);
    expect(r.errors).toEqual([expect.stringMatching(/^row 1 has more values than columns/i)]);
  });

  it("collapses repeated mismatches into one notice and ignores rows past the cap", () => {
    const body = Array.from({ length: 10 }, (_, i) => `n${i},x,extra`).join("\n");
    const r = parseCsvText(`a,b\n${body}`, { maxRows: 6 });
    expect(r.rows).toHaveLength(6);
    expect(r.errors).toHaveLength(2);
    expect(r.errors[0]).toMatch(/^6 rows have more values than columns.*rows 1, 2, 3, 4, 5 and 1 more/i);
    expect(r.errors[1]).toMatch(/first 6 rows/i);
  });

  it("numbers rows by data row, so blank lines do not shift the count", () => {
    const r = parseCsvText("a,b\n\n\n1,2,3\n");
    expect(r.errors).toEqual([expect.stringMatching(/^row 1 has more values/i)]);
  });

  it("stops at the row cap and says so", () => {
    const body = Array.from({ length: 5 }, (_, i) => `n${i}`).join("\n");
    const r = parseCsvText(`name\n${body}`, { maxRows: 3 });
    expect(r.rows).toHaveLength(3);
    expect(r.errors).toEqual([expect.stringMatching(/first 3 rows/i)]);
  });

  it("refuses pasted text above the byte limit before parsing", () => {
    const r = parseCsvText("a\n" + "x".repeat(10), { maxBytes: 8 });
    expect(r.rows).toEqual([]);
    expect(r.errors[0]).toMatch(/larger than/i);
  });

  it("reports an empty file", () => {
    const r = parseCsvText("");
    expect(r.rows).toEqual([]);
    expect(r.errors[0]).toMatch(/no rows/i);
  });
});

describe("escapeCsvCell / buildCsv", () => {
  it("quotes separators and guards formula prefixes", () => {
    expect(escapeCsvCell("a,b")).toBe('"a,b"');
    expect(escapeCsvCell('say "x"')).toBe('"say ""x"""');
    expect(escapeCsvCell("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(escapeCsvCell("+2348031234567")).toBe("'+2348031234567");
    expect(escapeCsvCell(null)).toBe("");
  });
  it("builds a CSV with a BOM for Excel", () => {
    const csv = buildCsv(["a", "b"], [{ a: "1", b: "x,y" }]);
    expect(csv).toBe('﻿a,b\n1,"x,y"');
  });
});
