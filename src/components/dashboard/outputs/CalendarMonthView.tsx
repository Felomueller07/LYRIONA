import React from "react";
import { Event } from "./calendar-types";

type CalendarMonthViewProps = {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick?: (date: Date) => void;
};

export default function CalendarMonthView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}: CalendarMonthViewProps) {
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const weekDaysShort = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  // Hole alle Tage des Monats
  const getDaysInMonth = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Erster Tag des Monats
    const firstDay = new Date(year, month, 1);
    // Letzter Tag des Monats
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Füge leere Tage am Anfang hinzu (wenn Monat nicht am Montag startet)
    const firstDayOfWeek = firstDay.getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Montag = 0
    
    for (let i = 0; i < offset; i++) {
      const emptyDay = new Date(year, month, 1 - (offset - i));
      days.push(emptyDay);
    }
    
    // Füge alle Tage des Monats hinzu
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    // Füge Tage vom nächsten Monat hinzu bis 6 Zeilen voll sind
    const remainingDays = 42 - days.length; // 6 Zeilen * 7 Tage = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date): Event[] => {
    // WICHTIG: Benutze lokales Datum ohne Timezone-Konvertierung!
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return events.filter((e: Event) => e.date === dateStr);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth();

  return (
    <div className="flex-1 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-3xl p-6 border border-[#D4AF37]/20 shadow-xl overflow-hidden flex flex-col">
      {/* Wochentage Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDaysShort.map((day: string, i: number) => (
          <div
            key={i}
            className="text-center text-sm font-semibold text-[#D4AF37]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Kalender Grid */}
      <div className="flex-1 grid grid-cols-7 gap-2 overflow-auto">
        {days.map((date: Date, index: number) => {
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isInCurrentMonth = isCurrentMonth(date);

          return (
            <div
              key={index}
              onClick={() => onDateClick && onDateClick(date)}
              className={`
                relative min-h-[100px] rounded-xl p-2 border-2 transition-all cursor-pointer
                ${isTodayDate
                  ? "border-[#FFD700] bg-gradient-to-br from-[#FFD700]/20 to-[#D4AF37]/10"
                  : "border-[#D4AF37]/20 bg-[#1a1a1a]/50 hover:border-[#D4AF37]/40"
                }
                ${!isInCurrentMonth ? "opacity-40" : ""}
              `}
            >
              {/* Datum */}
              <div
                className={`text-sm font-bold mb-1 ${
                  isTodayDate
                    ? "text-[#FFD700]"
                    : isInCurrentMonth
                    ? "text-[#C0C0C0]"
                    : "text-[#808080]"
                }`}
              >
                {date.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1 overflow-y-auto max-h-[70px]">
                {dayEvents.slice(0, 3).map((event: Event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="text-[8px] font-semibold rounded px-1 py-0.5 truncate cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: event.color,
                      color: "#000",
                    }}
                    title={`${event.startTime} - ${event.title}`}
                  >
                    {event.startTime} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[8px] text-[#D4AF37] font-bold">
                    +{dayEvents.length - 3} weitere
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}