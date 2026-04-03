"use client";

import { BarChart3, Wallet, Plus, Trash2 } from "lucide-react";
import { SectionCard, Field, TextInput, Toggle } from "./form-primitives";
import { isGradingComplete, isFeesComplete } from "./setup-types";
import type { SetupData, GradeRow, FeeCategory } from "./setup-types";
import { GRADING_PRESETS, COMMON_FEE_CATEGORIES, FEE_PRESETS } from "../_constants/setup-data";
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
// GradingSection
// ---------------------------------------------------------------------------

interface GradingSectionProps extends SectionProps {
  selectGradingPreset: (presetId: string) => void;
  updateGradeRow: (index: number, field: keyof GradeRow, value: string) => void;
  addGradeRow: () => void;
  removeGradeRow: (index: number) => void;
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
      {/* Step 1: Choose a regional preset */}
      <div>
        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
          Start from preset
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => selectGradingPreset(preset.id)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg border transition-all",
                data.gradingPresetId === preset.id
                  ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Editable grading table (shown after selecting a preset) */}
      {data.gradingPresetId && data.gradingScale.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[13px] font-medium text-[var(--foreground)]">Grade Boundaries</p>
              <p className="text-[11px] text-[var(--muted)]">
                Customize the scale to match your school&apos;s requirements
              </p>
            </div>
            <button
              onClick={() => selectGradingPreset(data.gradingPresetId)}
              className="text-[11px] font-medium text-[#0891B2] hover:underline"
            >
              Reset to default
            </button>
          </div>

          <div className="rounded-lg border border-[var(--border)] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[minmax(80px,1.2fr)_1fr_1fr_40px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)]">
              <span className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase">Grade</span>
              <span className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase">Min %</span>
              <span className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase">Max %</span>
              <span />
            </div>
            {/* Table rows */}
            {data.gradingScale.map((row, i) => (
              <div
                key={i}
                className={cn(
                  "grid grid-cols-[minmax(80px,1.2fr)_1fr_1fr_40px] gap-0 items-center",
                  i < data.gradingScale.length - 1 && "border-b border-[var(--border)]"
                )}
              >
                <input
                  value={row.grade}
                  onChange={(e) => updateGradeRow(i, "grade", e.target.value)}
                  className="px-3 py-2.5 text-[12px] font-medium bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5"
                />
                <input
                  value={row.minScore}
                  onChange={(e) => updateGradeRow(i, "minScore", e.target.value)}
                  type="number"
                  className="px-3 py-2.5 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                />
                <input
                  value={row.maxScore}
                  onChange={(e) => updateGradeRow(i, "maxScore", e.target.value)}
                  type="number"
                  className="px-3 py-2.5 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                />
                <button
                  onClick={() => removeGradeRow(i)}
                  className="flex items-center justify-center p-2 text-[var(--muted)] hover:text-red-500 transition-colors border-l border-[var(--border)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addGradeRow}
            className="flex items-center gap-1.5 px-3 py-2 mt-2 text-[12px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Grade
          </button>

          {/* Live preview */}
          <div className="mt-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] p-3">
            <p className="text-[11px] font-semibold text-[var(--muted)] uppercase mb-2">Preview: Score → Grade</p>
            <div className="flex flex-wrap gap-1.5">
              {[95, 80, 72, 65, 55, 45, 35, 20].map((score) => {
                const match = data.gradingScale.find(
                  (g) => score >= Number(g.minScore) && score <= Number(g.maxScore)
                );
                return (
                  <span
                    key={score}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-[var(--card)] border border-[var(--border)]"
                  >
                    <span className="text-[var(--muted)]">{score}%</span>
                    <span className="font-semibold text-[var(--foreground)]">→ {match?.grade || "—"}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Assessment weights & pass mark */}
      <Field label="CA Weight (%)" description="Weight of continuous assessment">
        <TextInput value={data.caWeight} onChange={(v) => update("caWeight", v)} type="number" />
      </Field>
      <Field label="Exam Weight (%)" description="Weight of exam in final score">
        <TextInput value={data.examWeight} onChange={(v) => update("examWeight", v)} type="number" />
      </Field>
      <Field label="Pass Mark (%)" description="Minimum percentage to pass">
        <TextInput value={data.passmark} onChange={(v) => update("passmark", v)} type="number" />
      </Field>
      <Field label="GPA Scale" description="Enable 4.0 GPA scale">
        <Toggle checked={data.gpaEnabled} onChange={(v) => update("gpaEnabled", v)} />
      </Field>

      {/* CA Breakdown */}
      <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-3">
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
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
              <p className={cn("text-xs font-medium", total > caTotal ? "text-red-500" : "text-amber-500")}>
                Total: {total}% — {total > caTotal ? `exceeds CA weight of ${caTotal}%` : `should add up to ${caTotal}%`}
              </p>
            );
          }
          if (total > 0 && total === caTotal) {
            return <p className="text-xs font-medium text-[#10B981]">Total: {total}% — matches CA weight</p>;
          }
          return null;
        })()}
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// FeesSection
// ---------------------------------------------------------------------------

interface FeesSectionProps extends SectionProps {
  addFeeCategory: (name?: string) => void;
  updateFeeCategory: (index: number, field: keyof FeeCategory, value: string | boolean | string[] | Record<string, string>) => void;
  toggleFeeCategoryLevel: (index: number, level: string) => void;
  updateFeeCategoryAmount: (index: number, level: string, amount: string) => void;
  removeFeeCategory: (index: number) => void;
  applyFeePreset: (presetId: string) => void;
  feeCategoryInput: string;
  setFeeCategoryInput: (v: string) => void;
}

export function FeesSection({
  data,
  update,
  expanded,
  toggleSection,
  addFeeCategory,
  updateFeeCategory,
  toggleFeeCategoryLevel,
  applyFeePreset,
}: FeesSectionProps) {
  // Local state for custom category input
  const removeFeeCategory = (index: number) => {
    const updated = data.feeCategories.filter((_, i) => i !== index);
    update("feeCategories", updated);
  };

  const updateFeeCategoryAmount = (index: number, level: string, amount: string) => {
    const updated = [...data.feeCategories];
    updated[index] = {
      ...updated[index],
      amounts: { ...updated[index].amounts, [level]: amount },
    };
    update("feeCategories", updated);
  };

  return (
    <SectionCard
      id="fees"
      title="Fee Categories"
      description="Define the types of fees your school charges"
      icon={<Wallet className="w-5 h-5" />}
      isComplete={isFeesComplete(data)}
      isExpanded={expanded === "fees"}
      onToggle={() => toggleSection("fees")}
    >
      {/* Fee presets */}
      <div>
        <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {FEE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyFeePreset(preset.id)}
              className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
            >
              {preset.label}
              <span className="ml-1 text-[9px] opacity-60">({preset.fees.length})</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
          Common categories — click to add
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_FEE_CATEGORIES.map((cat) => {
            const isAdded = data.feeCategories.some((f) => f.name === cat);
            return (
              <button
                key={cat}
                onClick={() => { if (!isAdded) addFeeCategory(cat); }}
                disabled={isAdded}
                className={cn(
                  "px-2.5 py-1 text-[12px] font-medium rounded-lg border transition-colors",
                  isAdded
                    ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2] cursor-default"
                    : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {data.feeCategories.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
            Your fee structure
          </label>
          <p className="text-xs text-[var(--muted)] mb-3">
            Define fee categories, which grade levels they apply to, and set amounts per level.
          </p>
          <div className="space-y-2">
            {data.feeCategories.map((fee, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--border)] overflow-hidden"
              >
                {/* Category header row */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--background-secondary)]">
                  <input
                    value={fee.name}
                    onChange={(e) => updateFeeCategory(i, "name", e.target.value)}
                    className="flex-1 text-[13px] font-medium bg-transparent text-[var(--foreground)] focus:outline-none"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-[var(--muted)]">Required</span>
                    <Toggle checked={fee.mandatory} onChange={(v) => updateFeeCategory(i, "mandatory", v)} />
                  </div>
                  <button
                    onClick={() => removeFeeCategory(i)}
                    className="p-1 text-[var(--muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Applies to row */}
                <div className="px-3 py-2.5 flex items-start gap-3">
                  <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider shrink-0 pt-1">Applies to</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateFeeCategory(i, "appliesTo", "all")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors",
                        fee.appliesTo === "all"
                          ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                          : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                      )}
                    >
                      All Levels
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFeeCategory(i, "appliesTo", "specific")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors",
                        fee.appliesTo === "specific"
                          ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                          : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                      )}
                    >
                      Specific Levels
                    </button>
                    {fee.appliesTo === "specific" && data.gradeLevels.length > 0 && (
                      <>
                        <span className="text-[var(--border)] self-center">|</span>
                        {data.gradeLevels.map((level) => {
                          const selected = fee.gradeLevels.includes(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => toggleFeeCategoryLevel(i, level)}
                              className={cn(
                                "px-2 py-1 text-[11px] font-medium rounded-md border transition-colors",
                                selected
                                  ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                              )}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </>
                    )}
                    {fee.appliesTo === "specific" && data.gradeLevels.length === 0 && (
                      <span className="text-[11px] text-[var(--muted)] italic self-center">
                        Add grade levels in Academic Structure first
                      </span>
                    )}
                  </div>
                </div>
                {/* Amounts per grade level */}
                {(() => {
                  const levels =
                    fee.appliesTo === "all"
                      ? data.gradeLevels
                      : fee.gradeLevels;
                  const hasLevels = levels.length > 0;
                  const allSame = hasLevels && levels.length > 1 && levels.every((l) => fee.amounts[l] && fee.amounts[l] === fee.amounts[levels[0]]);
                  return (
                    <div className="px-3 py-2.5 border-t border-[var(--border)] space-y-2">
                      {!hasLevels ? (
                        <>
                          <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">Amount</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={fee.amounts["_flat"] || ""}
                              onChange={(e) => updateFeeCategoryAmount(i, "_flat", e.target.value)}
                              placeholder="0"
                              className="w-48 px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                            />
                            <span className="text-[10px] text-[var(--muted)]">
                              Set grade levels in Academic Structure for per-level pricing
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
                            Amount per level
                          </span>
                          {/* Set all at once */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[var(--muted)] shrink-0">Set all:</span>
                            <input
                              type="number"
                              placeholder="Same amount for all levels"
                              className="w-48 px-2 py-1.5 text-[12px] bg-[var(--card)] border border-dashed border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val) {
                                    const newAmounts = { ...fee.amounts };
                                    levels.forEach((l) => { newAmounts[l] = val; });
                                    updateFeeCategory(i, "amounts", newAmounts);
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  const newAmounts = { ...fee.amounts };
                                  levels.forEach((l) => { newAmounts[l] = val; });
                                  updateFeeCategory(i, "amounts", newAmounts);
                                }
                              }}
                            />
                            <span className="text-[10px] text-[var(--muted)]">
                              {allSame ? `All set to ${fee.amounts[levels[0]]}` : "Then adjust individual levels below"}
                            </span>
                          </div>
                          {/* Per-level amounts */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {levels.map((level) => (
                              <div key={level} className="flex items-center gap-1.5">
                                <span className="text-[11px] text-[var(--muted)] w-16 truncate shrink-0" title={level}>
                                  {level}
                                </span>
                                <input
                                  type="number"
                                  value={fee.amounts[level] || ""}
                                  onChange={(e) => updateFeeCategoryAmount(i, level, e.target.value)}
                                  placeholder="0"
                                  className="w-full px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <input
          type="text"
          placeholder="Add custom category..."
          className="w-48 px-2 py-1 text-sm bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) {
                addFeeCategory(val);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
      </div>
    </SectionCard>
  );
}
