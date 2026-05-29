"use client";

import { useRef, useState } from "react";
import { BarChart3, Plus, Trash2, Sparkles, Layers, ChevronDown, Check } from "lucide-react";
import { SectionCard, Field, TextInput, Toggle } from "./form-primitives";
import { isGradingComplete } from "./setup-types";
import type { SetupData, GradeRow } from "./setup-types";
import { GRADING_PRESETS, ASSESSMENT_PRESETS, type GradingPreset, type AssessmentPreset } from "../_constants/grading";
import { GradingPresetPopover, AssessmentPresetPopover } from "./grading-popovers";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Shared Props
// ---------------------------------------------------------------------------

interface SectionProps {
  data: SetupData;
  update: <K extends keyof SetupData>(key: K, value: SetupData[K]) => void;
  expanded: string;
  toggleSection: (id: string) => void;
}

// ---------------------------------------------------------------------------
// GradingSection — three-layer UX (same pattern as subjects)
// ---------------------------------------------------------------------------

interface GradingSectionProps extends SectionProps {
  selectGradingPreset: (presetId: string) => void;
  updateGradeRow: (index: number, field: keyof GradeRow, value: string) => void;
  addGradeRow: () => void;
  removeGradeRow: (index: number) => void;
}

function getRecommendedGrading(structureId: string): GradingPreset[] {
  if (!structureId) return [];
  return GRADING_PRESETS.filter((p) => p.relevantFor.includes(structureId));
}

function getRecommendedAssessment(structureId: string): AssessmentPreset | null {
  if (!structureId) return null;
  return ASSESSMENT_PRESETS.find((p) => p.relevantFor.includes(structureId)) ?? null;
}

