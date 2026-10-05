import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StaffMemberNotFound() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Staff member not found</h1>
        <p className="text-sm text-[var(--muted)] mt-1">This person may have been removed, or the link is wrong.</p>
        <Link href="/school-admin/staff" className="mt-4 text-sm text-[var(--brand)] hover:underline">
          Back to staff
        </Link>
      </div>
    </div>
  );
}
