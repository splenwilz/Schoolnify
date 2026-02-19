"use client";

import { useMemo } from "react";
import { Search, FileText, FileSpreadsheet, Image, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface DocumentTableProps {
  documents: Document[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  onViewDocument: (doc: Document) => void;
}

const categoryTabs = [
  { id: "", label: "All" },
  { id: "student_records", label: "Student Records" },
  { id: "staff_records", label: "Staff Records" },
  { id: "certificates", label: "Certificates" },
  { id: "templates", label: "Templates" },
  { id: "reports", label: "Reports" },
];

const categoryLabels: Record<string, string> = {
  student_records: "Student Records",
  staff_records: "Staff Records",
  certificates: "Certificates",
  templates: "Templates",
  reports: "Reports",
};

const typeIconColors: Record<string, string> = {
  pdf: "#EF4444",
  docx: "#3B82F6",
  xlsx: "#10B981",
  image: "#F59E0B",
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
  archived: { color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)" },
  draft: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
};

function FileTypeIcon({ type }: { type: string }) {
  const color = typeIconColors[type] || "#6B7280";
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4" style={{ color }} />;
    case "docx":
      return <FileText className="w-4 h-4" style={{ color }} />;
    case "xlsx":
      return <FileSpreadsheet className="w-4 h-4" style={{ color }} />;
    case "image":
      return <Image className="w-4 h-4" style={{ color }} />;
    default:
      return <FileText className="w-4 h-4" style={{ color }} />;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DocumentTable({
  documents,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  onViewDocument,
}: DocumentTableProps) {
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { "": documents.length };
    for (const doc of documents) {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    }
    return counts;
  }, [documents]);

  const filtered = useMemo(() => {
    let result = [...documents];
    if (categoryFilter) {
      result = result.filter((d) => d.category === categoryFilter);
    }
    if (typeFilter) {
      result = result.filter((d) => d.type === typeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.uploadedBy.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [documents, categoryFilter, typeFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Tab Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onCategoryChange(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded text-sm font-medium transition-colors",
              categoryFilter === tab.id
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)]"
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              {tabCounts[tab.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Type Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
        >
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="xlsx">XLSX</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Size
                </th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const statusStyle = statusConfig[doc.status];
                return (
                  <tr
                    key={doc.id}
                    className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileTypeIcon type={doc.type} />
                        <span className="text-[13px] font-medium text-[var(--foreground)] truncate max-w-[240px]">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[var(--muted)] px-2 py-0.5 rounded-full bg-[var(--background-secondary)]">
                        {categoryLabels[doc.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase text-[var(--muted)] tracking-wider">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {doc.fileSize}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {doc.uploadedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(doc.uploadDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{
                          color: statusStyle.color,
                          backgroundColor: statusStyle.bg,
                        }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewDocument(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium text-[#0891B2] rounded-md hover:bg-[#0891B2]/10 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-[var(--muted)]"
                  >
                    No documents found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
