"use client";

import { Award, FileEdit } from "lucide-react";

interface CertificateTemplate {
  id: string;
  name: string;
  type: "transfer" | "graduation" | "achievement" | "character" | "enrollment";
  lastModified: string;
  status: string;
  usageCount: number;
}

interface TemplateSectionProps {
  templates: CertificateTemplate[];
}

const typeColors: Record<string, string> = {
  transfer: "#3B82F6",
  graduation: "#8B5CF6",
  achievement: "#F59E0B",
  character: "#10B981",
  enrollment: "#0891B2",
};

const typeLabels: Record<string, string> = {
  transfer: "Transfer",
  graduation: "Graduation",
  achievement: "Achievement",
  character: "Character",
  enrollment: "Enrollment",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TemplateSection({ templates }: TemplateSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Certificate Templates
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const color = typeColors[template.type] || "#6B7280";
          return (
            <div
              key={template.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3"
            >
              {/* Template Name */}
              <div>
                <h3 className="text-[14px] font-medium text-[var(--foreground)]">
                  {template.name}
                </h3>
                <span
                  className="inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: color,
                    backgroundColor: `${color}15`,
                  }}
                >
                  {typeLabels[template.type]}
                </span>
              </div>

              {/* Meta */}
              <div className="space-y-1.5">
                <p className="text-[12px] text-[var(--muted)]">
                  Last modified: {formatDate(template.lastModified)}
                </p>
                <p className="text-[12px] text-[var(--muted)]">
                  Used {template.usageCount} times
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md border transition-colors"
                  style={{
                    color: "#0891B2",
                    borderColor: "#0891B2",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(8, 145, 178, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Award className="w-3.5 h-3.5" />
                  Generate
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[var(--muted)] border border-[var(--border)] rounded-md hover:bg-[var(--background-secondary)] transition-colors">
                  <FileEdit className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
