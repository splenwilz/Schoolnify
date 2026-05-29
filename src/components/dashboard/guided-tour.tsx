"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Sparkles, Building2 } from "lucide-react";
import type { TourStep } from "@/lib/tour-steps";
import { TOUR_STORAGE_KEYS } from "@/lib/tour-steps";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PADDING = 8;
const TOOLTIP_WIDTH = 360;
const TOOLTIP_HEIGHT_EST = 240;
const MARGIN = 16;
const LG_BREAKPOINT = 1024;

function computeTooltipPosition(
  targetRect: TargetRect,
  preferredPlacement: TourStep["placement"],
): { top: number; left: number } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const tw = Math.min(TOOLTIP_WIDTH, vw - MARGIN * 2);

  let top: number;
  let left: number;

  switch (preferredPlacement) {
    case "right":
      top = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT_EST / 2;
      left = targetRect.left + targetRect.width + PADDING + MARGIN;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT_EST / 2;
      left = targetRect.left - tw - PADDING - MARGIN;
      break;
    case "top":
      top = targetRect.top - TOOLTIP_HEIGHT_EST - PADDING - MARGIN;
      left = targetRect.left + targetRect.width / 2 - tw / 2;
      break;
    case "bottom":
    default:
      top = targetRect.top + targetRect.height + PADDING + MARGIN;
      left = targetRect.left + targetRect.width / 2 - tw / 2;
      break;
  }

  // Clamp within viewport
  left = Math.max(MARGIN, Math.min(left, vw - tw - MARGIN));
  top = Math.max(MARGIN, Math.min(top, vh - TOOLTIP_HEIGHT_EST - MARGIN));

  return { top, left };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GuidedTour({ steps, isOpen, onComplete, onSkip }: GuidedTourProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Filter out sidebar steps on mobile
  const effectiveSteps = useMemo(() => {
    if (isMobile) return steps.filter((s) => !s.requiresSidebar);
    return steps;
  }, [steps, isMobile]);

  const step = effectiveSteps[currentStep];
  const isLastStep = currentStep === effectiveSteps.length - 1;
  const isCenterModal = !step?.target;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < LG_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Measure target element
  const measureTarget = useCallback(() => {
    if (!step?.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      // Delay measurement to allow scroll
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;
    measureTarget();
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [isOpen, measureTarget]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentStep, effectiveSteps.length]);

  // Persist step
  useEffect(() => {
    if (isOpen) {
      try {
        localStorage.setItem(TOUR_STORAGE_KEYS.currentStep, String(currentStep));
      } catch {
        // Silently continue
      }
    }
  }, [isOpen, currentStep]);

  // Resume from interrupted tour
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(TOUR_STORAGE_KEYS.currentStep);
        if (saved) {
          const idx = parseInt(saved, 10);
          if (idx >= 0 && idx < effectiveSteps.length) {
            setCurrentStep(idx);
          }
        }
      } catch {
        // Silently continue
      }
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const goNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((s) => Math.min(s + 1, effectiveSteps.length - 1));
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleComplete = () => {
    setCurrentStep(0);
    onComplete();
    // Navigate to setup on the final step
    router.push("/school-admin/setup");
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onSkip();
  };

  if (!isOpen || !step) return null;

  const tooltipPos = isCenterModal
    ? null
    : targetRect
    ? computeTooltipPosition(targetRect, step.placement)
    : null;

  const progress = ((currentStep + 1) / effectiveSteps.length) * 100;

  return (
    <>
      {/* Backdrop for center modals */}
      {isCenterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Spotlight cutout for targeted steps */}
      {!isCenterModal && targetRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9998] rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            transition: "top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease",
          }}
        />
      )}

      {/* Click shield (prevents clicking behind overlay, except the spotlighted element) */}
      {!isCenterModal && (
        <div className="fixed inset-0 z-[9997]" onClick={(e) => e.stopPropagation()} />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
          role="dialog"
          aria-modal="true"
          aria-label={step.title}
          className={`fixed z-[10000] w-[360px] max-w-[calc(100vw-2rem)] ${
            isCenterModal
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : ""
          }`}
          style={
            !isCenterModal && tooltipPos
              ? { top: tooltipPos.top, left: tooltipPos.left }
              : undefined
          }
        >
          <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--muted)]">
                {currentStep + 1} of {effectiveSteps.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Skip tour
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full bg-[var(--border)] mb-4 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#0891B2]"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Icon for center modals */}
            {isCenterModal && (
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                  {isLastStep ? (
                    <Building2 className="w-7 h-7 text-white" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Title & Description */}
            <h3 className={`text-base font-semibold text-[var(--foreground)] mb-2 ${isCenterModal ? "text-center" : ""}`}>
              {step.title}
            </h3>
            <p className={`text-sm text-[var(--muted)] leading-relaxed mb-5 ${isCenterModal ? "text-center" : ""}`}>
              {step.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors shadow-sm"
              >
                {isLastStep ? (
                  <>
                    Go to Setup
                    <Building2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
