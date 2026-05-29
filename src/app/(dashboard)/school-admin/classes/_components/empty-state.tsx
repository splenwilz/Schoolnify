import { SearchX } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6 text-[var(--muted)]" />
      </div>
      <p className="text-sm font-medium text-[var(--foreground)]">No classes found</p>
      <p className="text-sm text-[var(--muted)] mt-1">Try adjusting your search or filters</p>
      <button
        onClick={onClearFilters}
        className="mt-4 text-sm text-[var(--brand)] hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
}
