import React from "react";
import { X, Calendar, Clock, Tag, Sparkles } from "lucide-react";
import { CreateEventModalProps } from "./calendar-types";
import { motion, AnimatePresence } from "framer-motion";

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
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 max-w-lg w-full shadow-2xl"
        >
          {/* Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-t-[32px]" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center shadow-xl shadow-[#FFD700]/30">
                <Sparkles size={22} className="text-black" />
              </div>
              <h2 className="text-2xl font-black">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                  Neuer Termin
                </span>
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <X size={22} className="text-gray-400" />
            </motion.button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <Tag size={16} className="text-[#FFD700]" />
                Titel
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => onChange({ ...newEvent, title: e.target.value })}
                placeholder="z.B. Probe, Konzert, Meeting..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
              />
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <Calendar size={16} className="text-[#FFD700]" />
                Datum
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => onChange({ ...newEvent, date: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                  <Clock size={16} className="text-[#FFD700]" />
                  Start
                </label>
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => onChange({ ...newEvent, startTime: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                  <Clock size={16} className="text-[#FFD700]" />
                  Ende
                </label>
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => onChange({ ...newEvent, endTime: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4AF37]" />
                Kalender
              </label>
              <select
                value={newEvent.category}
                onChange={(e) => onChange({ ...newEvent, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name} className="bg-[#1a1a1a] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all"
            >
              Abbrechen
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreate}
              className="flex-1 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] rounded-2xl font-bold text-black transition-all shadow-xl shadow-[#FFD700]/30"
            >
              Erstellen
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}