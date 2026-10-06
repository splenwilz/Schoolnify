import { describe, expect, it } from "vitest";
import { parseStoredRules, parseStoredSections, resolveTemplateId } from "./school-config-context";

describe("stored class-naming settings are validated before use", () => {
  it("falls back when the template id is unknown", () => {
    expect(resolveTemplateId("nigerian")).toBe("nigerian");
    expect(resolveTemplateId("martian")).toBe("american");
    expect(resolveTemplateId(null)).toBe("american");
  });
  it("accepts an array of complete level rules, including an empty one", () => {
    const good = JSON.stringify([{ minLevel: 1, maxLevel: 6, prefix: "Primary", levelOffset: 0 }]);
    expect(parseStoredRules(good)).toHaveLength(1);
    expect(parseStoredRules("[]")).toEqual([]);
    for (const bad of ["{}", "[1,2]", '[{"minLevel":"1"}]', "not json", "null"]) {
      expect(parseStoredRules(bad)).toEqual(parseStoredRules(null));
    }
    expect(parseStoredRules(null).length).toBeGreaterThan(0);
  });
  it("accepts an array of non-empty strings for sections, including an empty one", () => {
    expect(parseStoredSections('["A","Gold"]')).toEqual(["A", "Gold"]);
    expect(parseStoredSections("[]")).toEqual([]);
    for (const bad of ['["A", 2]', '[""]', '"A"', "oops"]) {
      expect(parseStoredSections(bad)).toEqual(["A", "B"]);
    }
  });
});
