"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarOff,
  CalendarCheck,
  GraduationCap,
  Plus,
} from "lucide-react";
import { schoolEvents, academicTerms } from "@/lib/demo-data";
import { CalendarGrid } from "./_components/calendar-grid";
import { EventList } from "./_components/event-list";
import { EventModal } from "./_components/event-modal";
import { EventTable } from "./_components/event-table";
import { PtcSchedule } from "./_components/ptc-schedule";

type EventCategory = "academic" | "sports" | "cultural" | "meeting" | "holiday";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  category: EventCategory;
  description: string;
  location?: string;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(
    schoolEvents as CalendarEvent[]
  );

  // Navigation
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Stats calculations
  const totalEvents = localEvents.length;
  const holidays = localEvents.filter((e) => e.category === "holiday").length;

  const thisWeekEvents = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return localEvents.filter((event) => {
      const eventDate = new Date(event.date + "T00:00:00");
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }).length;
  }, [localEvents]);

  const activeTerms = academicTerms.filter((t) => t.isCurrent).length;

  // Events for the sidebar (date-filtered or upcoming)
  const sidebarEvents = useMemo(() => {
    if (selectedDate) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      return localEvents.filter((event) => {
        if (event.date === dateStr) return true;
        if (event.endDate) {
          const start = new Date(event.date + "T00:00:00");
          const end = new Date(event.endDate + "T00:00:00");
          const current = new Date(dateStr + "T00:00:00");
          if (current >= start && current <= end) return true;
        }
        return false;
      });
    }

    // Upcoming events (from today onward)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return localEvents
      .filter((event) => {
        const eventDate = new Date(event.date + "T00:00:00");
        return eventDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [localEvents, selectedDate]);

  // Modal handlers
  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    setLocalEvents((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === event.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = event;
        return updated;
      }
      return [...prev, event];
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setLocalEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      icon: CalendarDays,
      color: "#0891B2",
    },
    {
      label: "Holidays",
      value: holidays,
      icon: CalendarOff,
      color: "#EF4444",
    },
    {
      label: "This Week",
      value: thisWeekEvents,
      icon: CalendarCheck,
      color: "#10B981",
    },
    {
      label: "Active Terms",
      value: activeTerms,
      icon: GraduationCap,
      color: "#F59E0B",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Calendar & Events
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Manage school events, academic calendar, and scheduling
          </p>
        </div>
        <button
          onClick={handleAddEvent}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon
                  className="w-5 h-5"
                  style={{ color: stat.color }}
                />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--foreground)] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[12px] text-[var(--muted)]">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <CalendarGrid
            events={localEvents}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
        <div className="lg:col-span-1">
          <EventList events={sidebarEvents} />
        </div>
      </div>

      {/* Events Table */}
      <EventTable
        events={localEvents}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* PTC Section */}
      <div className="mt-6">
        <PtcSchedule />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
      />
    </motion.div>
  );
}
