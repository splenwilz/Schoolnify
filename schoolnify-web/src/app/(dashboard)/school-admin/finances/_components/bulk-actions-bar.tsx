"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, FileDown, Trash2 } from "lucide-react";

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
}

export function BulkActionsBar({ count, onClear }: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--foreground)] text-[var(--background)] shadow-xl shadow-black/20">
            <span className="text-[13px] font-medium tabular-nums">
              {count} selected
            </span>
            <div className="w-px h-5 bg-[var(--background)]/20" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg hover:bg-[var(--background)]/10 transition-colors">
              <Send className="w-3.5 h-3.5" />
              Send Reminder
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg hover:bg-[var(--background)]/10 transition-colors">
              <FileDown className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg hover:bg-[var(--background)]/10 transition-colors text-[#EF4444]">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
            <div className="w-px h-5 bg-[var(--background)]/20" />
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg hover:bg-[var(--background)]/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
