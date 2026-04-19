"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GraduationCap, Clock, Plus, Trash2, X, CalendarDays, ChevronDown } from "lucide-react";
import { SectionCard, Field, TextInput, Select, Toggle } from "./form-primitives";
import { isAcademicComplete, isScheduleComplete } from "./setup-types";
import type { SetupData, DivisionSchedule, PeriodSlot, TermDate } from "./setup-types";
import { CALENDAR_TYPES, GRADE_LEVEL_STRUCTURES, SCHEDULE_PRESETS } from "../_constants/setup-data";
import type { SchedulePreset } from "../_constants/setup-data";
import { cn } from "@/lib/utils";
import { GroupLevelsEditor, GroupSectionsEditor, AcademicYearPicker } from "./group-editors";

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
  setCalendarType: (type: string) => void;
  selectGradeLevelStructure: (structureId: string) => void;
  customLevelInput: string;
  setCustomLevelInput: (v: string) => void;
  addCustomLevel: () => void;
  removeLevel: (level: string) => void;
  sections: string[];
  setSections: (sections: string[]) => void;
  newSection: string;
  setNewSection: (v: string) => void;
  // Term handlers (merged from former TermsSection)
  addTerm: () => void;
  updateTerm: (index: number, field: keyof TermDate, value: string) => void;
  removeTerm: (index: number) => void;
  rolloverTerms: () => void;
}

