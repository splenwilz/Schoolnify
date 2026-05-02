"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUBJECT_DEPARTMENTS } from "./setup-types";
import { COMMON_SUBJECTS, SUBJECT_DEPT_MAP, SUBJECT_PRESETS, type SubjectPreset } from "../_constants/subjects";

// ---------------------------------------------------------------------------
// Portal popover helper — renders a popover anchored to a trigger button
// using position: fixed so it escapes any ancestor overflow clipping.
// ---------------------------------------------------------------------------

function usePopoverPosition(
  anchor: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  width: number,
  align: "left" | "right" = "left",
) {
  const [pos, setPos] = useState<{ top: number; left: number; maxH: number } | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !anchor.current) return;
    const update = () => {
      if (!anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const vw = typeof window !== "undefined" ? window.innerWidth : 0;
      const vh = typeof window !== "undefined" ? window.innerHeight : 0;
      let left = align === "right" ? rect.right - width : rect.left;
      if (left + width > vw - 12) left = vw - width - 12;
      if (left < 12) left = 12;
      const spaceBelow = vh - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      // Use whichever side has more room
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
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, anchor, width, align]);

  return pos;
}


// ---------------------------------------------------------------------------
// AddSubjectPopover — search-first picker with department + band filters
// ---------------------------------------------------------------------------

// Band filter maps to dept sets that typically belong to each schooling band.
const BAND_FILTERS: { value: string; label: string; depts?: string[]; match?: (s: string) => boolean }[] = [
  { value: "all", label: "All" },
  {
    value: "early",
    label: "Early Years",
    match: (s) =>
      [
        "Numeracy","Number Work","Early Math","Pre-Math","Literacy","Phonics","Pre-Reading","Pre-Writing",
        "Handwriting","Oral English","Rhymes","Storytelling","Songs and Rhymes","Colour and Shape",
        "Sensory Play","Dramatic Play","Block Play","Construction Play","Circle Time","Show and Tell",
        "Practical Life","Fine Motor Skills","Gross Motor Skills","Nature Studies","Music and Movement",
        "Art and Craft","Finger Painting","General Knowledge",
      ].includes(s),
  },
  {
    value: "primary",
    label: "Primary",
    match: (s) =>
      [
        "Mathematics","English Language","Science","Social Studies","Geography","History","Art","Music",
        "Physical Education","Health","Religious Education","French","Verbal Reasoning","Quantitative Reasoning",
        "Basic Science","Basic Technology","Cultural and Creative Arts","Creative Arts","Health Habits",
        "Personal Hygiene","Social Habits","Environmental Studies","Civic Studies","Computer Studies",
        "Basic Computer","Life Skills","Mathematical Literacy","EVS (Environmental Studies)","Value Education",
        "Moral Instruction","Hindi","Sanskrit","Yoruba","Igbo","Hausa","Kiswahili","Reading","General Knowledge",
      ].includes(s),
  },
  {
    value: "secondary",
    label: "Secondary",
    depts: ["science","commercial","technology","vocational","arts","humanities","languages"],
  },
];

