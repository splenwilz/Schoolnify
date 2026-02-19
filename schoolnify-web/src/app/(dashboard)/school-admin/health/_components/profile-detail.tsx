"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Heart,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
} from "lucide-react";

interface HealthProfile {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: { name: string; phone: string; relation: string };
  immunizations: { name: string; date: string; status: "completed" | "pending" }[];
  lastCheckup: string;
  notes: string;
}

interface ProfileDetailProps {
  profile: HealthProfile | null;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfileDetail({ profile, onClose }: ProfileDetailProps) {
  return (
    <AnimatePresence>
      {profile && (
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
                  Health Profile
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {profile.id}
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
              {/* Student Info */}
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
                      <p className="text-[12px] text-[var(--muted)]">Name</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {profile.studentName}
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
                        {profile.grade}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Blood Group
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#0891B2]/10 text-[#0891B2]">
                      {profile.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Allergies
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                  {profile.allergies.length === 0 ? (
                    <p className="text-[13px] text-[var(--muted)]">
                      No known allergies
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#FEE2E2] text-[#DC2626]"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Conditions */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Medical Conditions
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                  {profile.conditions.length === 0 ? (
                    <p className="text-[13px] text-[var(--muted)]">
                      No medical conditions on file
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {profile.conditions.map((condition) => (
                        <div
                          key={condition}
                          className="flex items-center gap-2"
                        >
                          <Heart className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0" />
                          <span className="text-[13px] text-[var(--foreground)]">
                            {condition}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Emergency Contact
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Name
                    </span>
                    <span className="text-[13px] font-medium text-[var(--foreground)]">
                      {profile.emergencyContact.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Phone
                    </span>
                    <a
                      href={`tel:${profile.emergencyContact.phone}`}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-[#0891B2] hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      {profile.emergencyContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Relation
                    </span>
                    <span className="text-[13px] text-[var(--foreground)]">
                      {profile.emergencyContact.relation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Immunization Records */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Immunization Records
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Vaccine
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.immunizations.map((imm) => (
                        <tr
                          key={imm.name}
                          className="border-t border-[var(--border)]"
                        >
                          <td className="px-4 py-2.5 text-[12px] text-[var(--foreground)]">
                            {imm.name}
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-[var(--muted)]">
                            {formatDate(imm.date)}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              {imm.status === "completed" ? (
                                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                              )}
                              <span
                                className={`text-[11px] font-medium ${
                                  imm.status === "completed"
                                    ? "text-[#10B981]"
                                    : "text-[#F59E0B]"
                                }`}
                              >
                                {imm.status === "completed"
                                  ? "Completed"
                                  : "Pending"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {profile.notes && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Notes
                  </h3>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-[var(--muted)] mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
                        {profile.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
