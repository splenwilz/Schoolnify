"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, DoorOpen, Users, Banknote } from "lucide-react";
import { hostelBlocks, hostelRooms, hostelFees } from "@/lib/demo-data";
import { RoomsTab } from "./_components/rooms-tab";
import { FeesTab } from "./_components/fees-tab";
import { RoomDetail } from "./_components/room-detail";
import { BlockOverview } from "./_components/block-overview";

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

const tabs = [
  { id: "rooms", label: "Rooms" },
  { id: "fees", label: "Fees" },
];

export default function HostelPage() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feeBlockFilter, setFeeBlockFilter] = useState("");

  const stats = useMemo(() => {
    const totalBlocks = hostelBlocks.length;
    const totalRooms = hostelBlocks.reduce((sum, b) => sum + b.totalRooms, 0);
    const totalCapacity = hostelBlocks.reduce((sum, b) => sum + b.capacity, 0);
    const totalOccupancy = hostelBlocks.reduce(
      (sum, b) => sum + b.currentOccupancy,
      0
    );
    const occupancyRate =
      totalCapacity > 0
        ? Math.round((totalOccupancy / totalCapacity) * 100)
        : 0;

    const paidCount = hostelFees.filter((f) => f.status === "paid").length;
    const feeCollection =
      hostelFees.length > 0
        ? Math.round((paidCount / hostelFees.length) * 100)
        : 0;

    return { totalBlocks, totalRooms, occupancyRate, feeCollection };
  }, []);

  const metricCards = [
    {
      label: "Total Blocks",
      value: stats.totalBlocks,
      subtitle: "Hostel buildings",
      icon: Building2,
      color: "#6B7280",
    },
    {
      label: "Total Rooms",
      value: stats.totalRooms,
      subtitle: "Across all blocks",
      icon: DoorOpen,
      color: "#3B82F6",
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      subtitle: "Current utilization",
      icon: Users,
      color: "#10B981",
    },
    {
      label: "Fee Collection",
      value: `${stats.feeCollection}%`,
      subtitle: "Fees collected",
      icon: Banknote,
      color: "#0891B2",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Hostel Management
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-0.5">
          Manage accommodation, room assignments, and hostel fees
        </p>
      </div>

      {/* Top Section: Metrics + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main: Metric Cards */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            {metricCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    delay: i * 0.05,
                  }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: card.color }}
                      />
                    </div>
                    <span className="text-[12px] text-[var(--muted)]">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
                    {card.value}
                  </p>
                  <p className="text-[12px] text-[var(--muted)] mt-1">
                    {card.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-72">
          <BlockOverview blocks={hostelBlocks} rooms={hostelRooms} />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Accommodation Section */}
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
          Accommodation
        </h2>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] w-fit mb-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "rooms" && (
          <RoomsTab
            rooms={hostelRooms}
            blocks={hostelBlocks}
            selectedBlock={selectedBlock}
            onBlockChange={setSelectedBlock}
            onViewRoom={setSelectedRoom}
          />
        )}

        {activeTab === "fees" && (
          <FeesTab
            fees={hostelFees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            blockFilter={feeBlockFilter}
            onBlockChange={setFeeBlockFilter}
            blocks={hostelBlocks}
          />
        )}
      </div>

      {/* Room Detail Panel */}
      <RoomDetail
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </motion.div>
  );
}
