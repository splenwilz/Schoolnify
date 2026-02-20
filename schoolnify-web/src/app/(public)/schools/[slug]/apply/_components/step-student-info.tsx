"use client";

import { useSchoolConfig } from "@/lib/school-config-context";

interface StudentInfoData {
  studentName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  previousSchool: string;
}

interface StepStudentInfoProps {
  data: StudentInfoData;
  onChange: (field: string, value: string) => void;
}

const inputClassName =
  "w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClassName = "block text-sm font-medium text-[var(--foreground)] mb-1.5";

export function StepStudentInfo({ data, onChange }: StepStudentInfoProps) {
  const { gradeOptions } = useSchoolConfig();
  const gradeOpts = gradeOptions({ minLevel: 7, maxLevel: 12 });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Student Information</h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Enter the student&apos;s personal details below.
        </p>
      </div>

      {/* Full Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.studentName}
            onChange={(e) => onChange("studentName", e.target.value)}
            placeholder="e.g. John Doe"
            className={inputClassName}
            required
          />
        </div>
        <div>
          <label className={labelClassName}>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="e.g. john@example.com"
            className={inputClassName}
          />
        </div>
      </div>

      {/* Phone & Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="e.g. +1 234 567 890"
            className={inputClassName}
          />
        </div>
        <div>
          <label className={labelClassName}>Date of Birth</label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      {/* Gender & Grade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Gender</label>
          <select
            value={data.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className={inputClassName}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClassName}>
            Grade Applying For <span className="text-red-500">*</span>
          </label>
          <select
            value={data.grade}
            onChange={(e) => onChange("grade", e.target.value)}
            className={inputClassName}
            required
          >
            <option value="">Select grade</option>
            {gradeOpts.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Previous School */}
      <div>
        <label className={labelClassName}>Previous School</label>
        <input
          type="text"
          value={data.previousSchool}
          onChange={(e) => onChange("previousSchool", e.target.value)}
          placeholder="e.g. Springfield High School"
          className={inputClassName}
        />
      </div>
    </div>
  );
}
