"use client";

import { useMemo } from "react";
import { Search, MoreHorizontal } from "lucide-react";

interface SubAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: "active" | "invited" | "deactivated";
  invitedDate: string;
  lastActive?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface SubAdminTableProps {
  subAdmins: SubAdmin[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  roles: Role[];
}

const statusColors: Record<string, { color: string; bg: string }> = {
  active: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  invited: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  deactivated: { color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

const tabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "invited", label: "Invited" },
  { id: "deactivated", label: "Deactivated" },
];

function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return "Pending invite";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export function SubAdminTable({
  subAdmins,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  roles,
}: SubAdminTableProps) {
  const tabCounts = useMemo(
    () => ({
      all: subAdmins.length,
      active: subAdmins.filter((sa) => sa.status === "active").length,
      invited: subAdmins.filter((sa) => sa.status === "invited").length,
      deactivated: subAdmins.filter((sa) => sa.status === "deactivated").length,
    }),
    [subAdmins]
  );

  const filtered = useMemo(() => {
    return subAdmins.filter((sa) => {
      if (statusFilter && statusFilter !== "all" && sa.status !== statusFilter)
        return false;
      if (roleFilter && sa.roleId !== roleFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${sa.firstName} ${sa.lastName}`.toLowerCase();
        if (!fullName.includes(query) && !sa.email.toLowerCase().includes(query))
          return false;
      }
      return true;
    });
  }, [subAdmins, statusFilter, roleFilter, searchQuery]);

  const getRoleColor = (roleId: string): string => {
    const role = roles.find((r) => r.id === roleId);
    return role?.color || "#6B7280";
  };

  return (
    <div className="space-y-4">
      {/* Tab Pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (tab.id === "all" && (!statusFilter || statusFilter === "all")) ||
              statusFilter === tab.id
                ? "bg-[#0891B2]/10 text-[#0891B2]"
                : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              {tabCounts[tab.id as keyof typeof tabCounts]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Role Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
        >
          <option value="">All roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Last Active
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sa) => {
                const initials = `${sa.firstName[0]}${sa.lastName[0]}`;
                const roleColor = getRoleColor(sa.roleId);
                const statusStyle = statusColors[sa.status];

                return (
                  <tr
                    key={sa.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)`,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {sa.firstName} {sa.lastName}
                          </div>
                          <div className="text-xs text-[var(--muted)]">
                            {sa.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{
                          color: roleColor,
                          backgroundColor: `${roleColor}1a`,
                        }}
                      >
                        {sa.roleName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full capitalize"
                        style={{
                          color: statusStyle.color,
                          backgroundColor: statusStyle.bg,
                        }}
                      >
                        {sa.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)]">
                        {formatRelativeDate(sa.lastActive)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No sub-admins found
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>
          Showing {filtered.length} of {subAdmins.length} sub-admins
        </span>
      </div>
    </div>
  );
}
