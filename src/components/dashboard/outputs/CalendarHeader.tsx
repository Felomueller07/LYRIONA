import React from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {CalendarHeaderProps} from "./calendar-types";

export default function CalendarHeader({
                                           currentDate,
                                           monthNames,
                                           onPreviousWeek,
                                           onNextWeek,
                                           onCreateEvent,
                                       }: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                    {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </h2>
                <span className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black text-sm rounded-full font-bold shadow-lg">
          Heute
        </span>
                <button
                    onClick={onCreateEvent}
                    className="px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-sm rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                >
                    <span className="text-lg">+</span>
                    Neuer Termin
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPreviousWeek}
                    className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-all"
                >
                    <ChevronLeft size={20} className="text-[#FFD700]"/>
                </button>
                <button
                    onClick={onNextWeek}
                    className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-all"
                >
                    <ChevronRight size={20} className="text-[#FFD700]"/>
                </button>
            </div>
        </div>
    );
}