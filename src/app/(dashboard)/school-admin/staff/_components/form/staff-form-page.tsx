"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, FileSpreadsheet, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaffDetail } from "@/types/staff";
import { staffFullName } from "@/types/staff";
import type { StaffCreateInput, StaffFormValues, StaffUpdateInput } from "@/lib/staff/schema";
import { currentContractOn } from "@/lib/staff/projections";
import { StaffForm } from "./staff-form";

interface StaffFormPageProps {
  mode: "create" | "edit";
  initial?: StaffDetail;
  today: string;
  country: string;
  managers: { id: string; name: string }[];
  departments: string[];
  backHref: string;
  title: string;
  subtitle?: string;
}

const REDIRECT_DELAY_MS = 1200;

/** Same two-way entry as Add Student: build one record here, or bring a spreadsheet. */
const CREATE_TABS = [
  { id: "new", label: "New Staff Member", icon: UserPlus, href: "/school-admin/staff/new" },
  { id: "import", label: "Import from CSV", icon: FileSpreadsheet, href: "/school-admin/staff/import" },
] as const;

/**
 * Submit seam. Until the staff API exists this resolves locally; it is the
 * one place to swap in useCreateStaff()/useUpdateStaff() mutations. Edits
 * carry the id of the contract being changed so history is never flattened.
 */
async function persistStaff(input: StaffCreateInput | StaffUpdateInput, _values: StaffFormValues): Promise<void> {
  void input;
  void _values;
  await new Promise((r) => setTimeout(r, 300));
}

export function StaffFormPage({ mode, initial, today, country, managers, departments, backHref, title, subtitle }: StaffFormPageProps) {
  const router = useRouter();
  const [savedName, setSavedName] = useState<string | null>(null);
  const contractId = initial ? currentContractOn(initial.contracts, today)?.id ?? initial.contracts[0]?.id ?? null : null;
  const doneHref = mode === "edit" && initial ? `/school-admin/staff/${initial.id}` : "/school-admin/staff";

  // Show the confirmation briefly, then move on; cancelled if the page unmounts first.
  const redirect = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (redirect.current) clearTimeout(redirect.current); }, []);

  if (savedName) {
    return (
      <div className="py-16 text-center" role="status">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[var(--success)]" aria-hidden="true" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">{mode === "edit" ? "Changes Saved" : "Staff Member Added"}</h2>
        <p className="text-[14px] text-[var(--muted)]">
          {savedName} {mode === "edit" ? "has been updated" : "has been added"}. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[860px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={backHref} aria-label="Back" className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">{title}</h1>
          {subtitle && <p className="text-[14px] text-[var(--muted)]">{subtitle}</p>}
        </div>
      </div>

      {mode === "create" && (
        <nav aria-label="How to add staff" className="flex gap-2 mb-6">
          {CREATE_TABS.map((tab) => {
            const active = tab.id === "new";
            return (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-lg border transition-colors",
                  active
                    ? "bg-[var(--brand)]/10 border-[var(--brand)]/30 text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/20"
                )}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      )}

      <StaffForm
        mode={mode}
        initial={initial}
        today={today}
        country={country}
        managers={managers}
        departments={departments}
        onCancel={() => router.push(backHref)}
        onSubmit={async (input, values) => {
          await persistStaff(mode === "edit" ? { ...input, contractId } : input, values);
          setSavedName(staffFullName({ firstName: values.firstName, lastName: values.lastName, preferredName: values.preferredName, title: values.title }));
          redirect.current = setTimeout(() => router.push(doneHref), REDIRECT_DELAY_MS);
        }}
      />
    </motion.div>
  );
}
