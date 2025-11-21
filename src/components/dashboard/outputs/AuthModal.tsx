"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, mode: initialMode }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "login") {
      // ADMIN Login
      if (formData.username === "admin" && formData.password === "4321") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("username", "admin");
        window.location.href = "/dashboard?role=admin";
        return;
      }
      
      // Andere User Login - prüfe ob registriert
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const user = users.find(
        (u: any) => u.username === formData.username && u.password === formData.password
      );
      
      if (user) {
        // User existiert → Visitor-Modus
        localStorage.setItem("userRole", "visitor");
        localStorage.setItem("username", user.username);
        localStorage.setItem("userEmail", user.email);
        window.location.href = "/dashboard?role=visitor";
      } else {
        alert("❌ Falscher Benutzername oder Passwort!");
      }
    } else {
      // REGISTER Logic
      if (!formData.username || !formData.email || !formData.password) {
        alert("⚠️ Bitte alle Felder ausfüllen!");
        return;
      }
      
      // Prüfe ob Username schon existiert
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userExists = users.some((u: any) => u.username === formData.username);
      
      if (userExists) {
        alert("❌ Dieser Benutzername ist bereits vergeben!");
        return;
      }
      
      // Speichere neuen User
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        verified: false, // Für Phase 2: Email-Verifizierung
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      
      // Info-Message
      alert(`✅ Registrierung erfolgreich!\n\n📧 Bestätigungslink wurde an ${formData.email} gesendet.\n\n(Phase 1: Du kannst dich jetzt direkt anmelden)`);
      
      // Automatisch einloggen als Visitor
      localStorage.setItem("userRole", "visitor");
      localStorage.setItem("username", newUser.username);
      localStorage.setItem("userEmail", newUser.email);
      window.location.href = "/dashboard?role=visitor";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#FFD700]/20 rounded-2xl p-8 shadow-[0_0_60px_rgba(255,215,0,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#C0C0C0] hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent mb-2">
            {mode === "login" ? "Willkommen zurück" : "Registrieren"}
          </h2>
          <p className="text-[#C0C0C0] text-sm">
            {mode === "login" 
              ? "Melde dich an um fortzufahren" 
              : "Erstelle dein kostenloses Konto"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
              Benutzername
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0C0C0]" size={20} />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#808080] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                placeholder="dein_benutzername"
                required
              />
            </div>
          </div>

          {/* Email (nur bei Register) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
                E-Mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0C0C0]" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#808080] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  placeholder="deine@email.com"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0C0C0]" size={20} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#808080] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Forgot Password (nur bei Login) */}
          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#FFD700] hover:text-[#FFA500] transition-colors"
              >
                Passwort vergessen?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
          >
            {mode === "login" ? "Anmelden" : "Konto erstellen"}
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-[#C0C0C0] text-sm">
            {mode === "login" ? "Noch kein Konto?" : "Hast du schon ein Konto?"}
            {" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#FFD700] hover:text-[#FFA500] font-semibold transition-colors"
            >
              {mode === "login" ? "Registrieren" : "Anmelden"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}