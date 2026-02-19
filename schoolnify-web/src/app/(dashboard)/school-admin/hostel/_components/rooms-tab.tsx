"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Occupant {
  studentId: string;
  studentName: string;
  grade: string;
}

interface Room {
  id: string;
  blockId: string;
  blockName: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  occupants: Occupant[];
  status: "available" | "full" | "maintenance";
}

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

interface RoomsTabProps {
  rooms: Room[];
  blocks: Block[];
  selectedBlock: string;
  onBlockChange: (blockId: string) => void;
  onViewRoom: (room: Room) => void;
}

const statusConfig: Record<
  string,
  { color: string; bg: string; text: string; label: string }
> = {
  available: {
    color: "#10B981",
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Available",
  },
  full: {
    color: "#3B82F6",
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    label: "Full",
  },
  maintenance: {
    color: "#F59E0B",
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Maintenance",
  },
};

export function RoomsTab({
  rooms,
  blocks,
  selectedBlock,
  onBlockChange,
  onViewRoom,
}: RoomsTabProps) {
  const filteredRooms = selectedBlock
    ? rooms.filter((r) => r.blockId === selectedBlock)
    : rooms;

  return (
    <div className="space-y-4">
      {/* Block Selector Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onBlockChange("")}
          className={cn(
            "px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all",
            !selectedBlock
              ? "bg-[#0891B2] text-white"
              : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          All
        </button>
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => onBlockChange(block.id)}
            className={cn(
              "px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all",
              selectedBlock === block.id
                ? "bg-[#0891B2] text-white"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {block.name.split(" — ")[0] || block.name}
          </button>
        ))}
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredRooms.map((room, i) => {
          const config = statusConfig[room.status];
          const occupancyPercent =
            room.capacity > 0
              ? Math.round((room.occupied / room.capacity) * 100)
              : 0;

          return (
            <motion.button
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200,
                delay: i * 0.03,
              }}
              onClick={() => onViewRoom(room)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-left hover:border-[#0891B2]/40 transition-all group"
            >
              {/* Room Number & Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2] transition-colors">
                  {room.roomNumber}
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

              {/* Capacity Bar */}
              <div className="w-full h-1.5 rounded-full bg-[var(--background-secondary)] mb-1.5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${occupancyPercent}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>

              {/* Occupancy Text */}
              <p className="text-[11px] text-[var(--muted)]">
                {room.occupied}/{room.capacity} occupied
              </p>
            </motion.button>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-[var(--muted)]">
            No rooms found for this block.
          </p>
        </div>
      )}
    </div>
  );
}
