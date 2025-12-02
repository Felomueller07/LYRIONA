"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const consent = localStorage.getItem("lyriona_cookie_consent");
    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("lyriona_cookie_consent", "all");
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("lyriona_cookie_consent", "necessary");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 animate-slide-up">
        {/* Icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <Cookie size={24} className="text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">🍪 Cookie-Einstellungen</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. Einige sind technisch 
              notwendig (z.B. für den Sitzplan), andere helfen uns, unseren Service zu verbessern.
            </p>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="space-y-3 mb-6">
          {/* Necessary */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Notwendige Cookies
              </h4>
              <span className="text-xs text-green-500 font-semibold">IMMER AKTIV</span>
            </div>
            <p className="text-gray-400 text-sm">
              Diese Cookies sind für den Betrieb der Website erforderlich (z.B. Sitzplatz-Auswahl, 
              Login-Session).
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                Zahlungs-Cookies (Stripe)
              </h4>
              <span className="text-xs text-gray-400">EMPFOHLEN</span>
            </div>
            <p className="text-gray-400 text-sm">
              Stripe setzt Cookies zur sicheren Zahlungsabwicklung und Betrugsprävention. 
              Ohne diese können Sie keine Tickets kaufen.
            </p>
          </div>
        </div>

        {/* Info Links */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-300">
            Weitere Informationen finden Sie in unserer{" "}
            <a href="/datenschutz" target="_blank" className="text-[#FFD700] hover:underline font-semibold">
              Datenschutzerklärung
            </a>
            {" "}und den{" "}
            <a href="/agb" target="_blank" className="text-[#FFD700] hover:underline font-semibold">
              AGB
            </a>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={acceptNecessary}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
          >
            Nur notwendige
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#FFA500] hover:to-[#FFD700] text-black rounded-xl font-bold transition-all shadow-lg shadow-[#FFD700]/30"
          >
            Alle akzeptieren
          </button>
        </div>

        {/* Small Print */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Durch Klicken auf „Alle akzeptieren" stimmen Sie der Verwendung aller Cookies zu.
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}