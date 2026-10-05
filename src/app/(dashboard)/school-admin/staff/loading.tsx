export default function StaffLoading() {
  return (
    <div className="max-w-[1200px] mx-auto animate-pulse" aria-busy="true" aria-label="Loading staff">
      <div className="h-8 w-32 rounded bg-[var(--background-secondary)] mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-lg bg-[var(--background-secondary)]" />)}
      </div>
      <div className="h-40 rounded-lg bg-[var(--background-secondary)] mb-8" />
      <div className="h-96 rounded-lg bg-[var(--background-secondary)]" />
    </div>
  );
}
