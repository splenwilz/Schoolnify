"use client";

/**
 * Staff List Page - Stripe-Inspired Clean Design
 * Features: Minimal stats, subtle chart, clean table
 * @see Stripe Dashboard - Professional, muted colors
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { staff } from "@/lib/demo-data";

// Calculate stats
const stats = {
  total: staff.length,
  active: staff.filter(s => s.status === "active").length,
  onLeave: staff.filter(s => s.status === "on_leave").length,
  teachers: staff.filter(s => s.role === "Teacher").length,
};

// Staff growth data (mock)
const staffGrowth = [
  { month: "Feb", count: 42 },
  { month: "Mar", count: 44 },
  { month: "Apr", count: 45 },
  { month: "May", count: 46 },
  { month: "Jun", count: 44 },
  { month: "Jul", count: 44 },
  { month: "Aug", count: 52 },
  { month: "Sep", count: 55 },
  { month: "Oct", count: 58 },
  { month: "Nov", count: 60 },
  { month: "Dec", count: 61 },
  { month: "Jan", count: 62 },
];

const maxStaff = Math.max(...staffGrowth.map(d => d.count));

// Tab options
const tabs = [
  { id: "all", label: "All", count: staff.length },
  { id: "active", label: "Active", count: staff.filter(s => s.status === "active").length },
  { id: "on_leave", label: "On Leave", count: staff.filter(s => s.status === "on_leave").length },
];

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const departments = useMemo(() => [...new Set(staff.map(s => s.department))].sort(), []);
  const roles = useMemo(() => [...new Set(staff.map(s => s.role))].sort(), []);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      if (activeTab === "active" && member.status !== "active") return false;
      if (activeTab === "on_leave" && member.status !== "on_leave") return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        if (!fullName.includes(query) && !member.email.toLowerCase().includes(query)) return false;
      }
      if (selectedDepartment && member.department !== selectedDepartment) return false;
      if (selectedRole && member.role !== selectedRole) return false;
      return true;
    });
  }, [activeTab, searchQuery, selectedDepartment, selectedRole]);

  const handleSelectAll = () => {
    if (selectedStaff.length === filteredStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff.map(s => s.id));
    }
  };

  const handleSelectStaff = (id: string) => {
    setSelectedStaff(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Staff</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Manage your team members</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-[var(--foreground)] border border-[var(--border)] rounded-md hover:bg-[var(--background-secondary)]">
            Export
          </button>
          <Link
            href="/school-admin/staff/new"
            className="px-3 py-1.5 text-sm font-medium text-white bg-[#0891B2] rounded-md hover:bg-[#0E7490]"
          >
            Add staff
          </Link>
        </div>
      </div>

      {/* Stats Row - Stripe style: simple text, no boxes */}
      <div className="flex items-baseline gap-8 mb-8 pb-6 border-b border-[var(--border)]">
        <div>
          <p className="text-sm text-[var(--muted)]">Total staff</p>
          <p className="text-3xl font-semibold text-[var(--foreground)] tabular-nums">{stats.total}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">Active</p>
          <p className="text-3xl font-semibold text-[var(--foreground)] tabular-nums">{stats.active}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">On leave</p>
          <p className="text-3xl font-semibold text-[var(--foreground)] tabular-nums">{stats.onLeave}</p>
        </div>
        <div className="ml-auto">
          {/* Mini sparkline chart */}
          <p className="text-sm text-[var(--muted)] mb-1">Team size</p>
          <div className="flex items-end gap-0.5 h-8">
            <svg width="120" height="32" viewBox="0 0 120 32" className="text-[var(--muted)]">
              <path
                d={`M 0 ${32 - (staffGrowth[0].count / maxStaff) * 28} ${staffGrowth.map((d, i) => {
                  const x = (i / (staffGrowth.length - 1)) * 120;
                  const y = 32 - (d.count / maxStaff) * 28;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--foreground)] ml-2">{staffGrowth[staffGrowth.length - 1].count}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--background-secondary)] text-[var(--foreground)] font-medium"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs text-[var(--muted)]">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)]"
        >
          <option value="">Department</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)]"
        >
          <option value="">Role</option>
          {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 rounded border-[var(--border)]"
                />
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Name</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Role</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Department</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Status</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Joined</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredStaff.map(member => (
              <tr key={member.id} className="hover:bg-[var(--background-secondary)]">
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(member.id)}
                    onChange={() => handleSelectStaff(member.id)}
                    className="w-3.5 h-3.5 rounded border-[var(--border)]"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/school-admin/staff/${member.id}`} className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-xs font-medium text-[var(--foreground)]">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm text-[var(--foreground)] group-hover:text-[#0891B2]">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{member.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-sm text-[var(--foreground)]">{member.role}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-sm text-[var(--muted)]">{member.department}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center text-xs ${
                    member.status === "active" ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      member.status === "active" ? "bg-green-500" : "bg-yellow-500"
                    }`} />
                    {member.status === "active" ? "Active" : "On leave"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-sm text-[var(--muted)]">{formatDate(member.joinDate)}</span>
                </td>
                <td className="px-3 py-2.5">
                  <button className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStaff.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--muted)]">
            No staff found
          </div>
        )}

        {filteredStaff.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2.5 border-t border-[var(--border)] text-xs text-[var(--muted)]">
            <span>{filteredStaff.length} results</span>
            <div className="flex gap-1">
              <button disabled className="px-2 py-1 border border-[var(--border)] rounded text-[var(--muted)] opacity-50">Previous</button>
              <button disabled className="px-2 py-1 border border-[var(--border)] rounded text-[var(--muted)] opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
