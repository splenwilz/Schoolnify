"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, ChevronDown, X } from "lucide-react";
import { SectionCard, Field, TextInput, Toggle } from "./form-primitives";
import { isReportCardComplete } from "./setup-types";
import type { SetupData } from "./setup-types";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REPORT_TEMPLATES = [
  { value: "standard", label: "Standard Tabular", description: "Subject rows with grade columns. Most common globally." },
  { value: "detailed", label: "Detailed (Nigerian)", description: "Full breakdown with CA/Exam, psychomotor, affective domain." },
  { value: "minimal", label: "Minimal", description: "Scores and grades only. Good for mid-term progress reports." },
  { value: "uk_style", label: "UK School Report", description: "Achievement + effort grades, target grades, prose comments." },
  { value: "standards_based", label: "Standards-Based", description: "Skills/standards rated by proficiency level. US elementary." },
  { value: "descriptive", label: "Descriptive / Narrative", description: "Prose-heavy, minimal grades. Early years, IB PYP, Montessori." },
];

const DEFAULT_PSYCHOMOTOR = [
  "Handwriting", "Verbal Fluency", "Creativity", "Sports", "Musical Skills",
  "Drawing & Painting", "Hand-eye Coordination", "Lab/Workshop Practice",
];

const DEFAULT_AFFECTIVE = [
  "Punctuality", "Neatness", "Attentiveness", "Honesty", "Politeness",
  "Perseverance", "Sociability", "Self-control", "Leadership", "Initiative",
];

// ---------------------------------------------------------------------------
// Sub-section
// ---------------------------------------------------------------------------