export function AddSubjectPopover({
  anchor,
  selected,
  onToggle,
  onClose,
}: {
  anchor: React.RefObject<HTMLButtonElement | null>;
  selected: string[];
  onToggle: (s: string) => void;
  onClose: () => void;
}) {
  const POPOVER_WIDTH = 520;
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [band, setBand] = useState("all");
  const [dept, setDept] = useState<string>("all");
  const pos = usePopoverPosition(anchor, true, POPOVER_WIDTH, "left");

  // Close on outside click (excluding anchor) + Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (anchor.current?.contains(target)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, anchor]);

  const bandFilter = BAND_FILTERS.find((b) => b.value === band)!;

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groups: Record<string, string[]> = {};
    for (const subject of COMMON_SUBJECTS) {
      const d = SUBJECT_DEPT_MAP[subject] ?? "other";
      if (q && !subject.toLowerCase().includes(q)) continue;
      if (dept !== "all" && d !== dept) continue;
      if (band !== "all") {
        if (bandFilter.match && !bandFilter.match(subject)) continue;
        if (bandFilter.depts && !bandFilter.depts.includes(d)) continue;
      }
      if (!groups[d]) groups[d] = [];
      groups[d].push(subject);
    }
    return groups;
  }, [query, band, dept, bandFilter]);

  const totalResults = Object.values(filteredGroups).reduce((n, arr) => n + arr.length, 0);
  const deptLabel = (v: string) => SUBJECT_DEPARTMENTS.find((d) => d.value === v)?.label ?? "Other";

  if (typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div
      ref={ref}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: POPOVER_WIDTH, maxHeight: pos.maxH }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Search */}
      <div className="p-3 border-b border-[var(--border)] flex items-center gap-2">
        <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subjects..."
          className="flex-1 text-[14px] bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-[var(--border)] space-y-2">
        <div className="flex flex-wrap gap-1">
          {BAND_FILTERS.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBand(b.value)}
              className={cn(
                "px-2.5 py-1 text-[12px] font-medium rounded-md transition-colors",
                band === b.value
                  ? "bg-[#0891B2] text-white"
                  : "bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setDept("all")}
            className={cn(
              "px-2.5 py-1 text-[12px] font-medium rounded-md transition-colors",
              dept === "all"
                ? "bg-[var(--foreground)] text-[var(--card)]"
                : "bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            All departments
          </button>
          {SUBJECT_DEPARTMENTS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDept(d.value)}
              className={cn(
                "px-2.5 py-1 text-[12px] font-medium rounded-md transition-colors",
                dept === d.value
                  ? "bg-[var(--foreground)] text-[var(--card)]"
                  : "bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {totalResults === 0 ? (
          <div className="py-8 text-center text-[13px] text-[var(--muted)]">
            No subjects match. Try a different search or filter.
          </div>
        ) : (
          Object.entries(filteredGroups).map(([d, subjects]) => (
            <div key={d}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5">
                {deptLabel(d)} <span className="opacity-70">({subjects.length})</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {subjects.map((s) => {
                  const isSelected = selected.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onToggle(s)}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 text-[13px] font-medium rounded-md border transition-colors",
                        isSelected
                          ? "bg-[#0891B2]/10 border-[#0891B2]/40 text-[#0891B2]"
                          : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--foreground)] hover:border-[#0891B2]/40"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[12px] text-[var(--muted)]">
          {totalResults} result{totalResults !== 1 ? "s" : ""} &middot; {selected.length} selected
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[13px] font-medium text-[#0891B2] hover:underline"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// PresetPopover — recommended presets first, rest collapsed
// ---------------------------------------------------------------------------

export function PresetPopover({
  anchor,
  gradeLevelStructureId,
  selected,
  onApply,
  onRemove,
  onClose,
}: {
  anchor: React.RefObject<HTMLButtonElement | null>;
  gradeLevelStructureId: string;
  selected: string[];
  onApply: (p: SubjectPreset) => void;
  onRemove: (p: SubjectPreset) => void;
  onClose: () => void;
}) {
  const POPOVER_WIDTH = 420;
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const pos = usePopoverPosition(anchor, true, POPOVER_WIDTH, "left");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (anchor.current?.contains(target)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, anchor]);

  const recommended = SUBJECT_PRESETS.filter((p) => gradeLevelStructureId && p.relevantFor.includes(gradeLevelStructureId));
  const others = SUBJECT_PRESETS.filter((p) => !gradeLevelStructureId || !p.relevantFor.includes(gradeLevelStructureId));

  const renderPreset = (preset: SubjectPreset) => {
    const applied = preset.subjects.length > 0 && preset.subjects.every((s) => selected.includes(s));
    return (
      <button
        key={preset.id}
        type="button"
        onClick={() => (applied ? onRemove(preset) : onApply(preset))}
        className={cn(
          "w-full text-left p-2.5 rounded-lg border transition-colors",
          applied
            ? "border-[#0891B2]/60 bg-[#0891B2]/10"
            : "border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5"
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn("text-[14px] font-medium truncate", applied ? "text-[#0891B2]" : "text-[var(--foreground)]")}>
              {preset.label}
            </span>
            {applied && (
              <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#0891B2] text-white uppercase tracking-wide">
                Applied
              </span>
            )}
          </div>
          <span className="shrink-0 text-[11px] text-[var(--muted)]">{preset.subjects.length}</span>
        </div>
        <p className="text-[12px] text-[var(--muted)] leading-snug">{preset.description}</p>
      </button>
    );
  };

  if (typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div
      ref={ref}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: POPOVER_WIDTH, maxHeight: pos.maxH }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--foreground)]">Apply a preset</span>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {recommended.length > 0 && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#0891B2] mb-1.5">
              Recommended for your grade system
            </p>
            <div className="space-y-1.5">{recommended.map(renderPreset)}</div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="flex items-center gap-1 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-1.5"
          >
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAll && "rotate-180")} />
            Other curricula ({others.length})
          </button>
          {showAll && <div className="space-y-1.5">{others.map(renderPreset)}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}
