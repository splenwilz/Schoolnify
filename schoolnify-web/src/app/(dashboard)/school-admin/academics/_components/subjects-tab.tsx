"use client";

/**
 * Subjects Management Tab
 * Displays subjects with search, department filtering, and CRUD actions
 */

interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  teachers: string[];
  grades: string[];
}

interface SubjectsTabProps {
  subjects: Subject[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
}

const departments = ["All", "Mathematics", "Languages", "Science", "Arts"];

const departmentColors: Record<string, { color: string; bg: string }> = {
  Mathematics: { color: "#0891B2", bg: "rgba(8,145,178,0.1)" },
  Languages: { color: "#A855F7", bg: "rgba(168,85,247,0.1)" },
  Science: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  Arts: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

export function SubjectsTab({
  subjects,
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
}: SubjectsTabProps) {
  const filtered = subjects.filter((subject) => {
    const matchesSearch =
      !searchQuery ||
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      !departmentFilter ||
      departmentFilter === "All" ||
      subject.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4">
      {/* Search + Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search subjects by name or code..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
          />
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => onDepartmentChange(dept === "All" ? "" : dept)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              (dept === "All" && !departmentFilter) ||
              departmentFilter === dept
                ? "bg-[#0891B2]/10 text-[#0891B2]"
                : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Subject Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Teachers
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Grades
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((subject) => {
                const deptColor = departmentColors[subject.department] || {
                  color: "#6B7280",
                  bg: "rgba(107,114,128,0.1)",
                };
                return (
                  <tr
                    key={subject.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {subject.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)] font-mono">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{
                          color: deptColor.color,
                          backgroundColor: deptColor.bg,
                        }}
                      >
                        {subject.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {subject.teachers.map((teacher) => (
                          <span
                            key={teacher}
                            className="text-xs text-[var(--foreground)] bg-[var(--background-secondary)] px-2 py-0.5 rounded"
                          >
                            {teacher}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)]">
                        {subject.grades.length} grades
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          title="Edit subject"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-colors"
                          title="Delete subject"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <svg
              className="w-12 h-12 text-[var(--muted)] mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
            <p className="text-sm font-medium text-[var(--foreground)]">
              No subjects found
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>
          Showing {filtered.length} of {subjects.length} subjects
        </span>
      </div>
    </div>
  );
}
