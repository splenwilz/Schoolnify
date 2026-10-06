"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Page } from "@/lib/staff/directory";

interface TablePaginationProps {
  page: Page<unknown>;
  onPageChange: (page: number) => void;
}

/** First, last, and the current page with one neighbour each side; gaps become ellipses. */
export function pageWindow(current: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (n - prev > 1) out.push("gap");
    out.push(n);
    prev = n;
  }
  return out;
}

export function TablePagination({ page, onPageChange }: TablePaginationProps) {
  const numbers = pageWindow(page.page, page.totalPages);
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]"
    >
      <p className="text-[12px] text-[var(--muted)]">
        Showing{" "}
        <span className="font-medium text-[var(--foreground)]">
          {page.from}–{page.to}
        </span>{" "}
        of <span className="font-medium text-[var(--foreground)]">{page.total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(page.page - 1)}
          disabled={page.page === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Previous
        </button>
        <div className="flex items-center gap-0.5 mx-1">
          {numbers.map((n, i) =>
            n === "gap" ? (
              <span key={`gap-${i}`} aria-hidden="true" className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--muted)]">
                …
              </span>
            ) : (
            <button
              key={n}
              type="button"
              aria-label={`Page ${n}`}
              aria-current={n === page.page ? "page" : undefined}
              onClick={() => onPageChange(n)}
              className={cn(
                "w-8 h-8 text-[12px] rounded-lg font-medium transition-all",
                n === page.page
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
              )}
            >
              {n}
            </button>
            )
          )}
        </div>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(page.page + 1)}
          disabled={page.page === page.totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
