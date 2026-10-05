import { cn } from "@/lib/utils";
import type { CredentialHealth } from "@/lib/staff/credentials";

const STYLE: Record<CredentialHealth, { dot: string; label: string }> = {
  none: { dot: "bg-[var(--border)]", label: "none recorded" },
  ok: { dot: "bg-[var(--success)]", label: "all valid" },
  unknown: { dot: "bg-[var(--warning)]", label: "a date needs checking" },
  expiring: { dot: "bg-[var(--warning)]", label: "expiring soon" },
  expired: { dot: "bg-[var(--error)]", label: "expired" },
};

/** Compact indicator for the directory column; the status text is read by screen readers. */
export function CredentialHealthDot({ health }: { health: CredentialHealth }) {
  const s = STYLE[health];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
      <span className={cn("w-2 h-2 rounded-full", s.dot)} aria-hidden="true" />
      <span className="sr-only">Credentials: {s.label}</span>
      <span aria-hidden="true" className="capitalize">
        {health === "none" ? "None" : health === "ok" ? "Valid" : health === "unknown" ? "Check" : health === "expiring" ? "Expiring" : "Expired"}
      </span>
    </span>
  );
}
