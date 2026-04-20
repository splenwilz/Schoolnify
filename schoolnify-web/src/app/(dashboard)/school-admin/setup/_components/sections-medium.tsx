"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { SectionCard, Field, TextInput } from "./form-primitives";
import { isTermsComplete } from "./setup-types";
import type { SetupData, TermDate } from "./setup-types";
import { CALENDAR_TYPES } from "../_constants/setup-data";

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
// 2. TermsSection
// ---------------------------------------------------------------------------

interface TermsSectionProps extends SectionProps {
  addTerm: () => void;
  updateTerm: (index: number, field: keyof TermDate, value: string) => void;
  removeTerm: (index: number) => void;
  applyTermPreset: (presetId: string) => void;
  getRelevantTermPresets: () => { id: string; label: string; terms: { name: string }[]; calendarTypes?: string[] }[];
}

export function TermsSection({
  data,
  update,
  expanded,
  toggleSection,
  addTerm,
  updateTerm,
  removeTerm,
  applyTermPreset,
  getRelevantTermPresets,
}: TermsSectionProps) {
  return (
    <SectionCard
      id="terms"
      title="Term / Session Dates"
      description="Term structure and dates for the current academic year"
      icon={<CalendarDays className="w-5 h-5" />}
      isComplete={isTermsComplete(data)}
      isExpanded={expanded === "terms"}
      onToggle={() => toggleSection("terms")}
    >
      {/* Year context note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0891B2]/5 border border-[#0891B2]/20">
        <CalendarDays className="w-4 h-4 text-[#0891B2] mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--muted)]">
          {data.currentAcademicYear ? (
            <>Dates below are for the <span className="font-medium text-[var(--foreground)]">{data.currentAcademicYear}</span> academic year. </>
          ) : (
            <>Set your current academic year in Academic Structure above. </>
          )}
          The term structure (names and count) stays the same each year. Only the dates need updating when a new session begins.
        </p>
      </div>

      {/* Term presets */}
      <div>
        <label className="block text-[14px] text-[var(--muted)] mb-1.5">Quick Start. Apply a Preset</label>
        <div className="flex flex-wrap gap-1.5">
          {getRelevantTermPresets().map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyTermPreset(preset.id)}
              className={cn(
                "px-2.5 py-1.5 text-[15px] font-medium rounded-md border transition-colors",
                preset.calendarTypes?.includes(data.calendarType)
                  ? "border-[#0891B2]/30 bg-[#0891B2]/5 text-[#0891B2] hover:bg-[#0891B2]/10"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5"
              )}
            >
              {preset.label}
              {preset.calendarTypes?.includes(data.calendarType) && (
                <span className="ml-1 text-[9px] opacity-70">recommended</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {data.terms.length > 0 ? (
        <div className="space-y-2">
          {data.terms.map((term, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]"
            >
              <div className="flex-1 min-w-0">
                <label className="block text-[14px] text-[var(--muted)] mb-1">Name</label>
                <input
                  value={term.name}
                  onChange={(e) => updateTerm(i, "name", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                  placeholder="e.g. First Term"
                />
              </div>
              <div className="w-36">
                <label className="block text-[14px] text-[var(--muted)] mb-1">Start Date</label>
                <input
                  type="date"
                  value={term.startDate}
                  onChange={(e) => updateTerm(i, "startDate", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div className="w-36">
                <label className="block text-[14px] text-[var(--muted)] mb-1">End Date</label>
                <input
                  type="date"
                  value={term.endDate}
                  onChange={(e) => updateTerm(i, "endDate", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <button
                onClick={() => removeTerm(i)}
                className="self-end mb-0.5 p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[14px] text-[var(--muted)]">No terms added yet. Add your first term below.</p>
      )}
      <button
        onClick={addTerm}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Term
      </button>
    </SectionCard>
  );
}

