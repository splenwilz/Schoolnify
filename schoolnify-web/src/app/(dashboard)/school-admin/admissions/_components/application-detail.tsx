"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  School,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ApplicationDetailProps {
  application: Application | null;
  onClose: () => void;
  onStatusChange: (appId: string, newStatus: string) => void;
  onEnroll: (appId: string) => void;
}

const allDocuments = [
  { id: "birth_certificate", label: "Birth Certificate" },
  { id: "transcript", label: "Transcript" },
  { id: "recommendation", label: "Recommendation Letter" },
  { id: "medical_report", label: "Medical Report" },
  { id: "passport_photos", label: "Passport Photos" },
  { id: "transfer_certificate", label: "Transfer Certificate" },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  inquiry: { color: "#6B7280", label: "Inquiry" },
  applied: { color: "#3B82F6", label: "Applied" },
  under_review: { color: "#F59E0B", label: "Under Review" },
  accepted: { color: "#10B981", label: "Accepted" },
  enrolled: { color: "#0891B2", label: "Enrolled" },
  rejected: { color: "#EF4444", label: "Rejected" },
  waitlisted: { color: "#A855F7", label: "Waitlisted" },
};

export function ApplicationDetail({
  application,
  onClose,
  onStatusChange,
  onEnroll,
}: ApplicationDetailProps) {
  const [noteText, setNoteText] = useState("");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {application && (
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

          {/* Slide-out Panel */}
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
                <h2 className="text-lg font-semibold text-[var(--foreground)] truncate">
                  {application.studentName}
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  Application Details
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
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Tracking Code */}
              {application.trackingCode && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
                    Tracking Code
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-sm bg-[var(--background-secondary)] px-3 py-2 rounded-lg text-[var(--foreground)]">
                    <Hash className="w-3.5 h-3.5 text-[var(--muted)]" />
                    {application.trackingCode}
                  </div>
                </div>
              )}

              {/* Student Information */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Student Information
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#0891B2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Full Name</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                        {application.studentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Email</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                        {application.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Phone</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {application.phone}
                      </p>
                    </div>
                  </div>
                  {application.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[var(--muted)]">Date of Birth</p>
                        <p className="text-[13px] font-medium text-[var(--foreground)]">
                          {formatDate(application.dateOfBirth)}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.gender && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#A855F7]/10 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4 text-[#A855F7]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[var(--muted)]">Gender</p>
                        <p className="text-[13px] font-medium text-[var(--foreground)]">
                          {application.gender}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                      <School className="w-4 h-4 text-[#0891B2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Applying for</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {application.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent / Guardian Information */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Parent / Guardian
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Name</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                        {application.parentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Email</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                        {application.parentEmail}
                      </p>
                    </div>
                  </div>
                  {application.relationship && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4 text-[#10B981]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[var(--muted)]">Relationship</p>
                        <p className="text-[13px] font-medium text-[var(--foreground)]">
                          {application.relationship}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous School */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Previous School
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6B7280]/10 flex items-center justify-center flex-shrink-0">
                      <School className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <p className="text-[13px] font-medium text-[var(--foreground)]">
                      {application.previousSchool || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Documents
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-2">
                  {allDocuments.map((doc) => {
                    const isPresent = application.documents.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 py-1.5"
                      >
                        {isPresent ? (
                          <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            "text-[13px]",
                            isPresent
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted)]"
                          )}
                        >
                          {doc.label}
                        </span>
                        {isPresent && (
                          <span className="ml-auto text-[11px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                            Received
                          </span>
                        )}
                        {!isPresent && (
                          <span className="ml-auto text-[11px] text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full">
                            Missing
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status History Timeline */}
              {application.statusHistory && application.statusHistory.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Status History
                  </h3>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                    <div className="space-y-0">
                      {application.statusHistory.map((entry, index) => {
                        const isLast =
                          index === application.statusHistory!.length - 1;
                        const isCurrent = isLast;
                        const isCompleted = !isLast;
                        const config = statusConfig[entry.status] || {
                          color: "#6B7280",
                          label: entry.status,
                        };

                        return (
                          <div key={index} className="flex gap-3">
                            {/* Timeline line + dot */}
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full flex-shrink-0 border-2",
                                  isCompleted
                                    ? "bg-[#10B981] border-[#10B981]"
                                    : isCurrent
                                      ? "bg-[#0891B2] border-[#0891B2]"
                                      : "bg-[var(--background-secondary)] border-[var(--border)]"
                                )}
                              />
                              {!isLast && (
                                <div
                                  className={cn(
                                    "w-0.5 flex-1 min-h-[24px]",
                                    isCompleted
                                      ? "bg-[#10B981]/30"
                                      : "bg-[var(--border)]"
                                  )}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className={cn("pb-4", isLast && "pb-0")}>
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[12px] font-semibold"
                                  style={{ color: config.color }}
                                >
                                  {config.label}
                                </span>
                                <span className="text-[11px] text-[var(--muted)]">
                                  {formatDate(entry.date)}
                                </span>
                              </div>
                              {entry.note && (
                                <p className="text-[12px] text-[var(--muted)] mt-0.5">
                                  {entry.note}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Notes
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  {application.notes && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-[var(--muted)] mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-[var(--foreground)]">
                        {application.notes}
                      </p>
                    </div>
                  )}
                  {!application.notes && (
                    <p className="text-[13px] text-[var(--muted)] italic">
                      No notes added yet.
                    </p>
                  )}
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add note..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Address if present */}
              {application.address && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Address
                  </h3>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                    <p className="text-[13px] text-[var(--foreground)]">
                      {application.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Buttons */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
              {application.status === "enrolled" ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <CheckCircle className="w-5 h-5 text-[#0891B2]" />
                  <span className="text-sm font-semibold text-[#0891B2]">
                    Student Enrolled
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Accept / Reject / Waitlist row */}
                  {application.status !== "rejected" && (
                    <div className="flex items-center gap-2">
                      {application.status !== "accepted" && (
                        <button
                          onClick={() =>
                            onStatusChange(application.id, "accepted")
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#10B981] rounded-lg hover:bg-[#059669] transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                      )}
                      <button
                        onClick={() =>
                          onStatusChange(application.id, "rejected")
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#EF4444] rounded-lg hover:bg-[#DC2626] transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      {application.status !== "waitlisted" && (
                        <button
                          onClick={() =>
                            onStatusChange(application.id, "waitlisted")
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#A855F7] rounded-lg hover:bg-[#9333EA] transition-all"
                        >
                          <Clock className="w-4 h-4" />
                          Waitlist
                        </button>
                      )}
                    </div>
                  )}

                  {/* Enroll button for accepted applications */}
                  {application.status === "accepted" && (
                    <button
                      onClick={() => onEnroll(application.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      Enroll Student
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
