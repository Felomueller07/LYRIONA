"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LogOut, Target, Calendar, FileText, Ticket, ChevronRight, Star, Clock, Music, TrendingUp } from "lucide-react";

const ModernerKalender = dynamic(() => import("../../components/dashboard/outputs/ModernerKalender"), { ssr: false });
const NotesUpload = dynamic(() => import("../../components/dashboard/NotesUpload"), { ssr: false });
const Goals = dynamic(() => import("../../components/dashboard/outputs/Goals"), { ssr: false });
const TicketSales = dynamic(() => import("../../components/dashboard/TicketSales"), { ssr: false });

export default function DashboardPage() {
  const [role, setRole] = useState<"admin" | "visitor">("visitor");
  const [activeTab, setActiveTab] = useState("termine");
  const [mounted, setMounted] = useState(false);

  const tabs = [
    { id: "noten", label: "Noten", icon: FileText },
    { id: "ziele", label: "Ziele", icon: Target },
    { id: "termine", label: "Termine", icon: Calendar },
    { id: "kalender", label: "Kalender", icon: Calendar },
    { id: "tickets", label: "Kartenverkauf", icon: Ticket },
  ];

  // ✅ FIXED: Tab Parameter aus URL lesen!
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const userRole = params.get("role") as "admin" | "visitor" | null;
      const storedRole = localStorage.getItem("userRole") as "admin" | "visitor" | null;
      const tabParam = params.get("tab"); // ✅ NEU: Lese tab aus URL!
      
      if (userRole === "admin" || userRole === "visitor") {
        setRole(userRole);
      } else if (storedRole === "admin" || storedRole === "visitor") {
        setRole(storedRole);
      } else {
        setRole("visitor");
      }

      // ✅ NEU: Wenn tab Parameter da ist, nutze ihn!
      if (tabParam === "kartenverkauf" || tabParam === "tickets") {
        console.log("🎟️ Öffne Kartenverkauf Tab aus URL");
        setActiveTab("tickets");
      } else if (tabParam && tabs.some(t => t.id === tabParam)) {
        console.log(`📍 Öffne ${tabParam} Tab aus URL`);
        setActiveTab(tabParam);
      } else if (role === "visitor") {
        setActiveTab("termine");
      }
    }
  }, []); // ✅ Dependency Array leer - nur beim Mount!

  return (
    <div className="min-h-screen bg-[#000000] text-white font-[system-ui] relative overflow-hidden">
      {/* 🎨 POLISHED AURORA BOREALIS - FINAL VERSION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Flowing Aurora Waves - Enhanced */}
        <div className="absolute inset-0">
          {/* Primary Aurora Wave - Gold dominant */}
          <div 
            className="absolute w-full h-[500px] -top-20 animate-aurora-1"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), rgba(255,215,0,0.3), rgba(255,223,128,0.25), rgba(192,192,192,0.2), transparent)',
              filter: 'blur(80px)',
            }}
          />
          
          {/* Secondary Wave - Silver/White */}
          <div 
            className="absolute w-full h-[400px] top-1/4 animate-aurora-2"
            style={{
              background: 'linear-gradient(-90deg, transparent, rgba(255,255,255,0.18), rgba(224,224,224,0.15), rgba(212,175,55,0.2), transparent)',
              filter: 'blur(90px)',
            }}
          />
          
          {/* Tertiary Wave - Mixed Metallics */}
          <div 
            className="absolute w-full h-[550px] top-1/2 animate-aurora-3"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.28), rgba(255,215,0,0.22), rgba(255,255,255,0.15), transparent)',
              filter: 'blur(100px)',
            }}
          />
          
          {/* Bottom Wave - Warm glow */}
          <div 
            className="absolute w-full h-[350px] bottom-0 animate-aurora-4"
            style={{
              background: 'linear-gradient(-90deg, transparent, rgba(212,175,55,0.3), rgba(255,215,0,0.18), rgba(255,255,255,0.12), transparent)',
              filter: 'blur(95px)',
            }}
          />

          {/* Additional depth layer */}
          <div 
            className="absolute w-full h-[450px] top-1/3 animate-aurora-5"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.15), transparent)',
              filter: 'blur(110px)',
            }}
          />
        </div>

        {/* Moving Particles - Gold, Silver, White */}
        {mounted && [...Array(60)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const colors = ['#FFD700', '#D4AF37', '#C0C0C0', '#FFFFFF'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const isGold = color === '#FFD700' || color === '#D4AF37';
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-particle-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                opacity: 0.4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 12}s`,
                boxShadow: isGold 
                  ? `0 0 ${size * 3}px ${color}` 
                  : `0 0 ${size * 2}px rgba(255,255,255,0.3)`,
                filter: 'blur(0.5px)',
              }}
            />
          );
        })}

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header - Elevated Design */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-3xl border-b border-white/10">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-16">
                {/* Logo - Larger & More Prominent */}
                <h1 className="text-3xl font-black tracking-tight">
                  <span className="text-white">LYRI</span>
                  <span className="bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">ONA</span>
                </h1>
                
                {/* Navigation - Better Spacing */}
                <nav className="hidden lg:flex items-center gap-10">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-[15px] font-medium transition-all duration-300 relative ${
                          isActive 
                            ? "text-white" 
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                        {isActive && (
                          <div className="absolute -bottom-[24px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Logout Button - More Refined */}
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-all hover:bg-white/5 rounded-xl"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Abmelden</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Nav - Enhanced */}
        <nav className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-black/70 backdrop-blur-3xl border-b border-white/10">
          <div className="flex overflow-x-auto px-4 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all relative ${
                    isActive 
                      ? "text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="pt-20 lg:pt-20">
          {/* HERO SECTION - Only show when NOT on tickets tab */}
          {activeTab !== "tickets" && (
            <section className="relative py-32 lg:py-40">
              <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                <div className="max-w-5xl">
                  {/* Status Badge - Refined */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-xs font-semibold text-[#FFD700] mb-8 backdrop-blur-xl">
                    <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse-glow" />
                    {role === "admin" ? "Administrator Dashboard" : "Besucher Ansicht"}
                  </div>

                  {/* Main Heading - Perfect Typography */}
                  <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-black tracking-tight mb-8 leading-[0.95]">
                    <span className="block text-white">Dein Musik-</span>
                    <span className="block bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#C0C0C0] bg-clip-text text-transparent animate-gradient">
                      Management
                    </span>
                  </h1>

                  {/* Subtitle - Better Readability */}
                  <p className="text-2xl text-gray-300 mb-14 max-w-3xl leading-relaxed font-light">
                    Die moderne Plattform für professionelles Musik-Management. 
                    <span className="block mt-2">Organisiere deine Noten, Ziele und Termine an einem Ort.</span>
                  </p>

                  {/* Quick Stats - Enhanced Design */}
                  <div className="flex flex-wrap items-center gap-12">
                    <div className="group">
                      <div className="text-5xl font-black text-white mb-2 group-hover:text-[#FFD700] transition-colors">3</div>
                      <div className="text-sm text-gray-400 font-medium">Termine diese Woche</div>
                    </div>
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="group">
                      <div className="text-5xl font-black text-white mb-2 group-hover:text-[#FFD700] transition-colors">8.5h</div>
                      <div className="text-sm text-gray-400 font-medium">Gesamt Stunden</div>
                    </div>
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="group">
                      <div className="text-5xl font-black text-white mb-2 group-hover:text-[#FFD700] transition-colors">2d</div>
                      <div className="text-sm text-gray-400 font-medium">Nächstes Event</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTENT SECTION - Enhanced Cards */}
          <section className={`py-16 lg:py-24 ${activeTab === "tickets" ? "pt-32" : ""}`}>
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
              {/* Section Header - Better Hierarchy - HIDE on tickets tab */}
              {activeTab !== "tickets" && (
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center shadow-xl shadow-[#FFD700]/30">
                      <Calendar size={22} className="text-black" />
                    </div>
                    <div>
                      <h2 className="text-5xl font-black tracking-tight">Meine Termine</h2>
                      <p className="text-gray-400 text-lg mt-1">Deine anstehenden Events, Proben und Auftritte</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "termine" && (
                <div className="space-y-16">
                  {/* Termine Grid - Perfect Proportions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                      { icon: "🎺", title: "Trompeten Probe", day: "Freitag", time: "17:00 - 19:00 Uhr", location: "Musikschule", color: "from-[#FFD700] to-[#FFA500]" },
                      { icon: "🥁", title: "Schlagzeugunterricht", day: "Dienstag", time: "18:30 - 20:00 Uhr", location: "Studio A", color: "from-[#C0C0C0] to-[#E8E8E8]" },
                      { icon: "🎤", title: "Auftritt Stadtfest", day: "Sonntag", time: "15:00 - 17:30 Uhr", location: "Hauptbühne", color: "from-[#D4AF37] to-[#FFD700]" },
                    ].map((termin, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 hover:bg-white/[0.08] hover:border-[#FFD700]/30 hover:shadow-2xl hover:shadow-[#FFD700]/10 transition-all duration-500 cursor-pointer"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                        }}
                      >
                        {/* Top accent line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${termin.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl`} />
                        
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-5xl mb-8 transition-all group-hover:scale-110">
                          {termin.icon}
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold mb-6 group-hover:text-[#FFD700] transition-colors">
                          {termin.title}
                        </h3>

                        <div className="space-y-3 text-base text-gray-300 mb-8">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="font-medium">{termin.day}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-gray-500" />
                            <span className="font-medium">{termin.time}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{termin.location}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-[#FFD700] transition-colors">
                          Details ansehen
                          <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats Cards - Enhanced */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Diese Woche", value: "3", icon: Star, gradient: "from-emerald-500 to-green-600" },
                      { label: "Gesamt Stunden", value: "8.5", icon: Clock, gradient: "from-blue-500 to-cyan-600" },
                      { label: "Nächstes Event", value: "2d", icon: Music, gradient: "from-purple-500 to-pink-600" },
                    ].map((stat, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-5xl font-black text-white group-hover:text-[#FFD700] transition-colors">{stat.value}</p>
                          </div>
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-20 flex items-center justify-center group-hover:opacity-30 group-hover:scale-110 transition-all`}>
                            <stat.icon size={28} className="text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "noten" && <NotesUpload role={role} />}
              {activeTab === "ziele" && <Goals role={role} />}
              {activeTab === "kalender" && <ModernerKalender role={role} />}
              {activeTab === "tickets" && <TicketSales role={role} />}
            </div>
          </section>

          <div className="h-32" />

          {/* FOOTER - Enhanced */}
          <footer className="border-t border-white/10 bg-black/60 backdrop-blur-3xl">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-12">
                  <div className="text-lg font-black tracking-tight text-white">LYRIONA</div>
                  <div className="flex items-center gap-8 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors font-medium">Über uns</a>
                    <a href="#" className="hover:text-white transition-colors font-medium">Kontakt</a>
                    <a href="#" className="hover:text-white transition-colors font-medium">Hilfe</a>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  © 2025 LYRIONA. Crafted with <span className="text-[#FFD700]">❤️</span> for musicians.
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes aurora-1 {
          0%, 100% { transform: translateX(-10%) translateY(0) scaleX(1); }
          50% { transform: translateX(10%) translateY(-30px) scaleX(1.15); }
        }

        @keyframes aurora-2 {
          0%, 100% { transform: translateX(15%) translateY(0) scaleX(1); }
          50% { transform: translateX(-15%) translateY(40px) scaleX(1.2); }
        }

        @keyframes aurora-3 {
          0%, 100% { transform: translateX(-8%) translateY(0) scaleX(1); }
          50% { transform: translateX(8%) translateY(-20px) scaleX(1.12); }
        }

        @keyframes aurora-4 {
          0%, 100% { transform: translateX(12%) translateY(0) scaleX(1); }
          50% { transform: translateX(-12%) translateY(35px) scaleX(1.18); }
        }

        @keyframes aurora-5 {
          0%, 100% { transform: rotate(0deg) translateX(-5%) scaleX(1); }
          50% { transform: rotate(2deg) translateX(5%) scaleX(1.1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
            transform: translateY(-50vh) translateX(30px) scale(1.1);
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) scale(0.8);
            opacity: 0;
          }
        }

        .animate-particle-float {
          animation: particle-float linear infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(255,215,0,0.5); }
          50% { opacity: 0.8; box-shadow: 0 0 20px rgba(255,215,0,0.8); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-aurora-1 { animation: aurora-1 18s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora-2 22s ease-in-out infinite; }
        .animate-aurora-3 { animation: aurora-3 25s ease-in-out infinite; }
        .animate-aurora-4 { animation: aurora-4 20s ease-in-out infinite; }
        .animate-aurora-5 { animation: aurora-5 30s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}