"use client";

import Link from "next/link";
import type { PublicSchoolInfo } from "@/lib/school-lookup";

interface SchoolFooterProps {
  school: PublicSchoolInfo;
}

export function SchoolFooter({ school }: SchoolFooterProps) {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center text-center gap-4">
          {/* School identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {school.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <span className="font-bold text-[var(--foreground)]">{school.name}</span>
          </div>

          {/* Contact details */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
            <span>{school.address}</span>
            <span className="hidden sm:inline">|</span>
            <a href={`tel:${school.phone}`} className="hover:text-[var(--foreground)] transition-colors">
              {school.phone}
            </a>
            <span className="hidden sm:inline">|</span>
            <a href={`mailto:${school.email}`} className="hover:text-[#0891B2] transition-colors">
              {school.email}
            </a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-[var(--border)] my-2" />

          {/* Powered by */}
          <p className="text-xs text-[var(--muted)]">
            Powered by{" "}
            <Link href="/" className="text-[#0891B2] hover:underline font-medium">
              Schoolnify
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
