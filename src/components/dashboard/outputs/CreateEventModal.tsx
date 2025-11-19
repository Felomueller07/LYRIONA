import React from "react";
import { X } from "lucide-react";
import { CreateEventModalProps } from "./calendar-types";

export default function CreateEventModal({
  show,
  categories,
  newEvent,
  onChange,
  onCreate,
  onClose,
}: CreateEventModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-3xl p-8 max-w-md w-full border border-[#D4AF37]/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#FFD700]">➕ Neuer Termin</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <X size={24} className="text-[#D4AF37]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#C0C0C0] mb-2 block">Titel</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => onChange({ ...newEvent, title: e.target.value })}
              placeholder="z.B. Probe, Konzert, Meeting..."
              className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white placeholder-[#C0C0C0]/50 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#C0C0C0] mb-2 block">Datum</label>
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => onChange({ ...newEvent, date: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#C0C0C0] mb-2 block">Start</label>
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => onChange({ ...newEvent, startTime: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#C0C0C0] mb-2 block">Ende</label>
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => onChange({ ...newEvent, endTime: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#C0C0C0] mb-2 block">Kalender</label>
            <select
              value={newEvent.category}
              onChange={(e) => onChange({ ...newEvent, category: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#1a1a1a] hover:bg-[#2d2d2d] border border-[#C0C0C0]/20 rounded-2xl font-bold text-white transition-all"
          >
            Abbrechen
          </button>
          <button
            onClick={onCreate}
            className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFA500] rounded-2xl font-bold text-black transition-all shadow-lg"
          >
            Erstellen
          </button>
        </div>
      </div>
    </div>
  );
}