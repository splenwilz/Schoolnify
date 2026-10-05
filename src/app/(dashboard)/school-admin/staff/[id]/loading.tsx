export default function StaffDetailLoading() {
  return (
    <div className="max-w-[1200px] mx-auto animate-pulse" aria-busy="true" aria-label="Loading staff member">
      <div className="h-4 w-40 rounded bg-[var(--background-secondary)] mb-6" />
      <div className="h-44 rounded-2xl bg-[var(--background-secondary)] mb-8" />
      <div className="h-10 w-96 rounded bg-[var(--background-secondary)] mb-6" />
      <div className="h-64 rounded-2xl bg-[var(--background-secondary)]" />
    </div>
  );
}
