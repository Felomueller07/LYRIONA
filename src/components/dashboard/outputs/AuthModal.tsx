"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      if (formData.username === "admin" && formData.password === "4321") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("username", "admin");
        window.location.href = "/dashboard?role=admin";
        return;
      }
      
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const user = users.find(
        (u: any) => u.username === formData.username && u.password === formData.password
      );
      
      if (user) {
        localStorage.setItem("userRole", "visitor");
        localStorage.setItem("username", user.username);
        localStorage.setItem("userEmail", user.email);
        window.location.href = "/dashboard?role=visitor";
      } else {
        alert("❌ Falscher Benutzername oder Passwort!");
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        alert("⚠️ Bitte alle Felder ausfüllen!");
        return;
      }
      
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userExists = users.some((u: any) => u.username === formData.username);
      
      if (userExists) {
        alert("❌ Dieser Benutzername ist bereits vergeben!");
        return;
      }
      
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        verified: false,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      
      alert(`✅ Registrierung erfolgreich!\n\n📧 Bestätigungslink wurde an ${formData.email} gesendet.`);
      
      localStorage.setItem("userRole", "visitor");
      localStorage.setItem("username", newUser.username);
      localStorage.setItem("userEmail", newUser.email);
      window.location.href = "/dashboard?role=visitor";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Glass Container */}
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-2xl">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-t-[32px]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={20} />
            </button>

            {/* Logo & Title */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] mb-6 shadow-xl shadow-[#FFD700]/30"
              >
                <Sparkles size={28} className="text-black" />
              </motion.div>

              <h2 className="text-3xl font-black tracking-tight mb-2">
                {mode === "login" ? (
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Willkommen zurück
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                    Konto erstellen
                  </span>
                )}
              </h2>
              <p className="text-gray-400 text-sm">
                {mode === "login" 
                  ? "Melde dich an um fortzufahren" 
                  : "Erstelle dein kostenloses Konto"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Benutzername
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                    placeholder="dein_benutzername"
                    required
                  />
                </div>
              </div>

              {/* Email (nur bei Register) */}
              <AnimatePresence>
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      E-Mail
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                        placeholder="deine@email.com"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Passwort
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all backdrop-blur-xl"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password */}
              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-[#FFD700] hover:text-[#FFA500] transition-colors font-medium"
                  >
                    Passwort vergessen?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#FFD700]/30"
              >
                {mode === "login" ? "Anmelden" : "Konto erstellen"}
                <ArrowRight size={18} />
              </motion.button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                {mode === "login" ? "Noch kein Konto?" : "Hast du schon ein Konto?"}
                {" "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-[#FFD700] hover:text-[#FFA500] font-bold transition-colors"
                >
                  {mode === "login" ? "Registrieren" : "Anmelden"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}