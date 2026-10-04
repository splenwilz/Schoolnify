"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
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
  const [templateId, setTemplateIdState] = useState<ClassNamingTemplateId>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_TEMPLATE);
        if (saved) return saved as ClassNamingTemplateId;
      }
      return DEFAULT_TEMPLATE_ID;
    }
  );

  const [customRules, setCustomRulesState] = useState<LevelRule[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_RULES);
      if (saved) {
        try {
          return JSON.parse(saved) as LevelRule[];
        } catch {
          // fall through
        }
      }
    }
    return getDefaultRules(DEFAULT_TEMPLATE_ID);
  });

  const [sections, setSectionsState] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_SECTIONS);
      if (saved) {
        try {
          return JSON.parse(saved) as string[];
        } catch {
          // fall through
        }
      }
    }
    return DEFAULT_SECTIONS;
  });

  const setTemplateId = useCallback((id: ClassNamingTemplateId) => {
    setTemplateIdState(id);
    const rules = getDefaultRules(id);
    setCustomRulesState(rules);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, id);
      localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    }
  }, []);

  const setCustomRules = useCallback((rules: LevelRule[]) => {
    setCustomRulesState(rules);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
    }
  }, []);

  const setSections = useCallback((s: string[]) => {
    setSectionsState(s);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(s));
    }
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

  return (
    <SchoolConfigContext.Provider
      value={{
        templateId,
        setTemplateId,
        customRules,
        setCustomRules,
        sections,
        setSections,
        fmtGrade,
        fmtClass,
        gradeOptions,
      }}
    >
      {children}
    </SchoolConfigContext.Provider>
  );
}

export function useSchoolConfig() {
  const ctx = useContext(SchoolConfigContext);
  if (!ctx)
    throw new Error(
      "useSchoolConfig must be used within SchoolConfigProvider"
    );
  return ctx;
}
