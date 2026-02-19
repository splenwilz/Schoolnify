"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClasses =
  "w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClasses =
  "block text-[13px] font-medium text-[var(--foreground)] mb-1.5";

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleClose = () => {
    setFileName("");
    setCategory("");
    setDescription("");
    setTags("");
    onClose();
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
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Upload Document
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  Add a new document to the library
                </p>
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
              {/* Drag & Drop Zone */}
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 flex flex-col items-center justify-center gap-3 hover:border-[#0891B2]/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#0891B2]/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#0891B2]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    PDF, DOCX, XLSX, or images up to 10MB
                  </p>
                </div>
              </div>

              {/* File Name */}
              <div>
                <label htmlFor="fileName" className={labelClasses}>
                  File Name
                </label>
                <input
                  id="fileName"
                  type="text"
                  placeholder="Enter document name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={inputClasses}
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className={labelClasses}>
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select a category</option>
                  <option value="student_records">Student Records</option>
                  <option value="staff_records">Staff Records</option>
                  <option value="certificates">Certificates</option>
                  <option value="templates">Templates</option>
                  <option value="reports">Reports</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelClasses}>
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Brief description of the document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={inputClasses + " resize-none"}
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className={labelClasses}>
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
