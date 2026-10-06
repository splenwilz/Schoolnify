"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  type ClassNamingTemplateId,
  type LevelRule,
  DEFAULT_TEMPLATE_ID,
  CLASS_NAMING_TEMPLATES,
  formatGradeCodeWithRules,
  formatClassNameWithRules,
  getGradeOptionsWithRules,
} from "./class-naming";

const STORAGE_KEY_TEMPLATE = "schoolnify_class_template";
const STORAGE_KEY_RULES = "schoolnify_class_rules";
const STORAGE_KEY_SECTIONS = "schoolnify_class_sections";

const DEFAULT_SECTIONS = ["A", "B"];

function getDefaultRules(templateId: ClassNamingTemplateId): LevelRule[] {
  const template = CLASS_NAMING_TEMPLATES.find((t) => t.id === templateId);
  return template ? template.rules.map((r) => ({ ...r })) : [];
}

// ---- Browser store ----
//
// Settings live in localStorage until the settings API exists. They are read
// through useSyncExternalStore with a server snapshot of "nothing saved", so
// the server HTML and the first client render agree (no hydration mismatch);
// the saved values apply right after hydration. Raw strings are the snapshot
// because the snapshot must be referentially stable between calls.

const listeners = new Set<() => void>();
/** Values written this session, so settings still take effect when storage is blocked (private mode, quota). */
const memory = new Map<string, string>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  // Another tab wrote the key (the event never fires in the writing tab), so
  // drop our copy and read storage again.
  const onStorage = (e: StorageEvent) => {
    if (e.key === null) memory.clear();
    else memory.delete(e.key);
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(key: string): string | null {
  const remembered = memory.get(key);
  if (remembered !== undefined) return remembered;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the value above still serves this session.
  }
  listeners.forEach((l) => l());
}

const serverSnapshot = () => null;

function useStoredRaw(key: string): string | null {
  return useSyncExternalStore(subscribe, () => readRaw(key), serverSnapshot);
}

function parseJson(raw: string | null): unknown {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

const isLevelRule = (v: unknown): v is LevelRule =>
  typeof v === "object" && v !== null &&
  typeof (v as LevelRule).minLevel === "number" && typeof (v as LevelRule).maxLevel === "number" &&
  typeof (v as LevelRule).prefix === "string" && typeof (v as LevelRule).levelOffset === "number";

/** Stored settings are untrusted: anything malformed falls back to the defaults rather than reaching the formatters. An empty list is a valid saved state, not a fallback case. */
export function resolveTemplateId(raw: string | null): ClassNamingTemplateId {
  return CLASS_NAMING_TEMPLATES.some((t) => t.id === raw) ? (raw as ClassNamingTemplateId) : DEFAULT_TEMPLATE_ID;
}

export function parseStoredRules(raw: string | null): LevelRule[] {
  const parsed = parseJson(raw);
  return Array.isArray(parsed) && parsed.every(isLevelRule) ? parsed : getDefaultRules(DEFAULT_TEMPLATE_ID);
}

export function parseStoredSections(raw: string | null): string[] {
  const parsed = parseJson(raw);
  return Array.isArray(parsed) && parsed.every((x) => typeof x === "string" && x.trim() !== "") ? parsed : DEFAULT_SECTIONS;
}

interface SchoolConfigContextValue {
  templateId: ClassNamingTemplateId;
  setTemplateId: (id: ClassNamingTemplateId) => void;
  /** Custom rules (editable copy of the selected template's rules) */
  customRules: LevelRule[];
  setCustomRules: (rules: LevelRule[]) => void;
  /** Section letters used for class sections */
  sections: string[];
  setSections: (sections: string[]) => void;
  /** Format short grade code: "7A" → "JSS 1A" */
  fmtGrade: (code: string) => string;
  /** Format long class name: "Grade 7A" → "JSS 1A" */
  fmtClass: (className: string) => string;
  /** Get grade dropdown options */
  gradeOptions: (
    options?: Parameters<typeof getGradeOptionsWithRules>[1]
  ) => ReturnType<typeof getGradeOptionsWithRules>;
}

const SchoolConfigContext = createContext<SchoolConfigContextValue | null>(null);

export function SchoolConfigProvider({ children }: { children: ReactNode }) {
  const rawTemplate = useStoredRaw(STORAGE_KEY_TEMPLATE);
  const rawRules = useStoredRaw(STORAGE_KEY_RULES);
  const rawSections = useStoredRaw(STORAGE_KEY_SECTIONS);

  const templateId = resolveTemplateId(rawTemplate);
  const customRules = useMemo(() => parseStoredRules(rawRules), [rawRules]);
  const sections = useMemo(() => parseStoredSections(rawSections), [rawSections]);

  const setTemplateId = useCallback((id: ClassNamingTemplateId) => {
    writeRaw(STORAGE_KEY_TEMPLATE, id);
    writeRaw(STORAGE_KEY_RULES, JSON.stringify(getDefaultRules(id)));
  }, []);

  const setCustomRules = useCallback((rules: LevelRule[]) => {
    writeRaw(STORAGE_KEY_RULES, JSON.stringify(rules));
  }, []);

  const setSections = useCallback((s: string[]) => {
    writeRaw(STORAGE_KEY_SECTIONS, JSON.stringify(s));
  }, []);

  const fmtGrade = useCallback(
    (code: string) => formatGradeCodeWithRules(code, customRules),
    [customRules]
  );

  const fmtClass = useCallback(
    (className: string) => formatClassNameWithRules(className, customRules),
    [customRules]
  );

  const gradeOptions = useCallback(
    (options?: Parameters<typeof getGradeOptionsWithRules>[1]) =>
      getGradeOptionsWithRules(customRules, {
        ...options,
        sections: options?.sections ?? sections,
      }),
    [customRules, sections]
  );

  const value = useMemo<SchoolConfigContextValue>(
    () => ({ templateId, setTemplateId, customRules, setCustomRules, sections, setSections, fmtGrade, fmtClass, gradeOptions }),
    [templateId, setTemplateId, customRules, setCustomRules, sections, setSections, fmtGrade, fmtClass, gradeOptions]
  );

  return <SchoolConfigContext.Provider value={value}>{children}</SchoolConfigContext.Provider>;
}

export function useSchoolConfig() {
  const ctx = useContext(SchoolConfigContext);
  if (!ctx)
    throw new Error(
      "useSchoolConfig must be used within SchoolConfigProvider"
    );
  return ctx;
}
