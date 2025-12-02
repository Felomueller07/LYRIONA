"use client";

import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarSidebar from "./CalendarSidebar";
import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";
import EventDetailModal from "./EventDetailModal";
import CreateEventModal from "./CreateEventModal";
import { Event, Category, CalendarProps } from "./calendar-types";
import { motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';

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

  // Südtiroler Schulkalender Generator
  const generateSchoolEvents = (): Event[] => {
    const schoolEvents: Event[] = [];
    const startDate = new Date('2024-09-05');
    const endDate = new Date('2026-06-13');

    const holidays = [
      // 2024/25 Ferien
      { start: new Date('2024-10-31'), end: new Date('2024-11-02') },
      { start: new Date('2024-11-01'), end: new Date('2024-11-03') },
      { start: new Date('2024-12-23'), end: new Date('2025-01-06') },
      { start: new Date('2025-02-17'), end: new Date('2025-03-02') },
      { start: new Date('2025-04-17'), end: new Date('2025-04-22') },
      { start: new Date('2025-06-14'), end: new Date('2025-09-04') },

      // 2025/26 Ferien
      { start: new Date('2025-10-30'), end: new Date('2025-11-01') },
      { start: new Date('2025-12-22'), end: new Date('2026-01-06') },
      { start: new Date('2026-02-16'), end: new Date('2026-03-01') },
      { start: new Date('2026-04-02'), end: new Date('2026-04-07') },

      // Staatsfeiertage
      { start: new Date('2024-11-01'), end: new Date('2024-11-01') },
      { start: new Date('2024-12-08'), end: new Date('2024-12-08') },
      { start: new Date('2025-04-25'), end: new Date('2025-04-25') },
      { start: new Date('2025-05-01'), end: new Date('2025-05-01') },
      { start: new Date('2025-06-02'), end: new Date('2025-06-02') },
      { start: new Date('2025-11-01'), end: new Date('2025-11-01') },
      { start: new Date('2025-12-08'), end: new Date('2025-12-08') },
      { start: new Date('2026-04-25'), end: new Date('2026-04-25') },
      { start: new Date('2026-05-01'), end: new Date('2026-05-01') },
      { start: new Date('2026-06-02'), end: new Date('2026-06-02') },
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

      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday(currentDate)) {
        const dateStr = currentDate.toISOString().split('T')[0];

        let endTime = '13:05';
        if (dayOfWeek === 2 || dayOfWeek === 4) {
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

    return schoolEvents;
  };

  // Load events from localStorage + School events
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
    const schoolEvents = events.filter(e => e.id.startsWith('school-'));
    const localEvents = events.filter(e => e.id.startsWith('local-'));
    const allEvents = [...schoolEvents, ...localEvents, ...importedEvents];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarEvents', JSON.stringify(allEvents));
      localStorage.setItem('calendarEventsTimestamp', Date.now().toString());
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
    <div className="min-h-screen bg-[#000000] text-white font-[system-ui] relative overflow-hidden">
      <Toaster position="top-center" />

      {/* 🎨 AURORA BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Aurora Waves */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-full h-[500px] -top-20 animate-aurora-1"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), rgba(255,215,0,0.3), rgba(255,223,128,0.25), rgba(192,192,192,0.2), transparent)',
              filter: 'blur(80px)',
            }}
          />
          <div 
            className="absolute w-full h-[400px] top-1/4 animate-aurora-2"
            style={{
              background: 'linear-gradient(-90deg, transparent, rgba(255,255,255,0.18), rgba(224,224,224,0.15), rgba(212,175,55,0.2), transparent)',
              filter: 'blur(90px)',
            }}
          />
          <div 
            className="absolute w-full h-[550px] top-1/2 animate-aurora-3"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.28), rgba(255,215,0,0.22), rgba(255,255,255,0.15), transparent)',
              filter: 'blur(100px)',
            }}
          />
          <div 
            className="absolute w-full h-[350px] bottom-0 animate-aurora-4"
            style={{
              background: 'linear-gradient(-90deg, transparent, rgba(212,175,55,0.3), rgba(255,215,0,0.18), rgba(255,255,255,0.12), transparent)',
              filter: 'blur(95px)',
            }}
          />
          <div 
            className="absolute w-full h-[450px] top-1/3 animate-aurora-5"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.15), transparent)',
              filter: 'blur(110px)',
            }}
          />
        </div>

        {/* Moving Particles */}
        {[...Array(60)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const colors = ['#FFD700', '#D4AF37', '#C0C0C0', '#FFFFFF'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const isGold = color === '#FFD700' || color === '#D4AF37';
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-particle-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                opacity: 0.4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 12}s`,
                boxShadow: isGold 
                  ? `0 0 ${size * 3}px ${color}` 
                  : `0 0 ${size * 2}px rgba(255,255,255,0.3)`,
                filter: 'blur(0.5px)',
              }}
            />
          );
        })}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
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

        <div className="flex gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
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
              role={role}
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
                events={events.filter((e: Event) => !e.id.startsWith('school-'))}
                onEventClick={setSelectedEvent}
                onDateClick={(date: Date) => {
                  setCurrentDate(date);
                  setView("week");
                }}
              />
            )}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes aurora-1 {
          0%, 100% { transform: translateX(-10%) translateY(0) scaleX(1); }
          50% { transform: translateX(10%) translateY(-30px) scaleX(1.15); }
        }

        @keyframes aurora-2 {
          0%, 100% { transform: translateX(15%) translateY(0) scaleX(1); }
          50% { transform: translateX(-15%) translateY(40px) scaleX(1.2); }
        }

        @keyframes aurora-3 {
          0%, 100% { transform: translateX(-8%) translateY(0) scaleX(1); }
          50% { transform: translateX(8%) translateY(-20px) scaleX(1.12); }
        }

        @keyframes aurora-4 {
          0%, 100% { transform: translateX(12%) translateY(0) scaleX(1); }
          50% { transform: translateX(-12%) translateY(35px) scaleX(1.18); }
        }

        @keyframes aurora-5 {
          0%, 100% { transform: rotate(0deg) translateX(-5%) scaleX(1); }
          50% { transform: rotate(2deg) translateX(5%) scaleX(1.1); }
        }

        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
            transform: translateY(-50vh) translateX(30px) scale(1.1);
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) scale(0.8);
            opacity: 0;
          }
        }

        .animate-aurora-1 { animation: aurora-1 18s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora-2 22s ease-in-out infinite; }
        .animate-aurora-3 { animation: aurora-3 25s ease-in-out infinite; }
        .animate-aurora-4 { animation: aurora-4 20s ease-in-out infinite; }
        .animate-aurora-5 { animation: aurora-5 30s ease-in-out infinite; }
        .animate-particle-float { animation: particle-float linear infinite; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}