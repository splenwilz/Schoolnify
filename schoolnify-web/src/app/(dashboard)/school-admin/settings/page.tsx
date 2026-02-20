"use client";

/**
 * Settings Page - Account & School Settings
 * Features: Profile, notifications, school config, security
 * @see Stripe Dashboard - Settings page
 */

import { useState } from "react";
import { schoolInfo, currentUser } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";
import {
  CLASS_NAMING_TEMPLATES,
  formatGradeCode,
  formatGradeCodeWithRules,
  type LevelRule,
} from "@/lib/class-naming";

// Settings tabs
const tabs = [
  { id: "general", label: "General", icon: "settings" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "billing", label: "Billing", icon: "card" },
  { id: "team", label: "Team", icon: "users" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    schoolName: schoolInfo.name,
    email: schoolInfo.email,
    phone: schoolInfo.phone,
    address: schoolInfo.address,
    website: schoolInfo.website,
    academicYear: schoolInfo.academicYear,
    currentTerm: schoolInfo.currentTerm,
  });

  const {
    templateId,
    setTemplateId,
    customRules,
    setCustomRules,
    sections,
    setSections,
  } = useSchoolConfig();
  const [newSection, setNewSection] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage your school and account settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#0891B2]/10 text-[#0891B2]"
                    : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                {tab.icon === "settings" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
                {tab.icon === "bell" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                )}
                {tab.icon === "shield" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                )}
                {tab.icon === "card" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                )}
                {tab.icon === "users" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                )}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* School Profile */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">School Profile</h2>
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-2xl font-bold">
                    {schoolInfo.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--foreground)]">{schoolInfo.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{schoolInfo.type}</p>
                    <button className="mt-2 text-sm text-[#0891B2] hover:underline">Change logo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Settings */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Academic Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Academic Year</label>
                    <input
                      type="text"
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Current Term</label>
                    <input
                      type="text"
                      name="currentTerm"
                      value={formData.currentTerm}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                </div>
              </div>

              {/* Class Naming Format */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">Class Naming Format</h2>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Start from a preset, then customize prefixes, level ranges, and sections to match your school
                </p>

                {/* Preset Templates */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Start from preset
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CLASS_NAMING_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setTemplateId(template.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          templateId === template.id
                            ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                            : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                        }`}
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editable Rules Table */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Level groups
                  </label>
                  <div className="space-y-2">
                    {customRules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]"
                      >
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] text-[var(--muted)] mb-1">Prefix</label>
                          <input
                            type="text"
                            value={rule.prefix}
                            onChange={(e) => {
                              const updated = [...customRules];
                              updated[index] = { ...rule, prefix: e.target.value };
                              setCustomRules(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                            placeholder="e.g. Grade"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-[10px] text-[var(--muted)] mb-1">From level</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={rule.minLevel}
                            onChange={(e) => {
                              const updated = [...customRules];
                              const minLevel = Math.max(1, parseInt(e.target.value) || 1);
                              updated[index] = { ...rule, minLevel };
                              setCustomRules(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-[10px] text-[var(--muted)] mb-1">To level</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={rule.maxLevel}
                            onChange={(e) => {
                              const updated = [...customRules];
                              const maxLevel = Math.max(1, parseInt(e.target.value) || 1);
                              updated[index] = { ...rule, maxLevel };
                              setCustomRules(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-[10px] text-[var(--muted)] mb-1">Starts at</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={rule.minLevel - rule.levelOffset}
                            onChange={(e) => {
                              const updated = [...customRules];
                              const displayStart = Math.max(1, parseInt(e.target.value) || 1);
                              updated[index] = {
                                ...rule,
                                levelOffset: rule.minLevel - displayStart,
                              };
                              setCustomRules(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                          />
                        </div>
                        {customRules.length > 1 && (
                          <button
                            onClick={() => {
                              setCustomRules(customRules.filter((_, i) => i !== index));
                            }}
                            className="self-end mb-0.5 p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                            title="Remove group"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const lastRule = customRules[customRules.length - 1];
                      const nextMin = lastRule ? lastRule.maxLevel + 1 : 1;
                      setCustomRules([
                        ...customRules,
                        {
                          prefix: "New",
                          minLevel: nextMin,
                          maxLevel: nextMin + 2,
                          levelOffset: nextMin - 1,
                        },
                      ]);
                    }}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add level group
                  </button>
                </div>

                {/* Sections Editor */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Class sections
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {sections.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]"
                      >
                        {s}
                        <button
                          onClick={() => setSections(sections.filter((x) => x !== s))}
                          className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value.toUpperCase().slice(0, 2))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSection && !sections.includes(newSection)) {
                            setSections([...sections, newSection]);
                            setNewSection("");
                          }
                        }}
                        placeholder="+"
                        className="w-10 px-2 py-1 text-sm text-center bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                      />
                      {newSection && !sections.includes(newSection) && (
                        <button
                          onClick={() => {
                            setSections([...sections, newSection]);
                            setNewSection("");
                          }}
                          className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1.5">
                    Type a letter and press Enter to add. These are appended to class names (e.g. 7<strong>A</strong>, 7<strong>B</strong>).
                  </p>
                </div>

                {/* Live Preview */}
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Preview
                  </label>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {customRules.map((rule, i) => (
                        <div key={i}>
                          <p className="text-[10px] font-medium text-[var(--muted)] mb-1 uppercase">
                            {rule.prefix} (levels {rule.minLevel}&ndash;{rule.maxLevel})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from(
                              { length: Math.min(rule.maxLevel - rule.minLevel + 1, 6) },
                              (_, j) => {
                                const level = rule.minLevel + j;
                                const code = sections.length > 0
                                  ? `${level}${sections[0]}`
                                  : `${level}`;
                                return (
                                  <span
                                    key={level}
                                    className="px-2 py-0.5 text-xs font-medium rounded bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                                  >
                                    {formatGradeCodeWithRules(code, customRules)}
                                  </span>
                                );
                              }
                            )}
                            {rule.maxLevel - rule.minLevel + 1 > 6 && (
                              <span className="px-2 py-0.5 text-xs text-[var(--muted)]">
                                +{rule.maxLevel - rule.minLevel + 1 - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490]">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { id: "email_attendance", label: "Attendance Alerts", description: "Get notified when a student is marked absent" },
                  { id: "email_fees", label: "Fee Reminders", description: "Notifications about pending and overdue payments" },
                  { id: "email_messages", label: "New Messages", description: "Email notifications for new messages" },
                  { id: "email_reports", label: "Report Ready", description: "When scheduled reports are generated" },
                  { id: "email_system", label: "System Updates", description: "Updates about Schoolnify features and maintenance" },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                      <p className="text-xs text-[var(--muted)]">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--background-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0891B2]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490]">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Two-Factor Authentication</h2>
                <p className="text-sm text-[var(--muted)] mb-4">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[#0891B2]">
                  Enable 2FA
                </button>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Active Sessions</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-secondary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">MacBook Pro - Chrome</p>
                        <p className="text-xs text-[var(--muted)]">Current session • Springfield, USA</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#10B981]">Active now</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Current Plan</h2>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#0891B2]/10 text-[#0891B2]">Professional</span>
                </div>
                <p className="text-sm text-[var(--muted)] mb-4">Your plan renews on February 1, 2026</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[var(--foreground)]">$99</span>
                  <span className="text-[var(--muted)]">/month</span>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-[#0891B2] border border-[#0891B2] rounded-lg hover:bg-[#0891B2]/10">
                  Upgrade Plan
                </button>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Payment Method</h2>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--background-secondary)]">
                  <div className="w-12 h-8 rounded bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--foreground)]">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">•••• •••• •••• 4242</p>
                    <p className="text-xs text-[var(--muted)]">Expires 12/2027</p>
                  </div>
                  <button className="ml-auto text-sm text-[#0891B2] hover:underline">Edit</button>
                </div>
              </div>
            </div>
          )}

          {/* Team Settings */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Team Members</h2>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Invite Member
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background-secondary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-sm font-medium">
                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-[var(--muted)]">{currentUser.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-[#A855F7]/10 text-[#A855F7]">Owner</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background-secondary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-white text-sm font-medium">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">Jane Doe</p>
                        <p className="text-xs text-[var(--muted)]">jane.doe@greenwoodacademy.edu</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-[#0891B2]/10 text-[#0891B2]">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


