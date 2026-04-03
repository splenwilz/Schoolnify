"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchoolConfig } from "@/lib/school-config-context";

import {
  GRADE_LEVEL_STRUCTURES,
  GRADING_PRESETS,
  FEE_PRESETS,
  STORAGE_KEY,
} from "./_constants/setup-data";
import type { SchedulePreset } from "./_constants/setup-data";
import {
  DEFAULT_DATA,
  isIdentityComplete,
  isBrandingComplete,
  isLocationComplete,
  isAcademicComplete,
  isGradingComplete,
  isScheduleComplete,
  isTermsComplete,
  isSubjectsComplete,
  isFeesComplete,
  isReportCardComplete,
  isCommsComplete,
  isPoliciesComplete,
} from "./_components/setup-types";
import type { SetupData, GradeRow, TermDate, PeriodSlot, DivisionSchedule, FeeCategory, PromotionRule } from "./_components/setup-types";
import { IdentitySection, LocationSection, ReportCardSection, CommunicationSection, BrandingSection } from "./_components/sections-simple";
import { SubjectsSection, TermsSection, PoliciesSection } from "./_components/sections-medium";
import { AcademicSection, ScheduleSection } from "./_components/section-academic";
import { GradingSection, FeesSection } from "./_components/section-grading-fees";

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function SchoolSetupPage() {
  const [data, setData] = useState<SetupData>(DEFAULT_DATA);
  const [expanded, setExpanded] = useState<string>("identity");
  const [saveMessage, setSaveMessage] = useState(false);
  const [customLevelInput, setCustomLevelInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [feeCategoryInput, setFeeCategoryInput] = useState("");
  const [newSection, setNewSection] = useState("");

  const { sections, setSections } = useSchoolConfig();

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Silently continue
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Generic handlers
  // ---------------------------------------------------------------------------

  const update = <K extends keyof SetupData>(key: K, value: SetupData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (id: string) => {
    setExpanded((prev) => (prev === id ? "" : id));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveMessage(true);
      setTimeout(() => setSaveMessage(false), 2000);
    } catch {
      // Silently continue
    }
  };

  // ---------------------------------------------------------------------------
  // Academic structure handlers
  // ---------------------------------------------------------------------------

  const selectGradeLevelStructure = (structureId: string) => {
    const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === structureId);
    if (structure) {
      const allLevels = structure.groups.flatMap((g) => g.levels);
      setData((prev) => ({ ...prev, gradeLevelStructureId: structureId, gradeLevels: allLevels }));
    }
  };

  const addCustomLevel = () => {
    const trimmed = customLevelInput.trim();
    if (trimmed && !data.gradeLevels.includes(trimmed)) {
      update("gradeLevels", [...data.gradeLevels, trimmed]);
      setCustomLevelInput("");
    }
  };

  const removeLevel = (level: string) => {
    update("gradeLevels", data.gradeLevels.filter((l) => l !== level));
  };

  // ---------------------------------------------------------------------------
  // Grading handlers
  // ---------------------------------------------------------------------------

  const updateGradeRow = (index: number, field: keyof GradeRow, value: string) => {
    setData((prev) => {
      const updated = [...prev.gradingScale];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gradingScale: updated };
    });
  };

  const addGradeRow = () => {
    setData((prev) => ({
      ...prev,
      gradingScale: [...prev.gradingScale, { grade: "", minScore: "", maxScore: "" }],
    }));
  };

  const removeGradeRow = (index: number) => {
    setData((prev) => ({
      ...prev,
      gradingScale: prev.gradingScale.filter((_, i) => i !== index),
    }));
  };

  const selectGradingPreset = (presetId: string) => {
    const preset = GRADING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setData((prev) => ({
        ...prev,
        gradingPresetId: presetId,
        gradingScale: preset.grades.map((g) => ({ ...g })),
        passmark: preset.passmark,
      }));
    }
  };

  // ---------------------------------------------------------------------------
  // Schedule handlers
  // ---------------------------------------------------------------------------

  const getScheduleDivisions = (): string[] => {
    const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
    if (structure && structure.groups.length > 0) return structure.groups.map((g) => g.name);
    return ["All Levels"];
  };

  const getOrCreateSchedule = (division: string): DivisionSchedule => {
    return data.schedules[division] || { startTime: "08:00", endTime: "15:00", periodDuration: "40", periods: [] };
  };

  const recalcPeriods = (periods: PeriodSlot[], startTime: string, periodMins: number): PeriodSlot[] => {
    if (periods.length === 0 || !startTime || !periodMins) return periods;
    const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); };
    const toTime = (m: number) => { const h = Math.floor(m / 60) % 24; const mm = m % 60; return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };
    let cursor = toMins(startTime);
    return periods.map((p) => {
      const dur = p.isBreak ? (toMins(p.endTime) - toMins(p.startTime)) || 15 : periodMins;
      const start = cursor;
      cursor += dur;
      return { ...p, startTime: toTime(start), endTime: toTime(cursor) };
    });
  };

  const updateScheduleField = (division: string, field: keyof Omit<DivisionSchedule, "periods">, value: string) => {
    setData((prev) => {
      const schedule = { ...getOrCreateSchedule(division), ...prev.schedules[division], [field]: value };
      if ((field === "periodDuration" || field === "startTime") && schedule.periods.length > 0) {
        const mins = parseInt(field === "periodDuration" ? value : schedule.periodDuration, 10);
        const start = field === "startTime" ? value : schedule.startTime;
        if (mins > 0 && start) {
          schedule.periods = recalcPeriods(schedule.periods, start, mins);
          const last = schedule.periods[schedule.periods.length - 1];
          if (last) schedule.endTime = last.endTime;
        }
      }
      return { ...prev, schedules: { ...prev.schedules, [division]: schedule } };
    });
  };

  const updateDivisionPeriod = (division: string, index: number, field: keyof PeriodSlot, value: string | boolean) => {
    setData((prev) => {
      const schedule = prev.schedules[division] || getOrCreateSchedule(division);
      const updated = schedule.periods.map((p) => ({ ...p }));
      updated[index] = { ...updated[index], [field]: value };
      if (field === "startTime" || field === "endTime") {
        const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); };
        const toTime = (m: number) => { const h = Math.floor(m / 60) % 24; const mm = m % 60; return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };
        if (field === "startTime") {
          const oldDur = toMins(schedule.periods[index].endTime) - toMins(schedule.periods[index].startTime);
          const dur = oldDur > 0 ? oldDur : parseInt(schedule.periodDuration, 10) || 40;
          updated[index].endTime = toTime(toMins(value as string) + dur);
        }
        for (let j = index + 1; j < updated.length; j++) {
          const prevEnd = toMins(updated[j - 1].endTime);
          const oldDur = toMins(schedule.periods[j].endTime) - toMins(schedule.periods[j].startTime);
          const dur = oldDur > 0 ? oldDur : parseInt(schedule.periodDuration, 10) || 40;
          updated[j].startTime = toTime(prevEnd);
          updated[j].endTime = toTime(prevEnd + dur);
        }
        const last = updated[updated.length - 1];
        return { ...prev, schedules: { ...prev.schedules, [division]: { ...schedule, periods: updated, endTime: last?.endTime || schedule.endTime } } };
      }
      return { ...prev, schedules: { ...prev.schedules, [division]: { ...schedule, periods: updated } } };
    });
  };

  const addDivisionPeriod = (division: string) => {
    setData((prev) => {
      const schedule = prev.schedules[division] || getOrCreateSchedule(division);
      const last = schedule.periods[schedule.periods.length - 1];
      return { ...prev, schedules: { ...prev.schedules, [division]: { ...schedule, periods: [...schedule.periods, { label: "", startTime: last?.endTime || schedule.startTime || "", endTime: "", isBreak: false }] } } };
    });
  };

  const removeDivisionPeriod = (division: string, index: number) => {
    setData((prev) => {
      const schedule = prev.schedules[division] || getOrCreateSchedule(division);
      return { ...prev, schedules: { ...prev.schedules, [division]: { ...schedule, periods: schedule.periods.filter((_, i) => i !== index) } } };
    });
  };

  const copyScheduleTo = (fromDivision: string, toDivision: string) => {
    setData((prev) => {
      const source = prev.schedules[fromDivision];
      if (!source) return prev;
      return { ...prev, schedules: { ...prev.schedules, [toDivision]: { ...source, periods: source.periods.map((p) => ({ ...p })) } } };
    });
  };

  const applySchedulePreset = (division: string, preset: SchedulePreset) => {
    setData((prev) => ({
      ...prev,
      schedules: { ...prev.schedules, [division]: { startTime: preset.startTime, endTime: preset.endTime, periodDuration: preset.periodDuration, periods: preset.periods.map((p) => ({ ...p })) } },
    }));
  };

  // ---------------------------------------------------------------------------
  // Term handlers
  // ---------------------------------------------------------------------------

  const TERM_PRESETS: { id: string; label: string; calendarTypes?: string[]; terms: { name: string }[] }[] = [
    { id: "2_semester", label: "2 Semesters", calendarTypes: ["semester"], terms: [{ name: "First Semester" }, { name: "Second Semester" }] },
    { id: "3_term", label: "3 Terms", calendarTypes: ["trimester", "term"], terms: [{ name: "First Term" }, { name: "Second Term" }, { name: "Third Term" }] },
    { id: "4_quarter", label: "4 Quarters", calendarTypes: ["quarter"], terms: [{ name: "Quarter 1" }, { name: "Quarter 2" }, { name: "Quarter 3" }, { name: "Quarter 4" }] },
    { id: "2_term", label: "2 Terms", terms: [{ name: "First Term" }, { name: "Second Term" }] },
    { id: "6_half", label: "6 Half-Terms", terms: [{ name: "Autumn 1" }, { name: "Autumn 2" }, { name: "Spring 1" }, { name: "Spring 2" }, { name: "Summer 1" }, { name: "Summer 2" }] },
  ];

  const getRelevantTermPresets = () => {
    if (!data.calendarType) return TERM_PRESETS;
    const matching = TERM_PRESETS.filter((p) => p.calendarTypes?.includes(data.calendarType));
    const others = TERM_PRESETS.filter((p) => !p.calendarTypes?.includes(data.calendarType));
    return [...matching, ...others];
  };

  const applyTermPreset = (presetId: string) => {
    const preset = TERM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setData((prev) => ({ ...prev, terms: preset.terms.map((t) => ({ name: t.name, startDate: "", endDate: "" })) }));
  };

  const addTerm = () => {
    setData((prev) => ({ ...prev, terms: [...prev.terms, { name: `Term ${prev.terms.length + 1}`, startDate: "", endDate: "" }] }));
  };

  const updateTerm = (index: number, field: keyof TermDate, value: string) => {
    setData((prev) => {
      const updated = [...prev.terms];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, terms: updated };
    });
  };

  const removeTerm = (index: number) => {
    setData((prev) => ({ ...prev, terms: prev.terms.filter((_, i) => i !== index) }));
  };

  // ---------------------------------------------------------------------------
  // Subject handlers
  // ---------------------------------------------------------------------------

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !data.subjects.includes(trimmed)) {
      update("subjects", [...data.subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const toggleSubject = (subject: string) => {
    if (data.subjects.includes(subject)) {
      update("subjects", data.subjects.filter((s) => s !== subject));
    } else {
      update("subjects", [...data.subjects, subject]);
    }
  };

  // ---------------------------------------------------------------------------
  // Fee handlers
  // ---------------------------------------------------------------------------

  const addFeeCategory = (name?: string) => {
    const catName = name || feeCategoryInput.trim();
    if (catName && !data.feeCategories.find((f) => f.name === catName)) {
      setData((prev) => ({ ...prev, feeCategories: [...prev.feeCategories, { name: catName, mandatory: true, appliesTo: "all", gradeLevels: [], amounts: {} }] }));
      if (!name) setFeeCategoryInput("");
    }
  };

  const updateFeeCategory = (index: number, field: keyof FeeCategory, value: string | boolean | string[] | Record<string, string>) => {
    setData((prev) => {
      const updated = [...prev.feeCategories];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "appliesTo" && value === "all") updated[index].gradeLevels = [];
      return { ...prev, feeCategories: updated };
    });
  };

  const toggleFeeCategoryLevel = (index: number, level: string) => {
    setData((prev) => {
      const updated = [...prev.feeCategories];
      const current = updated[index].gradeLevels;
      updated[index] = { ...updated[index], gradeLevels: current.includes(level) ? current.filter((l) => l !== level) : [...current, level] };
      return { ...prev, feeCategories: updated };
    });
  };

  const updateFeeCategoryAmount = (index: number, level: string, amount: string) => {
    setData((prev) => {
      const updated = [...prev.feeCategories];
      updated[index] = { ...updated[index], amounts: { ...updated[index].amounts, [level]: amount } };
      return { ...prev, feeCategories: updated };
    });
  };

  const removeFeeCategory = (index: number) => {
    setData((prev) => ({ ...prev, feeCategories: prev.feeCategories.filter((_, i) => i !== index) }));
  };

  const applyFeePreset = (presetId: string) => {
    const preset = FEE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setData((prev) => {
      const currency = prev.currency || "USD";
      const levels = prev.gradeLevels.length > 0 ? prev.gradeLevels : [];
      const newFees = preset.fees.map((f) => {
        const defaultAmount = f.defaults[currency] || f.defaults["USD"] || "0";
        const amounts: Record<string, string> = { _flat: defaultAmount };
        for (const level of levels) amounts[level] = defaultAmount;
        return { name: f.name, mandatory: f.mandatory, appliesTo: "all" as const, gradeLevels: [] as string[], amounts };
      });
      return { ...prev, feeCategories: newFees };
    });
  };

  // ---------------------------------------------------------------------------
  // Promotion rule handler
  // ---------------------------------------------------------------------------

  const updatePromotionRule = <K extends keyof PromotionRule>(field: K, value: PromotionRule[K]) => {
    setData((prev) => ({ ...prev, promotionRules: { ...prev.promotionRules, [field]: value } }));
  };

  // ---------------------------------------------------------------------------
  // Section completion tracking
  // ---------------------------------------------------------------------------

  const setupSections = useMemo(
    () => [
      { id: "identity", complete: isIdentityComplete(data) },
      { id: "location", complete: isLocationComplete(data) },
      { id: "academic", complete: isAcademicComplete(data) },
      { id: "subjects", complete: isSubjectsComplete(data) },
      { id: "grading", complete: isGradingComplete(data) },
      { id: "schedule", complete: isScheduleComplete(data) },
      { id: "terms", complete: isTermsComplete(data) },
      { id: "fees", complete: isFeesComplete(data) },
      { id: "policies", complete: isPoliciesComplete(data) },
      { id: "reportcard", complete: isReportCardComplete(data) },
      { id: "comms", complete: isCommsComplete(data) },
      { id: "branding", complete: isBrandingComplete(data) },
    ],
    [data]
  );

  const completedCount = setupSections.filter((s) => s.complete).length;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[900px] mx-auto pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/school-admin"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">School Setup</h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              {completedCount} of {setupSections.length} sections completed
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          {setupSections.map((s) => (
            <div key={s.id} className={cn("w-2 h-2 rounded-full transition-colors", s.complete ? "bg-[#10B981]" : "bg-[var(--border)]")} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Essential sections */}
        <IdentitySection data={data} update={update} expanded={expanded} toggleSection={toggleSection} />
        <LocationSection data={data} update={update} expanded={expanded} toggleSection={toggleSection} />
        <AcademicSection
          data={data} update={update} expanded={expanded} toggleSection={toggleSection}
          selectGradeLevelStructure={selectGradeLevelStructure}
          customLevelInput={customLevelInput} setCustomLevelInput={setCustomLevelInput}
          addCustomLevel={addCustomLevel} removeLevel={removeLevel}
          sections={sections} setSections={setSections}
          newSection={newSection} setNewSection={setNewSection}
        />
        <SubjectsSection
          data={data} update={update} expanded={expanded} toggleSection={toggleSection}
          subjectInput={subjectInput} setSubjectInput={setSubjectInput}
          addSubject={addSubject} toggleSubject={toggleSubject}
        />
        <GradingSection
          data={data} update={update} expanded={expanded} toggleSection={toggleSection}
          selectGradingPreset={selectGradingPreset} updateGradeRow={updateGradeRow}
          addGradeRow={addGradeRow} removeGradeRow={removeGradeRow}
        />
        <ScheduleSection
          data={data} update={update} expanded={expanded} toggleSection={toggleSection}
          getScheduleDivisions={getScheduleDivisions} getOrCreateSchedule={getOrCreateSchedule}
          updateScheduleField={updateScheduleField} updateDivisionPeriod={updateDivisionPeriod}
          addDivisionPeriod={addDivisionPeriod} removeDivisionPeriod={removeDivisionPeriod}
          copyScheduleTo={copyScheduleTo} applySchedulePreset={applySchedulePreset}
        />
        <TermsSection
          data={data} update={update} expanded={expanded} toggleSection={toggleSection}
          addTerm={addTerm} updateTerm={updateTerm} removeTerm={removeTerm}
          applyTermPreset={applyTermPreset} getRelevantTermPresets={getRelevantTermPresets}
        />
        <FeesSection
          data={data} update={update} expanded={expanded} toggleSection={toggleSection}
          addFeeCategory={addFeeCategory} updateFeeCategory={updateFeeCategory}
          toggleFeeCategoryLevel={toggleFeeCategoryLevel} updateFeeCategoryAmount={updateFeeCategoryAmount}
          removeFeeCategory={removeFeeCategory} applyFeePreset={applyFeePreset}
          feeCategoryInput={feeCategoryInput} setFeeCategoryInput={setFeeCategoryInput}
        />
        <PoliciesSection data={data} update={update} expanded={expanded} toggleSection={toggleSection} updatePromotionRule={updatePromotionRule} />

        {/* Optional divider */}
        <div className="flex items-center gap-3 pt-4 pb-1">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Optional</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <ReportCardSection data={data} update={update} expanded={expanded} toggleSection={toggleSection} />
        <CommunicationSection data={data} update={update} expanded={expanded} toggleSection={toggleSection} />
        <BrandingSection data={data} update={update} expanded={expanded} toggleSection={toggleSection} />
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-[var(--card)]/95 backdrop-blur-sm border-t border-[var(--border)] px-6 py-4">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <p className="text-[13px] text-[var(--muted)]">
            {completedCount === setupSections.length
              ? "All sections completed!"
              : `${setupSections.length - completedCount} section${setupSections.length - completedCount !== 1 ? "s" : ""} remaining`}
          </p>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saveMessage && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[13px] font-medium text-[#10B981]">
                  Changes saved!
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
