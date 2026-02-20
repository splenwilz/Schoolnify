"use client";

import { Search, ChevronDown, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchoolConfig } from "@/lib/school-config-context";

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

interface ProfilesTabProps {
  profiles: HealthProfile[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  gradeFilter: string;
  onGradeChange: (grade: string) => void;
  onViewProfile: (profile: HealthProfile) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfilesTab({
  profiles,
  searchQuery,
  onSearchChange,
  gradeFilter,
  onGradeChange,
  onViewProfile,
}: ProfilesTabProps) {
  const { fmtGrade } = useSchoolConfig();
  const grades = Array.from(new Set(profiles.map((p) => p.grade))).sort();

  const filtered = profiles.filter((p) => {
    if (gradeFilter && p.grade !== gradeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !p.studentName.toLowerCase().includes(q) &&
        !p.bloodGroup.toLowerCase().includes(q) &&
        !p.allergies.some((a) => a.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header with search and filter */}
      <div className="px-5 pt-5 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Health Profiles
          </h3>
          <span className="text-[12px] text-[var(--muted)]">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, blood group, allergy..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={gradeFilter}
              onChange={(e) => onGradeChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !gradeFilter && "text-[var(--muted)]"
              )}
            >
              <option value="">All Grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {fmtGrade(g)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-[var(--border)]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Blood Group
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Allergies
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Conditions
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Last Checkup
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No health profiles found.
                  </p>
                  <button
                    onClick={() => {
                      onSearchChange("");
                      onGradeChange("");
                    }}
                    className="mt-2 text-sm text-[#0891B2] hover:underline"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((profile) => (
                <tr
                  key={profile.id}
                  className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                >
                  {/* Student */}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onViewProfile(profile)}
                      className="text-left"
                    >
                      <p className="text-[13px] font-medium text-[var(--foreground)] hover:text-[#0891B2] transition-colors">
                        {profile.studentName}
                      </p>
                      <p className="text-[12px] text-[var(--muted)] mt-0.5">
                        {fmtGrade(profile.grade)}
                      </p>
                    </button>
                  </td>

                  {/* Blood Group */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#0891B2]/10 text-[#0891B2]">
                      {profile.bloodGroup}
                    </span>
                  </td>

                  {/* Allergies */}
                  <td className="px-4 py-3.5">
                    {profile.allergies.length === 0 ? (
                      <span className="text-[12px] text-[var(--muted)]">
                        None
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {profile.allergies.slice(0, 2).map((allergy) => (
                          <span
                            key={allergy}
                            className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#FEE2E2] text-[#DC2626]"
                          >
                            {allergy}
                          </span>
                        ))}
                        {profile.allergies.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--background-secondary)] text-[var(--muted)]">
                            +{profile.allergies.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Conditions */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    {profile.conditions.length === 0 ? (
                      <span className="text-[12px] text-[var(--muted)]">
                        None
                      </span>
                    ) : (
                      <span className="text-[12px] text-[var(--foreground)]">
                        {profile.conditions.join(", ")}
                      </span>
                    )}
                  </td>

                  {/* Last Checkup */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[13px] text-[var(--muted)]">
                      {formatDate(profile.lastCheckup)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => onViewProfile(profile)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[#0891B2] hover:bg-[#0891B2]/10 rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
