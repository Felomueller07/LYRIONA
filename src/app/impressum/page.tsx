import React from "react";
import { Scale } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <a href="/" className="text-2xl font-bold">
            <span className="text-white">LYRI</span>
            <span className="text-[#FFD700]">ONA</span>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="bg-gradient-to-br from-zinc-900/80 to-black/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-2xl flex items-center justify-center mb-6">
            <Scale size={32} className="text-black" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-8">Impressum</h1>

          {/* Verantwortlich */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2 text-gray-300">
              <p className="text-lg font-semibold text-white">Bürgerkapelle Untermais</p>
              <p>Romstraße 203/a</p>
              <p>39012 Meran (BZ) – Italien</p>
            </div>
          </section>

          {/* Kontakt */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Kontakt</h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-white font-semibold">E-Mail:</span>{" "}
                <a href="mailto:info@bku.it" className="text-[#FFD700] hover:underline">
                  info@bku.it
                </a>
              </p>
              <p>
                <span className="text-white font-semibold">Test-E-Mail:</span>{" "}
                <a href="mailto:felo.mueller.007@gmail.com" className="text-[#FFD700] hover:underline">
                  felo.mueller.007@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Registrierung */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Registrierung</h2>
            <div className="space-y-2 text-gray-300">
              <p>Eingetragen im Landesverzeichnis der ehrenamtlich tätigen Organisationen</p>
              <p className="text-sm">
                Dekret 114/1.1. vom 18.8.1999 - Str. Nr.: 82007470212 (Transparenzpflicht)
              </p>
            </div>
          </section>

          {/* Verantwortlich für Inhalt */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Verantwortlich für den Inhalt</h2>
            <div className="space-y-2 text-gray-300">
              <p>Bürgerkapelle Untermais</p>
              <p>Romstraße 203/a, 39012 Meran (BZ) – Italien</p>
            </div>
          </section>

          {/* Haftungsausschluss */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Haftungsausschluss</h2>
            
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">Haftung für Inhalte</h3>
            <p className="text-gray-300 mb-4">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich.
            </p>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">Haftung für Links</h3>
            <p className="text-gray-300 mb-4">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
              Seiten verantwortlich.
            </p>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">Urheberrecht</h3>
            <p className="text-gray-300">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          {/* Online-Streitbeilegung */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Online-Streitbeilegung</h2>
            <p className="text-gray-300 mb-2">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <a 
              href="https://ec.europa.eu/consumers/odr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            <p className="text-gray-300 mt-2">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          {/* Back Button */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all"
            >
              ← Zurück zur Startseite
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Bürgerkapelle Untermais. Alle Rechte vorbehalten.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/impressum" className="hover:text-[#FFD700] transition-colors">Impressum</a>
            <a href="/datenschutz" className="hover:text-[#FFD700] transition-colors">Datenschutz</a>
            <a href="/agb" className="hover:text-[#FFD700] transition-colors">AGB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}