"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CloudUpload,
  Loader2,
  Building2,
  Globe,
  GraduationCap,
  BookOpen,
  BarChart3,
  Clock,
  Wallet,
  Shield,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchoolConfig } from "@/lib/school-config-context";
import { useSchoolSetup } from "@/hooks/use-school-setup";

import {
  GRADE_LEVEL_STRUCTURES,
  COUNTRY_TO_STRUCTURE,
  COUNTRY_TO_CALENDAR,
} from "./_constants/setup-data";
import { FEE_PRESETS } from "./_constants/fees";
import { GRADING_PRESETS } from "./_constants/grading";
import type { SchedulePreset } from "./_constants/setup-data";
import {
  isIdentityComplete,
  isBrandingComplete,
  isLocationComplete,
  isAcademicComplete,
  isGradingComplete,
  isScheduleComplete,
  isSubjectsComplete,
  isFeesComplete,
  isReportCardComplete,
  isCommsComplete,
  isPoliciesComplete,
} from "./_components/setup-types";
import type { SetupData, GradeRow, TermDate, PeriodSlot, DivisionSchedule, FeeCategory, PromotionRule } from "./_components/setup-types";
import { IdentitySection, LocationSection, BrandingSection } from "./_components/sections-simple";
import { PoliciesSection } from "./_components/section-policies";
import { SubjectsSection } from "./_components/section-subjects";
import { AcademicSection, ScheduleSection } from "./_components/section-academic";
import { GradingSection } from "./_components/section-grading-fees";
import { FeesSection } from "./_components/section-fees";
import { StepPicker } from "./_components/step-picker";

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

// Helper: shift an ISO date string by N years (for year rollover)
function shiftDateByYear(isoDate: string, years: number): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

const STEPS = [
  { id: "identity", label: "School Identity", icon: Building2 },
  { id: "location", label: "Location & Regional", icon: Globe },
  { id: "academic", label: "Academic Structure", icon: GraduationCap },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "grading", label: "Grading", icon: BarChart3 },
  { id: "schedule", label: "Schedule", icon: Clock },
  { id: "fees", label: "Fees", icon: Wallet },
  { id: "policies", label: "Policies", icon: Shield },
  // optional
  { id: "branding", label: "Branding", icon: Palette, optional: true },
] as const;

