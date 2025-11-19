import React from "react";
import { CalendarWeekViewProps } from "./calendar-types";

export default function CalendarWeekView({
  weekDates,
  weekDays,
  hours,
  events,
  onEventClick,
}: CalendarWeekViewProps) {
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter(e => e.date === dateStr);
  };

  // Berechne überlappende Events und positioniere sie nebeneinander
  const getEventLayout = (dateEvents: typeof events, eventIndex: number) => {
    const event = dateEvents[eventIndex];
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    const [endHour, endMin] = event.endTime.split(":").map(Number);
    
    const eventStart = startHour * 60 + startMin;
    const eventEnd = endHour * 60 + endMin;
    
    // Finde alle Events die mit diesem Event überlappen
    const overlapping = dateEvents.filter((other, idx) => {
      if (idx === eventIndex) return false;
      
      const [otherStartHour, otherStartMin] = other.startTime.split(":").map(Number);
      const [otherEndHour, otherEndMin] = other.endTime.split(":").map(Number);
      
      const otherStart = otherStartHour * 60 + otherStartMin;
      const otherEnd = otherEndHour * 60 + otherEndMin;
      
      // Überlappt wenn: (Start1 < Ende2) UND (Start2 < Ende1)
      return (eventStart < otherEnd) && (otherStart < eventEnd);
    });
    
    const totalOverlapping = overlapping.length + 1;
    const position = overlapping.filter((_, idx) => idx < eventIndex).length;
    
    return {
      totalColumns: totalOverlapping,
      column: position,
    };
  };

  const calculateEventPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    
    const startMinutes = (startHour - 6) * 60 + startMin;
    const endMinutes = (endHour - 6) * 60 + endMin;
    const duration = endMinutes - startMinutes;
    
    return {
      top: `${(startMinutes / 60) * 30}px`,
      height: `${Math.max((duration / 60) * 30, 25)}px`,
    };
  };

  const isDateInImportedRange = (date: Date) => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setMonth(minDate.getMonth() - 4);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 12);
    
    return date >= minDate && date <= maxDate;
  };

  const isWeekOutOfRange = (dates: Date[]) => {
    return !dates.some(date => isDateInImportedRange(date));
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-3xl p-6 border border-[#D4AF37]/20 shadow-xl overflow-hidden flex flex-col">
      {/* Week Days Header */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="text-xs text-[#C0C0C0]">Zeit</div>
        {weekDates.map((date, i) => {
          const isToday = 
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth();
          
          return (
            <div key={i} className="text-center">
              <div className="text-xs text-[#C0C0C0] mb-1">{weekDays[i]}</div>
              <div
                className={`text-2xl font-bold ${
                  isToday ? "text-[#FFD700]" : "text-[#C0C0C0]"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto relative">
        {/* Wasserzeichen wenn Woche außerhalb des importierten Zeitraums */}
        {isWeekOutOfRange(weekDates) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="transform -rotate-12 bg-red-900/20 border-2 border-red-500/50 backdrop-blur-sm px-8 py-4 rounded-2xl">
              <p className="text-red-400 font-bold text-2xl text-center whitespace-nowrap">
                ⚠️ ACHTUNG!
              </p>
              <p className="text-red-300 text-sm text-center mt-1">
                Dieser Abschnitt des Kalenders ist noch nicht aktuell
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-8 gap-2">
          {/* Time Labels Column */}
          <div className="flex flex-col">
            {hours.map((hour) => (
              <div 
                key={hour} 
                className="text-[10px] text-[#C0C0C0] h-[30px] flex items-start leading-none"
              >
                {hour === 24 ? '00' : String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="relative border-l border-[#D4AF37]/20">
              {/* Hour Grid Lines */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[30px] border-b border-[#C0C0C0]/10"
                />
              ))}

              {/* Events */}
              {(() => {
                const dateEvents = getEventsForDate(date);
                return dateEvents.map((event, eventIndex) => {
                  const pos = calculateEventPosition(event.startTime, event.endTime);
                  const layout = getEventLayout(dateEvents, eventIndex);
                  
                  // Berechne Breite und Position basierend auf Überlappungen
                  const width = 100 / layout.totalColumns;
                  const left = width * layout.column;
                  
                  return (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="absolute rounded-lg p-1.5 cursor-pointer hover:scale-105 hover:z-10 transition-transform overflow-hidden shadow-lg border border-white/20 hover:border-white/40"
                      style={{
                        top: pos.top,
                        height: pos.height,
                        left: `${left}%`,
                        width: `${width - 1}%`, // -1% für kleinen Gap
                        background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)`,
                        minHeight: "25px",
                      }}
                    >
                      <div className="text-[8px] font-semibold text-black leading-tight opacity-80">
                        {event.startTime}
                      </div>
                      <div className="text-[9px] font-bold text-black leading-tight line-clamp-3 break-words">
                        {event.title}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}