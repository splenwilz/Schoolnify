"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GRADING_PRESETS, ASSESSMENT_PRESETS, type GradingPreset, type AssessmentPreset } from "../_constants/grading";

// ---------------------------------------------------------------------------
// Position helper — anchors a portal popover to a button
// ---------------------------------------------------------------------------

function usePopoverPosition(
  anchor: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  width: number,
) {
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
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, anchor, width]);

  return pos;
}

// ---------------------------------------------------------------------------
// GradingPresetPopover
// ---------------------------------------------------------------------------

export function GradingPresetPopover({
  btnRef,
  gradeLevelStructureId,
  currentPresetId,
  onSelect,
  onClose,
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  gradeLevelStructureId: string;
  currentPresetId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const POPOVER_WIDTH = 480;
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const pos = usePopoverPosition(btnRef, true, POPOVER_WIDTH);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [onClose, btnRef]);

  const recommended = GRADING_PRESETS.filter((p) => gradeLevelStructureId && p.relevantFor.includes(gradeLevelStructureId));
  const others = GRADING_PRESETS.filter((p) => !gradeLevelStructureId || !p.relevantFor.includes(gradeLevelStructureId));

  const renderPreset = (p: GradingPreset) => (
    <button
      key={p.id}
      type="button"
      onClick={() => onSelect(p.id)}
      className={cn(
        "w-full text-left p-2.5 rounded-lg border transition-colors",
        currentPresetId === p.id
          ? "border-[#0891B2]/60 bg-[#0891B2]/10"
          : "border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className={cn("text-[14px] font-medium truncate", currentPresetId === p.id ? "text-[#0891B2]" : "text-[var(--foreground)]")}>
          {p.label}
        </span>
        <span className="shrink-0 text-[11px] text-[var(--muted)]">{p.region}</span>
      </div>
      <p className="text-[12px] text-[var(--muted)] leading-snug">{p.description}</p>
    </button>
  );

  if (typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div
      ref={ref}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: POPOVER_WIDTH, maxHeight: pos.maxH }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--foreground)]">Choose grading scale</span>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {recommended.length > 0 && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#0891B2] mb-1.5">Recommended</p>
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
            Other scales ({others.length})
          </button>
          {showAll && <div className="space-y-1.5">{others.map(renderPreset)}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// AssessmentPresetPopover
// ---------------------------------------------------------------------------

export function AssessmentPresetPopover({
  btnRef,
  gradeLevelStructureId,
  onSelect,
  onClose,
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  gradeLevelStructureId: string;
  onSelect: (p: AssessmentPreset) => void;
  onClose: () => void;
}) {
  const POPOVER_WIDTH = 420;
  const ref = useRef<HTMLDivElement>(null);
  const pos = usePopoverPosition(btnRef, true, POPOVER_WIDTH);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [onClose, btnRef]);

  const recommended = ASSESSMENT_PRESETS.filter((p) => gradeLevelStructureId && p.relevantFor.includes(gradeLevelStructureId));
  const others = ASSESSMENT_PRESETS.filter((p) => !gradeLevelStructureId || !p.relevantFor.includes(gradeLevelStructureId));

  const renderPreset = (p: AssessmentPreset) => (
    <button
      key={p.id}
      type="button"
      onClick={() => onSelect(p)}
      className="w-full text-left p-2.5 rounded-lg border border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className="text-[14px] font-medium text-[var(--foreground)] truncate">{p.label}</span>
        <span className="shrink-0 text-[11px] text-[var(--muted)]">CA {p.caWeight}% / Exam {p.examWeight}%</span>
      </div>
      <p className="text-[12px] text-[var(--muted)] leading-snug">{p.description}</p>
    </button>
  );

  if (typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div
      ref={ref}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: POPOVER_WIDTH, maxHeight: pos.maxH }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--foreground)]">Assessment structure presets</span>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {recommended.length > 0 && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#0891B2] mb-1.5">Recommended</p>
            <div className="space-y-1.5">{recommended.map(renderPreset)}</div>
          </div>
        )}
        {others.length > 0 && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5">Other regions</p>
            <div className="space-y-1.5">{others.map(renderPreset)}</div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
