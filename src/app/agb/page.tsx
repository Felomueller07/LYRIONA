import React from "react";
import { FileText } from "lucide-react";

export default function AGBPage() {
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
            <FileText size={32} className="text-black" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>

          {/* 1. Geltungsbereich */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 1 Geltungsbereich</h2>
            <p className="text-gray-300 mb-2">
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über den Verkauf von 
              Eintrittskarten für Veranstaltungen, die über die Website LYRIONA abgeschlossen werden.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4">
              <p className="text-white font-semibold mb-1">Veranstalter:</p>
              <p className="text-gray-300">Bürgerkapelle Untermais</p>
              <p className="text-gray-300">Romstraße 203/a</p>
              <p className="text-gray-300">39012 Meran (BZ) – Italien</p>
              <p className="text-gray-300 mt-2">E-Mail: info@bku.it</p>
            </div>
          </section>

          {/* 2. Vertragsgegenstand */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 2 Vertragsgegenstand</h2>
            <p className="text-gray-300 mb-2">
              Gegenstand des Vertrages ist der Verkauf von Eintrittskarten für folgende Veranstaltung:
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-white font-semibold text-lg">Josefi Konzert</p>
              <p className="text-gray-300 mt-1">📍 Kursaal Meran</p>
              <p className="text-gray-300">📅 22. März 2026</p>
              <p className="text-gray-300 mt-2">💰 Preis: 50,00 € pro Ticket (inkl. MwSt.)</p>
            </div>
            <p className="text-gray-300 mt-4">
              Mit dem Kauf eines Tickets erwirbt der Käufer das Recht, die Veranstaltung am angegebenen 
              Datum am gewählten Sitzplatz zu besuchen.
            </p>
          </section>

          {/* 3. Vertragsschluss */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 3 Vertragsschluss</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.1 Bestellung</h3>
                <p className="text-gray-300">
                  Der Kunde wählt einen verfügbaren Sitzplatz aus dem interaktiven Sitzplan und gibt 
                  seine Kontaktdaten (Name, E-Mail, optional Telefon) ein.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.2 Angebot</h3>
                <p className="text-gray-300">
                  Durch Klicken auf „Jetzt bezahlen" gibt der Kunde ein verbindliches Angebot zum 
                  Kauf des Tickets ab.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.3 Annahme</h3>
                <p className="text-gray-300">
                  Der Vertrag kommt zustande, wenn die Zahlung erfolgreich über Stripe abgewickelt wurde. 
                  Der Kunde erhält eine Bestellbestätigung per E-Mail mit dem QR-Code-Ticket.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Preise und Zahlung */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 4 Preise und Zahlung</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.1 Preise</h3>
                <p className="text-gray-300">
                  Alle angegebenen Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer. 
                  Der Ticketpreis beträgt 50,00 € pro Sitzplatz.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.2 Zahlungsart</h3>
                <p className="text-gray-300">
                  Die Zahlung erfolgt ausschließlich über den Zahlungsdienstleister Stripe. 
                  Folgende Zahlungsmethoden werden akzeptiert:
                </p>
                <ul className="list-disc list-inside text-gray-300 ml-4 mt-2">
                  <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                  <li>Debitkarte</li>
                  <li>Weitere von Stripe unterstützte Zahlungsmethoden</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.3 Fälligkeit</h3>
                <p className="text-gray-300">
                  Der Kaufpreis ist sofort mit Vertragsschluss fällig und wird unmittelbar über Stripe eingezogen.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Lieferung */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 5 Lieferung des Tickets</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.1 Elektronisches Ticket</h3>
                <p className="text-gray-300">
                  Das Ticket wird als elektronisches Ticket (E-Ticket) mit QR-Code per E-Mail an die 
                  angegebene E-Mail-Adresse versendet.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.2 Zustellung</h3>
                <p className="text-gray-300">
                  Die Zustellung erfolgt unmittelbar nach erfolgreicher Zahlung, in der Regel innerhalb 
                  weniger Minuten.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5.3 Einlass</h3>
                <p className="text-gray-300">
                  Der Kunde muss das E-Ticket (ausgedruckt oder auf dem Smartphone) am Veranstaltungsort 
                  vorzeigen. Der QR-Code wird beim Einlass gescannt.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Widerrufsrecht */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 6 Widerrufsrecht</h2>
            <div className="bg-amber-900/20 border-2 border-[#FFD700]/30 p-4 rounded-xl mb-4">
              <p className="text-white font-semibold mb-2">⚠️ WICHTIGER HINWEIS:</p>
              <p className="text-gray-300">
                Für Tickets zu Veranstaltungen mit festem Termin besteht gemäß § 312g Abs. 2 Nr. 9 BGB 
                <span className="text-[#FFD700] font-semibold"> KEIN Widerrufsrecht</span>.
              </p>
            </div>
            <p className="text-gray-300">
              Da es sich beim Josefi Konzert um eine Veranstaltung zu einem bestimmten Zeitpunkt 
              (22. März 2026) handelt, ist ein Widerruf nach erfolgter Buchung ausgeschlossen.
            </p>
            <p className="text-gray-300 mt-2">
              Der Kunde nimmt dies durch Ankreuzen der entsprechenden Checkbox vor dem Kauf ausdrücklich 
              zur Kenntnis.
            </p>
          </section>

          {/* 7. Stornierung und Rückerstattung */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 7 Stornierung und Rückerstattung</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">7.1 Stornierung durch Kunden</h3>
                <p className="text-gray-300">
                  Eine Stornierung durch den Kunden ist grundsätzlich nicht möglich (siehe § 6 Widerrufsrecht). 
                  In Ausnahmefällen (z.B. Krankheit) kann eine individuelle Lösung mit dem Veranstalter 
                  vereinbart werden.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">7.2 Absage der Veranstaltung</h3>
                <p className="text-gray-300">
                  Bei Ausfall oder Absage der Veranstaltung durch den Veranstalter wird der Ticketpreis 
                  vollständig erstattet. Der Kunde wird per E-Mail informiert.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">7.3 Verlegung</h3>
                <p className="text-gray-300">
                  Bei Verlegung der Veranstaltung auf einen anderen Termin behält das Ticket seine 
                  Gültigkeit für den neuen Termin. Der Kunde kann in diesem Fall innerhalb von 14 Tagen 
                  vom Vertrag zurücktreten und eine Rückerstattung verlangen.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Hausrecht */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 8 Hausrecht und Veranstaltungsordnung</h2>
            <p className="text-gray-300 mb-2">
              Der Veranstalter behält sich das Hausrecht vor. Bei Verstoß gegen die Veranstaltungsordnung 
              kann der Zutritt verweigert oder ein Platzverweis ausgesprochen werden, ohne dass ein 
              Anspruch auf Rückerstattung besteht.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4">
              <p className="text-white font-semibold mb-2">Insbesondere ist untersagt:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Mitbringen von Waffen, gefährlichen Gegenständen</li>
                <li>Mitbringen von Glasflaschen</li>
                <li>Rauchen (außer in gekennzeichneten Bereichen)</li>
                <li>Störung der Veranstaltung oder anderer Besucher</li>
                <li>Ton-, Bild- oder Videoaufnahmen ohne Genehmigung</li>
              </ul>
            </div>
          </section>

          {/* 9. Übertragbarkeit */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 9 Übertragbarkeit</h2>
            <p className="text-gray-300">
              Das Ticket ist übertragbar. Der neue Inhaber tritt in die Rechte und Pflichten des 
              ursprünglichen Käufers ein. Der Veranstalter ist über die Übertragung zu informieren.
            </p>
          </section>

          {/* 10. Haftung */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 10 Haftung</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">10.1 Haftungsbeschränkung</h3>
                <p className="text-gray-300">
                  Der Veranstalter haftet nur für Schäden, die auf einer vorsätzlichen oder grob 
                  fahrlässigen Pflichtverletzung beruhen. Ausgenommen hiervon sind Schäden aus der 
                  Verletzung des Lebens, des Körpers oder der Gesundheit.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">10.2 Garderobe und Wertsachen</h3>
                <p className="text-gray-300">
                  Für Garderobe und mitgebrachte Wertsachen wird keine Haftung übernommen, es sei denn, 
                  die Beschädigung oder der Verlust beruht auf Vorsatz oder grober Fahrlässigkeit.
                </p>
              </div>
            </div>
          </section>

          {/* 11. Datenschutz */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 11 Datenschutz</h2>
            <p className="text-gray-300">
              Die Verarbeitung personenbezogener Daten erfolgt gemäß der DSGVO. Nähere Informationen 
              finden Sie in unserer{" "}
              <a href="/datenschutz" className="text-[#FFD700] hover:underline font-semibold">
                Datenschutzerklärung
              </a>.
            </p>
          </section>

          {/* 12. Schlussbestimmungen */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">§ 12 Schlussbestimmungen</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">12.1 Gerichtsstand</h3>
                <p className="text-gray-300">
                  Gerichtsstand ist, soweit gesetzlich zulässig, Meran (Italien).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">12.2 Anwendbares Recht</h3>
                <p className="text-gray-300">
                  Es gilt das Recht der Republik Italien.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">12.3 Salvatorische Klausel</h3>
                <p className="text-gray-300">
                  Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die 
                  Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
                </p>
              </div>
            </div>
          </section>

          {/* Stand */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-8">
            <p className="text-gray-300">
              <span className="text-white font-semibold">Stand:</span> {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>

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