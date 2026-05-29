"use client";

/**
 * Curriculum Tab
 * Displays curriculum items with subject/grade filtering, topic status badges,
 * progress bars, and an overall completion rate summary card.
 */

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSchoolConfig } from "@/lib/school-config-context";

interface Topic {
  name: string;
  duration: string;
  status: "completed" | "in_progress" | "upcoming";
}

interface CurriculumItem {
  id: string;
  subjectId: string;
  subjectName: string;
  grade: string;
  term: string;
  topics: Topic[];
  completionRate: number;
}

interface CurriculumTabProps {
  items: CurriculumItem[];
}

const statusConfig: Record<
  Topic["status"],
  { label: string; color: string; bg: string }
> = {
  completed: {
    label: "Completed",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  in_progress: {
    label: "In Progress",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
  },
  upcoming: {
    label: "Upcoming",
    color: "#6B7280",
    bg: "rgba(107,114,128,0.1)",
  },
};

export function CurriculumTab({ items }: CurriculumTabProps) {
  const { fmtGrade } = useSchoolConfig();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const subjects = useMemo(
    () => [...new Set(items.map((item) => item.subjectName))].sort(),
    [items]
  );

  const grades = useMemo(
    () => [...new Set(items.map((item) => item.grade))].sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSubject =
        selectedSubject === "all" || item.subjectName === selectedSubject;
      const matchGrade =
        selectedGrade === "all" || item.grade === selectedGrade;
      return matchSubject && matchGrade;
    });
  }, [items, selectedSubject, selectedGrade]);

  const overallCompletion = useMemo(() => {
    if (filteredItems.length === 0) return 0;
    const total = filteredItems.reduce(
      (sum, item) => sum + item.completionRate,
      0
    );
    return Math.round(total / filteredItems.length);
  }, [filteredItems]);

  const totalTopics = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.topics.length, 0);
  }, [filteredItems]);

  const completedTopics = useMemo(() => {
    return filteredItems.reduce(
      (sum, item) =>
        sum + item.topics.filter((t) => t.status === "completed").length,
      0
    );
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Overall Completion Card */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Curriculum Progress
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              {completedTopics} of {totalTopics} topics completed across{" "}
              {filteredItems.length} subjects
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--foreground)]">
              {overallCompletion}%
            </div>
            <div className="text-xs text-[var(--muted)]">
              Overall completion
            </div>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${overallCompletion}%`,
              backgroundColor:
                overallCompletion >= 70
                  ? "#10B981"
                  : overallCompletion >= 40
                    ? "#F59E0B"
                    : "#EF4444",
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Subject:
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Grade:
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
          >
            <option value="all">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {fmtGrade(grade)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-[var(--muted)]">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Curriculum Items */}
      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            No curriculum items match the selected filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
            >
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-semibold text-[var(--foreground)]">
                    {item.subjectName}
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {fmtGrade(item.grade)} &middot; {item.term}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {item.completionRate}%
                    </span>
                    <span className="text-xs text-[var(--muted)] ml-1">
                      complete
                    </span>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.completionRate}%`,
                        backgroundColor:
                          item.completionRate >= 70
                            ? "#10B981"
                            : item.completionRate >= 40
                              ? "#F59E0B"
                              : "#EF4444",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics List */}
              <div className="space-y-2">
                {item.topics.map((topic, idx) => {
                  const config = statusConfig[topic.status];
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg",
                        "bg-[var(--background-secondary)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Status Indicator */}
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-sm text-[var(--foreground)]">
                          {topic.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--muted)]">
                          {topic.duration}
                        </span>
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                          style={{
                            color: config.color,
                            backgroundColor: config.bg,
                          }}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Summary */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>
          {filteredItems.length} curriculum{" "}
          {filteredItems.length === 1 ? "item" : "items"} displayed
        </span>
        <span>
          {completedTopics} of {totalTopics} topics completed
        </span>
      </div>
    </div>
  );
}
