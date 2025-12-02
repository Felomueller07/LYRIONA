import React from "react";
import { X, Calendar, Clock, Tag, Edit2, Trash2, Save } from "lucide-react";
import { EventDetailModalProps } from "./calendar-types";
import { motion, AnimatePresence } from "framer-motion";

export default function EventDetailModal({
  event,
  categories,
  isEditing,
  editedEvent,
  onClose,
  onEdit,
  onSave,
  onDelete,
  onCancelEdit,
  onEditChange,
  role = "visitor",
}: EventDetailModalProps) {
  if (!event) return null;

  const currentEvent = isEditing && editedEvent ? editedEvent : event;
  const isGoogleEvent = event.id.startsWith('google-');
  const canEdit = !isGoogleEvent && (event.id.startsWith('local-') || event.id.startsWith('school-'));

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
          {/* Top Accent with Event Color */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 rounded-t-[32px]"
            style={{
              background: `linear-gradient(to right, transparent, ${currentEvent.color}, transparent)`
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${currentEvent.color}, ${currentEvent.color}cc)`,
                  boxShadow: `0 10px 30px ${currentEvent.color}50`
                }}
              >
                <Calendar size={22} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  {isEditing ? "Termin bearbeiten" : "Termin Details"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">{currentEvent.category}</p>
              </div>
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

          {isEditing && editedEvent ? (
            /* EDIT MODE */
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                  <Tag size={16} className="text-[#FFD700]" />
                  Titel
                </label>
                <input
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) => onEditChange({ ...editedEvent, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
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
                  value={editedEvent.date}
                  onChange={(e) => onEditChange({ ...editedEvent, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                    <Clock size={16} className="text-[#FFD700]" />
                    Start
                  </label>
                  <input
                    type="time"
                    value={editedEvent.startTime}
                    onChange={(e) => onEditChange({ ...editedEvent, startTime: e.target.value })}
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
                    value={editedEvent.endTime}
                    onChange={(e) => onEditChange({ ...editedEvent, endTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: editedEvent.color }} />
                  Kalender
                </label>
                <select
                  value={editedEvent.category}
                  onChange={(e) => onEditChange({ ...editedEvent, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name} className="bg-[#1a1a1a] text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancelEdit}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all"
                >
                  Abbrechen
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSave(editedEvent)}
                  className="flex-1 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] rounded-2xl font-bold text-black transition-all shadow-xl shadow-[#FFD700]/30 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Speichern
                </motion.button>
              </div>
            </div>
          ) : (
            /* VIEW MODE */
            <div className="space-y-6">
              {/* Title */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                  <Tag size={14} />
                  Titel
                </p>
                <h3 className="text-xl font-black text-white">{event.title}</h3>
              </div>

              {/* Date */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                  <Calendar size={14} />
                  Datum
                </p>
                <p className="text-lg font-bold text-white">
                  {new Date(event.date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <Clock size={14} />
                    Start
                  </p>
                  <p className="text-xl font-black text-emerald-400">
                    {event.startTime}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <Clock size={14} />
                    Ende
                  </p>
                  <p className="text-xl font-black text-red-400">
                    {event.endTime}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-gray-400 mb-3">Kalender</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ 
                      backgroundColor: event.color,
                      boxShadow: `0 0 10px ${event.color}50`
                    }}
                  />
                  <span className="text-base font-bold text-white">{event.category}</span>
                </div>
              </div>

              {/* Google Event Notice */}
              {isGoogleEvent && (
                <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4">
                  <p className="text-xs text-blue-400 flex items-center gap-2">
                    <Calendar size={14} />
                    Dieser Termin kommt aus Google Calendar und kann nur dort bearbeitet werden
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 mt-8">
                {canEdit && role === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onEdit}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Bearbeiten
                  </motion.button>
                )}

                {role === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete(event.id)}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-2xl font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Löschen
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all"
                >
                  Schließen
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}