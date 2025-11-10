"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LogOut, Target, Calendar, FileText, TrendingUp, Ticket } from "lucide-react";

// Dynamische Imports
const ModernerKalender = dynamic(
  () => import("../../components/dashboard/ModernerKalender"),
  { ssr: false }
);

const NotesUpload = dynamic(
  () => import("../../components/dashboard/NotesUpload"),
  { ssr: false }
);

const TicketSales = dynamic(
  () => import("../../components/dashboard/TicketSales"),
  { ssr: false }
);

export default function DashboardPage() {
  const [role, setRole] = useState<string>("visitor");
  const [activeTab, setActiveTab] = useState("noten");
  const [trumpetHours, setTrumpetHours] = useState(4);
  const [drumsHours, setDrumsHours] = useState(2);

  const trumpetProgress = (trumpetHours / 12) * 100;
  const drumsProgress = (drumsHours / 12) * 100;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const userRole = params.get("role") || "visitor";
      setRole(userRole);

      if (userRole === "visitor") {
        setActiveTab("termine");
      }
    }
  }, []);

  const tabs = [
    { id: "noten", label: "Noten", icon: FileText },
    { id: "ziele", label: "Ziele", icon: Target },
    { id: "termine", label: "Termine", icon: Calendar },
    { id: "kalender", label: "Kalender", icon: Calendar },
    { id: "tickets", label: "Kartenverkauf", icon: Ticket },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white font-[system-ui]">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  LYRIONA
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {role === "admin" ? "Administrator Dashboard" : "Besucher Ansicht"}
                </p>
              </div>

              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Abmelden</span>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="border-b border-white/10 bg-black/10 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 transition-all whitespace-nowrap ${
                      isActive
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Meine Noten */}
          {activeTab === "noten" && <NotesUpload role={role} />}

          {/* Meine Ziele */}
          {activeTab === "ziele" && (
            <section className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <Target className="text-purple-400" />
                  Meine Ziele
                </h2>
                <p className="text-gray-400">
                  {role === "visitor"
                    ? "👁️ Besucheransicht - du kannst nur anschauen"
                    : "Tracke deinen Übungsfortschritt"}
                </p>
              </div>

              <div className="grid gap-6 max-w-2xl">
                {/* Trompete */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                      🎺
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">Trompete</h3>
                      <p className="text-gray-400 text-sm">Wochenziel: 12 Stunden</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{trumpetHours.toFixed(1)}</div>
                      <div className="text-sm text-gray-400">Stunden</div>
                    </div>
                  </div>

                  <div className="relative h-3 bg-black/30 rounded-full overflow-hidden mb-4">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(trumpetProgress, 100)}%` }}
                    />
                  </div>

                  {role === "admin" ? (
                    <button
                      onClick={() => setTrumpetHours(Math.min(trumpetHours + 0.5, 12))}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-semibold transition-all hover:scale-105"
                    >
                      + 30 Minuten hinzufügen
                    </button>
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-2">
                      👁️ Besucheransicht - nur lesbar
                    </p>
                  )}
                </div>

                {/* Schlagzeug */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                      🥁
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">Schlagzeug</h3>
                      <p className="text-gray-400 text-sm">Wochenziel: 12 Stunden</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{drumsHours.toFixed(1)}</div>
                      <div className="text-sm text-gray-400">Stunden</div>
                    </div>
                  </div>

                  <div className="relative h-3 bg-black/30 rounded-full overflow-hidden mb-4">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(drumsProgress, 100)}%` }}
                    />
                  </div>

                  {role === "admin" ? (
                    <button
                      onClick={() => setDrumsHours(Math.min(drumsHours + 0.5, 12))}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all hover:scale-105"
                    >
                      + 30 Minuten hinzufügen
                    </button>
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-2">
                      👁️ Besucheransicht - nur lesbar
                    </p>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <TrendingUp size={24} className="text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {(((trumpetHours + drumsHours) / 24) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">Gesamt</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-2xl font-bold">
                      {(trumpetHours + drumsHours).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">Std diese Woche</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-2xl font-bold">
                      {(24 - trumpetHours - drumsHours).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">Std verbleibend</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Meine Termine */}
          {activeTab === "termine" && (
            <section className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <Calendar className="text-purple-400" />
                  Meine Termine
                </h2>
                <p className="text-gray-400">Deine anstehenden Events und Proben</p>
              </div>

              <div className="grid gap-4 max-w-2xl">
                {[
                  {
                    icon: "🎺",
                    title: "Trompeten Probe",
                    day: "Freitag",
                    time: "17:00 - 19:00 Uhr",
                    gradient: "from-yellow-500/20 to-orange-500/20",
                    border: "border-yellow-500/30",
                    iconBg: "from-yellow-500 to-orange-500",
                  },
                  {
                    icon: "🥁",
                    title: "Schlagzeugunterricht",
                    day: "Dienstag",
                    time: "18:30 - 20:00 Uhr",
                    gradient: "from-blue-500/20 to-cyan-500/20",
                    border: "border-blue-500/30",
                    iconBg: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: "🎶",
                    title: "Auftritt Stadtfest",
                    day: "Sonntag",
                    time: "15:00 - 17:30 Uhr",
                    gradient: "from-purple-500/20 to-pink-500/20",
                    border: "border-purple-500/30",
                    iconBg: "from-purple-500 to-pink-500",
                  },
                ].map((termin, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-3xl bg-gradient-to-br ${termin.gradient} border ${termin.border} backdrop-blur-sm hover:scale-[1.02] transition-all cursor-pointer group`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${termin.iconBg} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}
                      >
                        {termin.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{termin.title}</h3>
                        <p className="text-gray-300 text-sm">{termin.day}</p>
                      </div>
                      <div className="text-right">
                        <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10">
                          <p className="text-sm font-semibold">{termin.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Felix Kalender */}
          {activeTab === "kalender" && (
            <section className="animate-fade-in">
              <ModernerKalender role={role} />
            </section>
          )}

          {/* Kartenverkauf */}
          {activeTab === "tickets" && <TicketSales role={role} />}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm mt-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
            <div
              className="w-1 h-1 bg-pink-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
          © 2025 LYRIONA – minimal & elegant
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}