"use client";

import { useState, useMemo } from "react";
import { schoolDocuments, certificateTemplates } from "@/lib/demo-data";
import { CategorySidebar } from "./_components/category-sidebar";
import { DocumentTable } from "./_components/document-table";
import { UploadModal } from "./_components/upload-modal";
import { DocumentDetail } from "./_components/document-detail";
import { TemplateSection } from "./_components/template-section";
import { TcRequestsTab } from "./_components/tc-requests-tab";
import { BulkGenerateModal } from "./_components/bulk-generate-modal";
import { Plus, FileStack } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentItem {
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

function parseSizeToMB(size: string): number {
  const match = size.match(/([\d.]+)\s*(MB|KB)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "KB") return value / 1024;
  return value;
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null
  );
  const [showBulkGenerateModal, setShowBulkGenerateModal] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"all" | "tc">("all");

  // Metrics
  const totalDocuments = schoolDocuments.length;

  const totalSizeMB = useMemo(() => {
    const total = schoolDocuments.reduce(
      (sum, doc) => sum + parseSizeToMB(doc.fileSize),
      0
    );
    return total.toFixed(1);
  }, []);

  const recentUploads = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return schoolDocuments.filter(
      (doc) => new Date(doc.uploadDate) >= thirtyDaysAgo
    ).length;
  }, []);

  const totalTemplates = certificateTemplates.length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">
          Document Management
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 space-y-4">
            {/* Metric Cards. 2x2 grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Total Documents
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {totalDocuments}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Across all categories
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Total Size
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {totalSizeMB} MB
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Combined file storage
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Recent Uploads
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {recentUploads}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  In the last 30 days
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Templates
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {totalTemplates}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Certificate templates
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-72">
            <CategorySidebar documents={schoolDocuments} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Library Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Library
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkGenerateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
            >
              <FileStack className="w-4 h-4" />
              Bulk Generate
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-[#0891B2] hover:bg-[#0E7490] transition-all"
            >
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Library Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] w-fit mb-6">
          {[
            { id: "all" as const, label: "All Documents" },
            { id: "tc" as const, label: "Transfer Certificates" },
          ].map((tab) => {
            const isActive = libraryTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setLibraryTab(tab.id)}
                className={cn(
                  "px-4 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {libraryTab === "all" && (
          <DocumentTable
            documents={schoolDocuments}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            onViewDocument={setSelectedDocument}
          />
        )}

        {libraryTab === "tc" && <TcRequestsTab />}
      </section>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Templates Section */}
      <section>
        <TemplateSection templates={certificateTemplates} />
      </section>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      {/* Document Detail Slide-out */}
      <DocumentDetail
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      {/* Bulk Generate Modal */}
      <BulkGenerateModal
        isOpen={showBulkGenerateModal}
        onClose={() => setShowBulkGenerateModal(false)}
      />
    </div>
  );
}
