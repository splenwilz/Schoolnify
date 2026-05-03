"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
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
const escapeStack: Array<() => void> = [];

function lockBodyScroll() {
  if (scrollLockCount === 0) {
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = "";
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
      top();
    }
  });
  escapeListenerAttached = true;
}

export function Modal({ open, onClose, title, description, children, maxWidth = "440px" }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Body scroll lock + Escape stack registration.
  useEffect(() => {
    if (!open) return;
    ensureEscapeListener();
    escapeStack.push(onClose);
    lockBodyScroll();
    return () => {
      const idx = escapeStack.lastIndexOf(onClose);
      if (idx !== -1) escapeStack.splice(idx, 1);
      unlockBodyScroll();
    };
  }, [open, onClose]);

  // Focus management: capture the previously-focused element on open, focus
  // the dialog, restore focus on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    // Defer to next tick so the portal content is mounted.
    const id = window.setTimeout(() => {
      const node = contentRef.current;
      if (!node) return;
      const firstFocusable = node.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (firstFocusable ?? node).focus();
    }, 0);
    return () => {
      window.clearTimeout(id);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
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
