"use client";

import { useId, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  href?: string;
  tone?: "default" | "warning" | "error";
  className?: string;
}

/** Labelled metric tile; exposed as a named group so assistive tech reads label and value together. */
export function StatTile({ label, value, detail, href, tone = "default", className }: StatTileProps) {
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={id}
      className={cn("p-4 rounded-lg border bg-[var(--card)]", tone === "error" ? "border-[var(--error)]/40" : tone === "warning" ? "border-[var(--warning)]/40" : "border-[var(--border)]", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span id={id} className="text-sm text-[var(--muted)]">{label}</span>
        {href && (
          <Link href={href} className="text-sm text-[var(--brand)] hover:underline">
            View
          </Link>
        )}
      </div>
      <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums mt-1">{value}</div>
      {detail && <div className="text-xs text-[var(--muted)] mt-1">{detail}</div>}
    </div>
  );
}
