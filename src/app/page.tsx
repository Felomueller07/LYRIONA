"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Music, Target, Calendar, TrendingUp, Users, Zap, Shield, Award } from "lucide-react";
import AuthModal from "@/components/dashboard/outputs/AuthModal";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" }>({
    isOpen: false,
    mode: "login",
  });
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generiere Partikel NUR EINMAL beim Mount
  const [particles] = useState(() => {
    const colors = ['#FFD700', '#D4AF37', '#FFA500', '#FFFFFF', '#E8E8E8', '#C0C0C0'];
    return [...Array(50)].map((_, i) => {
      const colorIndex = i % colors.length;
      const color = colors[colorIndex];
      const size = Math.random() * 2.5 + 0.5;
      const isGold = colorIndex < 3;
      
      return {
        id: i,
        color,
        size,
        opacity: isGold ? 0.25 : 0.20,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 10 + Math.random() * 15,
      };
    });
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Cursor Follower - Weißer subtiler Glow - SMOOTH */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-50 transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Animated Background - Mehr Silber/Weiß, weniger Gold */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large flowing shapes - Silber-dominant */}
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-white/4 via-[#E8E8E8]/2 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#C0C0C0]/5 via-white/3 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#D4AF37]/2 via-transparent to-white/4 rounded-full blur-3xl animate-float-slow" />

        {/* Mixed particles - Mehr Gold */}
        {mounted && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}

        {/* Silberne/Weiße Linien */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/8 to-transparent animate-pulse-slow"
            style={{
              top: `${15 + i * 14}%`,
              width: "100%",
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Overlay - Weiß */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Navigation - Clean & Modern */}
      <nav className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                <Image
                  src="/images/lyriona-logo.png"
                  alt="LYRIONA Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent tracking-tight">
                LYRIONA
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold">
                Home
              </a>
              <a href="#features" className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold">
                Features
              </a>
              <Link 
                href="/about" 
                className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold"
              >
                Über uns
              </Link>
              <a href="#contact" className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold">
                Kontakt
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* Anmelden Button */}
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg sm:rounded-xl transition-all hover:scale-105 text-sm sm:text-base shadow-lg"
              >
                Anmelden
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-[#FFD700] transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-fade-in">
              <div className="flex flex-col gap-3">
                <a 
                  href="#home" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  Home
                </a>
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  Features
                </a>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  Über uns
                </Link>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-[#FFD700] transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-white/5"
                >
                  Kontakt
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 pt-20 md:pt-32 pb-12 md:pb-20" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Logo - Mehr Gold Glow */}
            <div className="mb-8 md:mb-12 flex justify-center">
              <div className="relative w-28 h-28 md:w-40 md:h-40 group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/50 via-[#FFA500]/30 to-[#FFD700]/50 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse-glow" />
                <div className="relative w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2rem] border border-[#FFD700]/20 p-4 md:p-6 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/lyriona-logo.png"
                    alt="LYRIONA"
                    fill
                    className="object-contain p-4 md:p-6"
                  />
                </div>
              </div>
            </div>

            {/* Ornament - Gold */}
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8 animate-fade-in">
              <div className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <span className="text-[#D4AF37] text-[0.65rem] md:text-xs tracking-[0.3em] md:tracking-[0.4em] font-light">WILLKOMMEN BEI</span>
              <div className="w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>

            {/* Title - Komplett Gold mit Animation - Responsive */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 leading-none animate-title-appear px-4">
              <span 
                className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
                style={{
                  filter: "drop-shadow(0 0 40px rgba(255,215,0,0.4))",
                }}
              >
                LYRIONA
              </span>
            </h1>

            {/* Subtitle - Silber mit Gold Akzent */}
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-6 font-light animate-fade-in-up px-4" style={{ animationDelay: "0.2s" }}>
              Die <span className="text-[#FFD700] font-medium">moderne</span> Plattform
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-8 md:mb-12 font-light animate-fade-in-up px-4" style={{ animationDelay: "0.3s" }}>
              für dein Musik-Management
            </p>

            <p className="text-[#C0C0C0] max-w-2xl mx-auto mb-10 md:mb-16 text-sm sm:text-base md:text-lg leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: "0.4s" }}>
              Verwalte deine Noten, tracke deine Ziele und organisiere deine Termine – alles an einem Ort.
              <br className="hidden sm:block" />
              <span className="text-white/60">Elegant. Effizient. Für Musiker gemacht.</span>
            </p>

            {/* Button - Registrierung */}
            <div className="flex items-center justify-center mb-12 md:mb-20 animate-fade-in-up px-4" style={{ animationDelay: "0.5s" }}>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
                className="group px-8 py-4 md:px-10 md:py-5 bg-white hover:bg-[#E8E8E8] text-black font-bold rounded-xl transition-all hover:scale-105 flex items-center gap-2 md:gap-3 text-base md:text-lg shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
              >
                Jetzt Starten
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                Alles was du brauchst
              </span>
            </h2>
            <p className="text-[#C0C0C0] text-xl max-w-2xl mx-auto">
              Eine komplette Lösung für Musiker, um organisiert und fokussiert zu bleiben
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Music,
                title: "Noten-Bibliothek",
                description: "Verwalte all deine Noten digital. Durchsuchbar, organisiert und immer griffbereit.",
              },
              {
                icon: Target,
                title: "Ziel-Tracking",
                description: "Setze dir Übungsziele und tracke deinen Fortschritt. Bleib motiviert und sieh deine Entwicklung.",
              },
              {
                icon: Calendar,
                title: "Termin-Manager",
                description: "Behalte den Überblick über Proben, Auftritte und Unterricht. Synchronisiert mit Google Calendar.",
              },
              {
                icon: TrendingUp,
                title: "Fortschritts-Analyse",
                description: "Visualisiere deine Übungszeit und erkenne Trends. Datengetrieben zum Erfolg.",
              },
              {
                icon: Users,
                title: "Team-Features",
                description: "Perfekt für Orchester und Ensembles. Koordiniere mit deinem Team.",
              },
              {
                icon: Shield,
                title: "Sicher & Privat",
                description: "Deine Daten sind verschlüsselt und geschützt. Datenschutz made in Europe.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-xl hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/15 transition-transform">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-[#C0C0C0] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Aktive Musiker", icon: Users },
              { number: "50K+", label: "Noten verwaltet", icon: Music },
              { number: "99.9%", label: "Uptime", icon: Zap },
              { number: "#1", label: "In Österreich", icon: Award },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-[#FFD700]/30 transition-all hover:scale-105"
              >
                <stat.icon size={40} className="text-[#C0C0C0] mx-auto mb-4" />
                <div className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-[#C0C0C0] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Gold Akzent */}
      <section className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            Bereit durchzustarten?
          </h2>
          <p className="text-[#C0C0C0] text-xl mb-12 leading-relaxed">
            Tritt der Community bei und bringe dein Musik-Management auf das nächste Level.
            <br />
            <span className="text-white/60">Kostenlos starten. Keine Kreditkarte erforderlich.</span>
          </p>
          <button
            onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all hover:scale-110 shadow-[0_20px_60px_rgba(255,215,0,0.2)] text-lg"
          >
            Jetzt kostenlos starten
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#FFD700]" />
                <span className="text-[#FFD700] text-xs tracking-[0.3em] font-light uppercase">
                  Kontakt
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#FFD700]" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                Lass uns reden
              </span>
            </h2>
            <p className="text-[#C0C0C0] text-lg">
              Fragen, Feedback oder oanfoch lei an ratscher mochen? 🎺
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 rounded-2xl hover:border-[#FFD700]/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Email</h3>
                    <a href="mailto:felo.mueller.007@gmail.com" className="text-[#FFD700] hover:text-[#FFA500] transition-colors">
                      felo.mueller.007@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 rounded-2xl hover:border-[#FFD700]/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Location</h3>
                    <p className="text-[#C0C0C0]">
                      Hafling, Südtirol
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 rounded-2xl hover:border-[#FFD700]/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Response Time</h3>
                    <p className="text-[#C0C0C0]">
                      Meist innerhalb von 24 Stunden
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 rounded-2xl">
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                window.location.href = `mailto:felo.mueller.007@gmail.com?subject=Nachricht von ${name}&body=${message}%0A%0AMeine Email: ${email}`;
              }}>
                <div>
                  <label className="block text-[#E8E8E8] text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-[#808080] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                    placeholder="Dein Name"
                  />
                </div>

                <div>
                  <label className="block text-[#E8E8E8] text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-[#808080] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                    placeholder="deine@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[#E8E8E8] text-sm font-semibold mb-2">
                    Nachricht
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-[#808080] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all resize-none"
                    placeholder="Deine Nachricht..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Nachricht senden
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/images/lyriona-logo.png"
                  alt="LYRIONA"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                LYRIONA
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
              <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
            </div>

            <p className="text-[#808080] text-sm">© 2025 LYRIONA – crafted with ❤️ for musicians</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
      />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-40px, 30px) rotate(-8deg); }
          66% { transform: translate(30px, -20px) rotate(8deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }

        @keyframes particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes title-appear {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 30s ease-in-out infinite; }
        .animate-particle { animation: particle linear infinite; }
        .animate-gradient { animation: gradient 3s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-title-appear { animation: title-appear 1s ease-out; }
      `}</style>
    </div>
  );
}