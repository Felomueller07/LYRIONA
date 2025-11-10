"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Music, Sparkles, ArrowRight, Lock, Eye } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<"none" | "admin" | "visitor">("none");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function handleLogin() {
    if (loginMode === "admin") {
      if (username === "admin" && password === "1234") {
        router.push("/dashboard?role=admin");
      } else {
        setError("Falscher Benutzername oder Passwort");
      }
    } else if (loginMode === "visitor") {
      router.push("/dashboard?role=visitor");
    }
  }

  function handleVisitorLogin() {
    router.push("/dashboard?role=visitor");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1f] text-white font-[system-ui]">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-50">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{
            animationDelay: "1s",
            transform: `translate(${-mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{
            animationDelay: "2s",
            transform: `translate(${mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo/Badge */}
        <div className="mb-8 animate-float relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
          <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-500/10 p-1 shadow-2xl shadow-yellow-500/50 backdrop-blur-sm border border-yellow-500/30">
            <div className="w-full h-full rounded-xl bg-[#0a0a1f]/80 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/lyriona-logo.png" 
                alt="LYRIONA Logo" 
                className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
              />
            </div>
          </div>
          {/* Rotating rings */}
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-500/20 animate-spin-slow" style={{ animationDuration: "8s" }} />
          <div className="absolute inset-2 rounded-2xl border-2 border-orange-500/20 animate-spin-slow" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
        </div>

        {/* Hero Section */}
        {!showLogin && (
          <section className="text-center max-w-4xl animate-fade-in">
            <div className="mb-6 flex items-center justify-center gap-2">
              <Sparkles size={20} className="text-purple-400 animate-pulse" />
              <span className="text-purple-400 uppercase text-sm font-semibold tracking-wider">
                Willkommen bei
              </span>
              <Sparkles size={20} className="text-pink-400 animate-pulse" />
            </div>

            <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              LYRIONA
            </h1>

            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Die <span className="text-purple-400 font-semibold">moderne Plattform</span> für
              dein Musik-Management
            </p>

            <p className="text-gray-400 mb-12 max-w-xl mx-auto">
              Verwalte deine Noten, tracke deine Ziele und organisiere deine Termine –
              alles an einem Ort.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowLogin(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75 hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <span>Jetzt Starten</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300">
                Mehr erfahren
              </button>
            </div>

            {/* Feature Pills */}
            <div className="mt-16 flex flex-wrap gap-3 justify-center">
              {["🎵 Noten verwalten", "🎯 Ziele tracken", "📅 Termine planen"].map(
                (feature, i) => (
                  <div
                    key={i}
                    className="px-5 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {feature}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1f] p-1 rounded-3xl max-w-md w-full shadow-2xl shadow-purple-500/20 animate-scale-in">
              <div className="bg-[#0a0a1f] rounded-3xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-1 mx-auto mb-4 shadow-lg shadow-purple-500/50">
                    <div className="w-full h-full rounded-xl bg-[#0a0a1f] flex items-center justify-center">
                      <Lock size={24} className="text-purple-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Anmeldung
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">
                    Wähle deinen Zugangstyp
                  </p>
                </div>

                {/* Login Mode Selection */}
                {loginMode === "none" && (
                  <div className="space-y-4 animate-fade-in">
                    <button
                      onClick={() => setLoginMode("admin")}
                      className="group w-full p-5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Lock size={20} />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-lg">Administrator</div>
                          <div className="text-sm text-gray-400">Voller Zugriff</div>
                        </div>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-purple-400 group-hover:translate-x-1 transition-transform"
                      />
                    </button>

                    <button
                      onClick={handleVisitorLogin}
                      className="group w-full p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Eye size={20} />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-lg">Besucher</div>
                          <div className="text-sm text-gray-400">Nur Ansicht</div>
                        </div>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-blue-400 group-hover:translate-x-1 transition-transform"
                      />
                    </button>

                    <button
                      onClick={() => setShowLogin(false)}
                      className="w-full py-3 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                )}

                {/* Admin Login Form */}
                {loginMode === "admin" && (
                  <div
                    className="space-y-5 animate-fade-in"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin();
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Benutzername
                      </label>
                      <input
                        type="text"
                        placeholder="admin"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setError("");
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Passwort
                      </label>
                      <input
                        type="password"
                        placeholder="••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center animate-shake">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setLoginMode("none");
                          setError("");
                          setUsername("");
                          setPassword("");
                        }}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={handleLogin}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold shadow-lg shadow-purple-500/50 transition-all hover:scale-105"
                      >
                        Anmelden
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
        © 2025 LYRIONA. Crafted with 💜
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}