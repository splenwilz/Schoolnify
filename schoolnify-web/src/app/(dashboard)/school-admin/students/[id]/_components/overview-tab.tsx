"use client";

import { motion } from "framer-motion";
import { FileText, DollarSign, AlertTriangle, Mail } from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  gender: string;
  dateOfBirth: string;
  enrollmentDate: string;
  parentName: string;
  parentPhone: string;
  status: "active" | "inactive";
}

interface OverviewTabProps {
  student: Student;
}

const quickActions = [
  { icon: FileText, label: "Report Card", color: "#0891B2" },
  { icon: DollarSign, label: "Record Payment", color: "#10B981" },
  { icon: AlertTriangle, label: "Disciplinary Note", color: "#F59E0B" },
  { icon: Mail, label: "Contact Parent", color: "#A855F7" },
];

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)] uppercase tracking-wide">{label}</p>
      <p className="text-sm text-[var(--foreground)] mt-1">{value}</p>
    </div>
  );
}

export function OverviewTab({ student }: OverviewTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Personal Information */}
      <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoField
            label="Date of Birth"
            value={new Date(student.dateOfBirth).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <InfoField label="Gender" value={student.gender} />
          <InfoField
            label="Enrollment Date"
            value={new Date(student.enrollmentDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <InfoField label="Email" value={student.email} />
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
            Parent/Guardian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField label="Name" value={student.parentName} />
            <InfoField label="Phone" value={student.parentPhone} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, idx) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] hover:scale-[1.02] transition-all"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${action.color}15` }}
              >
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-xs font-medium text-[var(--foreground)] text-center">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
