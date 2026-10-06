/**
 * Configurable Class Naming Template System
 *
 * Maps internal grade codes ("7A", "Grade 5A") to display names
 * based on the school's chosen naming template.
 *
 * Internal data is never modified. this is a pure display layer.
 */

// ---- Types ----

export type ClassNamingTemplateId =
  | "american"
  | "british"
  | "indian"
  | "nigerian"
  | "east_african";

export interface LevelRule {
  minLevel: number;
  maxLevel: number;
  prefix: string;
  /** Subtracted from level to get display number */
  levelOffset: number;
}

export interface ClassNamingTemplate {
  id: ClassNamingTemplateId;
  label: string;
  description: string;
  rules: LevelRule[];
}

// ---- Template Definitions ----

export const CLASS_NAMING_TEMPLATES: ClassNamingTemplate[] = [
  {
    id: "american",
    label: "American",
    description: "Grade 1, Grade 7A, Grade 12B",
    rules: [{ minLevel: 1, maxLevel: 12, prefix: "Grade", levelOffset: 0 }],
  },
  {
    id: "british",
    label: "British",
    description: "Year 1, Year 7A, Year 12B",
    rules: [{ minLevel: 1, maxLevel: 12, prefix: "Year", levelOffset: 0 }],
  },
  {
    id: "indian",
    label: "Indian",
    description: "Class 1, Class 7A, Class 12B",
    rules: [{ minLevel: 1, maxLevel: 12, prefix: "Class", levelOffset: 0 }],
  },
  {
    id: "nigerian",
    label: "Nigerian",
    description: "Primary 1A, JSS 1A, SSS 1A",
    rules: [
      { minLevel: 1, maxLevel: 6, prefix: "Primary", levelOffset: 0 },
      { minLevel: 7, maxLevel: 9, prefix: "JSS", levelOffset: 6 },
      { minLevel: 10, maxLevel: 12, prefix: "SSS", levelOffset: 9 },
    ],
  },
  {
    id: "east_african",
    label: "East African",
    description: "Standard 1A, Form 1A",
    rules: [
      { minLevel: 1, maxLevel: 7, prefix: "Standard", levelOffset: 0 },
      { minLevel: 8, maxLevel: 12, prefix: "Form", levelOffset: 7 },
    ],
  },
];

export const DEFAULT_TEMPLATE_ID: ClassNamingTemplateId = "american";

// ---- Parser ----

/**
 * Parse an internal grade/class code into level + section.
 * Handles: "7A", "10B", "5", "Grade 7A", "Grade 10", "JSS 1A", "Primary 5A"
 */
export function parseGradeCode(
  raw: string
): { level: number; section: string } | null {
  const stripped = raw
    .replace(
      /^(Grade|Year|Class|Primary|JSS|SSS|Standard|Form)\s*/i,
      ""
    )
    .trim();

  const match = stripped.match(/^(\d{1,2})([A-Za-z]?)$/);
  if (!match) return null;

  let level = parseInt(match[1], 10);
  const section = match[2].toUpperCase();

  // If the input had a prefix that implies an offset, reconstruct the absolute level
  const lower = raw.toLowerCase();
  if (lower.startsWith("jss")) level += 6;
  else if (lower.startsWith("sss")) level += 9;
  else if (lower.startsWith("form")) level += 7;

  return { level, section };
}

// ---- Formatters ----

/**
 * Format a short grade code ("7A") using custom rules directly.
 * This is the core formatter. all other format functions delegate here.
 */
export function formatGradeCodeWithRules(
  code: string,
  rules: LevelRule[]
): string {
  const parsed = parseGradeCode(code);
  if (!parsed) return code;

  const rule = rules.find(
    (r) => parsed.level >= r.minLevel && parsed.level <= r.maxLevel
  );
  if (!rule) return code;

  const displayNum = parsed.level - rule.levelOffset;
  return `${rule.prefix} ${displayNum}${parsed.section}`;
}

/**
 * Format a short grade code ("7A") using the given template.
 * Returns e.g. "JSS 1A" for Nigerian template.
 */
export function formatGradeCode(
  code: string,
  templateId: ClassNamingTemplateId
): string {
  const template = CLASS_NAMING_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return code;
  return formatGradeCodeWithRules(code, template.rules);
}

/**
 * Format a long class name ("Grade 7A") using custom rules directly.
 */
export function formatClassNameWithRules(
  className: string,
  rules: LevelRule[]
): string {
  const parsed = parseGradeCode(className);
  if (!parsed) return className;
  const matches = rules.some((r) => parsed.level >= r.minLevel && parsed.level <= r.maxLevel);
  // Outside every rule, keep the original name rather than the bare code.
  if (!matches) return className;
  const code = `${parsed.level}${parsed.section}`;
  return formatGradeCodeWithRules(code, rules);
}

/**
 * Format a long class name ("Grade 7A") by parsing then re-formatting.
 * Used for className fields in attendance, classes, timetable, etc.
 */
export function formatClassName(
  className: string,
  templateId: ClassNamingTemplateId
): string {
  const template = CLASS_NAMING_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return className;
  return formatClassNameWithRules(className, template.rules);
}

/**
 * Generate grade dropdown options using custom rules directly.
 */
export function getGradeOptionsWithRules(
  rules: LevelRule[],
  options: {
    withSections?: boolean;
    minLevel?: number;
    maxLevel?: number;
    sections?: string[];
  } = {}
): { value: string; label: string }[] {
  const {
    withSections = false,
    minLevel = 5,
    maxLevel = 12,
    sections = ["A", "B"],
  } = options;

  const result: { value: string; label: string }[] = [];

  for (let level = minLevel; level <= maxLevel; level++) {
    if (withSections) {
      for (const section of sections) {
        const code = `${level}${section}`;
        result.push({
          value: code,
          label: formatGradeCodeWithRules(code, rules),
        });
      }
    } else {
      result.push({
        value: `Grade ${level}`,
        label: formatGradeCodeWithRules(String(level), rules),
      });
    }
  }

  return result;
}

/**
 * Generate grade dropdown options.
 * - withSections=false: ["JSS 1", "JSS 2", ...] (admissions)
 * - withSections=true: ["JSS 1A", "JSS 1B", ...] (enrollment)
 */
export function getGradeOptions(
  templateId: ClassNamingTemplateId,
  options: {
    withSections?: boolean;
    minLevel?: number;
    maxLevel?: number;
    sections?: string[];
  } = {}
): { value: string; label: string }[] {
  const template = CLASS_NAMING_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return [];
  return getGradeOptionsWithRules(template.rules, options);
}
