"use client";

import React, { useState } from "react";
import { Target, TrendingUp, Plus, Clock } from "lucide-react";

interface GoalsProps {
  role: "admin" | "visitor";
}

export default function Goals({ role }: GoalsProps) {
  const [trumpetHours, setTrumpetHours] = useState(4.0);
  const [drumsHours, setDrumsHours] = useState(2.0);

  const trumpetProgress = (trumpetHours / 12) * 100;
  const drumsProgress = (drumsHours / 12) * 100;
  const weekProgress = trumpetHours + drumsHours;
  const totalRemaining = 24 - weekProgress;

  const addPracticeTime = (instrument: "trumpet" | "drums", minutes: number) => {
    if (instrument === "trumpet") {
      setTrumpetHours(Math.min(trumpetHours + minutes / 60, 12));
    } else {
      setDrumsHours(Math.min(drumsHours + minutes / 60, 12));
    }
  };

  return (
    <section className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center">
              <Target size={24} className="text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Übungsfortschritt
              </h2>
              <p className="text-gray-400">
                {role === "visitor"
                  ? "👁️ Besucheransicht - du kannst nur anschauen"
                  : "Tracke deine Übungszeit und erreiche deine Ziele"}
              </p>
            </div>
          </div>

          {role === "admin" && (
            <button className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all hover:scale-105 flex items-center gap-2">
              <Plus size={20} />
              Neues Instrument
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
              <TrendingUp className="text-[#FFD700]" size={24} />
            </div>
            <span className="text-sm text-[#10B981]">+25%</span>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-2">
            {weekProgress.toFixed(1)}h
          </div>
          <div className="text-gray-400 text-sm">Diese Woche</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{(weekProgress * 4).toFixed(1)}h</div>
          <div className="text-gray-400 text-sm">Gesamt (Monat)</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{totalRemaining.toFixed(1)}h</div>
          <div className="text-gray-400 text-sm">Noch bis Ziel</div>
        </div>
      </div>

      {/* Instruments Grid */}
      <div className="space-y-6">
        {/* Trompete */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 backdrop-blur-sm hover:border-[#FFD700]/40 transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-3xl shadow-lg">
                🎺
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Trompete</h3>
                <p className="text-gray-400">Wochenziel: 12 Stunden</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                {trumpetHours.toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Stunden</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Wochenfortschritt</span>
              <span className="text-sm font-semibold text-white">
                {Math.round(trumpetProgress)}%
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(trumpetProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {role === "admin" ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => addPracticeTime("trumpet", 30)}
                className="flex-1 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                + 30 Minuten
              </button>
              <button
                onClick={() => addPracticeTime("trumpet", 60)}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
              >
                + 1 Std
              </button>
              <button className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10">
                Bearbeiten
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4 bg-white/5 rounded-xl">
              👁️ Besucheransicht - nur lesbar
            </p>
          )}

          {/* Stats Footer */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xl font-bold text-white">{(trumpetHours * 4).toFixed(1)}h</div>
                <div className="text-sm text-gray-400">Gesamt</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#10B981]">
                  {(12 - trumpetHours).toFixed(1)}h
                </div>
                <div className="text-sm text-gray-400">Noch diese Woche</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Letztes Update: Heute, {new Date().getHours()}:
              {String(new Date().getMinutes()).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Schlagzeug */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#3B82F6]/20 backdrop-blur-sm hover:border-[#3B82F6]/40 transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-3xl shadow-lg">
                🥁
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Schlagzeug</h3>
                <p className="text-gray-400">Wochenziel: 12 Stunden</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {drumsHours.toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Stunden</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Wochenfortschritt</span>
              <span className="text-sm font-semibold text-white">{Math.round(drumsProgress)}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(drumsProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {role === "admin" ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => addPracticeTime("drums", 30)}
                className="flex-1 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                + 30 Minuten
              </button>
              <button
                onClick={() => addPracticeTime("drums", 60)}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
              >
                + 1 Std
              </button>
              <button className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10">
                Bearbeiten
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4 bg-white/5 rounded-xl">
              👁️ Besucheransicht - nur lesbar
            </p>
          )}

          {/* Stats Footer */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xl font-bold text-white">{(drumsHours * 4).toFixed(1)}h</div>
                <div className="text-sm text-gray-400">Gesamt</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#10B981]">{(12 - drumsHours).toFixed(1)}h</div>
                <div className="text-sm text-gray-400">Noch diese Woche</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Letztes Update: Heute, {new Date().getHours()}:
              {String(new Date().getMinutes()).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}