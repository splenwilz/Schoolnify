"use client";

import { useMemo, useRef, useState } from "react";
import { BookOpen, Plus, Sparkles, Layers, Trash2, X, Check, ChevronDown } from "lucide-react";
import { SectionCard } from "./form-primitives";
import { isSubjectsComplete, SUBJECT_DEPARTMENTS } from "./setup-types";
import type { SetupData } from "./setup-types";
import { SUBJECT_DEPT_MAP, SUBJECT_PRESETS, type SubjectPreset } from "../_constants/subjects";
import { AddSubjectPopover, PresetPopover } from "./subjects-popovers";

// ---------------------------------------------------------------------------
// SubjectsSection — three-layer UX
//   1. Starter banner (no subjects + recommended preset available)
//   2. Your Subjects panel (primary surface once anything is selected)
//   3. Add Subject popover (search-first, filterable) / Switch Preset popover
// ---------------------------------------------------------------------------

interface SubjectsSectionProps {
  data: SetupData;
  update: <K extends keyof SetupData>(key: K, value: SetupData[K]) => void;
  expanded: string;
  toggleSection: (id: string) => void;
}

// Subjects like "Mathematics" that every preset includes — used to detect when
// a preset is applied even if a few extras were added later.
const isPresetApplied = (preset: SubjectPreset, selected: string[]): boolean =>
  preset.subjects.length > 0 && preset.subjects.every((s) => selected.includes(s));

/**
 * Return the preset currently matching the selected subjects (if any),
 * preferring presets relevant to the grade level system.
 */
function detectAppliedPreset(selected: string[], structureId: string): SubjectPreset | null {
  const sorted = [...SUBJECT_PRESETS].sort((a, b) => {
    const aRel = a.relevantFor.includes(structureId) ? 0 : 1;
    const bRel = b.relevantFor.includes(structureId) ? 0 : 1;
    return aRel - bRel;
  });
  return sorted.find((p) => isPresetApplied(p, selected)) ?? null;
}

/** All recommended presets for a given grade level structure. */
function getRecommendedPresets(structureId: string): SubjectPreset[] {
  if (!structureId) return [];
  return SUBJECT_PRESETS.filter((p) => p.relevantFor.includes(structureId));
}

