"use client";

import { motion } from "framer-motion";
import { FileText, Award, User, Heart, Upload, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { staffDocuments } from "@/lib/demo-data";

interface DocumentsTabProps {
  staffId: string;
}

const typeConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  contract: { icon: FileText, color: "#3B82F6", label: "Contract" },
  certification: { icon: Award, color: "#F59E0B", label: "Certification" },
  resume: { icon: User, color: "#8B5CF6", label: "Resume" },
  medical: { icon: Heart, color: "#EF4444", label: "Medical" },
};

const statusColors: Record<string, string> = {
  active: "#10B981",
  expired: "#EF4444",
};

export function DocumentsTab({ staffId }: DocumentsTabProps) {
  const documents = staffDocuments.filter((d) => d.staffId === staffId);

  return (
    <div className="space-y-6">
      {/* Document List Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Documents</h3>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/20 transition-all">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FolderOpen className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--muted)]">No documents found</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {documents.map((doc, index) => {
              const config = typeConfig[doc.type] || typeConfig.contract;
              const Icon = config.icon;
              const sColor = statusColors[doc.status];

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer"
                >
                  {/* Type Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${config.color}15`,
                          color: config.color,
                        }}
                      >
                        {config.label}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {new Date(doc.uploadDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-[var(--muted)]">{doc.fileSize}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full"
                      )}
                      style={{
                        backgroundColor: `${sColor}15`,
                        color: sColor,
                      }}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>

                  {/* Expiry Date (if applicable) */}
                  {doc.expiryDate && (
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-[var(--muted)]">Expires</p>
                      <p className="text-xs font-medium text-[var(--foreground)]">
                        {new Date(doc.expiryDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
