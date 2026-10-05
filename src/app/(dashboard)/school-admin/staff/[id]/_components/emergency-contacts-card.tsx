"use client";

import { motion } from "framer-motion";
import { LifeBuoy, Phone } from "lucide-react";
import type { EmergencyContact } from "@/types/person";

export function EmergencyContactsCard({ contacts }: { contacts: readonly EmergencyContact[] }) {
  const ordered = [...contacts].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.priority - b.priority);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
          <LifeBuoy className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
        </div>
        <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Emergency contacts</h3>
      </div>
      {ordered.length === 0 ? (
        <p className="text-[13px] text-[var(--muted)]">No emergency contact on file. Add one so the school can reach someone in an emergency.</p>
      ) : (
        <ul className="space-y-3">
          {ordered.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-[var(--foreground)]">
                  {c.name}
                  {c.isPrimary && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[var(--brand)]/10 text-[var(--brand)]">Primary</span>
                  )}
                </p>
                <p className="text-[12px] text-[var(--muted)]">{c.relationship}</p>
              </div>
              <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 text-[12px] text-[var(--foreground)] hover:text-[var(--brand)]">
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                {c.phone}
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
