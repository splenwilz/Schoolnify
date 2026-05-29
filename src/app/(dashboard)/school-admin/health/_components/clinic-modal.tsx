"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClasses =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClasses =
  "block text-[13px] font-medium text-[var(--foreground)] mb-1.5";

interface FormData {
  studentName: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  attendedBy: string;
  status: string;
  notifyParent: boolean;
}

const EMPTY_FORM: FormData = {
  studentName: "",
  date: new Date().toISOString().split("T")[0],
  reason: "",
  diagnosis: "",
  treatment: "",
  attendedBy: "",
  status: "",
  notifyParent: false,
};

export function ClinicModal({ isOpen, onClose }: ClinicModalProps) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...EMPTY_FORM,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - just close the modal
    onClose();
  };

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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--card)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Log Clinic Visit
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  Record a new clinic visit
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
              <form
                id="clinic-form"
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-5"
              >
                {/* Student Info */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Visit Details
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
                  <div>
                    <label htmlFor="date" className={labelClasses}>
                      Date <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="reason" className={labelClasses}>
                      Reason <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="reason"
                      name="reason"
                      type="text"
                      required
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Reason for visit"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Diagnosis & Treatment */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Diagnosis & Treatment
                  </h3>
                  <div>
                    <label htmlFor="diagnosis" className={labelClasses}>
                      Diagnosis <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="diagnosis"
                      name="diagnosis"
                      type="text"
                      required
                      value={formData.diagnosis}
                      onChange={handleChange}
                      placeholder="Enter diagnosis"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="treatment" className={labelClasses}>
                      Treatment <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      id="treatment"
                      name="treatment"
                      rows={3}
                      required
                      value={formData.treatment}
                      onChange={handleChange}
                      placeholder="Describe treatment provided..."
                      className={inputClasses + " resize-none"}
                    />
                  </div>
                  <div>
                    <label htmlFor="attendedBy" className={labelClasses}>
                      Attended By <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="attendedBy"
                      name="attendedBy"
                      type="text"
                      required
                      value={formData.attendedBy}
                      onChange={handleChange}
                      placeholder="e.g. Nurse Olamide"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Status & Notification */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Status & Notification
                  </h3>
                  <div>
                    <label htmlFor="status" className={labelClasses}>
                      Status <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="">Select status</option>
                      <option value="treated">Treated</option>
                      <option value="referred">Referred</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifyParent"
                      checked={formData.notifyParent}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-[var(--border)] text-[#0891B2] focus:ring-[#0891B2]/30 cursor-pointer"
                    />
                    <span className="text-[13px] text-[var(--foreground)]">
                      Notify Parent / Guardian
                    </span>
                  </label>
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
                form="clinic-form"
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                Save Visit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
