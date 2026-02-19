"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, DoorOpen, Wrench, UserPlus, UserMinus } from "lucide-react";
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

interface RoomDetailProps {
  room: Room | null;
  onClose: () => void;
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

const avatarGradients = [
  "from-[#0891B2] to-[#06B6D4]",
  "from-[#8B5CF6] to-[#A78BFA]",
  "from-[#EC4899] to-[#F472B6]",
  "from-[#F59E0B] to-[#FBBF24]",
  "from-[#10B981] to-[#34D399]",
  "from-[#3B82F6] to-[#60A5FA]",
  "from-[#EF4444] to-[#F87171]",
  "from-[#6366F1] to-[#818CF8]",
];

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function RoomDetail({ room, onClose }: RoomDetailProps) {
  return (
    <AnimatePresence>
      {room && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--card)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Room {room.roomNumber}
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {room.blockName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Room Info */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Room Information
                </h3>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                  {/* Capacity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DoorOpen className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span className="text-[12px] text-[var(--muted)]">
                        Capacity
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-[var(--foreground)]">
                      {room.capacity} beds
                    </span>
                  </div>
                  {/* Occupied */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span className="text-[12px] text-[var(--muted)]">
                        Occupied
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-[var(--foreground)]">
                      {room.occupied} students
                    </span>
                  </div>
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">
                      Status
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full",
                        statusConfig[room.status].bg,
                        statusConfig[room.status].text
                      )}
                    >
                      {statusConfig[room.status].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Occupants */}
              <div>
                <h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                  Occupants
                </h3>

                {room.status === "maintenance" ? (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-3">
                      <Wrench className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <p className="text-[13px] font-medium text-[var(--foreground)]">
                      Room under maintenance
                    </p>
                    <p className="text-[12px] text-[var(--muted)] mt-1">
                      This room is currently unavailable for occupancy.
                    </p>
                  </div>
                ) : room.occupants.length === 0 ? (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-center">
                    <p className="text-[13px] text-[var(--muted)]">
                      No occupants assigned to this room.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
                    {room.occupants.map((occupant, idx) => (
                      <div
                        key={occupant.studentId}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        {/* Initials Avatar */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                            avatarGradients[idx % avatarGradients.length]
                          )}
                        >
                          <span className="text-[11px] font-semibold text-white">
                            {getInitials(occupant.studentName)}
                          </span>
                        </div>
                        {/* Name & Grade */}
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                            {occupant.studentName}
                          </p>
                          <p className="text-[11px] text-[var(--muted)]">
                            {occupant.grade}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[#EF4444] transition-all"
              >
                <UserMinus className="w-3.5 h-3.5" />
                Remove
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Assign Student
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
