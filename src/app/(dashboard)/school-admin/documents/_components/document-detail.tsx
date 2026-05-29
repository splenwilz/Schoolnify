"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  FileSpreadsheet,
  Image,
  Download,
  Share2,
  Archive,
  Calendar,
  User,
  HardDrive,
  Tag,
} from "lucide-react";

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

interface DocumentDetailProps {
  document: Document | null;
  onClose: () => void;
}

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

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", label: "Active" },
  archived: { color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)", label: "Archived" },
  draft: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", label: "Draft" },
};

function FileTypeIcon({ type, size = "w-5 h-5" }: { type: string; size?: string }) {
  const color = typeIconColors[type] || "#6B7280";
  switch (type) {
    case "pdf":
      return <FileText className={size} style={{ color }} />;
    case "docx":
      return <FileText className={size} style={{ color }} />;
    case "xlsx":
      return <FileSpreadsheet className={size} style={{ color }} />;
    case "image":
      return <Image className={size} style={{ color }} />;
    default:
      return <FileText className={size} style={{ color }} />;
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

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  return (
    <AnimatePresence>
      {document && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[var(--card)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--foreground)] truncate">
                  Document Details
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  View document information
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Document Name */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] leading-tight">
                  {document.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <FileTypeIcon type={document.type} size="w-4 h-4" />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      color: typeIconColors[document.type],
                      backgroundColor: `${typeIconColors[document.type]}15`,
                    }}
                  >
                    {document.type}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Information
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-4 h-4 text-[#0891B2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Category</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {categoryLabels[document.category]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                      <HardDrive className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Size</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {document.fileSize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Uploaded By</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {document.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Upload Date</p>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {formatDate(document.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: statusConfig[document.status].bg }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: statusConfig[document.status].color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[var(--muted)]">Status</p>
                      <p
                        className="text-[13px] font-medium"
                        style={{ color: statusConfig[document.status].color }}
                      >
                        {statusConfig[document.status].label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {document.tags.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[12px] font-medium text-[var(--foreground)] px-2.5 py-1 rounded-full bg-[var(--background-secondary)] border border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Placeholder */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Preview
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FileTypeIcon type={document.type} size="w-8 h-8" />
                    <p className="text-sm text-[var(--muted)] mt-2">
                      Preview not available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-all">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
