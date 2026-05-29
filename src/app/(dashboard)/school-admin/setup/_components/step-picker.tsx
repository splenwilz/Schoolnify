"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// StepPicker -- portal dropdown for step navigation (no scroll blocking)
// ---------------------------------------------------------------------------

function useStepPickerPos(anchor: React.RefObject<HTMLElement | null>, isOpen: boolean, width: number) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    if (!isOpen || !anchor.current) return;
    const update = () => {
      if (!anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const vw = typeof window !== "undefined" ? window.innerWidth : 0;
      let left = rect.right - width;
      if (left < 12) left = 12;
      if (left + width > vw - 12) left = vw - width - 12;
      setPos({ top: rect.bottom + 4, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [isOpen, anchor, width]);
  return pos;
}

export function StepPicker({
  steps,
  activeStep,
  sections,
  onSelect,
}: {
  steps: readonly { id: string; label: string; icon: React.ComponentType<{ className?: string }>; optional?: boolean }[];
  activeStep: string;
  sections: { id: string; complete: boolean }[];
  onSelect: (id: string) => void;
}) {
  const W = 280;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const pos = useStepPickerPos(btnRef, open, W);
  const currentLabel = steps.find((s) => s.id === activeStep)?.label ?? "";

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
        className="inline-flex items-center gap-1.5 text-[15px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        {currentLabel}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && pos && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: W }}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 py-1 overflow-hidden"
        >
          {steps.map((step, i) => {
            const isActive = step.id === activeStep;
            const isComplete = sections.find((s) => s.id === step.id)?.complete ?? false;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => { onSelect(step.id); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                  isActive ? "bg-[#0891B2]/10" : "hover:bg-[var(--background-secondary)]"
                )}
              >
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                  isComplete
                    ? "bg-[#10B981] text-white"
                    : isActive
                      ? "bg-[#0891B2] text-white"
                      : "bg-[var(--background-secondary)] text-[var(--muted)] border border-[var(--border)]"
                )}>
                  {isComplete ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className={cn(
                  "text-[14px]",
                  isActive ? "font-medium text-[#0891B2]" : "text-[var(--foreground)]"
                )}>
                  {step.label}
                </span>
                {"optional" in step && step.optional && (
                  <span className="text-[10px] text-[var(--muted)] ml-auto">optional</span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
