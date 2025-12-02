import React from "react";
import { Event } from "./calendar-types";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

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

  const getDaysInMonth = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    const firstDayOfWeek = firstDay.getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    for (let i = 0; i < offset; i++) {
      const emptyDay = new Date(year, month, 1 - (offset - i));
      days.push(emptyDay);
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date): Event[] => {
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
    <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-xl overflow-hidden flex flex-col">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {weekDaysShort.map((day: string, i: number) => (
          <div
            key={i}
            className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-3"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 gap-3 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {days.map((date: Date, index: number) => {
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isInCurrentMonth = isCurrentMonth(date);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDateClick && onDateClick(date)}
              className={`
                relative min-h-[140px] rounded-2xl p-3 transition-all cursor-pointer group
                ${isTodayDate
                  ? "bg-gradient-to-br from-[#FFD700]/20 to-[#D4AF37]/10 border-2 border-[#FFD700] shadow-lg shadow-[#FFD700]/20"
                  : "bg-white/5 border border-white/10 hover:border-[#FFD700]/30 hover:bg-white/10"
                }
                ${!isInCurrentMonth ? "opacity-40" : ""}
              `}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`text-sm font-bold transition-colors ${
                    isTodayDate
                      ? "text-[#FFD700]"
                      : isInCurrentMonth
                      ? "text-white group-hover:text-[#FFD700]"
                      : "text-gray-600"
                  }`}
                >
                  {date.getDate()}
                </div>
                
                {/* Add Event Indicator */}
                {isInCurrentMonth && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} className="text-gray-400 hover:text-[#FFD700]" />
                  </div>
                )}
              </div>

              {/* Events */}
              <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-white/10">
                {dayEvents.slice(0, 4).map((event: Event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="text-[9px] font-bold rounded-lg px-2 py-1.5 truncate cursor-pointer transition-all backdrop-blur-sm"
                    style={{
                      backgroundColor: `${event.color}dd`,
                      color: "#000",
                      border: `1px solid ${event.color}`,
                    }}
                    title={`${event.startTime} - ${event.title}`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] opacity-70">{event.startTime}</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  </motion.div>
                ))}
                
                {dayEvents.length > 4 && (
                  <div className="text-[9px] text-[#FFD700] font-bold text-center py-1 bg-white/5 rounded-lg">
                    +{dayEvents.length - 4} weitere
                  </div>
                )}
              </div>

              {/* Today Indicator */}
              {isTodayDate && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse shadow-lg shadow-[#FFD700]/50" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}