export default function SchoolSetupPage() {
  const { data, setData, update, save, isLoading, isSaving, isSuccess, saveError } = useSchoolSetup();
  const [activeStep, setActiveStep] = useState<string>("identity");
  const [customLevelInput, setCustomLevelInput] = useState("");
  const [newSection, setNewSection] = useState("");

  const { sections, setSections } = useSchoolConfig();

  // For section components that still expect expanded/toggleSection
  const expanded = activeStep;
  const toggleSection = (_id: string) => {};

  // ---------------------------------------------------------------------------
  // Academic structure handlers
  // ---------------------------------------------------------------------------

  const selectGradeLevelStructure = (structureId: string) => {
    const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === structureId);
    if (structure) {
      const allLevels = structure.groups.flatMap((g) => g.levels);
      // Rebuild attendance tracking for new groups (always, not just when empty)
      const trackingMethods: Record<string, "daily" | "per_subject"> = {};
      for (const g of structure.groups) trackingMethods[g.name] = "daily";
      setData((prev) => ({
        ...prev,
        gradeLevelStructureId: structureId,
        gradeLevels: allLevels,
        attendanceTrackingMethods: trackingMethods,
      }));
    }
  };

  // Auto-suggest grade level structure + calendar from country
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!data.country || data.gradeLevelStructureId) return;
    const code = data.country.toUpperCase();
    const suggestedStructure = COUNTRY_TO_STRUCTURE[code];
    if (suggestedStructure) selectGradeLevelStructure(suggestedStructure);
    const suggestedCalendar = COUNTRY_TO_CALENDAR[code];
    if (suggestedCalendar && !data.calendarType) update("calendarType", suggestedCalendar);
  }, [data.country]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Calendar type → term structure mapping. Picking a calendar type auto-creates terms.
  const TERM_STRUCTURES: Record<string, { name: string }[]> = {
    semester: [{ name: "First Semester" }, { name: "Second Semester" }],
    trimester: [{ name: "First Term" }, { name: "Second Term" }, { name: "Third Term" }],
    quarter: [{ name: "Quarter 1" }, { name: "Quarter 2" }, { name: "Quarter 3" }, { name: "Quarter 4" }],
    term: [], // Custom. admin adds their own
  };

  // When calendar type changes, replace terms with the new structure.
  // Warn if user already entered dates (their term data will be lost).
  const setCalendarType = (type: string) => {
    if (data.calendarType === type) return;

    // Custom = keep user's existing terms
    if (type === "term") {
      update("calendarType", type);
      return;
    }

    // Warn if user already entered dates
    const hasData = data.terms.some((t) => t.startDate || t.endDate);
    if (hasData && typeof window !== "undefined") {
      const ok = window.confirm(
        "Changing the calendar type will replace your current terms. Any dates you've entered will be cleared. Continue?"
      );
      if (!ok) return;
    }

    setData((prev) => ({
      ...prev,
      calendarType: type,
      terms: (TERM_STRUCTURES[type] || []).map((t) => ({ name: t.name, startDate: "", endDate: "" })),
    }));
  };

  const addTerm = () => {
    setData((prev) => ({ ...prev, terms: [...prev.terms, { name: `Term ${prev.terms.length + 1}`, startDate: "", endDate: "" }] }));
  };

  // Roll over terms to next academic year. Shifts all term dates by +1 year.
  const rolloverTerms = () => {
    setData((prev) => {
      // Shift term dates forward by 1 year
      const newTerms = prev.terms.map((t) => ({
        ...t,
        startDate: shiftDateByYear(t.startDate, 1),
        endDate: shiftDateByYear(t.endDate, 1),
      }));
      // Increment the academic year label (e.g. "2025/2026" → "2026/2027")
      const match = prev.currentAcademicYear.match(/(\d{4})[^\d]*(\d{4})?/);
      let newYearLabel = prev.currentAcademicYear;
      if (match) {
        const start = parseInt(match[1], 10) + 1;
        const end = match[2] ? parseInt(match[2], 10) + 1 : start;
        newYearLabel = start === end ? String(start) : `${start}/${end}`;
      }
      return { ...prev, terms: newTerms, currentAcademicYear: newYearLabel };
    });
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
  // Fee handlers
  // ---------------------------------------------------------------------------

  const addFeeCategory = (name: string, frequency?: FeeCategory["frequency"], feeType?: FeeCategory["feeType"]) => {
    if (name && !data.feeCategories.find((f) => f.name === name)) {
      setData((prev) => ({
        ...prev,
        feeCategories: [...prev.feeCategories, {
          name, mandatory: true, frequency: frequency || "per_term", feeType: feeType || "tuition",
          appliesTo: "all", gradeLevels: [], amounts: {},
        }],
      }));
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
    // Warn if existing categories have amounts entered
    const hasData = data.feeCategories.some((f) => Object.values(f.amounts).some((a) => a && a !== "0"));
    if (hasData && typeof window !== "undefined") {
      const ok = window.confirm("This will replace your current fee categories. Any amounts you've entered will be cleared. Continue?");
      if (!ok) return;
    }
    setData((prev) => {
      const newFees: FeeCategory[] = preset.items.map((f) => ({
        name: f.name, mandatory: f.mandatory, frequency: f.frequency, feeType: f.feeType,
        appliesTo: "all" as const, gradeLevels: [] as string[], amounts: {},
      }));
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
      { id: "fees", complete: isFeesComplete(data) },
      { id: "policies", complete: isPoliciesComplete(data) },
      { id: "branding", complete: isBrandingComplete(data) },
    ],
    [data]
  );

  const completedCount = setupSections.filter((s) => s.complete).length;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const currentIndex = STEPS.findIndex((s) => s.id === activeStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEPS.length - 1;

  const goNext = () => {
    if (!isLastStep) setActiveStep(STEPS[currentIndex + 1].id);
  };
  const goBack = () => {
    if (!isFirstStep) setActiveStep(STEPS[currentIndex - 1].id);
  };

  if (isLoading) {
    return (
      <div className="flex gap-8 pb-24">
        <div className="hidden lg:block w-56 shrink-0 space-y-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={`skel-${i}`} className="h-9 rounded-lg bg-[var(--border)] animate-pulse" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="w-48 h-7 rounded bg-[var(--border)] animate-pulse mb-2" />
          <div className="w-72 h-4 rounded bg-[var(--border)] animate-pulse mb-6" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`field-${i}`} className="space-y-2">
              <div className="w-28 h-4 rounded bg-[var(--border)] animate-pulse" />
              <div className="h-10 rounded-lg bg-[var(--border)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render the active section's content (without the SectionCard wrapper. shown directly)
  const renderActiveSection = () => {
    const sectionProps = { data, update, expanded, toggleSection };
    switch (activeStep) {
      case "identity": return <IdentitySection {...sectionProps} />;
      case "location": return <LocationSection {...sectionProps} />;
      case "academic": return (
        <AcademicSection {...sectionProps}
          setCalendarType={setCalendarType}
          selectGradeLevelStructure={selectGradeLevelStructure}
          customLevelInput={customLevelInput} setCustomLevelInput={setCustomLevelInput}
          addCustomLevel={addCustomLevel} removeLevel={removeLevel}
          sections={sections} setSections={setSections}
          newSection={newSection} setNewSection={setNewSection}
          addTerm={addTerm} updateTerm={updateTerm} removeTerm={removeTerm}
          rolloverTerms={rolloverTerms}
        />
      );
      case "subjects": return (
        <SubjectsSection {...sectionProps} />
      );
      case "grading": return (
        <GradingSection {...sectionProps}
          selectGradingPreset={selectGradingPreset} updateGradeRow={updateGradeRow}
          addGradeRow={addGradeRow} removeGradeRow={removeGradeRow}
        />
      );
      case "schedule": return (
        <ScheduleSection {...sectionProps}
          getScheduleDivisions={getScheduleDivisions} getOrCreateSchedule={getOrCreateSchedule}
          updateScheduleField={updateScheduleField} updateDivisionPeriod={updateDivisionPeriod}
          addDivisionPeriod={addDivisionPeriod} removeDivisionPeriod={removeDivisionPeriod}
          copyScheduleTo={copyScheduleTo} applySchedulePreset={applySchedulePreset}
        />
      );
      case "fees": return (
        <FeesSection {...sectionProps}
          addFeeCategory={addFeeCategory} updateFeeCategory={updateFeeCategory}
          toggleFeeCategoryLevel={toggleFeeCategoryLevel} updateFeeCategoryAmount={updateFeeCategoryAmount}
          removeFeeCategory={removeFeeCategory} applyFeePreset={applyFeePreset}
        />
      );
      case "policies": return <PoliciesSection {...sectionProps} updatePromotionRule={updatePromotionRule} />;
      case "branding": return <BrandingSection {...sectionProps} />;
      default: return null;
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/school-admin"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">School Setup</h1>
            <p className="text-[15px] text-[var(--muted)] mt-1">
              {completedCount} of {setupSections.length} sections completed
            </p>
          </div>
        </div>
        {/* Save status */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isSuccess && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[15px] font-medium text-[#10B981]">
                Saved
              </motion.span>
            )}
            {saveError && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[15px] font-medium text-[#EF4444]">
                Failed to save
              </motion.span>
            )}
          </AnimatePresence>
          {isSaving && <Loader2 className="w-5 h-5 animate-spin text-[var(--muted)]" />}
        </div>
      </div>

      {/* Auto-save info banner */}
      <div className="flex items-center gap-3 mb-8 py-3 px-4 rounded-lg bg-[#0891B2]/5 border border-[#0891B2]/15 text-[15px]">
        <svg className="w-5 h-5 text-[#0891B2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[var(--foreground-secondary)]">
          Your progress is saved automatically a few seconds after each change. You can leave and come back anytime.
        </p>
      </div>

      {/* Step indicator. Stripe style: flat, minimal */}
      {(() => {
        const currentStep = STEPS[currentIndex];
        return (
          <div className="mb-10">
            {/* Step counter + jump */}
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[15px] text-[var(--muted)] tabular-nums">
                {currentIndex + 1} / {STEPS.length}
                {"optional" in currentStep && currentStep.optional ? " (optional)" : ""}
              </p>
              <StepPicker
                steps={STEPS}
                activeStep={activeStep}
                sections={setupSections}
                onSelect={setActiveStep}
              />
            </div>
            {/* Progress bar */}
            <div className="h-1 rounded-full bg-[var(--border)] overflow-hidden mb-7">
              <div
                className="h-full rounded-full bg-[#0891B2] transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            {/* Step title */}
            <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">{currentStep.label}</h2>
          </div>
        );
      })()}

      <div className="max-w-[800px]">
        {/* Content area */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between mt-10 pt-7 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirstStep}
              className="flex items-center gap-2 px-5 py-3 text-[15px] font-medium rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-3 text-[15px] font-medium rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-60 transition-all"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
              Save
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={isLastStep}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-[15px] font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                isLastStep
                  ? "border border-[var(--border)] text-[var(--foreground)]"
                  : "bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25"
              )}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

