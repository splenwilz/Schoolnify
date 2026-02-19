"use client";

/**
 * Rooms Tab
 * Displays room allocation cards with type badges, capacity info,
 * assigned classes, and schedule previews.
 */

interface ScheduleEntry {
  day: string;
  periods: number[];
  subject: string;
}

interface RoomAllocation {
  id: string;
  roomNumber: string;
  type: "classroom" | "lab" | "hall" | "library";
  capacity: number;
  assignedClass: string;
  schedule: ScheduleEntry[];
}

interface RoomsTabProps {
  allocations: RoomAllocation[];
}

const roomTypeConfig: Record<
  RoomAllocation["type"],
  { label: string; color: string; bg: string }
> = {
  classroom: {
    label: "Classroom",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
  },
  lab: {
    label: "Lab",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
  },
  hall: {
    label: "Hall",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
  },
  library: {
    label: "Library",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
};

export function RoomsTab({ allocations }: RoomsTabProps) {
  const totalRooms = allocations.length;
  const totalCapacity = allocations.reduce((sum, r) => sum + r.capacity, 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Room Allocations
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              {totalRooms} rooms with a combined capacity of {totalCapacity}{" "}
              seats
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Room
          </button>
        </div>
      </div>

      {/* Type Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs">
        {Object.entries(roomTypeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{
                backgroundColor: config.bg,
                border: `1px solid ${config.color}`,
              }}
            />
            <span className="text-[var(--muted)]">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.map((room) => {
          const typeConfig = roomTypeConfig[room.type];
          const previewSchedule = room.schedule.slice(0, 3);

          return (
            <div
              key={room.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-[var(--foreground)]">
                  {room.roomNumber}
                </h4>
                <span
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    color: typeConfig.color,
                    backgroundColor: typeConfig.bg,
                  }}
                >
                  {typeConfig.label}
                </span>
              </div>

              {/* Room Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[var(--muted)] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-xs text-[var(--muted)]">
                      Capacity
                    </span>
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {room.capacity} seats
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[var(--muted)] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                    />
                  </svg>
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-xs text-[var(--muted)]">
                      Assigned
                    </span>
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {room.assignedClass}
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule Preview */}
              <div className="flex-1">
                <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                  Schedule Preview
                </div>
                <div className="space-y-1.5">
                  {previewSchedule.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[var(--background-secondary)]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--foreground)]">
                          {entry.day.slice(0, 3)}
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">
                          P{entry.periods.join(",")}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--foreground)] truncate ml-2 max-w-[140px] text-right">
                        {entry.subject}
                      </span>
                    </div>
                  ))}
                  {room.schedule.length > 3 && (
                    <div className="text-[11px] text-[var(--muted)] text-center pt-1">
                      +{room.schedule.length - 3} more{" "}
                      {room.schedule.length - 3 === 1 ? "entry" : "entries"}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Edit Room
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{totalRooms} rooms configured</span>
        <span>Total capacity: {totalCapacity} seats</span>
      </div>
    </div>
  );
}