export function AcademicSection({
  data,
  update,
  expanded,
  toggleSection,
  setCalendarType,
  selectGradeLevelStructure,
  customLevelInput,
  setCustomLevelInput,
  addCustomLevel,
  removeLevel,
  sections,
  setSections,
  newSection,
  setNewSection,
  addTerm,
  updateTerm,
  removeTerm,
  rolloverTerms,
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
      <Field label="Calendar Type" description="How your academic year is divided. This creates your terms automatically.">
        <Select value={data.calendarType} onChange={setCalendarType} options={CALENDAR_TYPES} />
      </Field>
      {data.calendarType === "term" && (
        <div className="col-span-full -mt-2 flex items-start gap-2 p-3 rounded-lg bg-[#0891B2]/5 border border-[#0891B2]/20">
          <CalendarDays className="w-4 h-4 text-[#0891B2] mt-0.5 shrink-0" />
          <p className="text-[13px] text-[var(--muted)]">
            Pick this for a non-standard number of terms (e.g. 5 terms or 6 half-terms). You&apos;ll define them in the Terms section below.
          </p>
        </div>
      )}
      <Field label="Current Academic Year" description="Pick the year(s) this term runs. We'll format the label for you.">
        <AcademicYearPicker
          value={data.currentAcademicYear}
          onChange={(v) => update("currentAcademicYear", v)}
        />
      </Field>

      {/* ---- Terms (merged from former TermsSection) ---- */}
      {data.calendarType && (
        <div className="col-span-full pt-2 border-t border-[var(--border)]">
          <div className="flex items-start justify-between mb-3 gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-1">Terms &amp; Dates</p>
              <p className="text-sm text-[var(--muted)]">
                Rename terms if needed and set their dates. Each new academic year, click <span className="font-medium text-[var(--foreground)]">Roll over to next year</span> to shift dates forward.
              </p>
            </div>
            {data.terms.length > 0 && data.terms.some((t) => t.startDate || t.endDate) && (
              <button
                type="button"
                onClick={rolloverTerms}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#0891B2] border border-[#0891B2]/30 hover:bg-[#0891B2]/5 rounded-lg transition-colors"
              >
                <CalendarDays className="w-4 h-4" />
                Roll over to next year
              </button>
            )}
          </div>

          {data.terms.length > 0 ? (
            <div className="space-y-2">
              {data.terms.map((term, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]"
                >
                  <div className="flex-1 min-w-0">
                    <label className="block text-[13px] text-[var(--muted)] mb-1">Term name</label>
                    <input
                      value={term.name}
                      onChange={(e) => updateTerm(i, "name", e.target.value)}
                      className="w-full px-3 py-2 text-[15px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                      placeholder="e.g. First Term"
                    />
                  </div>
                  <div className="w-40">
                    <label className="block text-[13px] text-[var(--muted)] mb-1">Start</label>
                    <input
                      type="date"
                      value={term.startDate}
                      onChange={(e) => updateTerm(i, "startDate", e.target.value)}
                      className="w-full px-3 py-2 text-[15px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div className="w-40">
                    <label className="block text-[13px] text-[var(--muted)] mb-1">End</label>
                    <input
                      type="date"
                      value={term.endDate}
                      onChange={(e) => updateTerm(i, "endDate", e.target.value)}
                      className="w-full px-3 py-2 text-[15px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  {data.calendarType === "term" && (
                    <button
                      type="button"
                      onClick={() => removeTerm(i)}
                      className="self-end mb-0.5 p-2 text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] italic">
              {data.calendarType === "term"
                ? "No terms yet. Click \u201cAdd Term\u201d below to add your first one."
                : "Pick a calendar type above to auto-create terms."}
            </p>
          )}
          {data.calendarType === "term" && (
            <button
              type="button"
              onClick={addTerm}
              className="flex items-center gap-1.5 mt-3 px-3 py-2 text-sm font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Term
            </button>
          )}
        </div>
      )}

      {/* Grade Level Structure. regional presets */}
      <div>
        <label className="block text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
          Grade level system
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Choose a regional system, or pick Custom to define your own levels.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GRADE_LEVEL_STRUCTURES.map((structure) => {
            const isSelected = data.gradeLevelStructureId === structure.id;
            return (
              <button
                key={structure.id}
                type="button"
                onClick={() => selectGradeLevelStructure(structure.id)}
                className={cn(
                  "flex flex-col items-start gap-0.5 px-3.5 py-3 text-left rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-[#0891B2] bg-[#0891B2]/5"
                    : "border-[var(--border)] hover:border-[var(--muted)] bg-[var(--background-secondary)]/40"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={cn("text-[15px] font-medium", isSelected ? "text-[#0891B2]" : "text-[var(--foreground)]")}>
                    {structure.label}
                  </span>
                  <span className="text-[11px] text-[var(--muted)] uppercase tracking-wide">{structure.region}</span>
                </div>
                <span className="text-[13px] text-[var(--muted)]">{structure.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level groups. Settings-style editable list */}
      {data.gradeLevelStructureId && (
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
            Level groups
          </label>
          {(() => {
            const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
            if (structure && structure.groups.length > 0) {
              return (
                <div className="space-y-2">
                  {structure.groups.map((group) => (
                    <GroupLevelsEditor
                      key={group.name}
                      groupName={group.name}
                      presetLevels={group.levels}
                      activeGradeLevels={data.gradeLevels}
                      customLevels={data.customGroupLevels[group.name] ?? []}
                      onToggle={(level) => {
                        if (data.gradeLevels.includes(level)) {
                          removeLevel(level);
                        } else {
                          update("gradeLevels", [...data.gradeLevels, level]);
                        }
                      }}
                      onAddCustom={(level) => {
                        update("gradeLevels", [...data.gradeLevels, level]);
                        update("customGroupLevels", {
                          ...data.customGroupLevels,
                          [group.name]: [...(data.customGroupLevels[group.name] ?? []), level],
                        });
                      }}
                      onRemoveCustom={(level) => {
                        update("gradeLevels", data.gradeLevels.filter((l) => l !== level));
                        update("customGroupLevels", {
                          ...data.customGroupLevels,
                          [group.name]: (data.customGroupLevels[group.name] ?? []).filter((l) => l !== level),
                        });
                      }}
                    />
                  ))}
                </div>
              );
            }
            // Custom structure. flat list with add input
            return (
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
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
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customLevelInput}
                    onChange={(e) => setCustomLevelInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomLevel(); } }}
                    placeholder="Add a level (e.g. SSS 1)"
                    className="flex-1 max-w-xs px-3.5 py-2 text-[15px] bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
                  />
                  <button
                    type="button"
                    onClick={addCustomLevel}
                    disabled={!customLevelInput.trim()}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ---- Class Sections (per group) ---- */}
      {data.gradeLevels.length > 0 && (() => {
        const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
        const groups = structure?.groups?.length
          ? structure.groups.filter((g) => g.levels.some((l) => data.gradeLevels.includes(l)))
          : [{ name: "All Levels", levels: data.gradeLevels }];

        return (
          <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-4">
            <div>
              <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-1">Class Sections</p>
              <p className="text-sm text-[var(--muted)]">
                Set section suffixes per group. Leave empty for groups that don&apos;t need sections (e.g. single class per level).
              </p>
            </div>

            {groups.map((group) => (
              <GroupSectionsEditor
                key={group.name}
                groupName={group.name}
                groupLevels={group.levels.filter((l) => data.gradeLevels.includes(l))}
                sections={data.groupSections[group.name] ?? []}
                onChange={(newSections) =>
                  update("groupSections", { ...data.groupSections, [group.name]: newSections })
                }
              />
            ))}
          </div>
        );
      })()}
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
      description="Bell times and break schedule, configured per division"
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
                <p className="text-sm text-[var(--muted)]">
                  Select a <span className="font-medium text-[var(--foreground)]">Grade Level Structure</span> in the Academic Structure section above to configure separate schedules per division (e.g. Primary, Junior Secondary, Senior Secondary). Without it, a single schedule applies to all levels.
                </p>
              </div>
            )}
            {hasDivisions && (
              <p className="text-sm text-[var(--muted)]">
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
                    <span className="text-[15px] font-medium text-[var(--foreground)]">{division}</span>
                    <div className="flex items-center gap-2">
                      {divIdx > 0 && (
                        <select
                          value=""
                          onChange={(e) => { if (e.target.value) copyScheduleTo(e.target.value, division); }}
                          className="px-2 py-1 text-[13px] text-[#0891B2] bg-transparent border border-[#0891B2]/30 rounded-md cursor-pointer hover:bg-[#0891B2]/5"
                        >
                          <option value="" disabled>Copy from...</option>
                          {divisions.filter((d) => d !== division).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* Preset selector */}
                    <div className="flex items-center gap-2">
                      <SchedulePresetPicker
                        onSelect={(preset) => applySchedulePreset(division, preset)}
                      />
                      <span className="text-[13px] text-[var(--muted)]">or configure manually below</span>
                    </div>

                    {/* Time settings */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[14px] text-[var(--muted)] mb-1">Start</label>
                        <input
                          type="time"
                          value={current.startTime}
                          onChange={(e) => updateScheduleField(division, "startTime", e.target.value)}
                          className="w-full px-2 py-1.5 text-[14px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] text-[var(--muted)] mb-1">End <span className="text-[9px] font-normal opacity-70">(auto)</span></label>
                        <div className="w-full px-2 py-1.5 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-md text-[var(--muted)]">
                          {current.endTime || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] text-[var(--muted)] mb-1">Period (mins)</label>
                        <input
                          type="number"
                          value={current.periodDuration}
                          onChange={(e) => updateScheduleField(division, "periodDuration", e.target.value)}
                          placeholder="40"
                          className="w-full px-2 py-1.5 text-[14px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                        />
                      </div>
                    </div>

                    {/* Period table */}
                    {current.periods.length > 0 && (
                      <div className="rounded-md border border-[var(--border)] overflow-hidden">
                        <div className="grid grid-cols-[1fr_100px_100px_60px_36px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)]">
                          <span className="px-2 py-1.5 text-[14px] font-semibold text-[var(--muted)] uppercase">Label</span>
                          <span className="px-2 py-1.5 text-[14px] font-semibold text-[var(--muted)] uppercase">Start</span>
                          <span className="px-2 py-1.5 text-[14px] font-semibold text-[var(--muted)] uppercase">End</span>
                          <span className="px-2 py-1.5 text-[14px] font-semibold text-[var(--muted)] uppercase">Break</span>
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
                              className="px-2 py-2 text-[14px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5"
                              placeholder="Period name"
                            />
                            <input
                              value={p.startTime}
                              onChange={(e) => updateDivisionPeriod(division, i, "startTime", e.target.value)}
                              placeholder="08:00"
                              className="px-2 py-2 text-[14px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                            />
                            <input
                              value={p.endTime}
                              onChange={(e) => updateDivisionPeriod(division, i, "endTime", e.target.value)}
                              placeholder="08:40"
                              className="px-2 py-2 text-[14px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
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
                      className="flex items-center gap-1.5 px-2 py-1.5 text-[15px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-md transition-colors"
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

// ---------------------------------------------------------------------------
// SchedulePresetPicker — portal popover anchored to a trigger button
// ---------------------------------------------------------------------------

function usePopoverPos(anchor: React.RefObject<HTMLElement | null>, isOpen: boolean, width: number) {
  const [pos, setPos] = useState<{ top: number; left: number; maxH: number } | null>(null);
  useLayoutEffect(() => {
    if (!isOpen || !anchor.current) return;
    const update = () => {
      if (!anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const vw = typeof window !== "undefined" ? window.innerWidth : 0;
      const vh = typeof window !== "undefined" ? window.innerHeight : 0;
      let left = rect.left;
      if (left + width > vw - 12) left = vw - width - 12;
      if (left < 12) left = 12;
      const spaceBelow = vh - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      if (spaceBelow >= spaceAbove) {
        setPos({ top: rect.bottom + 8, left, maxH: spaceBelow - 12 });
      } else {
        const h = Math.min(spaceAbove - 12, vh * 0.7);
        setPos({ top: rect.top - h - 8, left, maxH: h });
      }
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [isOpen, anchor, width]);
  return pos;
}

function SchedulePresetPicker({ onSelect }: { onSelect: (p: SchedulePreset) => void }) {
  const WIDTH = 400;
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pos = usePopoverPos(btnRef, open, WIDTH);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-medium bg-[var(--card)] border border-[#0891B2]/30 text-[#0891B2] rounded-lg hover:bg-[#0891B2]/5 transition-colors"
      >
        Apply a preset
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && pos && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: WIDTH, maxHeight: pos.maxH }}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-[13px] font-medium text-[var(--foreground)]">Schedule presets</span>
            <button type="button" onClick={() => setOpen(false)} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {SCHEDULE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => { onSelect(preset); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-medium text-[var(--foreground)]">{preset.label}</span>
                  <span className="shrink-0 text-[11px] text-[var(--muted)]">{preset.startTime} - {preset.endTime}</span>
                </div>
                <p className="text-[12px] text-[var(--muted)]">
                  {preset.periods.filter((p) => !p.isBreak).length} teaching periods, {preset.periods.filter((p) => p.isBreak).length} breaks
                </p>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
