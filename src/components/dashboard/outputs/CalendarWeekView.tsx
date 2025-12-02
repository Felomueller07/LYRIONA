import React from "react";
import { CalendarWeekViewProps, Event } from "./calendar-types";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function CalendarWeekView({
  weekDates,
  weekDays,
  hours,
  events,
  onEventClick,
}: CalendarWeekViewProps) {
  const calculateEventPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const top = ((startMinutes - 360) / 60) * 60; // 6:00 = 360 minutes
    const height = ((endMinutes - startMinutes) / 60) * 60;
    
    return { top: `${top}px`, height: `${Math.max(height, 30)}px` };
  };

  const getEventsForDate = (date: Date): Event[] => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return events.filter((e: Event) => e.date === dateStr);
  };

  const doEventsOverlap = (event1: Event, event2: Event): boolean => {
    const start1 = event1.startTime;
    const end1 = event1.endTime;
    const start2 = event2.startTime;
    const end2 = event2.endTime;
    
    return start1 < end2 && end1 > start2;
  };

  const getEventLayout = (dateEvents: Event[], currentEvent: Event) => {
    const overlappingEvents = dateEvents.filter((e: Event) =>
      e.id !== currentEvent.id && doEventsOverlap(e, currentEvent)
    );
    
    const allEvents = [currentEvent, ...overlappingEvents].sort((a: Event, b: Event) => 
      a.startTime.localeCompare(b.startTime)
    );
    
    const totalColumns = Math.max(allEvents.length, 1);
    const column = allEvents.indexOf(currentEvent);
    
    return { totalColumns, column };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-xl overflow-hidden flex flex-col">
      {/* Week Days Header */}
      <div className="grid grid-cols-8 gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="col-span-1 flex items-center justify-end pr-4">
          <Clock size={16} className="text-gray-500" />
        </div>
        {weekDates.map((date: Date, idx: number) => {
          const today = isToday(date);
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="text-center"
            >
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                {weekDays[idx]}
              </div>
              <div
                className={`text-2xl font-black transition-all ${
                  today
                    ? "bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black px-3 py-1.5 rounded-2xl shadow-lg shadow-[#FFD700]/30"
                    : "text-white"
                }`}
              >
                {date.getDate()}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="grid grid-cols-8 gap-3 relative min-h-[1200px]">
          {/* Time Labels */}
          <div className="col-span-1 space-y-[60px] pt-8">
            {hours.map((hour: number) => (
              <div 
                key={hour} 
                className="text-xs font-semibold text-gray-500 text-right pr-4"
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date: Date, dayIndex: number) => {
            const today = isToday(date);
            
            return (
              <div 
                key={dayIndex}
                className={`relative border-l transition-colors ${
                  today 
                    ? "border-[#FFD700]/30" 
                    : "border-white/5"
                } min-h-[1200px]`}
              >
                {/* Hour Cells */}
                {hours.map((hour: number, hourIndex: number) => (
                  <div
                    key={hourIndex}
                    className={`h-[60px] border-b transition-all ${
                      today
                        ? "border-[#FFD700]/10 hover:bg-[#FFD700]/5"
                        : "border-white/5 hover:bg-white/[0.02]"
                    }`}
                  />
                ))}

                {/* Events */}
                {(() => {
                  const dateEvents: Event[] = getEventsForDate(date);
                  return dateEvents.map((event: Event) => {
                    const pos = calculateEventPosition(event.startTime, event.endTime);
                    const layout = getEventLayout(dateEvents, event);
                    
                    const width: number = 100 / (layout.totalColumns || 1);
                    const left: number = width * layout.column;
                    
                    const isSchool = event.id.startsWith('school-');
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, zIndex: 50 }}
                        onClick={() => onEventClick(event)}
                        className="absolute rounded-2xl p-3 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all backdrop-blur-sm"
                        style={{
                          top: pos.top,
                          height: pos.height,
                          left: `${left}%`,
                          width: `${width - 2}%`,
                          background: isSchool 
                            ? `linear-gradient(135deg, ${event.color}99, ${event.color}cc)` 
                            : `linear-gradient(135deg, ${event.color}dd, ${event.color})`,
                          border: `1px solid ${event.color}`,
                          minHeight: "30px",
                        }}
                      >
                        {/* Event Content */}
                        <div className="h-full flex flex-col">
                          <div className="text-[9px] font-bold text-black/70 mb-1 uppercase tracking-wide">
                            {event.startTime} - {event.endTime}
                          </div>
                          <div className="text-xs font-bold text-black leading-tight line-clamp-3">
                            {event.title}
                          </div>
                          {event.category && (
                            <div className="text-[8px] text-black/60 font-semibold mt-auto uppercase tracking-wide">
                              {event.category}
                            </div>
                          )}
                        </div>

                        {/* Hover Indicator */}
                        <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors rounded-2xl" />
                      </motion.div>
                    );
                  });
                })()}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}