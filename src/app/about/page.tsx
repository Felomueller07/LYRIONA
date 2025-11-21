"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Music, Code, Coffee, Zap } from "lucide-react";

export default function AboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Cursor Follower */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#FFD700]/5 via-[#FFA500]/3 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/4 via-white/2 to-transparent rounded-full blur-3xl animate-float-delayed" />
        
        {/* Gold particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#D4AF37' : '#FFA500',
              opacity: 0.2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,215,0,0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,215,0,0.15) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Back Button */}
      <div className="relative z-20 pt-8 pb-4">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFA500] transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Zurück zur Startseite</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#FFD700]" />
                <span className="text-[#FFD700] text-xs tracking-[0.3em] font-light uppercase">
                  Über den Mastermind
                </span>
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#FFD700]" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                Felix Müller
              </span>
            </h1>

            {/* Titel - Ohne Emojis, professionell aber ironisch */}
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              <span className="px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700]/40 rounded-lg text-[#FFD700] font-bold text-base tracking-wide">
                MR.
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700]/40 rounded-lg text-[#FFD700] font-bold text-base tracking-wide">
                Dr. phil.
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700]/40 rounded-lg text-[#FFD700] font-bold text-base tracking-wide">
                Dipl.-Ing.
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700]/40 rounded-lg text-[#FFD700] font-bold text-base tracking-wide">
                MBA
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700]/40 rounded-lg text-[#FFD700] font-bold text-base tracking-wide">
                h.c.
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FFD700]/40 rounded-lg text-[#FFD700] font-bold text-base tracking-wide">
                geiler typ/zopfen
              </span>
            </div>
          </div>

          {/* Card mit Bild & Text */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#FFD700]/20 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(255,215,0,0.15)] animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Bild Platzhalter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative aspect-square bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-2xl border-2 border-[#FFD700]/40 overflow-hidden flex items-center justify-center">
                  {/* Platzhalter für dein Bild */}
                  <div className="text-center p-8">
                    <Music size={80} className="text-[#FFD700] mx-auto mb-4 opacity-40" />
                    <p className="text-[#808080] text-sm">
                      Dein geiles Foto<br />kommt hier hin! 📸
                    </p>
                  </div>
                  {/* Wenn du dein Bild einfügst, ersetze den div oben mit:
                  <Image
                    src="/images/felix-photo.jpg"
                    alt="Felix Müller"
                    fill
                    className="object-cover"
                  />
                  */}
                </div>
              </div>

              {/* Text */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="text-[#FFD700]" size={24} />
                  <h2 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                      Wer ist dieser<br />
                      mysteriöse Typ?
                    </span>
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none">
                 
                  <p className="text-[#E8E8E8] text-lg leading-relaxed mb-4">
                    Jo griast enk a von meiner seite.
                  </p>
                  
                  <p className="text-[#C0C0C0] leading-relaxed mb-4">
                    Zu meiner person isch net viel zu sogen. I bin Hansele Tresn Sepp im sein jüngster. Man munkelt olls wos es do segs 
                    isch net gonz aloan von mir selber gmocht gworten. Hell sein Gschichten aus 
                    Paulaner Gorten. 🍺
                  </p>

                  <p className="text-[#C0C0C0] leading-relaxed mb-6">
                    Auf der Seite do tua i lei bissl ummermergln und 
                    poor sochen probieren. I verstea jo selber an tubo, 
                    weil i koch a lei mit Wosser. 💧
                  </p>

                  {/* Fun Facts */}
                  <div className="grid gap-3 mt-8">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Music className="text-[#FFD700]" size={20} />
                      <span className="text-[#E8E8E8]">Musiker aus alkoholischen Vorteilen</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Code className="text-[#FFD700]" size={20} />
                      <span className="text-[#E8E8E8]">Hobby-Programmierer (stimmp eigentlich net kling ober guat)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Coffee className="text-[#FFD700]" size={20} />
                      <span className="text-[#E8E8E8]">Professional (also warm) Müsli Cooking Star Cook</span>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="pt-6">
                  <a
                    href="mailto:felix@lyriona.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all hover:scale-105"
                  >
                    <Mail size={18} />
                    Schreib mir mal
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Quote */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="inline-block p-6 bg-gradient-to-r from-[#FFD700]/5 to-[#FFA500]/5 border border-[#FFD700]/20 rounded-2xl">

              <p className="text-[#FFD700] text-xl font-bold italic">
                Donkschian fürs zuschaugen und auflousn!
              </p>
              <p className="text-[#808080] text-sm mt-2">– enker Felix</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-[#808080] text-sm mt-20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-[#FFA500] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
        © 2025 LYRIONA – gmocht mit Wosser 💧
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-120deg); }
          66% { transform: translate(20px, -20px) rotate(-240deg); }
        }

        @keyframes particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(var(--x, 100px), var(--y, 100px)); opacity: 0.4; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-particle {
          animation: particle 15s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}