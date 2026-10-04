"use client";

import Link from "next/link";
import { staff } from "@/lib/demo-data";
import { Avatar } from "../../students/_components/avatar";

const newest = [...staff]
  .sort((a, b) => b.hireDate.localeCompare(a.hireDate))
  .slice(0, 4);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewestHiresCard() {
  return (
    <div className="surface-flat p-6 h-full">
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
        Newest team members
      </p>
      <div className="flex flex-col gap-3">
        {newest.map((s) => (
          <Link
            key={s.id}
            href={`/school-admin/staff/${s.id}`}
            className="flex items-center gap-3 group"
          >
            <Avatar firstName={s.firstName} lastName={s.lastName} size="sm" className="rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[var(--foreground)] truncate group-hover:text-[var(--brand)] transition-colors">
                {s.firstName} {s.lastName}
              </p>
              <p className="text-[11px] text-[var(--muted)] truncate">{s.designation}</p>
            </div>
            <span className="text-[11px] text-[var(--muted)] tabular-nums flex-shrink-0">
              {formatDate(s.hireDate)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
