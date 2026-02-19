"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { tcRequests } from "@/lib/demo-data";
import { Plus, FileText, CheckCircle } from "lucide-react";

interface TcRequest {
  id: string;
  studentName: string;
  grade: string;
  requestDate: string;
  reason: string;
  status: "pending" | "generated" | "collected";
  generatedDate?: string;
  collectedDate?: string;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Pending",
  },
  generated: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    label: "Generated",
  },
  collected: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Collected",
  },
};

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "--";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TcRequestsTab() {
  const [requests, setRequests] = useState<TcRequest[]>(
    tcRequests as TcRequest[]
  );

  const handleNewTcRequest = () => {
    alert("New TC Request: This feature is coming soon.");
  };

  const handleGenerate = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "generated" as const,
              generatedDate: new Date().toISOString().split("T")[0],
            }
          : req
      )
    );
  };

  const handleMarkCollected = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "collected" as const,
              collectedDate: new Date().toISOString().split("T")[0],
            }
          : req
      )
    );
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Transfer Certificates
            </h3>
            <span className="text-[12px] text-[var(--muted)]">
              {requests.length} request{requests.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={handleNewTcRequest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-[#0891B2] hover:bg-[#0E7490] transition-all"
          >
            <Plus className="w-4 h-4" />
            New TC Request
          </button>
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
                Grade
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Request Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Generated Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">
                Collected Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No transfer certificate requests.
                  </p>
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const config = statusConfig[request.status];
                return (
                  <tr
                    key={request.id}
                    className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">
                        {request.studentName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[var(--muted)]">
                        {request.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(request.requestDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <span className="text-[12px] text-[var(--foreground)] line-clamp-2">
                        {request.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                          config.bg,
                          config.text
                        )}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-[12px] text-[var(--muted)]">
                        {formatDate(request.generatedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-[12px] text-[var(--muted)]">
                        {formatDate(request.collectedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleGenerate(request.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 rounded-lg hover:bg-[#3B82F6]/20 transition-all"
                        >
                          <FileText className="w-3 h-3" />
                          Generate
                        </button>
                      )}
                      {request.status === "generated" && (
                        <button
                          onClick={() => handleMarkCollected(request.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 rounded-lg hover:bg-[#10B981]/20 transition-all"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark Collected
                        </button>
                      )}
                      {request.status === "collected" && (
                        <span className="text-[11px] text-[var(--muted)]">
                          --
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
