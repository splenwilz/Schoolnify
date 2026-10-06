"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Staff } from "@/types/staff";
import { ImportWizard, type ImportPayload } from "./import-wizard";

/** Commit seam: swap for the bulk import mutation once the staff API exists. */
async function commitImport(payload: ImportPayload) {
  await new Promise((r) => setTimeout(r, 400));
  return { created: payload.create.length, updated: payload.update.length, failed: 0 };
}

export function ImportPageView({ existingStaff, today, country }: { existingStaff: Staff[]; today: string; country: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[960px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/school-admin/staff" aria-label="Back to staff" className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Import staff</h1>
          <p className="text-[14px] text-[var(--muted)]">Bulk create or update people from a CSV export.</p>
        </div>
      </div>
      <ImportWizard existingStaff={existingStaff} today={today} country={country} onCommit={commitImport} />
    </motion.div>
  );
}
