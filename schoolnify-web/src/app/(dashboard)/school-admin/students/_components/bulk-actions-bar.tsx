"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, UserCog, X } from "lucide-react";

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  onExport?: () => void;
  onMessage?: () => void;
  onStatusChange?: () => void;
}

export function BulkActionsBar({ count, onClear, onExport, onMessage, onStatusChange }: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] shadow-2xl"
        >
          <span className="text-sm font-medium">{count} selected</span>
          <div className="w-px h-5 bg-[var(--background)]/20" />
          {onExport && (
            <button onClick={onExport} className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
          {onMessage && (
            <button onClick={onMessage} className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity">
              <Mail className="w-4 h-4" /> Message
            </button>
          )}
          {onStatusChange && (
            <button onClick={onStatusChange} className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity">
              <UserCog className="w-4 h-4" /> Status
            </button>
          )}
          <button
            onClick={onClear}
            aria-label="Clear selection"
            className="ml-2 p-1 rounded-full hover:bg-[var(--background)]/10 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