function SubSection({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80 transition-colors"
      >
        <p className="text-[14px] font-medium text-[var(--foreground)] text-left">{title}</p>
        <ChevronDown className={cn("w-4 h-4 text-[var(--muted)] transition-transform shrink-0", open && "rotate-180")} />
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editable tag list (reused from policies pattern)
// ---------------------------------------------------------------------------

function TagList({ items, onChange, defaults, defaultsLabel, placeholder }: {
  items: string[]; onChange: (v: string[]) => void; defaults: string[]; defaultsLabel: string; placeholder: string;
}) {
  const [input, setInput] = useState("");
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
          onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { e.preventDefault(); if (!items.includes(input.trim())) onChange([...items, input.trim()]); setInput(""); } }}
          placeholder={placeholder}
          className="flex-1 max-w-[250px] px-2.5 py-1.5 text-[13px] bg-[var(--card)] border border-dashed border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
        />
        {items.length === 0 && (
          <button type="button" onClick={() => onChange([...defaults])} className="text-[12px] font-medium text-[#0891B2] hover:underline">{defaultsLabel}</button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MiniDropdown (portal-based, no scroll blocking)
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

function TemplatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const W = 400;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const pos = useMiniPos(btnRef, open, W);
  const current = REPORT_TEMPLATES.find((t) => t.value === value);

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
        className="inline-flex items-center gap-2 px-3 py-2 text-[14px] font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[#0891B2]/40 transition-colors"
      >
        {current?.label ?? "Select template"}
        <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform", open && "rotate-180")} />
      </button>
      {open && pos && typeof document !== "undefined" && createPortal(
        <div ref={popRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: W }}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 py-1 overflow-hidden"
        >
          {REPORT_TEMPLATES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => { onChange(t.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-2 transition-colors",
                t.value === value ? "bg-[#0891B2]/10" : "hover:bg-[var(--background-secondary)]"
              )}
            >
              <span className={cn("text-[14px] font-medium", t.value === value ? "text-[#0891B2]" : "text-[var(--foreground)]")}>{t.label}</span>
              <p className="text-[12px] text-[var(--muted)]">{t.description}</p>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Toggle row (compact inline toggle with label)
// ---------------------------------------------------------------------------

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--background-secondary)]">
      <span className="text-[13px] text-[var(--foreground)]">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReportCardSection
// ---------------------------------------------------------------------------

interface ReportCardSectionProps {
  data: SetupData;
  update: <K extends keyof SetupData>(key: K, value: SetupData[K]) => void;
  expanded: string;
  toggleSection: (id: string) => void;
}

export function ReportCardSection({ data, update, expanded, toggleSection }: ReportCardSectionProps) {
  return (
    <SectionCard
      id="reportcard"
      title="Report Card"
      description="Template style, sections, and what appears on student reports"
      icon={<FileText className="w-5 h-5" />}
      isComplete={isReportCardComplete(data)}
      isExpanded={expanded === "reportcard"}
      onToggle={() => toggleSection("reportcard")}
    >
      <div className="space-y-4">
        <p className="text-[13px] text-[var(--muted)] px-1">
          These are school-wide defaults. If different groups need different report formats (e.g. descriptive for Nursery, tabular for Secondary), you can customize per group in the Reports module.
        </p>

        {/* Template */}
        <Field label="Report Card Template" description="Choose a starting style. You can toggle individual sections below.">
          <TemplatePicker value={data.reportTemplate} onChange={(v) => update("reportTemplate", v)} />
        </Field>

        {/* Academic */}
        <SubSection title="Academic Section">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ToggleRow label="Show CA/Exam breakdown" checked={data.showAssessmentBreakdown} onChange={(v) => update("showAssessmentBreakdown", v)} />
            <ToggleRow label="Show class average per subject" checked={data.showClassAverage} onChange={(v) => update("showClassAverage", v)} />
            <ToggleRow label="Show highest/lowest score in class" checked={data.showHighestLowest} onChange={(v) => update("showHighestLowest", v)} />
            <ToggleRow label="Show grading scale legend" checked={data.showGradingLegend} onChange={(v) => update("showGradingLegend", v)} />
          </div>
        </SubSection>

        {/* Ranking & Performance */}
        <SubSection title="Ranking & Performance">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ToggleRow label="Show class position/ranking" checked={data.showPosition} onChange={(v) => update("showPosition", v)} />
            <ToggleRow label="Show GPA" checked={data.showGPA} onChange={(v) => update("showGPA", v)} />
            <ToggleRow label="Show effort grades (alongside achievement)" checked={data.showEffortGrades} onChange={(v) => update("showEffortGrades", v)} />
          </div>
        </SubSection>

        {/* Behavioral Assessment */}
        <SubSection title="Behavioral Assessment" defaultOpen={false}>
          <ToggleRow label="Conduct / behavior rating" checked={data.showBehaviorRating} onChange={(v) => update("showBehaviorRating", v)} />

          <div className="mt-3">
            <ToggleRow label="Psychomotor domain" checked={data.showPsychomotor} onChange={(v) => update("showPsychomotor", v)} />
            {data.showPsychomotor && (
              <div className="mt-2 pl-3">
                <p className="text-[12px] text-[var(--muted)] mb-1.5">Traits rated on the report card (e.g. 1-5 or A-E scale)</p>
                <TagList
                  items={data.psychomotorTraits}
                  onChange={(v) => update("psychomotorTraits", v)}
                  defaults={DEFAULT_PSYCHOMOTOR}
                  defaultsLabel="Use common defaults"
                  placeholder="Add trait + Enter"
                />
              </div>
            )}
          </div>

          <div className="mt-3">
            <ToggleRow label="Affective domain" checked={data.showAffective} onChange={(v) => update("showAffective", v)} />
            {data.showAffective && (
              <div className="mt-2 pl-3">
                <p className="text-[12px] text-[var(--muted)] mb-1.5">Character/behavioral traits rated on the report card</p>
                <TagList
                  items={data.affectiveTraits}
                  onChange={(v) => update("affectiveTraits", v)}
                  defaults={DEFAULT_AFFECTIVE}
                  defaultsLabel="Use common defaults"
                  placeholder="Add trait + Enter"
                />
              </div>
            )}
          </div>
        </SubSection>

        {/* Comments & Signatures */}
        <SubSection title="Comments & Signatures" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ToggleRow label="Subject teacher comments" checked={data.showTeacherComments} onChange={(v) => update("showTeacherComments", v)} />
            <ToggleRow label="Class teacher general comment" checked={data.showClassTeacherComment} onChange={(v) => update("showClassTeacherComment", v)} />
            <ToggleRow label="Principal signature/comment" checked={data.showPrincipalSignature} onChange={(v) => update("showPrincipalSignature", v)} />
            <ToggleRow label="Subject teacher signature lines" checked={data.showSubjectTeacherSignature} onChange={(v) => update("showSubjectTeacherSignature", v)} />
          </div>
          {(data.showTeacherComments || data.showClassTeacherComment) && (
            <Field label="Comment character limit" description="Maximum characters per comment box">
              <TextInput value={data.commentCharLimit} onChange={(v) => update("commentCharLimit", v)} type="number" placeholder="200" />
            </Field>
          )}
        </SubSection>

        {/* Additional Info */}
        <SubSection title="Additional Information" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ToggleRow label="Attendance summary" checked={data.showAttendanceSummary} onChange={(v) => update("showAttendanceSummary", v)} />
            <ToggleRow label="Next term resumption date" checked={data.showNextTermDates} onChange={(v) => update("showNextTermDates", v)} />
            <ToggleRow label="Co-curricular activities" checked={data.showCoCurricular} onChange={(v) => update("showCoCurricular", v)} />
          </div>
        </SubSection>
      </div>
    </SectionCard>
  );
}
