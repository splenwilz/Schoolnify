"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewApplication {
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  notes: string;
}

type EntryMode = "inquiry" | "applied";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewApplication, mode: EntryMode) => void;
}

const gradeOptions = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const EMPTY_FORM: NewApplication = {
  studentName: "",
  email: "",
  phone: "",
  grade: "",
  parentName: "",
  parentEmail: "",
  previousSchool: "",
  notes: "",
};

const inputClasses =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClasses =
  "block text-[13px] font-medium text-[var(--foreground)] mb-1.5";

export function ApplicationModal({
  isOpen,
  onClose,
  onSave,
}: ApplicationModalProps) {
  const [mode, setMode] = useState<EntryMode>("inquiry");
  const [formData, setFormData] = useState<NewApplication>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setMode("inquiry");
      setFormData(EMPTY_FORM);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, mode);
    setFormData(EMPTY_FORM);
    onClose();
  };

  const isApplication = mode === "applied";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Slide-out Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[var(--card)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  New Entry
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {isApplication
                    ? "Register an application on behalf of a student"
                    : "Record an inquiry from a parent or guardian"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Mode Selector */}
              <div className="px-6 pt-5 pb-2">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setMode("inquiry")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[13px] font-medium rounded-md transition-all",
                      mode === "inquiry"
                        ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("applied")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[13px] font-medium rounded-md transition-all",
                      mode === "applied"
                        ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Application
                  </button>
                </div>
              </div>

              {/* Form */}
              <form
                id="new-entry-form"
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-5"
              >
                {/* Student Info Section */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Student Information
                  </h3>
                  <div>
                    <label htmlFor="studentName" className={labelClasses}>
                      Student Name <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="studentName"
                      name="studentName"
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Enter student full name"
                      className={inputClasses}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@email.com"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClasses}>
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 800 000 0000"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="grade" className={labelClasses}>
                      Grade <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="">Select grade</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Parent Info Section */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Parent / Guardian Information
                  </h3>
                  <div>
                    <label htmlFor="parentName" className={labelClasses}>
                      Parent Name <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent/guardian name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="parentEmail" className={labelClasses}>
                      Parent Email
                    </label>
                    <input
                      id="parentEmail"
                      name="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="parent@email.com"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Additional Info */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Additional Information
                  </h3>
                  <div>
                    <label htmlFor="previousSchool" className={labelClasses}>
                      Previous School
                    </label>
                    <input
                      id="previousSchool"
                      name="previousSchool"
                      type="text"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder="Name of previous school"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className={labelClasses}>
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder={
                        isApplication
                          ? "Any additional notes about this application..."
                          : "How the parent reached out (phone, visit, email), questions asked..."
                      }
                      className={inputClasses + " resize-none"}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="new-entry-form"
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                {isApplication ? "Submit Application" : "Log Inquiry"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
