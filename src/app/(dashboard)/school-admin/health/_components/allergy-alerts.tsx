"use client";

import { AlertTriangle } from "lucide-react";

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

interface AllergyAlertsProps {
  profiles: HealthProfile[];
}

export function AllergyAlerts({ profiles }: AllergyAlertsProps) {
  const profilesWithAllergies = profiles
    .filter((p) => p.allergies.length > 0)
    .slice(0, 6);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
        </div>
        <h3 className="text-[13px] font-semibold text-[var(--foreground)]">
          Allergy Alerts
        </h3>
      </div>

      {profilesWithAllergies.length === 0 ? (
        <p className="text-[12px] text-[var(--muted)]">
          No allergy alerts to display.
        </p>
      ) : (
        <div className="space-y-3">
          {profilesWithAllergies.map((profile) => (
            <div key={profile.id} className="space-y-1.5">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {profile.studentName}
                </p>
                <p className="text-xs text-[var(--muted)]">{profile.grade}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#FEE2E2] text-[#DC2626]"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
