"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClasses =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClasses =
  "block text-[13px] font-medium text-[var(--foreground)] mb-1.5";

interface FormData {
  studentName: string;
  type: string;
  severity: string;
  date: string;
  location: string;
  description: string;
  actionTaken: string;
  notifyParent: boolean;
}

const EMPTY_FORM: FormData = {
  studentName: "",
  type: "",
  severity: "",
  date: new Date().toISOString().split("T")[0],
  location: "",
  description: "",
  actionTaken: "",
  notifyParent: false,
};

export function IncidentModal({ isOpen, onClose }: IncidentModalProps) {
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
                  Report Incident
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  Log a new discipline incident
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
                id="incident-form"
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-5"
              >
                {/* Student Info */}
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
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Incident Details */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Incident Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="type" className={labelClasses}>
                        Type <span className="text-[#EF4444]">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="">Select type</option>
                        <option value="behavioral">Behavioral</option>
                        <option value="academic">Academic</option>
                        <option value="attendance">Attendance</option>
                        <option value="bullying">Bullying</option>
                        <option value="property">Property</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="severity" className={labelClasses}>
                        Severity <span className="text-[#EF4444]">*</span>
                      </label>
                      <select
                        id="severity"
                        name="severity"
                        required
                        value={formData.severity}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="">Select severity</option>
                        <option value="minor">Minor</option>
                        <option value="moderate">Moderate</option>
                        <option value="major">Major</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                      <label htmlFor="location" className={labelClasses}>
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Classroom, Lab"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className={labelClasses}>
                      Description <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what happened..."
                      className={inputClasses + " resize-none"}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Action & Notification */}
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Action & Notification
                  </h3>
                  <div>
                    <label htmlFor="actionTaken" className={labelClasses}>
                      Action Taken
                    </label>
                    <textarea
                      id="actionTaken"
                      name="actionTaken"
                      rows={3}
                      value={formData.actionTaken}
                      onChange={handleChange}
                      placeholder="Describe any actions taken..."
                      className={inputClasses + " resize-none"}
                    />
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
                form="incident-form"
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                Submit Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
