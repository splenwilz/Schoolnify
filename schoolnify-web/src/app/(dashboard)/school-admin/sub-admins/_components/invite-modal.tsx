"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
}

export function InviteModal({ isOpen, onClose, roles }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId),
    [roles, selectedRoleId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual only. no actual submission
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg mx-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Invite Sub-Admin
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.edu"
                    className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                  />
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Role
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                  >
                    <option value="">Select a role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Permissions Display */}
                {selectedRole && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Permissions
                    </label>
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-3 space-y-2">
                      {selectedRole.permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[#0891B2]"
                          />
                          <span className="text-xs text-[var(--foreground)]">
                            {permission
                              .replace(/\./g, " > ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors shadow-sm shadow-[#0891B2]/25"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
