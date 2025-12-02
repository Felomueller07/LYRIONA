import React from "react";
import { ChevronLeft, ChevronRight, Calendar, Check, ChevronDown, ChevronUp } from "lucide-react";
import GoogleCalendarSync from "./GoogleCalendarSync";
import { CalendarSidebarProps, Event } from "./calendar-types";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarSidebar({
  currentDate,
  monthNames,
  weekDays,
  categories,
  showAllCategories,
  setShowAllCategories,
  onMonthChange,
  onEventsImported,
  role = "admin",
  events = [],
}: CalendarSidebarProps & { events?: Event[] }) {
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventColorsForDate = (day: number): string[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    const dayEvents = events.filter((e: Event) => 
      e.date === dateStr && !e.id.startsWith('school-')
    );
    
    const uniqueColors = Array.from(new Set(dayEvents.map((e: Event) => e.color)));
    return uniqueColors.slice(0, 3);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();

  return (
    <div className="w-80 space-y-6">
      {/* Mini Calendar Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-xl"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all group"
          >
            <ChevronLeft size={18} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
          </motion.button>
          
          <h3 className="text-sm font-bold">
            <span className="text-[#FFD700]">{monthNames[currentDate.getMonth()]}</span>
            <span className="text-gray-400 ml-2">{currentDate.getFullYear()}</span>
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all group"
          >
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-xs">
          {/* Weekday Headers */}
          {weekDays.map((day: string) => (
            <div key={day} className="text-center text-gray-500 font-bold py-2 uppercase tracking-wide">
              {day}
            </div>
          ))}
          
          {/* Empty cells for offset */}
          {Array.from({ length: startingDayOfWeek }).map((_, i: number) => (
            <div key={`empty-${i}`} />
          ))}
          
          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i: number) => {
            const day = i + 1;
            const isToday = 
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();
            
            const eventColors = getEventColorsForDate(day);
            
            return (
              <div key={day} className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                    isToday
                      ? "bg-gradient-to-br from-[#FFD700] to-[#D4AF37] text-black shadow-lg shadow-[#FFD700]/30"
                      : "hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {day}
                </motion.button>
                
                {/* Event Color Dots */}
                {eventColors.length > 0 && (
                  <div className="flex justify-center gap-0.5 mt-1 h-1.5">
                    {eventColors.map((color: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Categories Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-xl"
      >
        <button 
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="w-full flex items-center justify-between mb-5 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
              <Calendar size={18} className="text-black" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Meine Termine
            </h3>
          </div>
          <motion.div
            animate={{ rotate: showAllCategories ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{ 
              height: showAllCategories ? "auto" : "200px",
              opacity: 1
            }}
            className="overflow-y-auto space-y-3"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 py-2.5 px-3 hover:bg-white/5 rounded-xl transition-all group cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: cat.color,
                    boxShadow: `0 0 10px ${cat.color}50`
                  }}
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate flex-1">
                  {cat.name}
                </span>
                <Check size={14} className="text-[#FFD700] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Google Sync (nur für Admin) */}
      {role === "admin" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GoogleCalendarSync 
            onEventsImported={onEventsImported}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-xl"
          />
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-xl"
      >
        <h3 className="text-sm font-bold text-white mb-4">Statistik</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Events heute</span>
            <span className="text-sm font-bold text-[#FFD700]">
              {events.filter(e => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return e.date === `${year}-${month}-${day}`;
              }).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Diese Woche</span>
            <span className="text-sm font-bold text-white">
              {events.filter(e => {
                const eventDate = new Date(e.date);
                const today = new Date();
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay() + 1);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return eventDate >= weekStart && eventDate <= weekEnd;
              }).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Dieser Monat</span>
            <span className="text-sm font-bold text-white">
              {events.filter(e => {
                const eventDate = new Date(e.date);
                const today = new Date();
                return eventDate.getMonth() === today.getMonth() && 
                       eventDate.getFullYear() === today.getFullYear();
              }).length}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}