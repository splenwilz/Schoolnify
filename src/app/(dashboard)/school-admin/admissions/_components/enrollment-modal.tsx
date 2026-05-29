"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Calendar, CreditCard, Mail, IdCard } from "lucide-react";

interface Application {
  id: string;
  trackingCode?: string;
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  appliedDate: string;
  status:
    | "inquiry"
    | "applied"
    | "under_review"
    | "accepted"
    | "enrolled"
    | "rejected"
    | "waitlisted";
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  documents: string[];
  notes?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  relationship?: string;
  statusHistory?: { status: string; date: string; note: string }[];
}

interface EnrollmentModalProps {
  isOpen: boolean;
  application: Application | null;
  onClose: () => void;
  onConfirm: (data: {
    classAssignment: string;
    enrollmentDate: string;
    feeStatus: string;
  }) => void;
}

function getClassOptions(grade: string): string[] {
  const gradeNum = grade.replace(/\D/g, "");
  if (!gradeNum) return [`${grade}A`, `${grade}B`, `${grade}C`];
  return [
    `Grade ${gradeNum}A`,
    `Grade ${gradeNum}B`,
    `Grade ${gradeNum}C`,
  ];
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const inputClasses =
  "w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClasses =
  "block text-[13px] font-medium text-[var(--foreground)] mb-1.5";

export function EnrollmentModal({
  isOpen,
  application,
  onClose,
  onConfirm,
}: EnrollmentModalProps) {
  const [classAssignment, setClassAssignment] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(getTodayString());
  const [feeStatus, setFeeStatus] = useState("Pending");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [generateStudentId, setGenerateStudentId] = useState(true);

  useEffect(() => {
    if (isOpen && application) {
      const options = getClassOptions(application.grade);
      setClassAssignment(options[0]);
      setEnrollmentDate(getTodayString());
      setFeeStatus("Pending");
      setSendWelcomeEmail(true);
      setGenerateStudentId(true);
    }
  }, [isOpen, application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      classAssignment,
      enrollmentDate,
      feeStatus,
    });
  };

  const classOptions = application ? getClassOptions(application.grade) : [];

  return (
    <AnimatePresence>
      {isOpen && application && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Enroll Student
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  Complete enrollment for this applicant
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Summary */}
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background-secondary)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#0891B2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--foreground)] truncate">
                    {application.studentName}
                  </p>
                  <p className="text-[12px] text-[var(--muted)]">
                    {application.grade}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Assign to Class */}
              <div>
                <label htmlFor="classAssignment" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--muted)]" />
                    Assign to Class <span className="text-[#EF4444]">*</span>
                  </span>
                </label>
                <select
                  id="classAssignment"
                  value={classAssignment}
                  onChange={(e) => setClassAssignment(e.target.value)}
                  required
                  className={inputClasses}
                >
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enrollment Date */}
              <div>
                <label htmlFor="enrollmentDate" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
                    Enrollment Date <span className="text-[#EF4444]">*</span>
                  </span>
                </label>
                <input
                  id="enrollmentDate"
                  type="date"
                  value={enrollmentDate}
                  onChange={(e) => setEnrollmentDate(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>

              {/* Fee Status */}
              <div>
                <label htmlFor="feeStatus" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[var(--muted)]" />
                    Fee Status <span className="text-[#EF4444]">*</span>
                  </span>
                </label>
                <select
                  id="feeStatus"
                  value={feeStatus}
                  onChange={(e) => setFeeStatus(e.target.value)}
                  required
                  className={inputClasses}
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Divider */}
              <div className="border-t border-[var(--border)]" />

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setSendWelcomeEmail(!sendWelcomeEmail)}
                    className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all flex-shrink-0 ${
                      sendWelcomeEmail
                        ? "bg-[#0891B2] border-[#0891B2]"
                        : "border-[var(--border)] group-hover:border-[var(--muted)]"
                    }`}
                  >
                    {sendWelcomeEmail && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--muted)]" />
                    <span className="text-[13px] text-[var(--foreground)]">
                      Send welcome email to parent
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setGenerateStudentId(!generateStudentId)}
                    className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all flex-shrink-0 ${
                      generateStudentId
                        ? "bg-[#0891B2] border-[#0891B2]"
                        : "border-[var(--border)] group-hover:border-[var(--muted)]"
                    }`}
                  >
                    {generateStudentId && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-[var(--muted)]" />
                    <span className="text-[13px] text-[var(--foreground)]">
                      Generate student ID
                    </span>
                  </div>
                </label>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                Confirm Enrollment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
