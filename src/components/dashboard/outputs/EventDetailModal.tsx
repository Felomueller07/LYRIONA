import React from "react";
import {X} from "lucide-react";
import {EventDetailModalProps} from "./calendar-types";

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
                                         }: EventDetailModalProps) {
    if (!event) return null;

    const currentEvent = isEditing && editedEvent ? editedEvent : event;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-3xl p-8 max-w-md w-full border border-[#D4AF37]/30 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{backgroundColor: currentEvent.color}}
                        />
                        <h2 className="text-xl font-bold text-[#FFD700]">
                            {isEditing ? "✏️ Termin bearbeiten" : "Termin Details"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={24} className="text-[#D4AF37]"/>
                    </button>
                </div>

                {isEditing && editedEvent ? (
                    /* EDIT MODE */
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-[#C0C0C0] mb-2 block">Titel</label>
                            <input
                                type="text"
                                value={editedEvent.title}
                                onChange={(e) => onEditChange({...editedEvent, title: e.target.value})}
                                className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#C0C0C0] mb-2 block">Datum</label>
                            <input
                                type="date"
                                value={editedEvent.date}
                                onChange={(e) => onEditChange({...editedEvent, date: e.target.value})}
                                className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-[#C0C0C0] mb-2 block">Start</label>
                                <input
                                    type="time"
                                    value={editedEvent.startTime}
                                    onChange={(e) => onEditChange({...editedEvent, startTime: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#C0C0C0] mb-2 block">Ende</label>
                                <input
                                    type="time"
                                    value={editedEvent.endTime}
                                    onChange={(e) => onEditChange({...editedEvent, endTime: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-[#C0C0C0] mb-2 block">Kalender</label>
                            <select
                                value={editedEvent.category}
                                onChange={(e) => onEditChange({...editedEvent, category: e.target.value})}
                                className="w-full bg-[#1a1a1a] border border-[#C0C0C0]/20 rounded-xl p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onCancelEdit}
                                className="flex-1 py-3 bg-[#1a1a1a] hover:bg-[#2d2d2d] border border-[#C0C0C0]/20 rounded-2xl font-bold text-white transition-all"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={() => onSave(editedEvent)}
                                className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFA500] rounded-2xl font-bold text-black transition-all shadow-lg"
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                ) : (
                    /* VIEW MODE */
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border border-[#C0C0C0]/20 rounded-xl p-4">
                            <p className="text-xs text-[#C0C0C0] mb-1">Titel</p>
                            <h3 className="text-lg font-bold text-[#FFD700]">{event.title}</h3>
                        </div>

                        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border border-[#C0C0C0]/20 rounded-xl p-4">
                            <p className="text-xs text-[#C0C0C0] mb-1">Datum</p>
                            <p className="text-base font-semibold text-white">
                                {new Date(event.date).toLocaleDateString('de-DE', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border border-[#C0C0C0]/20 rounded-xl p-4">
                                <p className="text-xs text-[#C0C0C0] mb-1">Start</p>
                                <p className="text-lg font-bold text-[#10B981]">
                                    {event.startTime} Uhr
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border border-[#C0C0C0]/20 rounded-xl p-4">
                                <p className="text-xs text-[#C0C0C0] mb-1">Ende</p>
                                <p className="text-lg font-bold text-[#EF4444]">
                                    {event.endTime} Uhr
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border border-[#C0C0C0]/20 rounded-xl p-4">
                            <p className="text-xs text-[#C0C0C0] mb-2">Kalender</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full shadow-lg"
                                    style={{backgroundColor: event.color}}
                                />
                                <span className="text-base font-semibold text-white">{event.category}</span>
                            </div>
                        </div>

                        {event.id.startsWith('google-') && (
                            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] border border-blue-500/20 rounded-xl p-3">
                                <p className="text-xs text-blue-400 flex items-center gap-2">
                                    <span>📅</span>
                                    Dieser Termin kommt aus Google Calendar und kann nur dort bearbeitet werden
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 mt-6">
                            {(event.id.startsWith('local-') || event.id.startsWith('school-')) && (
                                <button
                                    onClick={onEdit}
                                    className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] rounded-2xl font-bold text-white transition-all shadow-lg"
                                >
                                    ✏️ Bearbeiten
                                </button>
                            )}

                            <button
                                onClick={() => onDelete(event.id)}
                                className="w-full py-3 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] rounded-2xl font-bold text-white transition-all shadow-lg"
                            >
                                🗑️ Termin löschen
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-[#1a1a1a] hover:bg-[#2d2d2d] border border-[#C0C0C0]/20 rounded-2xl font-bold text-white transition-all"
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}