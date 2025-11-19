// src/components/dashboard/outputs/CalendarSidebar.tsx
import React from "react";
import {ChevronLeft, ChevronRight, Calendar, Check} from "lucide-react";
import GoogleCalendarSync from "./GoogleCalendarSync";
import {CalendarSidebarProps} from "./calendar-types";

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
                                        }: CalendarSidebarProps) {
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        return {daysInMonth, startingDayOfWeek};
    };

    const {daysInMonth, startingDayOfWeek} = getDaysInMonth();

    return (
        <div className="w-80 space-y-6">
            {/* Mini Calendar */}
            <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-3xl p-6 border border-[#D4AF37]/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => onMonthChange(-1)}>
                        <ChevronLeft size={20} className="text-[#C0C0C0] hover:text-[#FFD700]"/>
                    </button>
                    <h3 className="text-sm font-semibold text-[#FFD700]">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={() => onMonthChange(1)}>
                        <ChevronRight size={20} className="text-[#C0C0C0] hover:text-[#FFD700]"/>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[#C0C0C0] font-medium py-2">
                            {day}
                        </div>
                    ))}
                    {Array.from({length: startingDayOfWeek}).map((_, i) => (
                        <div key={`empty-${i}`}/>
                    ))}
                    {Array.from({length: daysInMonth}).map((_, i) => {
                        const day = i + 1;
                        const today = new Date();
                        const isToday =
                            day === today.getDate() &&
                            currentDate.getMonth() === today.getMonth() &&
                            currentDate.getFullYear() === today.getFullYear();

                        return (
                            <button
                                key={day}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                                    isToday
                                        ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold shadow-lg"
                                        : "hover:bg-[#2d2d2d] text-[#C0C0C0]"
                                }`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Kategorien */}
            <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-3xl p-6 border border-[#D4AF37]/20 shadow-xl">
                <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="w-full text-left"
                >
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[#FFD700]">
                        <Calendar size={18}/>
                        Meine Termine
                        <span className="ml-auto text-xs text-[#C0C0C0]">
              {showAllCategories ? "▲" : "▼"}
            </span>
                    </h3>
                </button>
                <div className={`space-y-2 overflow-y-auto transition-all ${
                    showAllCategories ? "max-h-96" : "max-h-48"
                }`}>
                    {categories.map((cat) => {
                        const isString = typeof cat === "string";
                        const name = isString ? cat : (cat as { name: string; color?: string }).name;
                        const color = isString ? "#C0C0C0" : ((cat as { name: string; color?: string }).color ?? "#C0C0C0");

                        return (
                            <div key={name} className="flex items-center gap-3 py-2">
                                <div
                                    className="w-3 h-3 rounded-full shadow-lg flex-shrink-0"
                                    style={{backgroundColor: color}}
                                />
                                <span className="text-xs text-[#C0C0C0] truncate">{name}</span>
                                <Check size={12} className="ml-auto text-[#D4AF37] flex-shrink-0"/>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Google Sync Button */}
            {role === "admin" && (
                <GoogleCalendarSync onEventsImported={onEventsImported}/>
            )}
        </div>
    );
}