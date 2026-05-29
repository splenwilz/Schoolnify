"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Calendar,
  MapPin,
  FileText,
  Shield,
  Bell,
  BellOff,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  type: "behavioral" | "academic" | "attendance" | "bullying" | "property";
  severity: "minor" | "moderate" | "major" | "critical";
  status: "open" | "in_progress" | "resolved" | "escalated";
  description: string;
  location: string;
  reportedBy: string;
  actionTaken: string;
  parentNotified: boolean;
}

interface IncidentDetailProps {
  incident: Incident | null;
  onClose: () => void;
}

const severityConfig: Record<
  string,
  { bg: string; text: string; color: string; label: string }
> = {
  minor: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    color: "#3B82F6",
    label: "Minor",
  },
  moderate: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    color: "#F59E0B",
    label: "Moderate",
  },
  major: {
    bg: "bg-[#EF4444]/10",
    text: "text-[#EF4444]",
    color: "#EF4444",
    label: "Major",
  },
  critical: {
    bg: "bg-[#7C2D12]/10",
    text: "text-[#7C2D12]",
    color: "#7C2D12",
    label: "Critical",
  },
};

const statusConfig: Record<
  string,
  { bg: string; text: string; color: string; label: string }
> = {
  open: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    color: "#F59E0B",
    label: "Open",
  },
  in_progress: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    color: "#3B82F6",
    label: "In Progress",
  },
  resolved: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    color: "#10B981",
    label: "Resolved",
  },
  escalated: {
    bg: "bg-[#EF4444]/10",
    text: "text-[#EF4444]",
    color: "#EF4444",
    label: "Escalated",
  },
};

const typeLabels: Record<string, string> = {
  behavioral: "Behavioral",
  academic: "Academic",
  attendance: "Attendance",
  bullying: "Bullying",
  property: "Property",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function IncidentDetail({ incident, onClose }: IncidentDetailProps) {
  return (
    <AnimatePresence>
      {incident && (
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
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[var(--card)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Incident Details
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {incident.id}
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
                      <p className="text-[12px] text-[var(--muted)]">
                        Student Name
                      </p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {incident.studentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Grade</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {incident.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incident Information */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Incident Information
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  {/* Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Type
                    </span>
                    <span className="text-[12px] text-[var(--muted)] bg-[var(--background-secondary)] px-2.5 py-0.5 rounded">
                      {typeLabels[incident.type] || incident.type}
                    </span>
                  </div>
                  {/* Severity */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Severity
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full",
                        severityConfig[incident.severity].bg,
                        severityConfig[incident.severity].text
                      )}
                    >
                      {severityConfig[incident.severity].label}
                    </span>
                  </div>
                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Date
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[var(--muted)]" />
                      <span className="text-[12px] text-[var(--foreground)]">
                        {formatDate(incident.date)}
                      </span>
                    </div>
                  </div>
                  {/* Location */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Location
                    </span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[var(--muted)]" />
                      <span className="text-[12px] text-[var(--foreground)]">
                        {incident.location || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Description
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-[var(--muted)] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
                      {incident.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Taken */}
              {incident.actionTaken && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Action Taken
                  </h3>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                    <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
                      {incident.actionTaken}
                    </p>
                  </div>
                </div>
              )}

              {/* Status & Notifications */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Status & Notifications
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  {/* Current Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Current Status
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            statusConfig[incident.status].color,
                        }}
                      />
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full",
                          statusConfig[incident.status].bg,
                          statusConfig[incident.status].text
                        )}
                      >
                        {statusConfig[incident.status].label}
                      </span>
                    </div>
                  </div>
                  {/* Parent Notification */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Parent Notified
                    </span>
                    <div className="flex items-center gap-1.5">
                      {incident.parentNotified ? (
                        <>
                          <Bell className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-[12px] font-medium text-[#10B981]">
                            Yes
                          </span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span className="text-[12px] font-medium text-[#F59E0B]">
                            Not yet
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Reported By */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Reported By
                    </span>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3 text-[var(--muted)]" />
                      <span className="text-[12px] text-[var(--foreground)]">
                        {incident.reportedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
              {!incident.parentNotified && (
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Notify Parent
                </button>
              )}
              <button
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
