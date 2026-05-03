"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, DollarSign, AlertTriangle, Mail, Phone, MapPin, Heart, Users, ChevronDown } from "lucide-react";
import type { Student } from "@/types/student";
import { cn } from "@/lib/utils";

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
      <p className="text-[12px] text-[var(--muted)] mb-0.5">{label}</p>
      <p className="text-[14px] font-medium text-[var(--foreground)]">{value || "N/A"}</p>
    </div>
  );
}

export function OverviewTab({ student }: OverviewTabProps) {
  const primaryGuardian = student.guardians.find((g) => g.isPrimary) ?? student.guardians[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Info Sections */}
      <div className="lg:col-span-2 space-y-6">
        {/* Personal Information */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <InfoField label="Full Name" value={`${student.firstName} ${student.middleName ?? ""} ${student.lastName}`.trim()} />
            <InfoField label="Gender" value={student.gender} />
            <InfoField label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} />
            <InfoField label="Admission Number" value={student.admissionNumber} />
            <InfoField label="Grade Level" value={student.gradeLevel} />
            <InfoField label="Section" value={student.section ?? "N/A"} />
            <InfoField label="Enrollment Date" value={new Date(student.enrollmentDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} />
            <InfoField label="Status" value={student.status.charAt(0).toUpperCase() + student.status.slice(1)} />
            <InfoField label="Boarding Status" value={student.boardingStatus} />
          </div>
        </div>

        {/* Guardian(s) */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[var(--muted)]" />
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Guardian(s)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.guardians.map((g, i) => (
              <div key={i} className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[14px] font-medium text-[var(--foreground)]">{g.firstName} {g.lastName}</p>
                  {g.isPrimary && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#0891B2]/10 text-[#0891B2] uppercase">Primary</span>
                  )}
                </div>
                <div className="space-y-1.5 text-[13px]">
                  <p className="text-[var(--muted)]">Relationship: <span className="text-[var(--foreground)]">{g.relationship}</span></p>
                  <div className="flex items-center gap-1.5 text-[var(--muted)]">
                    <Phone className="w-3 h-3" />
                    <span className="text-[var(--foreground)]">{g.phone}</span>
                  </div>
                  {g.email && (
                    <div className="flex items-center gap-1.5 text-[var(--muted)]">
                      <Mail className="w-3 h-3" />
                      <span className="text-[var(--foreground)]">{g.email}</span>
                    </div>
                  )}
                  {g.occupation && (
                    <p className="text-[var(--muted)]">Occupation: <span className="text-[var(--foreground)]">{g.occupation}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical + Regional (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medical */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-[var(--muted)]" />
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Medical</h2>
            </div>
            <div className="space-y-3">
              <InfoField label="Blood Group" value={student.bloodGroup ?? "N/A"} />
              <InfoField label="Genotype" value={student.genotype ?? "N/A"} />
              <InfoField label="Allergies" value={student.allergies ?? "None"} />
              <InfoField label="Medical Conditions" value={student.medicalConditions ?? "None"} />
            </div>
          </div>

          {/* Regional */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[var(--muted)]" />
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Regional Info</h2>
            </div>
            <div className="space-y-3">
              <InfoField label="State of Origin" value={student.stateOfOrigin ?? "N/A"} />
              <InfoField label="LGA" value={student.lga ?? "N/A"} />
              <InfoField label="Religion" value={student.religion ?? "N/A"} />
              <InfoField label="Tribe / Ethnicity" value={student.tribe ?? "N/A"} />
            </div>
          </div>
        </div>

        {/* Contact */}
        {(student.phone || student.email || student.address) && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Contact</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {student.phone && <InfoField label="Phone" value={student.phone} />}
              {student.email && <InfoField label="Email" value={student.email} />}
              {student.address && <InfoField label="Address" value={`${student.address}${student.city ? `, ${student.city}` : ""}${student.state ? `, ${student.state}` : ""}`} />}
            </div>
          </div>
        )}

        {/* Fee Summary */}
        <FeeSection student={student} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Enrollment Status */}
        <StatusManager student={student} />

        {/* Class Assignment */}
        <ClassAssignment student={student} />

        {/* Quick Actions */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--muted)] transition-all group cursor-pointer"
              >
                <action.icon className="w-5 h-5 transition-colors" style={{ color: action.color }} />
                <span className="text-[12px] font-medium text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors text-center">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatusManager -- change enrollment status
// ---------------------------------------------------------------------------

const STATUSES = [
  { value: "active", label: "Active", color: "#10B981" },
  { value: "inactive", label: "Inactive", color: "#6B7280" },
  { value: "transferred", label: "Transferred", color: "#3B82F6" },
  { value: "withdrawn", label: "Withdrawn", color: "#F59E0B" },
  { value: "graduated", label: "Graduated", color: "#8B5CF6" },
  { value: "suspended", label: "Suspended", color: "#EF4444" },
];

function StatusManager({ student }: { student: Student }) {
  const [showForm, setShowForm] = useState(false);
  const [newStatus, setNewStatus] = useState(student.status);
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);

  const currentStatus = STATUSES.find((s) => s.value === student.status) ?? STATUSES[0];

  const handleSave = () => {
    // Demo: just show success
    setSaved(true);
    setShowForm(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Enrollment Status</h2>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStatus.color }} />
          {currentStatus.label}
        </span>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-[12px] font-medium text-[#0891B2] hover:underline">
            Change
          </button>
        )}
      </div>

      {saved && (
        <p className="text-[12px] text-[#10B981] font-medium mb-2">Status updated successfully</p>
      )}

      {showForm && (
        <div className="space-y-3 pt-3 border-t border-[var(--border)]">
          <div>
            <label className="block text-[12px] text-[var(--muted)] mb-1">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as Student["status"])}
              className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
            >
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-[var(--muted)] mb-1">Reason</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Parent requested transfer"
              className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors">
              Update Status
            </button>
            <button onClick={() => { setShowForm(false); setNewStatus(student.status); setReason(""); }} className="px-3 py-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--foreground)]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClassAssignment -- change grade level / section
// ---------------------------------------------------------------------------

function ClassAssignment({ student }: { student: Student }) {
  const [showForm, setShowForm] = useState(false);
  const [grade, setGrade] = useState(student.gradeLevel);
  const [section, setSection] = useState(student.section ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setShowForm(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Class Assignment</h2>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-[var(--foreground)]">
          {student.gradeLevel}{student.section ? ` ${student.section}` : ""}
        </span>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-[12px] font-medium text-[#0891B2] hover:underline">
            Change
          </button>
        )}
      </div>

      {saved && (
        <p className="text-[12px] text-[#10B981] font-medium mb-2">Class updated successfully</p>
      )}

      {showForm && (
        <div className="space-y-3 pt-3 border-t border-[var(--border)]">
          <div>
            <label className="block text-[12px] text-[var(--muted)] mb-1">Grade Level</label>
            <input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. JSS 2"
              className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[var(--muted)] mb-1">Section</label>
            <input
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. A, Science"
              className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors">
              Update Class
            </button>
            <button onClick={() => { setShowForm(false); setGrade(student.gradeLevel); setSection(student.section ?? ""); }} className="px-3 py-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--foreground)]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeeSection -- fee balance + payment history
// ---------------------------------------------------------------------------

function FeeSection({ student }: { student: Student }) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false);

  const totalFee = 250000;
  const paid = student.feeStatus === "paid" ? totalFee : student.feeStatus === "pending" ? Math.round(totalFee * 0.6) : Math.round(totalFee * 0.3);
  const balance = totalFee - paid;

  const payments = [
    ...(paid > 0 ? [{ date: "2025-01-15", amount: Math.round(paid * 0.6), method: "Bank Transfer", ref: "PAY-001" }] : []),
    ...(paid > Math.round(totalFee * 0.3) ? [{ date: "2025-03-10", amount: paid - Math.round(paid * 0.6), method: "Cash", ref: "PAY-002" }] : []),
  ];

  const handleRecordPayment = () => {
    setPaymentSaved(true);
    setShowPayment(false);
    setPaymentAmount("");
    setTimeout(() => setPaymentSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[var(--muted)]" />
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Fees</h2>
        </div>
        {!showPayment && balance > 0 && (
          <button onClick={() => setShowPayment(true)} className="text-[12px] font-medium text-[#0891B2] hover:underline">
            Record Payment
          </button>
        )}
      </div>

      {paymentSaved && <p className="text-[12px] text-[#10B981] font-medium mb-3">Payment recorded</p>}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-[var(--background-secondary)]">
          <p className="text-[11px] text-[var(--muted)] mb-0.5">Total</p>
          <p className="text-[14px] font-semibold text-[var(--foreground)] tabular-nums">{"\u20A6"}{totalFee.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-[#10B981]/5">
          <p className="text-[11px] text-[var(--muted)] mb-0.5">Paid</p>
          <p className="text-[14px] font-semibold text-[#10B981] tabular-nums">{"\u20A6"}{paid.toLocaleString()}</p>
        </div>
        <div className={cn("p-3 rounded-lg", balance > 0 ? "bg-red-500/5" : "bg-[var(--background-secondary)]")}>
          <p className="text-[11px] text-[var(--muted)] mb-0.5">Balance</p>
          <p className={cn("text-[14px] font-semibold tabular-nums", balance > 0 ? "text-red-500" : "text-[var(--foreground)]")}>{"\u20A6"}{balance.toLocaleString()}</p>
        </div>
      </div>

      {showPayment && (
        <div className="p-3 rounded-lg border border-[#0891B2]/20 bg-[#0891B2]/5 mb-4 space-y-2">
          <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Amount" className="w-full px-3 py-2 text-[13px] bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]" />
          <div className="flex gap-2">
            <button onClick={handleRecordPayment} disabled={!paymentAmount} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-40">Record</button>
            <button onClick={() => setShowPayment(false)} className="px-3 py-1.5 text-[12px] text-[var(--muted)]">Cancel</button>
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-2">History</p>
          {payments.map((p) => (
            <div key={p.ref} className="flex items-center justify-between text-[12px] py-1.5">
              <div><span className="text-[var(--foreground)] font-medium">{"\u20A6"}{p.amount.toLocaleString()}</span> <span className="text-[var(--muted)]">{p.method}</span></div>
              <span className="text-[var(--muted)]">{new Date(p.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
