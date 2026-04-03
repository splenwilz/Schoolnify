"use client";

import { GraduationCap, Clock, Plus, Trash2, X } from "lucide-react";
import { SectionCard, Field, TextInput, Select, Toggle } from "./form-primitives";
import { isAcademicComplete, isScheduleComplete } from "./setup-types";
import type { SetupData, DivisionSchedule, PeriodSlot } from "./setup-types";
import { CALENDAR_TYPES, GRADE_LEVEL_STRUCTURES, SCHEDULE_PRESETS } from "../_constants/setup-data";
import type { SchedulePreset } from "../_constants/setup-data";
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
// AcademicSection
// ---------------------------------------------------------------------------

interface AcademicSectionProps extends SectionProps {
  selectGradeLevelStructure: (structureId: string) => void;
  customLevelInput: string;
  setCustomLevelInput: (v: string) => void;
  addCustomLevel: () => void;
  removeLevel: (level: string) => void;
  sections: string[];
  setSections: (sections: string[]) => void;
  newSection: string;
  setNewSection: (v: string) => void;
}

export function AcademicSection({
  data,
  update,
  expanded,
  toggleSection,
  selectGradeLevelStructure,
  customLevelInput,
  setCustomLevelInput,
  addCustomLevel,
  removeLevel,
  sections,
  setSections,
  newSection,
  setNewSection,
}: AcademicSectionProps) {
  return (
    <SectionCard
      id="academic"
      title="Academic Structure"
      description="Calendar type, grade levels, and academic year"
      icon={<GraduationCap className="w-5 h-5" />}
      isComplete={isAcademicComplete(data)}
      isExpanded={expanded === "academic"}
      onToggle={() => toggleSection("academic")}
    >
      <Field label="Calendar Type" description="How your academic year is divided">
        <Select value={data.calendarType} onChange={(v) => update("calendarType", v)} options={CALENDAR_TYPES} />
      </Field>
      <Field label="Current Academic Year" description="e.g. 2025/2026">
        <TextInput value={data.currentAcademicYear} onChange={(v) => update("currentAcademicYear", v)} placeholder="e.g. 2025/2026" />
      </Field>

      {/* Grade Level Structure — regional presets */}
      <div>
        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
          Start from preset
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADE_LEVEL_STRUCTURES.map((structure) => (
            <button
              key={structure.id}
              onClick={() => selectGradeLevelStructure(structure.id)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg border transition-all",
                data.gradeLevelStructureId === structure.id
                  ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
              )}
            >
              {structure.label}
            </button>
          ))}
        </div>
      </div>

      {/* Level groups — Settings-style editable list */}
      {data.gradeLevelStructureId && (
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
            Level groups
          </label>
          {(() => {
            const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
            if (structure && structure.groups.length > 0) {
              return (
                <div className="space-y-2">
                  {structure.groups.map((group) => {
                    const activeLevels = group.levels.filter((l) => data.gradeLevels.includes(l));
                    const removedLevels = group.levels.filter((l) => !data.gradeLevels.includes(l));
                    return (
                      <div
                        key={group.name}
                        className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]"
                      >
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] text-[var(--muted)] mb-1">{group.name}</label>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {group.levels.map((level) => {
                              const isActive = data.gradeLevels.includes(level);
                              return (
                                <span
                                  key={level}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg border",
                                    isActive
                                      ? "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                                      : "bg-transparent border-dashed border-[var(--border)] text-[var(--muted)] opacity-40"
                                  )}
                                >
                                  {level}
                                  <button
                                    onClick={() => {
                                      if (isActive) {
                                        removeLevel(level);
                                      } else {
                                        update("gradeLevels", [...data.gradeLevels, level]);
                                      }
                                    }}
                                    className={cn(
                                      "ml-0.5 transition-colors",
                                      isActive ? "text-[var(--muted)] hover:text-red-500" : "text-[#0891B2] hover:text-[#0E7490]"
                                    )}
                                  >
                                    {isActive ? (
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                      </svg>
                                    )}
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            // Custom structure — show flat list of added levels
            return (
              <div className="flex flex-wrap items-center gap-2">
                {data.gradeLevels.map((level) => (
                  <span
                    key={level}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                  >
                    {level}
                    <button
                      onClick={() => removeLevel(level)}
                      className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            );
          })()}
          {/* Add custom level */}
          <div className="flex items-center gap-1 mt-2">
            <input
              type="text"
              value={customLevelInput}
              onChange={(e) => setCustomLevelInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addCustomLevel(); }}
              placeholder="+"
              className="w-24 px-2 py-1 text-sm text-center bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
            />
            {customLevelInput.trim() && (
              <button
                onClick={addCustomLevel}
                className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-1.5">
            Type a level name and press Enter to add. Click <strong>&times;</strong> to remove a level.
          </p>
        </div>
      )}

      {/* ---- Class Sections ---- */}
      {data.gradeLevels.length > 0 && (
        <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-4">
          <div>
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-1">Class Sections</p>
            <p className="text-xs text-[var(--muted)]">
              Define section letters (A, B, C...) appended to each grade level to form class names
            </p>
          </div>

          {/* Sections Editor */}
          <div className="flex flex-wrap items-center gap-2">
            {sections.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
              >
                {s}
                <button
                  onClick={() => setSections(sections.filter((x) => x !== s))}
                  className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value.toUpperCase().slice(0, 2))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSection && !sections.includes(newSection)) {
                    setSections([...sections, newSection]);
                    setNewSection("");
                  }
                }}
                placeholder="+"
                className="w-10 px-2 py-1 text-sm text-center bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
              />
              {newSection && !sections.includes(newSection) && (
                <button
                  onClick={() => {
                    setSections([...sections, newSection]);
                    setNewSection("");
                  }}
                  className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Preview using actual grade levels + sections */}
          {sections.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Preview
              </label>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="flex flex-wrap gap-1.5">
                  {data.gradeLevels.slice(0, 4).map((level) => (
                    sections.map((s) => (
                      <span
                        key={`${level}-${s}`}
                        className="px-2 py-0.5 text-xs font-medium rounded bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]"
                      >
                        {level}{s}
                      </span>
                    ))
                  ))}
                  {data.gradeLevels.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-[var(--muted)]">
                      +{(data.gradeLevels.length - 4) * sections.length} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// ScheduleSection
// ---------------------------------------------------------------------------

interface ScheduleSectionProps extends SectionProps {
  getScheduleDivisions: () => string[];
  getOrCreateSchedule: (division: string) => DivisionSchedule;
  updateScheduleField: (division: string, field: keyof Omit<DivisionSchedule, "periods">, value: string) => void;
  updateDivisionPeriod: (division: string, index: number, field: keyof PeriodSlot, value: string | boolean) => void;
  addDivisionPeriod: (division: string) => void;
  removeDivisionPeriod: (division: string, index: number) => void;
  copyScheduleTo: (fromDivision: string, toDivision: string) => void;
  applySchedulePreset: (division: string, preset: SchedulePreset) => void;
}

export function ScheduleSection({
  data,
  expanded,
  toggleSection,
  getScheduleDivisions,
  getOrCreateSchedule,
  updateScheduleField,
  updateDivisionPeriod,
  addDivisionPeriod,
  removeDivisionPeriod,
  copyScheduleTo,
  applySchedulePreset,
}: ScheduleSectionProps) {
  return (
    <SectionCard
      id="schedule"
      title="School Hours & Periods"
      description="Bell times and break schedule — configured per division"
      icon={<Clock className="w-5 h-5" />}
      isComplete={isScheduleComplete(data)}
      isExpanded={expanded === "schedule"}
      onToggle={() => toggleSection("schedule")}
    >
      {(() => {
        const divisions = getScheduleDivisions();
        const hasDivisions = data.gradeLevelStructureId && divisions.length > 1;
        return (
          <div className="space-y-4">
            {!data.gradeLevelStructureId && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0891B2]/5 border border-[#0891B2]/20">
                <Clock className="w-4 h-4 text-[#0891B2] mt-0.5 shrink-0" />
                <p className="text-xs text-[var(--muted)]">
                  Select a <span className="font-medium text-[var(--foreground)]">Grade Level Structure</span> in the Academic Structure section above to configure separate schedules per division (e.g. Primary, Junior Secondary, Senior Secondary). Without it, a single schedule applies to all levels.
                </p>
              </div>
            )}
            {hasDivisions && (
              <p className="text-xs text-[var(--muted)]">
                Each division can have its own start/end times, period lengths, and break schedule. Use a preset to get started quickly.
              </p>
            )}
            {divisions.map((division, divIdx) => {
              const schedule = getOrCreateSchedule(division);
              const current = data.schedules[division] || schedule;
              return (
                <div key={division} className="rounded-lg border border-[var(--border)] overflow-hidden">
                  {/* Division header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[var(--background-secondary)]">
                    <span className="text-[13px] font-medium text-[var(--foreground)]">{division}</span>
                    <div className="flex items-center gap-2">
                      {divIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => copyScheduleTo(divisions[0], division)}
                          className="text-[11px] text-[#0891B2] hover:underline"
                        >
                          Copy from {divisions[0]}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* Preset selector */}
                    <div>
                      <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
                      <div className="flex flex-wrap gap-1.5">
                        {SCHEDULE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => applySchedulePreset(division, preset)}
                            className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time settings */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-[var(--muted)] mb-1">Start</label>
                        <input
                          type="time"
                          value={current.startTime}
                          onChange={(e) => updateScheduleField(division, "startTime", e.target.value)}
                          className="w-full px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--muted)] mb-1">End <span className="text-[9px] font-normal opacity-70">(auto)</span></label>
                        <div className="w-full px-2 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-md text-[var(--muted)]">
                          {current.endTime || "—"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--muted)] mb-1">Period (mins)</label>
                        <input
                          type="number"
                          value={current.periodDuration}
                          onChange={(e) => updateScheduleField(division, "periodDuration", e.target.value)}
                          placeholder="40"
                          className="w-full px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                        />
                      </div>
                    </div>

                    {/* Period table */}
                    {current.periods.length > 0 && (
                      <div className="rounded-md border border-[var(--border)] overflow-hidden">
                        <div className="grid grid-cols-[1fr_100px_100px_60px_36px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)]">
                          <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">Label</span>
                          <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">Start</span>
                          <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">End</span>
                          <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">Break</span>
                          <span />
                        </div>
                        {current.periods.map((p, i) => (
                          <div
                            key={i}
                            className={cn(
                              "grid grid-cols-[1fr_100px_100px_60px_36px] gap-0 items-center",
                              i < current.periods.length - 1 && "border-b border-[var(--border)]",
                              p.isBreak && "bg-[#F59E0B]/5"
                            )}
                          >
                            <input
                              value={p.label}
                              onChange={(e) => updateDivisionPeriod(division, i, "label", e.target.value)}
                              className="px-2 py-2 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5"
                              placeholder="Period name"
                            />
                            <input
                              value={p.startTime}
                              onChange={(e) => updateDivisionPeriod(division, i, "startTime", e.target.value)}
                              placeholder="08:00"
                              className="px-2 py-2 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                            />
                            <input
                              value={p.endTime}
                              onChange={(e) => updateDivisionPeriod(division, i, "endTime", e.target.value)}
                              placeholder="08:40"
                              className="px-2 py-2 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                            />
                            <div className="flex items-center justify-center border-l border-[var(--border)]">
                              <Toggle checked={p.isBreak} onChange={(v) => updateDivisionPeriod(division, i, "isBreak", v)} />
                            </div>
                            <button
                              onClick={() => removeDivisionPeriod(division, i)}
                              className="flex items-center justify-center p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors border-l border-[var(--border)]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => addDivisionPeriod(division)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-md transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add Period
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </SectionCard>
  );
}
