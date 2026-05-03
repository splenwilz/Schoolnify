"use client";

import { DollarSign, Mail, Phone, MapPin, Heart, Users } from "lucide-react";
import type { Student } from "@/types/student";

interface OverviewTabProps {
  student: Student;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-[var(--muted)] mb-0.5">{label}</p>
      <p className="text-[14px] font-medium text-[var(--foreground)]">{value || "N/A"}</p>
    </div>
  );
}

const STATUS_LABEL: Record<Student["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  graduated: "Graduated",
  transferred: "Transferred",
  withdrawn: "Withdrawn",
};

export function OverviewTab({ student }: OverviewTabProps) {
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
            <InfoField label="Status" value={STATUS_LABEL[student.status]} />
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
            {student.guardians.map((g) => (
              <div key={g.id ?? `${g.firstName}-${g.phone}`} className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
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

        {/* Fees -- placeholder until fees module ships */}
        <FeesPlaceholder />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <SummaryCard label="Enrollment Status" value={STATUS_LABEL[student.status]} hint="Use the Change Status button above to update." />
        <SummaryCard
          label="Class Assignment"
          value={`${student.gradeLevel}${student.section ? ` ${student.section}` : ""}`}
          hint="Use the Change Class button above to move this student."
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="text-sm font-semibold text-[var(--foreground)] mb-2">{label}</h2>
      <p className="text-[14px] font-medium text-[var(--foreground)] mb-1">{value}</p>
      <p className="text-[12px] text-[var(--muted)]">{hint}</p>
    </div>
  );
}

function FeesPlaceholder() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-[var(--muted)]" />
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Fees</h2>
      </div>
      <p className="text-[13px] text-[var(--muted)]">
        Fee balance and payment history will appear here once the fees module is wired.
      </p>
    </div>
  );
}