export function SubjectsSection({ data, update, expanded, toggleSection }: SubjectsSectionProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const recommendedList = getRecommendedPresets(data.gradeLevelStructureId);
  const appliedPreset = detectAppliedPreset(data.subjects, data.gradeLevelStructureId);
  const hasSubjects = data.subjects.length > 0;
  const showBanner = !hasSubjects && !bannerDismissed && recommendedList.length > 0;

  // Apply a preset's subjects (union) and tag departments.
  const applyPreset = (preset: SubjectPreset) => {
    const nextSubjects = Array.from(new Set([...data.subjects, ...preset.subjects]));
    const depts = { ...data.subjectDepartments };
    for (const subj of preset.subjects) {
      if (!depts[subj] && SUBJECT_DEPT_MAP[subj]) depts[subj] = SUBJECT_DEPT_MAP[subj];
    }
    update("subjects", nextSubjects);
    update("subjectDepartments", depts);
  };

  const removePresetSubjects = (preset: SubjectPreset) => {
    const toRemove = new Set(preset.subjects);
    update("subjects", data.subjects.filter((s) => !toRemove.has(s)));
    const depts = { ...data.subjectDepartments };
    for (const s of preset.subjects) delete depts[s];
    update("subjectDepartments", depts);
  };

  const toggleSubject = (subject: string) => {
    if (data.subjects.includes(subject)) {
      update("subjects", data.subjects.filter((s) => s !== subject));
      const depts = { ...data.subjectDepartments };
      delete depts[subject];
      update("subjectDepartments", depts);
    } else {
      update("subjects", [...data.subjects, subject]);
      const dept = SUBJECT_DEPT_MAP[subject];
      if (dept) update("subjectDepartments", { ...data.subjectDepartments, [subject]: dept });
    }
  };

  const clearAll = () => {
    update("subjects", []);
    update("subjectDepartments", {});
  };

  return (
    <SectionCard
      id="subjects"
      title="Subjects Offered"
      description="Core and elective subjects taught at your school"
      icon={<BookOpen className="w-5 h-5" />}
      isComplete={isSubjectsComplete(data)}
      isExpanded={expanded === "subjects"}
      onToggle={() => toggleSection("subjects")}
    >
      {showBanner ? (
        <StarterBanner
          presets={recommendedList}
          onUse={(preset) => applyPreset(preset)}
          onDismiss={() => setBannerDismissed(true)}
          onBrowseAll={() => {
            setBannerDismissed(true);
            setPresetOpen(true);
          }}
        />
      ) : (
        <YourSubjectsPanel
          data={data}
          appliedPreset={appliedPreset}
          onRemoveSubject={toggleSubject}
          onAddClick={() => setAddOpen(true)}
          onPresetClick={() => setPresetOpen(true)}
          onClear={clearAll}
          isAddOpen={addOpen}
          onAddClose={() => setAddOpen(false)}
          isPresetOpen={presetOpen}
          onPresetClose={() => setPresetOpen(false)}
          onToggleSubject={toggleSubject}
          onApplyPreset={applyPreset}
          onRemovePreset={removePresetSubjects}
        />
      )}
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// StarterBanner — shown when no subjects selected yet and a preset matches
// ---------------------------------------------------------------------------

function StarterBanner({
  presets,
  onUse,
  onDismiss,
  onBrowseAll,
}: {
  presets: SubjectPreset[];
  onUse: (preset: SubjectPreset) => void;
  onDismiss: () => void;
  onBrowseAll: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#0891B2]/20 bg-gradient-to-br from-[#0891B2]/5 to-transparent p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[#0891B2]/10 text-[#0891B2] flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#0891B2]">
          Recommended for your grade system
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onUse(preset)}
            className="text-left p-3 rounded-lg border border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
          >
            <span className="text-[14px] font-medium text-[var(--foreground)]">{preset.label}</span>
            <p className="text-[12px] text-[var(--muted)]">{preset.description} &middot; {preset.subjects.length} subjects</p>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBrowseAll}
          className="text-[13px] font-medium text-[#0891B2] hover:underline"
        >
          Browse all presets
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Start blank
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// YourSubjectsPanel — the primary surface once subjects exist (or banner dismissed)
// ---------------------------------------------------------------------------

function YourSubjectsPanel({
  data,
  appliedPreset,
  onRemoveSubject,
  onAddClick,
  onPresetClick,
  onClear,
  isAddOpen,
  onAddClose,
  isPresetOpen,
  onPresetClose,
  onToggleSubject,
  onApplyPreset,
  onRemovePreset,
}: {
  data: SetupData;
  appliedPreset: SubjectPreset | null;
  onRemoveSubject: (s: string) => void;
  onAddClick: () => void;
  onPresetClick: () => void;
  onClear: () => void;
  isAddOpen: boolean;
  onAddClose: () => void;
  isPresetOpen: boolean;
  onPresetClose: () => void;
  onToggleSubject: (s: string) => void;
  onApplyPreset: (p: SubjectPreset) => void;
  onRemovePreset: (p: SubjectPreset) => void;
}) {
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const presetBtnRef = useRef<HTMLButtonElement>(null);

  // Group selected subjects by department for display
  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const s of data.subjects) {
      const dept = data.subjectDepartments[s] ?? SUBJECT_DEPT_MAP[s] ?? "other";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(s);
    }
    return groups;
  }, [data.subjects, data.subjectDepartments]);

  const deptLabel = (value: string) => SUBJECT_DEPARTMENTS.find((d) => d.value === value)?.label ?? "Other";

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex-1 min-w-[180px]">
          <p className="text-[15px] font-medium text-[var(--foreground)]">
            {data.subjects.length} {data.subjects.length === 1 ? "subject" : "subjects"} selected
          </p>
          {appliedPreset && (
            <p className="text-[13px] text-[var(--muted)]">
              Based on <span className="text-[#0891B2] font-medium">{appliedPreset.label}</span>
            </p>
          )}
        </div>

        <button
          ref={addBtnRef}
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add subject
        </button>
        {isAddOpen && (
          <AddSubjectPopover
            anchor={addBtnRef}
            selected={data.subjects}
            onClose={onAddClose}
            onToggle={onToggleSubject}
          />
        )}

        <button
          ref={presetBtnRef}
          type="button"
          onClick={onPresetClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
        >
          <Layers className="w-4 h-4" />
          Add from preset
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
        {isPresetOpen && (
          <PresetPopover
            anchor={presetBtnRef}
            gradeLevelStructureId={data.gradeLevelStructureId}
            selected={data.subjects}
            onApply={onApplyPreset}
            onRemove={onRemovePreset}
            onClose={onPresetClose}
          />
        )}

        {data.subjects.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] text-[var(--muted)] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Subjects list grouped by department */}
      {data.subjects.length === 0 ? (
        <div className="py-10 text-center text-[14px] text-[var(--muted)] border border-dashed border-[var(--border)] rounded-lg">
          No subjects yet. Click <span className="font-medium">Add subject</span> or <span className="font-medium">Add from preset</span> to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([dept, subjects]) => (
            <div key={dept}>
              <p className="text-[12px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5">
                {deptLabel(dept)} <span className="text-[var(--muted)]/60">({subjects.length})</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-[13px] font-medium rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => onRemoveSubject(s)}
                      className="ml-0.5 p-0.5 rounded hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-colors"
                      aria-label={`Remove ${s}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

