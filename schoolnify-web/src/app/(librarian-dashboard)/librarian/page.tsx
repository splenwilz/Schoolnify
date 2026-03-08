"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./_components/overview-tab";
import { CatalogTab } from "./_components/catalog-tab";
import { CirculationTab } from "./_components/circulation-tab";
import { MembersTab } from "./_components/members-tab";
import { FinesTab } from "./_components/fines-tab";
import { ReportsTab } from "./_components/reports-tab";

const mainTabs = [
  { id: "overview", label: "Overview" },
  { id: "catalog", label: "Catalog" },
  { id: "circulation", label: "Circulation" },
  { id: "members", label: "Members" },
  { id: "fines", label: "Fines" },
  { id: "reports", label: "Reports" },
] as const;

type MainTab = (typeof mainTabs)[number]["id"];

export default function LibrarianDashboardPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("overview");

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
            Library Dashboard
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage catalog, circulation, members, fines, and library reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setActiveTab("circulation")}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Issue Book
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--background-secondary)] mb-6 w-fit overflow-x-auto">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "catalog" && <CatalogTab />}
      {activeTab === "circulation" && <CirculationTab />}
      {activeTab === "members" && <MembersTab />}
      {activeTab === "fines" && <FinesTab />}
      {activeTab === "reports" && <ReportsTab />}
    </motion.div>
  );
}
