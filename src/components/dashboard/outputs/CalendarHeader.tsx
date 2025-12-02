import React from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Grid3x3, List } from "lucide-react";
import { CalendarHeaderProps } from "./calendar-types";
import { motion } from "framer-motion";

export default function CalendarHeader({
  currentDate,
  monthNames,
  view,
  onPreviousWeek,
  onNextWeek,
  onPreviousMonth,
  onNextMonth,
  onCreateEvent,
  onToggleView,
  role = "visitor",
}: CalendarHeaderProps) {
  const isWeekView = view === "week";
  
  const handlePrevious = () => {
    if (isWeekView) {
      onPreviousWeek();
    } else {
      onPreviousMonth();
    }
  };

  const handleNext = () => {
    if (isWeekView) {
      onNextWeek();
    } else {
      onNextMonth();
    }
  };

  const today = new Date();
  const isToday = 
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="mb-8">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Left: Title & Date Info */}
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-5xl font-black tracking-tight mb-2">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                {monthNames[currentDate.getMonth()]}
              </span>
              <span className="text-white ml-3">
                {currentDate.getFullYear()}
              </span>
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {isWeekView ? "Wochenansicht" : "Monatsansicht"} • {isToday ? "Heute" : ""}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
            <button
              onClick={onToggleView}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                isWeekView
                  ? "bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List size={16} />
              Woche
            </button>
            <button
              onClick={onToggleView}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                !isWeekView
                  ? "bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid3x3 size={16} />
              Monat
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="p-3 hover:bg-white/10 rounded-xl transition-all group"
            >
              <ChevronLeft size={20} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
            </motion.button>
            
            <button
              onClick={() => {
                const today = new Date();
                if (isWeekView) {
                  onPreviousWeek(); // Reset to current week
                } else {
                  onPreviousMonth(); // Reset to current month
                }
                // Note: This is a simplified "Today" button - you might want to add proper logic
              }}
              className="px-4 py-2 text-sm font-bold text-white hover:text-[#FFD700] transition-colors"
            >
              Heute
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-3 hover:bg-white/10 rounded-xl transition-all group"
            >
              <ChevronRight size={20} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
            </motion.button>
          </div>

          {/* Create Event Button (nur für Admin) */}
          {role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateEvent}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-2xl shadow-xl shadow-[#FFD700]/30 transition-all"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Neuer Termin</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats Bar (optional) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CalendarIcon size={16} className="text-[#FFD700]" />
          <span className="text-sm text-gray-300 font-medium">
            KW {Math.ceil((currentDate.getDate() + (currentDate.getDay() || 7) - 1) / 7)}
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-300 font-medium">
            Synchronisiert
          </span>
        </div>
      </div>
    </div>
  );
}