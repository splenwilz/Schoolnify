"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, FileDown } from "lucide-react";
import { admissionApplications } from "@/lib/demo-data";
import { AdmissionsOverviewCard } from "./_components/admissions-overview-card";
import { AdmissionsMiniStats } from "./_components/admissions-mini-stats";
import { PipelineCards } from "./_components/pipeline-cards";
import { ApplicationTable } from "./_components/application-table";
import { ApplicationModal } from "./_components/application-modal";
import { ApplicationDetail } from "./_components/application-detail";
import { EnrollmentModal } from "./_components/enrollment-modal";

interface Application {
  id: string;
  trackingCode?: string;
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  appliedDate: string;
  status: "inquiry" | "applied" | "under_review" | "accepted" | "enrolled" | "rejected" | "waitlisted";
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  documents: string[];
  notes?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  relationship?: string;
  statusHistory?: { status: string; date: string; note: string }[];
}

const statusLabels: Record<string, string> = {
  inquiry: "Inquiry",
  applied: "Applied",
  under_review: "Under Review",
  accepted: "Accepted",
  enrolled: "Enrolled",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
};

export default function AdmissionsPage() {
  const [localApplications, setLocalApplications] = useState<Application[]>(
    admissionApplications as Application[]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [enrollingApplication, setEnrollingApplication] = useState<Application | null>(null);

  const stats = useMemo(() => {
    const total = localApplications.length;
    const pendingReview = localApplications.filter(
      (a) => a.status === "applied" || a.status === "under_review"
    ).length;
    const accepted = localApplications.filter(
      (a) => a.status === "accepted"
    ).length;
    const enrolled = localApplications.filter(
      (a) => a.status === "enrolled"
    ).length;
    const acceptanceRate =
      total > 0 ? Math.round(((accepted + enrolled) / total) * 100) : 0;

    // Count applications from this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const newThisMonth = localApplications.filter((a) => {
      const d = new Date(a.appliedDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    return { total, pendingReview, accepted, enrolled, acceptanceRate, newThisMonth };
  }, [localApplications]);

  const handleSaveApplication = (
    data: {
      studentName: string;
      email: string;
      phone: string;
      grade: string;
      parentName: string;
      parentEmail: string;
      previousSchool: string;
      notes: string;
    },
    mode: "inquiry" | "applied"
  ) => {
    const today = new Date().toISOString().split("T")[0];
    const newApp: Application = {
      id: `app_${Date.now()}`,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      grade: data.grade,
      appliedDate: today,
      status: mode,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      previousSchool: data.previousSchool,
      documents: [],
      notes: data.notes || undefined,
      statusHistory: [
        {
          status: mode,
          date: today,
          note:
            mode === "applied"
              ? "Application registered by admin"
              : "Inquiry logged by admin",
        },
      ],
    };
    setLocalApplications((prev) => [newApp, ...prev]);
  };

  const handleStatusChange = (appId: string, newStatus: string) => {
    setLocalApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const today = new Date().toISOString().split("T")[0];
        const label = statusLabels[newStatus] || newStatus;
        const newEntry = {
          status: newStatus,
          date: today,
          note: `Status changed to ${label}`,
        };
        return {
          ...app,
          status: newStatus as Application["status"],
          statusHistory: [...(app.statusHistory || []), newEntry],
        };
      })
    );

    // If the detail panel is open for this application, update it too
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication((prev) => {
        if (!prev || prev.id !== appId) return prev;
        const today = new Date().toISOString().split("T")[0];
        const label = statusLabels[newStatus] || newStatus;
        const newEntry = {
          status: newStatus,
          date: today,
          note: `Status changed to ${label}`,
        };
        return {
          ...prev,
          status: newStatus as Application["status"],
          statusHistory: [...(prev.statusHistory || []), newEntry],
        };
      });
    }
  };

  const handleReview = (application: Application) => {
    setSelectedApplication(application);
  };

  const handleEnroll = (appId: string) => {
    const app = localApplications.find((a) => a.id === appId);
    if (app) {
      setEnrollingApplication(app);
    }
  };

  const handleConfirmEnrollment = (data: {
    classAssignment: string;
    enrollmentDate: string;
    feeStatus: string;
  }) => {
    if (!enrollingApplication) return;

    const appId = enrollingApplication.id;
    const newEntry = {
      status: "enrolled",
      date: data.enrollmentDate,
      note: `Enrolled in ${data.classAssignment} — Fee status: ${data.feeStatus}`,
    };

    setLocalApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: "enrolled" as const,
          statusHistory: [...(app.statusHistory || []), newEntry],
        };
      })
    );

    // Update the detail panel if it's showing this application
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication((prev) => {
        if (!prev || prev.id !== appId) return prev;
        return {
          ...prev,
          status: "enrolled" as const,
          statusHistory: [...(prev.statusHistory || []), newEntry],
        };
      });
    }

    setEnrollingApplication(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Admissions
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage student applications and enrollment pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* Row 1: Hero — Overview + Mini Stats + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-2">
          <AdmissionsOverviewCard
            total={stats.total}
            newThisMonth={stats.newThisMonth}
            acceptanceRate={stats.acceptanceRate}
          />
        </div>
        <div className="lg:col-span-1">
          <AdmissionsMiniStats
            pendingReview={stats.pendingReview}
            accepted={stats.accepted}
            enrolled={stats.enrolled}
          />
        </div>
        <div className="lg:col-span-2">
          <PipelineCards applications={localApplications} />
        </div>
      </div>

      {/* Application Table */}
      <div>
        <ApplicationTable
          applications={localApplications}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          gradeFilter={gradeFilter}
          onGradeChange={setGradeFilter}
          onApplicationStatusChange={handleStatusChange}
          onReview={handleReview}
        />
      </div>

      {/* Log Inquiry Modal */}
      <ApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveApplication}
      />

      {/* Application Detail Panel */}
      <ApplicationDetail
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onStatusChange={handleStatusChange}
        onEnroll={handleEnroll}
      />

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={enrollingApplication !== null}
        application={enrollingApplication}
        onClose={() => setEnrollingApplication(null)}
        onConfirm={handleConfirmEnrollment}
      />
    </motion.div>
  );
}
