"use client";

import { cn } from "@/lib/utils";
import { BookOpen, CalendarDays, Shield, Plus, Trash2, X } from "lucide-react";
import { SectionCard, Field, Toggle, TextInput, Select } from "./form-primitives";
import { isSubjectsComplete, isTermsComplete, isPoliciesComplete, SUBJECT_DEPARTMENTS } from "./setup-types";
import type { SetupData, TermDate, PromotionRule } from "./setup-types";
import { COMMON_SUBJECTS, CALENDAR_TYPES, PROMOTION_CRITERIA } from "../_constants/setup-data";

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
// 1. SubjectsSection
// ---------------------------------------------------------------------------

interface SubjectsSectionProps extends SectionProps {
  subjectInput: string;
  setSubjectInput: (v: string) => void;
  addSubject: () => void;
  toggleSubject: (subject: string) => void;
}

export function SubjectsSection({
  data,
  update,
  expanded,
  toggleSection,
  subjectInput,
  setSubjectInput,
  addSubject,
  toggleSubject,
}: SubjectsSectionProps) {
  // Known department for each subject
  const SUBJECT_DEPT_MAP: Record<string, string> = {
    // Science
    "Mathematics": "science", "Further Mathematics": "science", "Biology": "science",
    "Chemistry": "science", "Physics": "science", "Science": "science",
    "Agricultural Science": "science", "Health Education": "science",
    "Algebra": "science", "Geometry": "science", "Calculus": "science",
    "Statistics": "science", "Earth Science": "science", "Environmental Science": "science",
    // Languages
    "English Language": "languages", "French": "languages", "Arabic": "languages",
    "Spanish": "languages", "German": "languages", "Mandarin": "languages",
    "Portuguese": "languages", "Swahili": "languages",
    "Yoruba": "languages", "Igbo": "languages", "Hausa": "languages",
    "English Literature": "languages", "Literature in English": "languages",
    // Arts
    "Fine Art": "arts", "Art": "arts", "Music": "arts", "Drama": "arts",
    "Media Studies": "arts",
    // Humanities
    "History": "humanities", "Geography": "humanities", "Social Studies": "humanities",
    "Civic Education": "humanities", "Religious Studies": "humanities",
    "Religious Education": "humanities", "Government": "humanities",
    "Citizenship": "humanities", "US History": "humanities", "World History": "humanities",
    "Psychology": "humanities", "Sociology": "humanities",
    // Commercial
    "Economics": "commercial", "Commerce": "commercial", "Accounting": "commercial",
    "Business Studies": "commercial",
    // Technology
    "Computer Science": "technology", "Technical Drawing": "technology",
    "ICT": "technology", "Design & Technology": "technology",
    "Food Technology": "technology",
    // General / Vocational
    "Physical Education": "general", "Health": "general",
    "Home Economics": "vocational",
  };

  const SUBJECT_PRESETS: { id: string; label: string; subjects: string[] }[] = [
    {
      id: "primary_core",
      label: "Primary Core",
      subjects: ["Mathematics", "English Language", "Science", "Social Studies", "Geography", "History", "Art", "Music", "Physical Education", "Health", "Religious Education", "French"],
    },
    {
      id: "us_high",
      label: "US High School",
      subjects: ["Algebra", "Geometry", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "US History", "World History", "Geography", "Economics", "Computer Science", "Spanish", "Art", "Music", "Drama", "Physical Education", "Health", "Psychology", "Environmental Science", "Statistics"],
    },
    {
      id: "uk_gcse",
      label: "UK Secondary (GCSE)",
      subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Geography", "History", "French", "Spanish", "Religious Education", "Art", "Music", "Drama", "Design & Technology", "Computer Science", "Physical Education", "Citizenship", "Business Studies", "Food Technology", "Media Studies"],
    },
    {
      id: "ng_science",
      label: "West Africa \u2014 Science",
      subjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics", "Further Mathematics", "Computer Science", "Geography", "Civic Education", "Agricultural Science", "Literature in English", "Economics"],
    },
    {
      id: "ng_arts",
      label: "West Africa \u2014 Arts",
      subjects: ["Mathematics", "English Language", "Literature in English", "Government", "History", "Economics", "Civic Education", "Religious Studies", "French", "Fine Art", "Music", "Geography"],
    },
    {
      id: "ng_commercial",
      label: "West Africa \u2014 Commercial",
      subjects: ["Mathematics", "English Language", "Economics", "Commerce", "Accounting", "Business Studies", "Government", "Civic Education", "Computer Science", "Geography", "Literature in English"],
    },
  ];

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
      {/* Subject presets */}
      <div>
        <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {SUBJECT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                update("subjects", Array.from(new Set([...data.subjects, ...preset.subjects])));
                const depts = { ...data.subjectDepartments };
                for (const subj of preset.subjects) {
                  if (!depts[subj] && SUBJECT_DEPT_MAP[subj]) {
                    depts[subj] = SUBJECT_DEPT_MAP[subj];
                  }
                }
                update("subjectDepartments", depts);
              }}
              className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
          Common subjects — click to add
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SUBJECTS.map((subject) => {
            const isSelected = data.subjects.includes(subject);
            return (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={cn(
                  "px-2.5 py-1 text-[12px] font-medium rounded-lg border transition-colors",
                  isSelected
                    ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                    : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {subject}
              </button>
            );
          })}
        </div>
      </div>

      {data.subjects.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
            Selected subjects ({data.subjects.length})
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {data.subjects.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
              >
                {s}
                <button
                  onClick={() => toggleSubject(s)}
                  className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <input
          type="text"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addSubject(); }}
          placeholder="Add custom subject..."
          className="w-48 px-2 py-1 text-sm bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
        />
        {subjectInput.trim() && (
          <button
            onClick={addSubject}
            className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}
      </div>

      {/* Subject Departments */}
      {data.subjects.length > 0 && (
        <div className="mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
            Assign departments <span className="normal-case font-normal">(optional — helps with timetabling and reporting)</span>
          </p>
          <div className="space-y-1.5">
            {data.subjects.map((subj) => (
              <div key={subj} className="flex items-center gap-3">
                <span className="text-[13px] text-[var(--foreground)] w-40 truncate shrink-0" title={subj}>{subj}</span>
                <select
                  value={data.subjectDepartments[subj] || ""}
                  onChange={(e) => {
                    update("subjectDepartments", { ...data.subjectDepartments, [subj]: e.target.value });
                  }}
                  className="px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                >
                  <option value="">No department</option>
                  {SUBJECT_DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
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
        <p className="text-xs text-[var(--muted)]">
          {data.currentAcademicYear ? (
            <>Dates below are for the <span className="font-medium text-[var(--foreground)]">{data.currentAcademicYear}</span> academic year. </>
          ) : (
            <>Set your current academic year in Academic Structure above. </>
          )}
          The term structure (names and count) stays the same each year — only the dates need updating when a new session begins.
        </p>
      </div>

      {/* Term presets */}
      <div>
        <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
        <div className="flex flex-wrap gap-1.5">
          {getRelevantTermPresets().map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyTermPreset(preset.id)}
              className={cn(
                "px-2.5 py-1.5 text-[11px] font-medium rounded-md border transition-colors",
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
                <label className="block text-[10px] text-[var(--muted)] mb-1">Name</label>
                <input
                  value={term.name}
                  onChange={(e) => updateTerm(i, "name", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                  placeholder="e.g. First Term"
                />
              </div>
              <div className="w-36">
                <label className="block text-[10px] text-[var(--muted)] mb-1">Start Date</label>
                <input
                  type="date"
                  value={term.startDate}
                  onChange={(e) => updateTerm(i, "startDate", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div className="w-36">
                <label className="block text-[10px] text-[var(--muted)] mb-1">End Date</label>
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
        <p className="text-[12px] text-[var(--muted)]">No terms added yet. Add your first term below.</p>
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

// ---------------------------------------------------------------------------
// 3. PoliciesSection
// ---------------------------------------------------------------------------

interface PoliciesSectionProps extends SectionProps {
  updatePromotionRule: <K extends keyof PromotionRule>(field: K, value: PromotionRule[K]) => void;
}

export function PoliciesSection({
  data,
  update,
  expanded,
  toggleSection,
  updatePromotionRule,
}: PoliciesSectionProps) {
  return (
    <SectionCard
      id="policies"
      title="Policies"
      description="School policies for attendance, promotion, and discipline"
      icon={<Shield className="w-5 h-5" />}
      isComplete={isPoliciesComplete(data)}
      isExpanded={expanded === "policies"}
      onToggle={() => toggleSection("policies")}
    >
      <Field label="Late Arrival Grace Period" description="Minutes allowed before marked late">
        <TextInput value={data.lateGracePeriod} onChange={(v) => update("lateGracePeriod", v)} placeholder="e.g. 15" type="number" />
      </Field>
      <Field label="Attendance Threshold (%)" description="Minimum attendance percentage before flagging">
        <TextInput value={data.attendanceThreshold} onChange={(v) => update("attendanceThreshold", v)} placeholder="e.g. 75" type="number" />
      </Field>
      <Field label="Promotion Criteria" description="How students are promoted to the next level">
        <Select value={data.promotionCriteria} onChange={(v) => update("promotionCriteria", v)} options={PROMOTION_CRITERIA} />
      </Field>

      {data.promotionCriteria && (
        <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-4">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Promotion Rules</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Min. Subjects to Pass" description="Minimum number of subjects a student must pass">
              <TextInput value={data.promotionRules.minSubjectsToPass} onChange={(v) => updatePromotionRule("minSubjectsToPass", v)} placeholder="e.g. 5" type="number" />
            </Field>
            <Field label="Max Repeats Allowed" description="Maximum times a student can repeat a level">
              <TextInput value={data.promotionRules.maxRepeats} onChange={(v) => updatePromotionRule("maxRepeats", v)} placeholder="e.g. 1" type="number" />
            </Field>
          </div>
          <Field label="Required Subjects" description="Subjects that must be passed for promotion (select from your subjects list)">
            <div className="flex flex-wrap gap-2">
              {data.subjects.length === 0 && (
                <p className="text-xs text-[var(--muted)] italic">Add subjects in the &ldquo;Subjects Offered&rdquo; section first</p>
              )}
              {data.subjects.map((subj) => {
                const isSelected = data.promotionRules.requiredSubjects.includes(subj);
                return (
                  <button key={subj} type="button"
                    onClick={() => { const current = data.promotionRules.requiredSubjects; updatePromotionRule("requiredSubjects", isSelected ? current.filter((s) => s !== subj) : [...current, subj]); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isSelected ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]/20"}`}
                  >{subj}</button>
                );
              })}
            </div>
          </Field>
          <Field label="Allow Remedial Exams" description="Students who fail can retake exams before being held back">
            <Toggle checked={data.promotionRules.allowRemedial} onChange={(v) => updatePromotionRule("allowRemedial", v)} />
          </Field>
        </div>
      )}

      <Field label="Discipline System" description="Enable disciplinary tracking and records">
        <Toggle checked={data.disciplineSystem} onChange={(v) => update("disciplineSystem", v)} />
      </Field>
    </SectionCard>
  );
}
