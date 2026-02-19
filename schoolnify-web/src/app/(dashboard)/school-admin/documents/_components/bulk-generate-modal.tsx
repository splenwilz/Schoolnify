"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileStack } from "lucide-react";

interface BulkGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClasses =
  "w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClasses =
  "block text-[13px] font-medium text-[var(--foreground)] mb-1.5";

export function BulkGenerateModal({ isOpen, onClose }: BulkGenerateModalProps) {
  const [documentType, setDocumentType] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClose = () => {
    setDocumentType("");
    setGradeClass("");
    setIsGenerating(false);
    setProgress(0);
    onClose();
  };

  const handleGenerate = () => {
    if (!documentType || !gradeClass) {
      alert("Please select a document type and grade/class.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Mock progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            alert("All 32 documents have been generated successfully!");
            handleClose();
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg mx-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FileStack className="w-5 h-5 text-[#0891B2]" />
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Bulk Generate Documents
                  </h2>
                  <p className="text-[13px] text-[var(--muted)] mt-0.5">
                    Generate documents for an entire class
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              {/* Document Type */}
              <div>
                <label htmlFor="docType" className={labelClasses}>
                  Document Type
                </label>
                <select
                  id="docType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={inputClasses}
                  disabled={isGenerating}
                >
                  <option value="">Select document type</option>
                  <option value="report_cards">Report Cards</option>
                  <option value="id_cards">ID Cards</option>
                  <option value="certificates">Certificates</option>
                </select>
              </div>

              {/* Grade / Class */}
              <div>
                <label htmlFor="gradeClass" className={labelClasses}>
                  Grade / Class
                </label>
                <select
                  id="gradeClass"
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  className={inputClasses}
                  disabled={isGenerating}
                >
                  <option value="">Select grade / class</option>
                  <option value="grade_7a">Grade 7A</option>
                  <option value="grade_7b">Grade 7B</option>
                  <option value="grade_8a">Grade 8A</option>
                  <option value="grade_8b">Grade 8B</option>
                  <option value="grade_9a">Grade 9A</option>
                  <option value="grade_9b">Grade 9B</option>
                  <option value="grade_10a">Grade 10A</option>
                  <option value="grade_10b">Grade 10B</option>
                  <option value="grade_11a">Grade 11A</option>
                  <option value="grade_11b">Grade 11B</option>
                </select>
              </div>

              {/* Preview count */}
              {documentType && gradeClass && (
                <div className="rounded-lg bg-[var(--background-secondary)] p-3">
                  <p className="text-[13px] text-[var(--foreground)]">
                    <span className="font-semibold">32</span> documents will be
                    generated
                  </p>
                </div>
              )}

              {/* Progress bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Generating documents...
                    </span>
                    <span className="text-[12px] font-medium text-[var(--foreground)] tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#0891B2]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleClose}
                disabled={isGenerating}
                className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !documentType || !gradeClass}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate All"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
