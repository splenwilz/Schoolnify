"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Shield, ChevronDown, X } from "lucide-react";
import { SectionCard, Field, TextInput, Toggle } from "./form-primitives";
import { isPoliciesComplete } from "./setup-types";
import type { SetupData, PromotionRule } from "./setup-types";
import { PROMOTION_CRITERIA, GRADE_LEVEL_STRUCTURES } from "../_constants/setup-data";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Option data
// ---------------------------------------------------------------------------

const TRACKING_METHODS = [
  { label: "Daily", value: "daily" },
  { label: "Per Subject", value: "per_subject" },
];

const DISCIPLINE_FRAMEWORKS = [
  { label: "Merit / Demerit Points", value: "merit_demerit" },
  { label: "Behavior Levels", value: "behavior_levels" },
  { label: "Incident Logging", value: "incident_logging" },
  { label: "House Points", value: "house_points" },
  { label: "Restorative Justice", value: "restorative" },
];

const POINT_RESET_OPTIONS = [
  { label: "Per Term", value: "per_term" },
  { label: "Per Semester", value: "per_semester" },
  { label: "Per Year", value: "per_year" },
  { label: "Never", value: "never" },
];

const HOMEWORK_LATE_POLICIES = [
  { label: "% per day", value: "percentage_per_day" },
  { label: "Flat deduction", value: "flat" },
  { label: "No penalty", value: "none" },
];

const DEFAULT_ABSENCE_CATEGORIES = [
  "Excused", "Unexcused", "Medical", "School Activity", "Suspended",
  "Bereavement", "Religious Observance", "Late Arrival", "Early Departure",
];

const DEFAULT_OFFENSES = [
  "Late to class", "Incomplete homework", "Dress code violation",
  "Disrespect", "Unauthorized phone use", "Skipping class", "Cheating",
  "Fighting", "Bullying", "Vandalism", "Substance abuse", "Theft",
];

const DEFAULT_CONSEQUENCES = [
  "Verbal warning", "Written warning", "Detention",
  "Parent meeting", "In-school suspension", "Out-of-school suspension",
  "Expulsion hearing",
];

const NOTIFICATION_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "whatsapp", label: "WhatsApp" },
];

// ---------------------------------------------------------------------------
// Reusable: Inline pill picker (replaces native <select> -- no scroll blocking)
// ---------------------------------------------------------------------------

function PillPicker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors",
            opt.value === value
              ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/20"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editable tag list
// ---------------------------------------------------------------------------

