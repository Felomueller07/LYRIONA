"use client";

import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarSidebar from "./CalendarSidebar";
import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";
import EventDetailModal from "./EventDetailModal";
import CreateEventModal from "./CreateEventModal";
import { Event, Category, CalendarProps } from "./calendar-types";

export default function ModernerKalender({ role = "visitor" }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    category: "SPG",
  });

  // Südtiroler Schulkalender Generator 🎓
  const generateSchoolEvents = (): Event[] => {
    const schoolEvents: Event[] = [];
    const startDate = new Date('2024-09-05'); // Schulstart Südtirol 2024/25
    const endDate = new Date('2026-06-13'); // Schulende Südtirol 2025/26 - VERLÄNGERT!

    // Südtiroler Schulferien 2024/25 + 2025/26
    const holidays = [
      // 2024/25 Ferien
      { start: new Date('2024-10-31'), end: new Date('2024-11-02') },
      { start: new Date('2024-11-01'), end: new Date('2024-11-03') },
      { start: new Date('2024-12-23'), end: new Date('2025-01-06') },
      { start: new Date('2025-02-17'), end: new Date('2025-03-02') },
      { start: new Date('2025-04-17'), end: new Date('2025-04-22') },
      { start: new Date('2025-06-14'), end: new Date('2025-09-04') }, // SOMMERFERIEN 2025!

      // 2025/26 Ferien
      { start: new Date('2025-10-30'), end: new Date('2025-11-01') }, // Herbstferien
      { start: new Date('2025-12-22'), end: new Date('2026-01-06') }, // Weihnachtsferien
      { start: new Date('2026-02-16'), end: new Date('2026-03-01') }, // Semesterferien
      { start: new Date('2026-04-02'), end: new Date('2026-04-07') }, // Osterferien

      // Staatsfeiertage (jährlich)
      { start: new Date('2024-11-01'), end: new Date('2024-11-01') }, // Allerheiligen
      { start: new Date('2024-12-08'), end: new Date('2024-12-08') }, // Maria Empfängnis
      { start: new Date('2025-04-25'), end: new Date('2025-04-25') }, // Tag der Befreiung
      { start: new Date('2025-05-01'), end: new Date('2025-05-01') }, // Tag der Arbeit
      { start: new Date('2025-06-02'), end: new Date('2025-06-02') }, // Tag der Republik
      { start: new Date('2025-11-01'), end: new Date('2025-11-01') }, // Allerheiligen 2025
      { start: new Date('2025-12-08'), end: new Date('2025-12-08') }, // Maria Empfängnis 2025
      { start: new Date('2026-04-25'), end: new Date('2026-04-25') }, // Tag der Befreiung 2026
      { start: new Date('2026-05-01'), end: new Date('2026-05-01') }, // Tag der Arbeit 2026
      { start: new Date('2026-06-02'), end: new Date('2026-06-02') }, // Tag der Republik 2026
    ];

    const isHoliday = (date: Date): boolean => {
      return holidays.some(holiday => {
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        const holidayStart = new Date(holiday.start);
        holidayStart.setHours(0, 0, 0, 0);
        const holidayEnd = new Date(holiday.end);
        holidayEnd.setHours(23, 59, 59, 999);
        return checkDate >= holidayStart && checkDate <= holidayEnd;
      });
    };

    let currentDate = new Date(startDate);
    let eventId = 1;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Montag (1), Mittwoch (3), Freitag (5) = 7:50-13:05
      // Dienstag (2), Donnerstag (4) = 7:50-16:50
      // Samstag (6) und Sonntag (0) = keine Schule

      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday(currentDate)) {
        const dateStr = currentDate.toISOString().split('T')[0];

        let endTime = '13:05';
        if (dayOfWeek === 2 || dayOfWeek === 4) { // Dienstag oder Donnerstag
          endTime = '16:50';
        }

        schoolEvents.push({
          id: `school-${eventId++}`,
          title: '🏫 Schule',
          date: dateStr,
          startTime: '07:50',
          endTime: endTime,
          color: '#4B5563',
          category: 'Schule',
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`🎓 ${schoolEvents.length} Schultermine generiert (Sep 2024 - Jun 2026)`);
    return schoolEvents;
  };

  // Lade Termine aus localStorage beim Start + Schultermine
  const [events, setEvents] = useState<Event[]>(() => {
    const schoolEvents = generateSchoolEvents();

    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('calendarEvents');
      const savedTimestamp = localStorage.getItem('calendarEventsTimestamp');

      if (savedEvents && savedTimestamp) {
        const timestamp = parseInt(savedTimestamp);
        const now = Date.now();
        const daysSinceLastSync = (now - timestamp) / (1000 * 60 * 60 * 24);

        if (daysSinceLastSync < 7) {
          const cached = JSON.parse(savedEvents);
          const nonSchoolEvents = cached.filter((e: Event) => !e.id.startsWith('school-'));
          console.log(`📦 Lade ${nonSchoolEvents.length} Termine aus Cache + ${schoolEvents.length} Schultermine`);
          return [...schoolEvents, ...nonSchoolEvents];
        }
      }
    }
    return schoolEvents;
  });

  const [categories] = useState<Category[]>([
    { name: "SPG", color: "#10B981", enabled: true },
    { name: "MKH", color: "#3B82F6", enabled: true },
    { name: "BKU", color: "#FFD700", enabled: true },
    { name: "Gipfelblech", color: "#8B0000", enabled: true },
    { name: "BBÜ", color: "#8B5CF6", enabled: true },
    { name: "Various Music", color: "#FF8C00", enabled: true },
    { name: "Schule", color: "#4B5563", enabled: true },
    { name: "Andere", color: "#EC4899", enabled: true },
  ]);

  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 19 }, (_, i) => i + 6);

  const getWeekDates = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const handleEventsImported = (importedEvents: Event[]) => {
    // Behalte ALLE Schultermine
    const schoolEvents = events.filter(e => e.id.startsWith('school-'));
    
    // Behalte ALLE lokalen Termine (selbst erstellt)
    const localEvents = events.filter(e => e.id.startsWith('local-'));
    
    // ENTFERNE alte Google Events (die werden durch neue ersetzt)
    // Füge die NEUEN Google Events hinzu
    const allEvents = [...schoolEvents, ...localEvents, ...importedEvents];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarEvents', JSON.stringify(allEvents));
      localStorage.setItem('calendarEventsTimestamp', Date.now().toString());
      console.log(`💾 ${allEvents.length} Termine gespeichert:`);
      console.log(`  - ${schoolEvents.length} Schultermine`);
      console.log(`  - ${localEvents.length} lokale Termine`);
      console.log(`  - ${importedEvents.length} Google Termine`);
    }

    setEvents(allEvents);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const category = categories.find(c => c.name === newEvent.category);

    const event: Event = {
      id: `local-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      color: category?.color || "#EC4899",
      category: newEvent.category,
    };

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);

    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
      localStorage.setItem('calendarEventsTimestamp', Date.now().toString());
    }

    setNewEvent({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      category: "SPG",
    });
    setShowCreateModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Möchtest du diesen Termin wirklich löschen?")) {
      const updatedEvents = events.filter(e => e.id !== eventId);
      setEvents(updatedEvents);

      if (typeof window !== 'undefined') {
        localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
        localStorage.setItem('calendarEventsTimestamp', Date.now().toString());
      }

      setSelectedEvent(null);
      setIsEditingEvent(false);
    }
  };

  const handleSaveEditedEvent = (editedEvent: Event) => {
    if (!editedEvent.title || !editedEvent.date || !editedEvent.startTime || !editedEvent.endTime) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const category = categories.find(c => c.name === editedEvent.category);
    const updatedEvent = {
      ...editedEvent,
      color: category?.color || editedEvent.color,
    };

    const updatedEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEvents(updatedEvents);

    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
      localStorage.setItem('calendarEventsTimestamp', Date.now().toString());
    }

    setSelectedEvent(updatedEvent);
    setIsEditingEvent(false);
  };

  const weekDates = getWeekDates();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white p-6 flex gap-6 relative">
      {role === "admin" && (
        <CreateEventModal
          show={showCreateModal}
          categories={categories}
          newEvent={newEvent}
          onChange={setNewEvent}
          onCreate={handleCreateEvent}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      <EventDetailModal
        event={selectedEvent}
        categories={categories}
        isEditing={isEditingEvent}
        editedEvent={editedEvent}
        onClose={() => {
          setSelectedEvent(null);
          setIsEditingEvent(false);
          setEditedEvent(null);
        }}
        onEdit={() => {
          setEditedEvent(selectedEvent);
          setIsEditingEvent(true);
        }}
        onSave={handleSaveEditedEvent}
        onDelete={handleDeleteEvent}
        onCancelEdit={() => {
          setIsEditingEvent(false);
          setEditedEvent(null);
        }}
        onEditChange={setEditedEvent}
        role={role}
      />

      <CalendarSidebar
        currentDate={currentDate}
        monthNames={monthNames}
        weekDays={weekDays}
        categories={categories}
        showAllCategories={showAllCategories}
        setShowAllCategories={setShowAllCategories}
        onMonthChange={(increment) => {
          const newDate = new Date(currentDate);
          newDate.setMonth(newDate.getMonth() + increment);
          setCurrentDate(newDate);
        }}
        onEventsImported={handleEventsImported}
        role={role}
        events={events}
      />

      <div className="flex-1 flex flex-col">
        <CalendarHeader
          currentDate={currentDate}
          monthNames={monthNames}
          view={view}
          onPreviousWeek={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
          }}
          onNextWeek={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
          }}
          onPreviousMonth={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            setCurrentDate(newDate);
          }}
          onNextMonth={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            setCurrentDate(newDate);
          }}
          onCreateEvent={() => setShowCreateModal(true)}
          onToggleView={() => setView(view === "week" ? "month" : "week")}
        />

        {view === "week" ? (
          <CalendarWeekView
            weekDates={weekDates}
            weekDays={weekDays}
            hours={hours}
            events={events}
            onEventClick={setSelectedEvent}
          />
        ) : (
          <CalendarMonthView
            currentDate={currentDate}
            events={events.filter((e: Event) => !e.id.startsWith('school-'))} // Keine Schultermine in Monatsansicht
            onEventClick={setSelectedEvent}
            onDateClick={(date: Date) => {
              setCurrentDate(date);
              setView("week");
            }}
          />
        )}
      </div>
    </div>
  );
}