export function GradingSection({
  data,
  update,
  expanded,
  toggleSection,
  selectGradingPreset,
  updateGradeRow,
  addGradeRow,
  removeGradeRow,
}: GradingSectionProps) {
  const [scaleOpen, setScaleOpen] = useState(false);
  const [assessOpen, setAssessOpen] = useState(false);
  const scaleBtnRef = useRef<HTMLButtonElement>(null);
  const assessBtnRef = useRef<HTMLButtonElement>(null);

  const hasPreset = !!data.gradingPresetId;
  const recommendedList = getRecommendedGrading(data.gradeLevelStructureId);
  const recommendedAssess = getRecommendedAssessment(data.gradeLevelStructureId);
  const currentPreset = GRADING_PRESETS.find((p) => p.id === data.gradingPresetId);

  const applyAssessment = (preset: AssessmentPreset) => {
    update("caWeight", preset.caWeight);
    update("examWeight", preset.examWeight);
    update("assignmentWeight", preset.assignmentWeight);
    update("testWeight", preset.testWeight);
    update("projectWeight", preset.projectWeight);
    setAssessOpen(false);
  };

  const applyGradingWithAssessment = (preset: GradingPreset) => {
    selectGradingPreset(preset.id);
    if (recommendedAssess) applyAssessment(recommendedAssess);
  };

  return (
    <SectionCard
      id="grading"
      title="Grading & Assessment"
      description="Choose a regional standard, then customize to fit your school"
      icon={<BarChart3 className="w-5 h-5" />}
      isComplete={isGradingComplete(data)}
      isExpanded={expanded === "grading"}
      onToggle={() => toggleSection("grading")}
    >
      {/* Layer 1: Starter banner when no preset selected */}
      {!hasPreset && recommendedList.length > 0 ? (
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
            {recommendedList.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyGradingWithAssessment(preset)}
                className="text-left p-3 rounded-lg border border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
              >
                <span className="text-[14px] font-medium text-[var(--foreground)]">{preset.label}</span>
                <p className="text-[12px] text-[var(--muted)]">{preset.description} · {preset.grades.length} grades</p>
              </button>
            ))}
          </div>
          <button
            ref={scaleBtnRef}
            type="button"
            onClick={() => setScaleOpen(true)}
            className="text-[13px] font-medium text-[#0891B2] hover:underline"
          >
            Browse all scales ({GRADING_PRESETS.length})
          </button>
        </div>
      ) : !hasPreset ? (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            ref={scaleBtnRef}
            type="button"
            onClick={() => setScaleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
          >
            <Layers className="w-4 h-4" />
            Choose grading scale
          </button>
        </div>
      ) : null}

      {/* Layer 2: Applied preset + editable table + assessment weights */}
      {hasPreset && data.gradingScale.length > 0 && (
        <>
          {/* Scale header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex-1 min-w-[180px]">
              <p className="text-[15px] font-medium text-[var(--foreground)]">
                {currentPreset?.label ?? "Custom"} Scale
              </p>
              <p className="text-[13px] text-[var(--muted)]">{currentPreset?.description}</p>
            </div>
            <button
              ref={scaleBtnRef}
              type="button"
              onClick={() => setScaleOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              Switch scale
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <button
              type="button"
              onClick={() => selectGradingPreset(data.gradingPresetId)}
              className="px-3 py-1.5 text-[13px] font-medium text-[#0891B2] hover:underline"
            >
              Reset to default
            </button>
          </div>

          {/* Grade boundaries table */}
          <div className="rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-[minmax(80px,1.2fr)_1fr_1fr_minmax(100px,1.5fr)_40px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)]">
              <span className="px-3 py-2 text-[12px] font-semibold text-[var(--muted)] uppercase">Grade</span>
              <span className="px-3 py-2 text-[12px] font-semibold text-[var(--muted)] uppercase">Min %</span>
              <span className="px-3 py-2 text-[12px] font-semibold text-[var(--muted)] uppercase">Max %</span>
              <span className="px-3 py-2 text-[12px] font-semibold text-[var(--muted)] uppercase">Descriptor</span>
              <span />
            </div>
            {data.gradingScale.map((row, i) => (
              <div
                key={`${row.grade}-${i}`}
                className={cn(
                  "grid grid-cols-[minmax(80px,1.2fr)_1fr_1fr_minmax(100px,1.5fr)_40px] gap-0 items-center",
                  i < data.gradingScale.length - 1 && "border-b border-[var(--border)]"
                )}
              >
                <input
                  value={row.grade}
                  onChange={(e) => updateGradeRow(i, "grade", e.target.value)}
                  className="px-3 py-2 text-[14px] font-medium bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5"
                />
                <input
                  value={row.minScore}
                  onChange={(e) => updateGradeRow(i, "minScore", e.target.value)}
                  type="number"
                  className="px-3 py-2 text-[14px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                />
                <input
                  value={row.maxScore}
                  onChange={(e) => updateGradeRow(i, "maxScore", e.target.value)}
                  type="number"
                  className="px-3 py-2 text-[14px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                />
                <input
                  value={row.descriptor ?? ""}
                  onChange={(e) => updateGradeRow(i, "descriptor" as keyof GradeRow, e.target.value)}
                  placeholder="e.g. Excellent"
                  className="px-3 py-2 text-[13px] bg-transparent text-[var(--muted)] focus:text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)] placeholder:text-[var(--muted)]/50"
                />
                <button
                  type="button"
                  onClick={() => removeGradeRow(i)}
                  className="flex items-center justify-center p-2 text-[var(--muted)] hover:text-red-500 transition-colors border-l border-[var(--border)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addGradeRow}
            className="flex items-center gap-1.5 px-3 py-2 mt-2 text-[14px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Grade
          </button>

          {/* Live preview */}
          <div className="mt-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] p-3">
            <p className="text-[12px] font-semibold text-[var(--muted)] uppercase mb-2">Preview: Score to Grade</p>
            <div className="flex flex-wrap gap-1.5">
              {[95, 80, 72, 65, 55, 45, 35, 20].map((score) => {
                const match = data.gradingScale.find(
                  (g) => score >= Number(g.minScore) && score <= Number(g.maxScore)
                );
                return (
                  <span key={score} className="inline-flex items-center gap-1 px-2 py-1 text-[13px] rounded-md bg-[var(--card)] border border-[var(--border)]">
                    <span className="text-[var(--muted)]">{score}%</span>
                    <span className="font-semibold text-[var(--foreground)]">= {match?.grade || "-"}</span>
                    {match?.descriptor && <span className="text-[var(--muted)] text-[11px]">({match.descriptor})</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Assessment weights */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex-1 min-w-[180px]">
                <p className="text-[15px] font-medium text-[var(--foreground)]">Assessment Structure</p>
                <p className="text-[13px] text-[var(--muted)]">
                  CA {data.caWeight}% + Exam {data.examWeight}% · Pass mark {data.passmark}%
                </p>
              </div>
              <button
                ref={assessBtnRef}
                type="button"
                onClick={() => setAssessOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
              >
                Use regional preset
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="CA Weight (%)" description="Continuous assessment weight">
                <TextInput value={data.caWeight} onChange={(v) => update("caWeight", v)} type="number" />
              </Field>
              <Field label="Exam Weight (%)" description="Terminal exam weight">
                <TextInput value={data.examWeight} onChange={(v) => update("examWeight", v)} type="number" />
              </Field>
              <Field label="Pass Mark (%)" description="Minimum to pass">
                <TextInput value={data.passmark} onChange={(v) => update("passmark", v)} type="number" />
              </Field>
            </div>
            <div className="mt-2">
              <Field label="GPA Scale" description="Enable GPA conversion (e.g. 4.0 scale)">
                <Toggle checked={data.gpaEnabled} onChange={(v) => update("gpaEnabled", v)} />
              </Field>
            </div>
          </div>

          {/* CA Breakdown */}
          <div className="mt-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-3">
            <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">
              CA Breakdown <span className="normal-case font-normal">(how the {data.caWeight || 40}% CA is split)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Assignments (%)" description="Weight for assignments">
                <TextInput value={data.assignmentWeight} onChange={(v) => update("assignmentWeight", v)} placeholder="e.g. 10" type="number" />
              </Field>
              <Field label="Tests (%)" description="Weight for class tests">
                <TextInput value={data.testWeight} onChange={(v) => update("testWeight", v)} placeholder="e.g. 20" type="number" />
              </Field>
              <Field label="Projects (%)" description="Weight for projects">
                <TextInput value={data.projectWeight} onChange={(v) => update("projectWeight", v)} placeholder="e.g. 10" type="number" />
              </Field>
            </div>
            {(() => {
              const total = (parseInt(data.assignmentWeight) || 0) + (parseInt(data.testWeight) || 0) + (parseInt(data.projectWeight) || 0);
              const caTotal = parseInt(data.caWeight) || 40;
              if (total > 0 && total !== caTotal) {
                return (
                  <p className={cn("text-sm font-medium", total > caTotal ? "text-red-500" : "text-amber-500")}>
                    Total: {total}%. {total > caTotal ? `Exceeds CA weight of ${caTotal}%` : `Should add up to ${caTotal}%`}
                  </p>
                );
              }
              if (total > 0 && total === caTotal) {
                return <p className="text-sm font-medium text-[#10B981]">Total: {total}% - matches CA weight</p>;
              }
              return null;
            })()}
          </div>
        </>
      )}

      {/* Scale popover */}
      {scaleOpen && (
        <GradingPresetPopover
          btnRef={scaleBtnRef}
          gradeLevelStructureId={data.gradeLevelStructureId}
          currentPresetId={data.gradingPresetId}
          onSelect={(presetId) => { selectGradingPreset(presetId); setScaleOpen(false); }}
          onClose={() => setScaleOpen(false)}
        />
      )}
      {/* Assessment popover */}
      {assessOpen && (
        <AssessmentPresetPopover
          btnRef={assessBtnRef}
          gradeLevelStructureId={data.gradeLevelStructureId}
          onSelect={(p) => { applyAssessment(p); }}
          onClose={() => setAssessOpen(false)}
        />
      )}
    </SectionCard>
  );
}

