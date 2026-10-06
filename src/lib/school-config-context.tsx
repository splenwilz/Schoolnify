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

function parseJson<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
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

  const templateId = (rawTemplate as ClassNamingTemplateId | null) ?? DEFAULT_TEMPLATE_ID;
  const customRules = useMemo(() => parseJson<LevelRule[]>(rawRules, getDefaultRules(DEFAULT_TEMPLATE_ID)), [rawRules]);
  const sections = useMemo(() => parseJson<string[]>(rawSections, DEFAULT_SECTIONS), [rawSections]);

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
