import React from "react";
import { Shield } from "lucide-react";

export default function DatenschutzPage() {
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
            <Shield size={32} className="text-black" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-8">Datenschutzerklärung</h1>

          {/* Einleitung */}
          <section className="mb-8">
            <p className="text-gray-300 mb-4">
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre 
              Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).
            </p>
            <p className="text-gray-300">
              In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der 
              Datenverarbeitung im Rahmen unserer Ticket-Verkaufsplattform.
            </p>
          </section>

          {/* Verantwortlicher */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Verantwortlicher</h2>
            <div className="text-gray-300 space-y-1">
              <p className="font-semibold text-white">Bürgerkapelle Untermais</p>
              <p>Romstraße 203/a</p>
              <p>39012 Meran (BZ) – Italien</p>
              <p className="mt-2">
                E-Mail: <a href="mailto:info@bku.it" className="text-[#FFD700] hover:underline">info@bku.it</a>
              </p>
            </div>
          </section>

          {/* Welche Daten */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Welche Daten erheben wir?</h2>
            
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">1. Ticket-Kauf</h3>
            <p className="text-gray-300 mb-2">Bei der Buchung eines Tickets erheben wir:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (optional)</li>
              <li>Gewählter Sitzplatz</li>
              <li>Zahlungsinformationen (über Stripe verarbeitet)</li>
              <li>Zeitstempel der Buchung</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">2. Technische Daten</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Browser-Typ und Version</li>
              <li>Verwendetes Betriebssystem</li>
              <li>IP-Adresse (anonymisiert)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">3. LocalStorage</h3>
            <p className="text-gray-300">
              Wir speichern den Status verkaufter Sitzplätze lokal in Ihrem Browser (LocalStorage), 
              um die Verfügbarkeit in Echtzeit anzuzeigen. Diese Daten bleiben auf Ihrem Gerät.
            </p>
          </section>

          {/* Zweck */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Wofür nutzen wir Ihre Daten?</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Abwicklung Ihrer Ticket-Bestellung</li>
              <li>Zusendung des QR-Code-Tickets per E-Mail</li>
              <li>Zahlungsabwicklung über Stripe</li>
              <li>Kommunikation bezüglich Ihrer Bestellung</li>
              <li>Einhaltung gesetzlicher Aufbewahrungsfristen</li>
              <li>Verbesserung unserer Dienstleistung</li>
            </ul>
          </section>

          {/* Rechtsgrundlage */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Rechtsgrundlage</h2>
            <p className="text-gray-300 mb-2">
              Die Verarbeitung erfolgt auf Grundlage von:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
              <li>Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
            </ul>
          </section>

          {/* Speicherdauer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Wie lange speichern wir Ihre Daten?</h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-white font-semibold">Ticket-Daten:</span> Event-Datum + 30 Tage
              </p>
              <p>
                <span className="text-white font-semibold">Rechnungsdaten:</span> 10 Jahre (gesetzliche Aufbewahrungspflicht)
              </p>
              <p>
                <span className="text-white font-semibold">E-Mail-Korrespondenz:</span> 3 Jahre
              </p>
              <p>
                <span className="text-white font-semibold">LocalStorage:</span> Bis zur manuellen Löschung durch den Nutzer
              </p>
            </div>
          </section>

          {/* Drittanbieter */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Weitergabe an Dritte</h2>
            
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">Stripe (Zahlungsdienstleister)</h3>
            <p className="text-gray-300 mb-2">
              Für die Zahlungsabwicklung nutzen wir Stripe, Inc. (USA). Stripe verarbeitet Ihre 
              Zahlungsinformationen gemäß den Datenschutzbestimmungen von Stripe:
            </p>
            <a 
              href="https://stripe.com/de/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:underline"
            >
              https://stripe.com/de/privacy
            </a>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">E-Mail-Versand</h3>
            <p className="text-gray-300">
              Tickets werden per E-Mail versendet. Der E-Mail-Versand erfolgt über unseren Hosting-Provider.
            </p>
          </section>

          {/* Ihre Rechte */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Ihre Rechte</h2>
            <p className="text-gray-300 mb-4">
              Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, 
              Datenübertragbarkeit, Widerruf und Widerspruch zu.
            </p>
            
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-1">Auskunftsrecht</h4>
                <p className="text-gray-300 text-sm">
                  Sie haben das Recht, Auskunft über Ihre gespeicherten Daten zu erhalten.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-1">Recht auf Berichtigung</h4>
                <p className="text-gray-300 text-sm">
                  Sie haben das Recht, unrichtige Daten berichtigen zu lassen.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-1">Recht auf Löschung</h4>
                <p className="text-gray-300 text-sm">
                  Sie haben das Recht auf Löschung Ihrer Daten („Recht auf Vergessenwerden"), 
                  sofern keine gesetzlichen Aufbewahrungsfristen bestehen.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-1">Recht auf Datenübertragbarkeit</h4>
                <p className="text-gray-300 text-sm">
                  Sie haben das Recht, Ihre Daten in einem strukturierten Format zu erhalten.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-1">Widerspruchsrecht</h4>
                <p className="text-gray-300 text-sm">
                  Sie haben das Recht, der Datenverarbeitung zu widersprechen.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-1">Beschwerderecht</h4>
                <p className="text-gray-300 text-sm">
                  Sie haben das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren.
                </p>
              </div>
            </div>

            <p className="text-gray-300 mt-4">
              Für die Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
              <a href="mailto:info@bku.it" className="text-[#FFD700] hover:underline">
                info@bku.it
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Cookies und LocalStorage</h2>
            
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">Technisch notwendige Speicherung</h3>
            <p className="text-gray-300 mb-2">
              Wir verwenden LocalStorage (Browser-Speicher) um:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Status verkaufter Sitzplätze anzuzeigen</li>
              <li>Ihre Sitzplatz-Auswahl während des Buchungsprozesses zu speichern</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Diese Speicherung ist technisch notwendig für den Betrieb der Plattform und 
              erfordert keine Einwilligung gemäß Art. 6 Abs. 1 lit. f DSGVO.
            </p>

            <h3 className="text-lg font-semibold text-white mb-2 mt-4">Stripe Cookies</h3>
            <p className="text-gray-300">
              Stripe setzt Cookies zur Betrugsprävention und sicheren Zahlungsabwicklung. 
              Details finden Sie in der Stripe-Datenschutzerklärung.
            </p>
          </section>

          {/* Datensicherheit */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Datensicherheit</h2>
            <p className="text-gray-300 mb-2">
              Wir treffen umfangreiche technische und organisatorische Sicherheitsmaßnahmen:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>SSL/TLS-Verschlüsselung der gesamten Website</li>
              <li>Sichere Datenübertragung an Stripe</li>
              <li>Keine Speicherung von Kreditkartendaten auf unseren Servern</li>
              <li>Regelmäßige Sicherheitsupdates</li>
              <li>Zugriffsbeschränkungen für Mitarbeiter</li>
            </ul>
          </section>

          {/* Kontakt */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Kontakt Datenschutz</h2>
            <p className="text-gray-300 mb-2">
              Bei Fragen zum Datenschutz kontaktieren Sie uns:
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-gray-300">
                <span className="text-white font-semibold">E-Mail:</span>{" "}
                <a href="mailto:info@bku.it" className="text-[#FFD700] hover:underline">
                  info@bku.it
                </a>
              </p>
              <p className="text-gray-300 mt-1">
                <span className="text-white font-semibold">Adresse:</span> Romstraße 203/a, 39012 Meran (BZ)
              </p>
            </div>
          </section>

          {/* Änderungen */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Änderungen</h2>
            <p className="text-gray-300">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
              aktuellen rechtlichen Anforderungen entspricht.
            </p>
            <p className="text-gray-300 mt-2">
              <span className="text-white font-semibold">Stand:</span> {new Date().toLocaleDateString('de-DE')}
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