function TagList({
  items, onChange, defaults, defaultsLabel, placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  defaults: string[];
  defaultsLabel: string;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const add = (val: string) => {
    const t = val.trim();
    if (t && !items.includes(t)) onChange([...items, t]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-[13px] font-medium rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]">
            {item}
            <button type="button" onClick={() => onChange(items.filter((i) => i !== item))} className="p-0.5 rounded hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { e.preventDefault(); add(input); setInput(""); } }}
          placeholder={placeholder}
          className="flex-1 max-w-[250px] px-2.5 py-1.5 text-[13px] bg-[var(--card)] border border-dashed border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
        />
        {items.length === 0 && (
          <button type="button" onClick={() => onChange([...defaults])} className="text-[12px] font-medium text-[#0891B2] hover:underline">
            {defaultsLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible sub-section
// ---------------------------------------------------------------------------

function SubSection({ title, description, defaultOpen, children }: {
  title: string; description: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80 transition-colors"
      >
        <div className="text-left">
          <p className="text-[14px] font-medium text-[var(--foreground)]">{title}</p>
          <p className="text-[12px] text-[var(--muted)]">{description}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-[var(--muted)] transition-transform shrink-0", open && "rotate-180")} />
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PoliciesSection
// ---------------------------------------------------------------------------

interface PoliciesSectionProps {
  data: SetupData;
  update: <K extends keyof SetupData>(key: K, value: SetupData[K]) => void;
  expanded: string;
  toggleSection: (id: string) => void;
  updatePromotionRule: <K extends keyof PromotionRule>(field: K, value: PromotionRule[K]) => void;
}

export function PoliciesSection({ data, update, expanded, toggleSection, updatePromotionRule }: PoliciesSectionProps) {
  return (
    <SectionCard
      id="policies"
      title="Policies & Rules"
      description="Attendance, promotion, discipline, notifications, and more"
      icon={<Shield className="w-5 h-5" />}
      isComplete={isPoliciesComplete(data)}
      isExpanded={expanded === "policies"}
      onToggle={() => toggleSection("policies")}
    >
      <div className="space-y-4">
        {/* ---- 1. Attendance ---- */}
        <SubSection title="Attendance Policy" description="Tracking method, thresholds, and absence categories">
          {/* Per-group tracking method */}
          {(() => {
            const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
            const groups = structure?.groups.map((g) => g.name) ?? [];
            if (groups.length === 0) {
              return (
                <Field label="Tracking Method" description="How attendance is recorded (set grade levels first for per-group config)">
                  <MiniDropdown
                    value={data.attendanceTrackingMethods["_default"] ?? "daily"}
                    onChange={(v) => update("attendanceTrackingMethods", { ...data.attendanceTrackingMethods, _default: v as "daily" | "per_subject" })}
                    options={TRACKING_METHODS}
                  />
                </Field>
              );
            }
            return (
              <Field label="Tracking Method" description="Set per group since primary and secondary often differ">
                <div className="space-y-1.5">
                  {groups.map((group) => (
                    <div key={group} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[var(--background-secondary)]">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">{group}</span>
                      <MiniDropdown
                        value={data.attendanceTrackingMethods[group] ?? "daily"}
                        onChange={(v) => update("attendanceTrackingMethods", { ...data.attendanceTrackingMethods, [group]: v as "daily" | "per_subject" })}
                        options={TRACKING_METHODS}
                      />
                    </div>
                  ))}
                </div>
              </Field>
            );
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Minimum Attendance (%)" description="Below this, student is flagged">
              <TextInput value={data.attendanceThreshold} onChange={(v) => update("attendanceThreshold", v)} type="number" placeholder="75" />
            </Field>
            <Field label="Late Grace Period (min)" description="Minutes before marked late">
              <TextInput value={data.lateGracePeriod} onChange={(v) => update("lateGracePeriod", v)} type="number" placeholder="15" />
            </Field>
            <Field label="Tardies = 1 Absence" description="Number of lates that count as one absence">
              <TextInput value={data.tardiesToAbsence} onChange={(v) => update("tardiesToAbsence", v)} type="number" placeholder="3" />
            </Field>
            <Field label="Consecutive Absence Alert" description="Notify parent after this many consecutive absences">
              <TextInput value={data.consecutiveAbsenceAlert} onChange={(v) => update("consecutiveAbsenceAlert", v)} type="number" placeholder="3" />
            </Field>
          </div>
          <Field label="Absence Categories" description="These appear as options when teachers mark a student absent. Reports will break down absences by category.">
            <TagList items={data.absenceCategories} onChange={(v) => update("absenceCategories", v)} defaults={DEFAULT_ABSENCE_CATEGORIES} defaultsLabel="Use common defaults" placeholder="Add category + Enter" />
          </Field>
        </SubSection>

        {/* ---- 2. Promotion ---- */}
        <SubSection title="Promotion Policy" description="How students advance to the next grade level">
          <Field label="Promotion Mode" description="How promotion decisions are made">
            <MiniDropdown value={data.promotionCriteria} onChange={(v) => update("promotionCriteria", v)} options={PROMOTION_CRITERIA} />
          </Field>
          {/* Pass mark reference from Grading section */}
          <div className="px-3 py-2 rounded-lg bg-[var(--background-secondary)] flex items-center gap-2">
            <span className="text-[13px] text-[var(--muted)]">Pass mark:</span>
            <span className="text-[14px] font-medium text-[var(--foreground)]">{data.passmark || "40"}%</span>
            <span className="text-[12px] text-[var(--muted)]">(set in Grading & Assessment)</span>
          </div>
          <Field label="Max Repeats Allowed" description="Maximum times a student can repeat a level">
            <TextInput value={data.promotionRules.maxRepeats} onChange={(v) => updatePromotionRule("maxRepeats", v)} type="number" placeholder="1" />
          </Field>
          <Field label="Required Subjects" description="Students must pass these specific subjects to be promoted, regardless of their overall average. Most schools require just Math and English.">
            <RequiredSubjectsPicker
              selected={data.promotionRules.requiredSubjects}
              allSubjects={data.subjects}
              onChange={(v) => updatePromotionRule("requiredSubjects", v)}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Remedial / Supplementary Exams" description="Students who fail can retake exams before being held back. Turn off for strict pass-or-repeat.">
              <Toggle checked={data.promotionRules.allowRemedial} onChange={(v) => updatePromotionRule("allowRemedial", v)} />
            </Field>
            {data.promotionRules.allowRemedial && (
              <Field label="Max Subjects for Re-sit" description="Students who fail more than this many subjects repeat outright instead of getting a re-sit.">
                <TextInput value={data.promotionRules.maxSubjectsForSupplementary} onChange={(v) => updatePromotionRule("maxSubjectsForSupplementary", v)} type="number" placeholder="2" />
              </Field>
            )}
            <Field label="Conditional Promotion" description="Allow promoting a student to the next class with conditions attached (e.g. must attend extra classes, on academic probation).">
              <Toggle checked={data.promotionRules.conditionalPromotion} onChange={(v) => updatePromotionRule("conditionalPromotion", v)} />
            </Field>
          </div>
        </SubSection>

        {/* ---- 3. Discipline ---- */}
        <SubSection title="Discipline Policy" description="Behavior tracking and consequence structure" defaultOpen={false}>
          <Field label="Discipline Framework" description={{
            merit_demerit: "Earn/lose points for behavior. Consequences trigger at thresholds.",
            behavior_levels: "Offenses grouped by severity. Each level has set consequences.",
            incident_logging: "Log incidents as-is. Admin decides consequences case-by-case.",
            house_points: "Like merit/demerit but points count toward house competitions.",
            restorative: "Focus on repairing harm through guided conversations, not punishment.",
          }[data.disciplineFramework] || "Choose how your school tracks student behavior"}>
            <MiniDropdown value={data.disciplineFramework} onChange={(v) => update("disciplineFramework", v)} options={DISCIPLINE_FRAMEWORKS} />
          </Field>
          {(data.disciplineFramework === "merit_demerit" || data.disciplineFramework === "house_points") && (
            <Field label="Point Reset Period" description="When accumulated points reset to zero">
              <MiniDropdown value={data.pointResetPeriod} onChange={(v) => update("pointResetPeriod", v)} options={POINT_RESET_OPTIONS} />
            </Field>
          )}
          <Field label="Offense Categories" description="These appear as options when logging a behavior incident. Used for reports and tracking patterns.">
            <TagList items={data.offenseCategories} onChange={(v) => update("offenseCategories", v)} defaults={DEFAULT_OFFENSES} defaultsLabel="Use common defaults" placeholder="Add offense + Enter" />
          </Field>
        </SubSection>



        {/* ---- 5. Notifications ---- */}
        <SubSection title="Notifications & Communication" description="Parent portal and alert settings" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Parent Portal" description="Allow parents to view student data online">
              <Toggle checked={data.parentPortal} onChange={(v) => update("parentPortal", v)} />
            </Field>
            <Field label="Report Comments" description="Allow teacher comments on report cards">
              <Toggle checked={data.reportComments} onChange={(v) => update("reportComments", v)} />
            </Field>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--muted)] uppercase tracking-wider mb-2">Alert Triggers</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {([
                ["attendanceAlerts", "Attendance alerts"],
                ["feeReminders", "Fee reminders"],
                ["examResultNotify", "Exam result notifications"],
                ["behaviorAlerts", "Behavior incident alerts"],
                ["homeworkAlerts", "Homework/assignment alerts"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--background-secondary)]">
                  <span className="text-[13px] text-[var(--foreground)]">{label}</span>
                  <Toggle checked={data[key]} onChange={(v) => update(key, v)} />
                </div>
              ))}
            </div>
          </div>
          <Field label="Notification Channels" description="How parents receive alerts">
            <div className="flex flex-wrap gap-2">
              {NOTIFICATION_CHANNELS.map((ch) => {
                const sel = data.notificationChannels.includes(ch.value);
                return (
                  <button key={ch.value} type="button"
                    onClick={() => update("notificationChannels", sel ? data.notificationChannels.filter((c) => c !== ch.value) : [...data.notificationChannels, ch.value])}
                    className={cn("px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors", sel ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]" : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]")}
                  >{ch.label}</button>
                );
              })}
            </div>
          </Field>
        </SubSection>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// RequiredSubjectsPicker -- selected chips + search popover to add
// ---------------------------------------------------------------------------

function RequiredSubjectsPicker({
  selected, allSubjects, onChange,
}: {
  selected: string[];
  allSubjects: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pos = useMiniPos(btnRef, open, 300);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [open]);

  if (allSubjects.length === 0) {
    return <p className="text-[13px] text-[var(--muted)] italic">Add subjects in the Subjects step first</p>;
  }

  const filtered = allSubjects.filter((s) =>
    !selected.includes(s) && (!query || s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((subj) => (
            <span key={subj} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-[13px] font-medium rounded-lg bg-[#0891B2]/10 border border-[#0891B2]/30 text-[#0891B2]">
              {subj}
              <button type="button" onClick={() => onChange(selected.filter((s) => s !== subj))} className="p-0.5 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0891B2] hover:underline"
      >
        + Add required subject
      </button>

      {/* Popover */}
      {open && pos && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: 300 }}
          className="max-h-[40vh] rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full text-[13px] bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
            />
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-[var(--muted)]">No subjects found</p>
            ) : (
              filtered.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => { onChange([...selected, subj]); setQuery(""); }}
                  className="w-full text-left px-3 py-1.5 text-[13px] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  {subj}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MiniDropdown -- portal-based compact dropdown (no scroll blocking)
// ---------------------------------------------------------------------------

function useMiniPos(anchor: React.RefObject<HTMLElement | null>, isOpen: boolean, width: number) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    if (!isOpen || !anchor.current) return;
    const update = () => {
      if (!anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const vw = typeof window !== "undefined" ? window.innerWidth : 0;
      let left = rect.left;
      if (left + width > vw - 12) left = vw - width - 12;
      if (left < 12) left = 12;
      setPos({ top: rect.bottom + 4, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [isOpen, anchor, width]);
  return pos;
}

function MiniDropdown({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const W = 180;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const pos = useMiniPos(btnRef, open, W);
  const label = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
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
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[#0891B2]/40 transition-colors"
      >
        {label}
        <ChevronDown className={cn("w-3 h-3 opacity-60 transition-transform", open && "rotate-180")} />
      </button>
      {open && pos && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: W }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 py-1 overflow-hidden"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-[13px] transition-colors",
                opt.value === value
                  ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                  : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
