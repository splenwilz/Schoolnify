"use client";

import { Folder } from "lucide-react";

interface Document {
  id: string;
  name: string;
  category: "student_records" | "staff_records" | "certificates" | "templates" | "reports";
  type: "pdf" | "docx" | "xlsx" | "image";
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  status: "active" | "archived" | "draft";
  tags: string[];
}

interface CategorySidebarProps {
  documents: Document[];
}

const categoryLabels: Record<string, string> = {
  student_records: "Student Records",
  staff_records: "Staff Records",
  certificates: "Certificates",
  templates: "Templates",
  reports: "Reports",
};

const categoryOrder = [
  "student_records",
  "staff_records",
  "certificates",
  "templates",
  "reports",
];

export function CategorySidebar({ documents }: CategorySidebarProps) {
  const categoryCounts = categoryOrder.map((cat) => ({
    key: cat,
    label: categoryLabels[cat],
    count: documents.filter((d) => d.category === cat).length,
  }));

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
        Categories
      </h3>
      <div className="space-y-3">
        {categoryCounts.map((cat) => (
          <div key={cat.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-[var(--muted)]" />
              <span className="text-sm text-[var(--foreground)]">
                {cat.label}
              </span>
            </div>
            <span className="text-sm font-medium text-[var(--foreground)] font-mono">
              {cat.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
