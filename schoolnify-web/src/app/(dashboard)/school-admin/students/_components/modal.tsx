"use client";

import { useEffect, useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}

// Module-level state so stacked modals coordinate body scroll lock + Escape
// handling. Only the top-most modal closes on Escape; only the last modal to
// close releases body scroll.
let scrollLockCount = 0;
// The body's inline overflow value at the moment we first locked. Restored on
// final unlock so we don't clobber any pre-existing inline style set by the
// host page (e.g., layout shells that intentionally hide overflow).
let previousBodyOverflow = "";
type EscapeHandler = { call: () => void };
const escapeStack: EscapeHandler[] = [];

function lockBodyScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = "";
  }
}

// Single document-level Escape listener. Reads the top of the stack so layered
// dialogs (e.g., a confirm-on-top-of-form modal) close one at a time.
let escapeListenerAttached = false;
function ensureEscapeListener() {
  if (escapeListenerAttached) return;
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const top = escapeStack[escapeStack.length - 1];
    if (top) {
      e.stopPropagation();
      top.call();
    }
  });
  escapeListenerAttached = true;
}

// SSR-safe layout effect.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Modal({ open, onClose, title, description, children, maxWidth = "440px" }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Capture latest onClose in a ref so the registered escape handler is stable
  // across renders (avoids unbounded escapeStack churn when parent passes an
  // inline arrow function).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Tracks whether the most recent mousedown started inside the dialog. If so,
  // we ignore the mouseup-on-backdrop close (prevents drag-to-select-text from
  // accidentally dismissing the modal).
  const mouseDownInsideRef = useRef(false);

  // Body scroll lock + Escape stack registration. Deps include only `open` so
  // we don't re-register on every parent render that produces a fresh onClose.
  useEffect(() => {
    if (!open) return;
    ensureEscapeListener();
    const handler: EscapeHandler = { call: () => onCloseRef.current() };
    escapeStack.push(handler);
    lockBodyScroll();
    return () => {
      const idx = escapeStack.lastIndexOf(handler);
      if (idx !== -1) escapeStack.splice(idx, 1);
      unlockBodyScroll();
    };
  }, [open]);

  // Focus management: capture the previously-focused element on open, focus
  // the dialog, trap Tab inside the dialog, and restore focus on close.
  useIsoLayoutEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const node = contentRef.current;
    if (!node) return;

    const tabbableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const initial = node.querySelector<HTMLElement>(tabbableSelector);
    (initial ?? node).focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(tabbableSelector)
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
      if (focusables.length === 0) {
        // Nothing focusable -- keep focus on the dialog itself.
        e.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", handleKeyDown);

    return () => {
      node.removeEventListener("keydown", handleKeyDown);
      const prev = previouslyFocusedRef.current;
      if (prev && document.contains(prev)) {
        prev.focus();
      }
    };
  }, [open]);

  if (typeof window === "undefined") return null;

  // Close-on-backdrop semantics: close only if BOTH mousedown and mouseup
  // occurred on the backdrop itself. This avoids the common bug where dragging
  // a text selection from inside the dialog and releasing on the backdrop
  // dismisses the modal.
  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownInsideRef.current = e.target !== e.currentTarget;
  };
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !mouseDownInsideRef.current) {
      onClose();
    }
    mouseDownInsideRef.current = false;
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onMouseDown={handleBackdropMouseDown}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth }}
            className="w-full bg-[var(--card)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden focus:outline-none"
          >
            <div className="flex items-start justify-between p-5 border-b border-[var(--border)]">
              <div>
                <h2 id={titleId} className="text-[16px] font-semibold text-[var(--foreground)]">{title}</h2>
                {description && (
                  <p id={descriptionId} className="text-[13px] text-[var(--muted)] mt-0.5">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
