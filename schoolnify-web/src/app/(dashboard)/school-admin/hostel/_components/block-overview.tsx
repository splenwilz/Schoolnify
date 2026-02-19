"use client";

import { cn } from "@/lib/utils";

interface Block {
  id: string;
  name: string;
  type: "boys" | "girls";
  totalRooms: number;
  occupiedRooms: number;
  capacity: number;
  currentOccupancy: number;
  warden: string;
}

interface Room {
  id: string;
  blockId: string;
  blockName: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  occupants: { studentId: string; studentName: string; grade: string }[];
  status: "available" | "full" | "maintenance";
}

interface BlockOverviewProps {
  blocks: Block[];
  rooms: Room[];
}

const typeConfig: Record<string, { bg: string; text: string; label: string }> =
  {
    boys: { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", label: "Boys" },
    girls: { bg: "bg-[#EC4899]/10", text: "text-[#EC4899]", label: "Girls" },
  };

export function BlockOverview({ blocks, rooms }: BlockOverviewProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="text-[13px] font-semibold text-[var(--foreground)] mb-4">
        Blocks
      </h3>

      <div className="space-y-4">
        {blocks.map((block) => {
          const occupancyPercent =
            block.capacity > 0
              ? Math.round((block.currentOccupancy / block.capacity) * 100)
              : 0;

          const blockRooms = rooms.filter((r) => r.blockId === block.id);
          const occupiedRoomCount = blockRooms.filter(
            (r) => r.status === "full"
          ).length;

          const config = typeConfig[block.type];

          return (
            <div key={block.id} className="space-y-2">
              {/* Block Name & Type */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[var(--foreground)]">
                  {block.name.split(" — ")[0] || block.name}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full",
                    config.bg,
                    config.text
                  )}
                >
                  {config.label}
                </span>
              </div>

              {/* Full Name (subtitle) */}
              {block.name.includes(" — ") && (
                <p className="text-[11px] text-[var(--muted)] -mt-1">
                  {block.name.split(" — ")[1]}
                </p>
              )}

              {/* Occupancy Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--background-secondary)]">
                  <div
                    className="h-full rounded-full bg-[#0891B2] transition-all"
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[var(--muted)] tabular-nums w-8 text-right">
                  {occupancyPercent}%
                </span>
              </div>

              {/* Warden & Rooms */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--muted)]">
                  {block.warden}
                </span>
                <span className="text-[11px] text-[var(--muted)] tabular-nums">
                  {occupiedRoomCount}/{blockRooms.length} rooms occupied
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
