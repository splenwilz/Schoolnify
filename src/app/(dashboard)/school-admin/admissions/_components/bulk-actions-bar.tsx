"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Download,
  Mail,
  X,
} from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onExport: () => void;
  onEmail: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onAcceptAll,
  onRejectAll,
  onExport,
  onEmail,
  onClear,
}: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg shadow-black/10">
            {/* Count badge */}
            <span className="inline-flex items-center justify-center px-2.5 py-1 text-[12px] font-semibold text-white bg-[#0891B2] rounded-full tabular-nums mr-1">
              {selectedCount} selected
            </span>

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--border)]" />

            {/* Accept All */}
            <button
              onClick={onAcceptAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#10B981] bg-[#10B981]/10 rounded-lg hover:bg-[#10B981]/20 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Accept All
            </button>

            {/* Reject All */}
            <button
              onClick={onRejectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#EF4444] bg-[#EF4444]/10 rounded-lg hover:bg-[#EF4444]/20 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject All
            </button>

            {/* Export Selected */}
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg hover:bg-[var(--border)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Selected
            </button>

            {/* Email Selected */}
            <button
              onClick={onEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg hover:bg-[var(--border)] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Selected
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--border)]" />

            {/* Clear */}
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
