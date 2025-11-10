"use client";

import React, { useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2 } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  color: string;
};

type Props = {
  role?: string;
};

export default function ModernerKalender({ role = "admin" }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Trompeten Probe",
      date: "2025-10-24",
      color: "#ff6b6b",
    },
    {
      id: "2",
      title: "Schlagzeugunterricht",
      date: "2025-10-28",
      color: "#4ecdc4",
    },
    {
      id: "3",
      title: "Auftritt Stadtfest",
      date: "2025-10-26",
      color: "#ffe66d",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");

  const monthNames = [
    "JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI",
    "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DEZEMBER"
  ];

  const weekDays = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    if (role === "visitor") return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowAddModal(true);
  };

  const addEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const newEvent: Event = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: dateStr,
      color: "#ff6b6b",
    };

    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setShowAddModal(false);
    setSelectedDate(null);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split("T")[0];
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
        {/* Kalender Links */}
        <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
                {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
              </h2>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Wochentage */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-bold text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Tage */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={role === "visitor"}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-xl
                    transition-all relative group
                    ${today 
                      ? "bg-orange-500 text-white font-bold shadow-lg" 
                      : "hover:bg-gray-100 text-gray-700"
                    }
                    ${role === "visitor" ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  <span className={`text-lg ${today ? "font-bold" : ""}`}>
                    {day}
                  </span>
                  
                  {/* Event Dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          {role === "admin" && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CalendarIcon size={18} />
                GEPLANTE EVENTS ANSEHEN
              </button>
            </div>
          )}
        </div>

        {/* Events Sidebar Rechts */}
        <div className="w-80 bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">EVENTS</h3>
            {role === "admin" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus size={18} className="text-white" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                Keine Events geplant
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <h4 className="text-white font-semibold text-sm">
                          {event.title}
                        </h4>
                      </div>
                      <p className="text-gray-400 text-xs">
                        {new Date(event.date + "T00:00:00").toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {role === "admin" && (
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500 rounded-lg transition-all"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {role === "admin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full mt-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              NEUES EVENT
            </button>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Neues Event</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewEventTitle("");
                  setSelectedDate(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event-Titel
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="z.B. Konzert, Probe..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-800"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addEvent();
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Datum
                </label>
                <input
                  type="date"
                  value={selectedDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setSelectedDate(new Date(e.target.value + "T00:00:00"))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-800"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewEventTitle("");
                    setSelectedDate(null);
                  }}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={addEvent}
                  disabled={!newEventTitle.trim() || !selectedDate}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}