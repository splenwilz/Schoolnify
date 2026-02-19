"use client";

interface ParentInfoData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  address: string;
}

interface StepParentInfoProps {
  data: ParentInfoData;
  onChange: (field: string, value: string) => void;
}

const inputClassName =
  "w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClassName = "block text-sm font-medium text-[var(--foreground)] mb-1.5";

export function StepParentInfo({ data, onChange }: StepParentInfoProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Parent / Guardian Information
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Provide the details of the student&apos;s parent or guardian.
        </p>
      </div>

      {/* Parent Name */}
      <div>
        <label className={labelClassName}>
          Parent/Guardian Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.parentName}
          onChange={(e) => onChange("parentName", e.target.value)}
          placeholder="e.g. Jane Doe"
          className={inputClassName}
          required
        />
      </div>

      {/* Parent Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>
            Parent Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.parentEmail}
            onChange={(e) => onChange("parentEmail", e.target.value)}
            placeholder="e.g. jane@example.com"
            className={inputClassName}
            required
          />
        </div>
        <div>
          <label className={labelClassName}>Parent Phone</label>
          <input
            type="tel"
            value={data.parentPhone}
            onChange={(e) => onChange("parentPhone", e.target.value)}
            placeholder="e.g. +1 234 567 890"
            className={inputClassName}
          />
        </div>
      </div>

      {/* Relationship */}
      <div>
        <label className={labelClassName}>Relationship</label>
        <select
          value={data.relationship}
          onChange={(e) => onChange("relationship", e.target.value)}
          className={inputClassName}
        >
          <option value="">Select relationship</option>
          <option value="Father">Father</option>
          <option value="Mother">Mother</option>
          <option value="Guardian">Guardian</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Address */}
      <div>
        <label className={labelClassName}>Address</label>
        <textarea
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Enter full residential address"
          rows={3}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
