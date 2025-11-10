"use client";
import React, { useEffect, useState } from "react";
import { X, CreditCard, Download } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import QRCode from "qrcode";

interface SeatStatus {
  [id: string]: "available" | "selected" | "sold";
}

type Props = {
  role: string;
};

// Stripe initialisieren
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const TicketSales: React.FC<Props> = ({ role }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [seats, setSeats] = useState<SeatStatus>({});
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [currentSeatId, setCurrentSeatId] = useState<string>("");
  const [reservationForm, setReservationForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 💾 Lade gespeicherte Plätze beim Start
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSeats = localStorage.getItem("lyriona_sold_seats");
      if (savedSeats) {
        console.log("📥 Lade gespeicherte Plätze:", savedSeats);
        setSeats(JSON.parse(savedSeats));
      }
    }
  }, []);

  // ✅ Check for successful payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const seatId = urlParams.get("seat");
    const name = urlParams.get("name");
    const email = urlParams.get("email");

    if (success === "true" && seatId && name && email) {
      console.log("💰 Zahlung erfolgreich für Platz:", seatId);
      
      // Platz als verkauft markieren UND speichern
      setSeats((prev) => {
        const newSeats = {
          ...prev,
          [seatId]: "sold" as SeatStatus[string],
        };
        // 💾 In localStorage speichern
        localStorage.setItem("lyriona_sold_seats", JSON.stringify(newSeats));
        console.log("💾 Platz gespeichert:", seatId);
        return newSeats;
      });

      // DIREKT die Farbe ändern im DOM
      setTimeout(() => {
        const svgEl = document.getElementById("kursaal-svg");
        if (svgEl) {
          const seatElement = svgEl.querySelector(`[id="${seatId}"]`) as SVGElement;
          if (seatElement) {
            console.log("🔴 Färbe Platz ROT:", seatId);
            seatElement.setAttribute("fill", "#ef4444");
            seatElement.style.fill = "#ef4444";
          }
        }
      }, 500);

      // QR-Code generieren
      generateQRCode(seatId, decodeURIComponent(name), decodeURIComponent(email));
      setShowSuccessModal(true);

      // URL Parameter entfernen
      window.history.replaceState({}, "", "/dashboard?tab=tickets");
    }
  }, [svgContent]); // svgContent als Dependency damit es nach SVG-Load ausgeführt wird

  // 🧩 SVG laden
  useEffect(() => {
    fetch("/ZeichnungKursaal.svg")
      .then((res) => res.text())
      .then((data) => {
        console.log("SVG geladen ✅");
        // NICHT mehr fill="none" ersetzen!
        setSvgContent(data);
      })
      .catch((err) => console.error("Fehler beim Laden des SVG:", err));
  }, []);

  // 🎨 Wenn SVG gerendert ist → Klick-Events an alle Sitz-Elemente binden
  useEffect(() => {
    if (!svgContent) return;

    // Warte kurz bis DOM fertig ist
    setTimeout(() => {
      const svgEl = document.getElementById("kursaal-svg");
      if (!svgEl) {
        console.log("⚠️ SVG Element nicht gefunden");
        return;
      }

      const seatElements = svgEl.querySelectorAll('[id^="seat_"]');
      console.log("🪑 Gefundene Sitze:", seatElements.length);

      seatElements.forEach((el) => {
        const id = el.id;
        
        // Farbe aktualisieren basierend auf Status
        const status = seats[id] || "available";
        updateSeatColor(el as SVGElement, status);
        
        // Event Listener
        const clickHandler = () => handleSeatClick(id);
        el.removeEventListener("click", clickHandler);
        el.addEventListener("click", clickHandler);
        
        (el as HTMLElement).style.cursor = role === "admin" ? "pointer" : "default";
      });
    }, 100); // 100ms warten

    return () => {
      const svgEl = document.getElementById("kursaal-svg");
      if (svgEl) {
        const seatElements = svgEl.querySelectorAll('[id^="seat_"]');
        seatElements.forEach((el) => {
          el.removeEventListener("click", () => handleSeatClick(el.id));
        });
      }
    };
  }, [svgContent, seats, role]); // WICHTIG: seats als Dependency!

  // 🧠 Klick-Logik - öffnet Modal
  const handleSeatClick = (id: string) => {
    if (role === "visitor") return;
    if (seats[id] === "sold") return;

    setCurrentSeatId(id);
    setShowReservationModal(true);
  };

  // ✅ Reservierung bestätigen - zu Stripe weiterleiten
  const confirmReservation = async () => {
    if (!reservationForm.name || !reservationForm.email) {
      alert("Bitte Name und E-Mail ausfüllen!");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("🚀 Starte Stripe Checkout...");
      
      // Backend API aufrufen
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seatId: currentSeatId,
          name: reservationForm.name,
          email: reservationForm.email,
          phone: reservationForm.phone,
          price: 50,
        }),
      });

      console.log("📡 API Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`API Fehler: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("📦 API Response Data:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.sessionId) {
        throw new Error("Keine Session ID erhalten");
      }

      console.log("✅ Session ID erhalten:", data.sessionId);

      // Zu Stripe Checkout weiterleiten über die URL
      if (data.url) {
        console.log("🔄 Weiterleitung zu Stripe Checkout...");
        // Direkt weiterleiten statt nur URL zu loggen
        window.location.href = data.url;
        return; // Wichtig: Verhindert dass isProcessing zurückgesetzt wird
      } else {
        throw new Error("Keine Checkout-URL erhalten");
      }
      
    } catch (error: any) {
      console.error("💥 Payment Error:", error);
      alert("Fehler bei der Zahlung: " + error.message);
      setIsProcessing(false);
    }
  };

  // 📱 QR-Code generieren
  const generateQRCode = async (seatId: string, name: string, email: string) => {
    try {
      const qrData = JSON.stringify({
        event: "LYRIONA Konzert",
        seat: seatId,
        name: name,
        email: email,
        date: new Date().toISOString(),
      });

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("QR-Code Error:", error);
    }
  };

  // 📥 QR-Code herunterladen
  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `ticket-${currentSeatId}.png`;
    link.click();
  };

  // ❌ Reservierung abbrechen
  const cancelReservation = () => {
    setShowReservationModal(false);
    setReservationForm({ name: "", email: "", phone: "" });
    setCurrentSeatId("");
  };

  // 🖌️ Farben dynamisch setzen
  const updateSeatColor = (el: SVGElement, status: SeatStatus[string]) => {
    console.log("Färbe Platz:", el.id, "Status:", status); // Debug
    
    switch (status) {
      case "selected":
        el.setAttribute("fill", "#facc15"); // Gelb
        el.style.fill = "#facc15";
        break;
      case "sold":
        el.setAttribute("fill", "#ef4444"); // Rot
        el.style.fill = "#ef4444";
        break;
      default:
        el.setAttribute("fill", "#4ade80"); // Grün
        el.style.fill = "#4ade80";
        break;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold mb-2">🎟️ Sitzplan Kursaal</h2>

      {svgContent ? (
        <div
          className="border rounded-2xl shadow-lg p-3 bg-white overflow-auto max-h-[80vh] w-full flex justify-center"
          dangerouslySetInnerHTML={{
            __html: svgContent
              .replace(
                "<svg",
                '<svg id="kursaal-svg" width="100%" height="auto" style="max-height:80vh;"'
              )
              // NICHT mehr fill="none" ersetzen - das zerstört die Farben!
          }}
        />
      ) : (
        <p className="text-gray-500">Lade Sitzplan…</p>
      )}

      <div className="mt-4 flex gap-4 text-sm">
        <Legend color="#4ade80" label="Frei" />
        <Legend color="#facc15" label="Ausgewählt" />
        <Legend color="#ef4444" label="Verkauft" />
      </div>

      {/* Reservierungs-Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Sitzplatz reservieren
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    Platz: {currentSeatId.replace("seat_", "")}
                  </p>
                </div>
                <button
                  onClick={cancelReservation}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Preis-Info */}
              <div className="mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Preis pro Platz:</span>
                  <span className="text-3xl font-bold text-purple-600">50€</span>
                </div>
              </div>

              {/* Formular */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vor- und Nachname *
                  </label>
                  <input
                    type="text"
                    value={reservationForm.name}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, name: e.target.value })
                    }
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    value={reservationForm.email}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, email: e.target.value })
                    }
                    placeholder="max@beispiel.de"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefonnummer (optional)
                  </label>
                  <input
                    type="tel"
                    value={reservationForm.phone}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, phone: e.target.value })
                    }
                    placeholder="+49 123 456789"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-gray-800"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  📧 Nach der Reservierung erhältst du eine Bestätigungs-E-Mail mit allen
                  Details.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelReservation}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmReservation}
                  disabled={!reservationForm.name || !reservationForm.email || isProcessing}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Weiterleitung...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Jetzt bezahlen (50€)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal mit QR-Code */}
      {showSuccessModal && qrCodeUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
              <h3 className="text-2xl font-bold text-white text-center">
                ✅ Zahlung erfolgreich!
              </h3>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-700 mb-6">
                Dein Ticket wurde erfolgreich gebucht! <br />
                Hier ist dein QR-Code:
              </p>

              <div className="bg-gray-100 p-6 rounded-2xl inline-block">
                <img src={qrCodeUrl} alt="Ticket QR Code" className="w-64 h-64" />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Zeige diesen QR-Code am Eingang vor
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  QR-Code herunterladen
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// 🎨 kleine Legende-Komponente
const Legend: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div className="flex items-center gap-1">
    <div
      className="w-4 h-4 rounded-full border"
      style={{ backgroundColor: color }}
    />
    <span>{label}</span>
  </div>
);

export default TicketSales;