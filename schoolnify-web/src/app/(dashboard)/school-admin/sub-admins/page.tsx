"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import {
  subAdminRoles,
  subAdmins,
  subAdminActivityLog,
} from "@/lib/demo-data";
import { SubAdminTable } from "./_components/sub-admin-table";
import { RoleCards } from "./_components/role-cards";
import { ActivityLog } from "./_components/activity-log";
import { InviteModal } from "./_components/invite-modal";

export default function SubAdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const totalSubAdmins = subAdmins.length;
  const activeCount = subAdmins.filter((sa) => sa.status === "active").length;
  const invitedCount = subAdmins.filter((sa) => sa.status === "invited").length;
  const rolesConfigured = subAdminRoles.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Sub-Admin Management
          </h1>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite Sub-Admin
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 space-y-4">
            {/* Metric Cards — 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total Sub-Admins */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Total Sub-Admins
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {totalSubAdmins}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Across {rolesConfigured} roles
                </div>
              </div>

              {/* Active */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">Active</span>
                </div>
                <div className="text-2xl font-semibold text-[#10B981]">
                  {activeCount}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  {totalSubAdmins > 0
                    ? `${Math.round((activeCount / totalSubAdmins) * 100)}% of total`
                    : "No sub-admins"}
                </div>
              </div>

              {/* Invited (Pending) */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Invited (Pending)
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[#F59E0B]">
                  {invitedCount}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Awaiting acceptance
                </div>
              </div>

              {/* Roles Configured */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Roles Configured
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {rolesConfigured}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  With custom permissions
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar — Role Cards */}
          <div className="w-full lg:w-72">
            <RoleCards roles={subAdminRoles} subAdmins={subAdmins} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Content Section */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sub-Admin Table */}
          <div className="lg:col-span-8">
            <SubAdminTable
              subAdmins={subAdmins}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              roleFilter={roleFilter}
              onRoleChange={setRoleFilter}
              roles={subAdminRoles}
            />
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-4">
            <ActivityLog activities={subAdminActivityLog} />
          </div>
        </div>
      </section>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        roles={subAdminRoles}
      />
    </motion.div>
  );
}
