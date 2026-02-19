"use client";

interface ApplicationFormData {
  studentName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  previousSchool: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  address: string;
  documents: string[];
  notes: string;
}

interface StepReviewProps {
  data: ApplicationFormData;
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
      <span className="text-sm text-[var(--muted)] sm:w-44 sm:flex-shrink-0">{label}</span>
      <span className="text-sm text-[var(--foreground)]">{value || "Not provided"}</span>
    </div>
  );
}

export function StepReview({ data }: StepReviewProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Review & Submit</h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Please review your information before submitting.
        </p>
      </div>

      {/* Student Information */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Student Information</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <ReviewField label="Full Name" value={data.studentName} />
          <ReviewField label="Email" value={data.email} />
          <ReviewField label="Phone" value={data.phone} />
          <ReviewField label="Date of Birth" value={data.dateOfBirth} />
          <ReviewField label="Gender" value={data.gender} />
          <ReviewField label="Grade Applying For" value={data.grade} />
          <ReviewField label="Previous School" value={data.previousSchool} />
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Parent / Guardian Information
          </h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <ReviewField label="Name" value={data.parentName} />
          <ReviewField label="Email" value={data.parentEmail} />
          <ReviewField label="Phone" value={data.parentPhone} />
          <ReviewField label="Relationship" value={data.relationship} />
          <ReviewField label="Address" value={data.address} />
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Documents</h3>
        </div>
        <div className="px-5 py-4">
          {data.documents.length > 0 ? (
            <ul className="space-y-2">
              {data.documents.map((doc) => (
                <li key={doc} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                  <svg
                    className="w-4 h-4 text-[#10B981] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {doc}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted)]">No documents selected</p>
          )}
        </div>
      </div>

      {/* Additional Notes */}
      {data.notes && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Additional Notes</h3>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">{data.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
