"use client";

import React, { useEffect, useState } from "react";
import { X, CreditCard, Download, MapPin } from "lucide-react";
import QRCode from "qrcode";

interface SeatStatus {
  [id: string]: "available" | "selected" | "sold";
}

type Props = {
  role: string;
};

const TicketSales: React.FC<Props> = ({ role }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [seats, setSeats] = useState<SeatStatus>({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // ← NEU: Warenkorb
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [currentSeatId, setCurrentSeatId] = useState<string>("");
  const [reservationForm, setReservationForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Rechtliche Checkboxes
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNoRefund, setAcceptNoRefund] = useState(false);

  // Load saved seats
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSeats = localStorage.getItem("lyriona_sold_seats");
      if (savedSeats) {
        setSeats(JSON.parse(savedSeats));
      }
    }
  }, []);

  // Check for successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const seatsParam = urlParams.get("seats"); // Kann mehrere sein: "seat_A_13,seat_B_20"
    const name = urlParams.get("name");
    const email = urlParams.get("email");

    if (success === "true" && seatsParam && name && email) {
      // Parse seats (kann kommasepariert sein)
      const soldSeatIds = seatsParam.split(",");
      
      console.log("✅ Payment erfolgreich! Sitze verkauft:", soldSeatIds);

      // Update seats state
      setSeats((prev) => {
        const newSeats = { ...prev };
        soldSeatIds.forEach(seatId => {
          newSeats[seatId] = "sold";
        });
        
        // ✅ Speichere in localStorage!
        localStorage.setItem("lyriona_sold_seats", JSON.stringify(newSeats));
        console.log("💾 LocalStorage aktualisiert:", newSeats);
        
        return newSeats;
      });

      // Clear selected seats
      setSelectedSeats([]);

      // Generate QR Code
      const fullName = decodeURIComponent(name);
      const userEmail = decodeURIComponent(email);
      generateQRCode(soldSeatIds.join(", "), fullName, userEmail);
      
      setShowSuccessModal(true);
      
      // ✅ TRICK: Auto-Reload nach 1 Sekunde um Farben zu forcen!
      // URL params entfernen BEVOR reload
      window.history.replaceState({}, "", "/dashboard?tab=kartenverkauf&role=admin");
      
      // Reload nach kurzer Delay (damit Modal noch sichtbar)
      setTimeout(() => {
        console.log("🔄 Auto-Reload um Sitz-Farben zu aktualisieren...");
        window.location.reload();
      }, 1500);
    }
  }, [svgContent]);

  // Load SVG
  useEffect(() => {
    fetch("/ZeichnungKursaal.svg")
      .then((res) => res.text())
      .then((data) => setSvgContent(data))
      .catch((err) => console.error("Fehler beim Laden des SVG:", err));
  }, []);

  // Update seat colors
  const updateSeatColor = (el: SVGElement, status: SeatStatus[string], isSelected: boolean = false) => {
    let color = "#4ade80";
    
    if (isSelected) {
      // Selected in cart = always gold
      color = "#FFD700";
    } else {
      switch (status) {
        case "selected":
          color = "#FFD700";
          break;
        case "sold":
          color = "#ef4444";
          break;
        default:
          color = "#4ade80";
          break;
      }
    }
    
    el.setAttribute("fill", color);
    el.style.fill = color;
    el.setAttribute("opacity", "1");
  };

  // Bind click events + RIPPLE HOVER (NO SCALING!)
  useEffect(() => {
    if (!svgContent) return;

    setTimeout(() => {
      const svgEl = document.getElementById("kursaal-svg");
      if (!svgEl) return;

      const seatElements = svgEl.querySelectorAll('[id^="seat_"]');

      seatElements.forEach((el) => {
        const id = el.id;
        const status = seats[id] || "available";
        const isSelected = selectedSeats.includes(id);
        
        updateSeatColor(el as SVGElement, status, isSelected);

        // Click
        const clickHandler = (e: Event) => {
          e.stopPropagation();
          handleSeatClick(id);
        };
        
        (el as any)._clickHandler && el.removeEventListener("click", (el as any)._clickHandler);
        el.addEventListener("click", clickHandler);
        (el as any)._clickHandler = clickHandler;

        // Cursor
        (el as HTMLElement).style.cursor = role === "admin" ? "pointer" : "default";
        
        // Mouse Enter - ONLY CHANGE FILL COLOR!
        const mouseEnterHandler = function(this: SVGElement, e: Event) {
          e.stopPropagation();
          if (role === "admin" && seats[id] !== "sold") {
            // Store original stroke (black border)
            if (!this.dataset.originalStroke) {
              this.dataset.originalStroke = this.getAttribute("stroke") || "#000000";
              this.dataset.originalStrokeWidth = this.getAttribute("stroke-width") || "1";
            }
            
            // ONLY change fill to gold - KEEP original border!
            this.style.fill = "#FFD700";
            this.style.filter = "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))";
          }
        };

        // Mouse Leave - RESTORE ORIGINAL COLOR!
        const mouseLeaveHandler = function(this: SVGElement, e: Event) {
          e.stopPropagation();
          
          // Remove glow
          this.style.filter = "none";
          
          // DON'T touch stroke - it stays as is!
          // ONLY restore fill color based on status
          const currentStatus = seats[id] || "available";
          updateSeatColor(this, currentStatus);
        };

        (el as any)._mouseEnterHandler && el.removeEventListener("mouseenter", (el as any)._mouseEnterHandler);
        (el as any)._mouseLeaveHandler && el.removeEventListener("mouseleave", (el as any)._mouseLeaveHandler);
        
        el.addEventListener("mouseenter", mouseEnterHandler);
        el.addEventListener("mouseleave", mouseLeaveHandler);
        
        (el as any)._mouseEnterHandler = mouseEnterHandler;
        (el as any)._mouseLeaveHandler = mouseLeaveHandler;
      });
    }, 100);

    return () => {
      const svgEl = document.getElementById("kursaal-svg");
      if (svgEl) {
        const seatElements = svgEl.querySelectorAll('[id^="seat_"]');
        seatElements.forEach((el) => {
          (el as any)._clickHandler && el.removeEventListener("click", (el as any)._clickHandler);
          (el as any)._mouseEnterHandler && el.removeEventListener("mouseenter", (el as any)._mouseEnterHandler);
          (el as any)._mouseLeaveHandler && el.removeEventListener("mouseleave", (el as any)._mouseLeaveHandler);
        });
      }
    };
  }, [svgContent, seats, role, showReservationModal, selectedSeats]);

  const handleSeatClick = (id: string) => {
    if (role === "visitor") return;
    if (seats[id] === "sold") return;

    // Toggle selection
    setSelectedSeats(prev => {
      if (prev.includes(id)) {
        // Abwählen
        return prev.filter(seatId => seatId !== id);
      } else {
        // Hinzufügen
        return [...prev, id];
      }
    });
  };

  const openCheckout = () => {
    if (selectedSeats.length === 0) {
      alert("Bitte wähle mindestens einen Sitzplatz aus!");
      return;
    }
    setShowReservationModal(true);
  };

  const confirmReservation = async () => {
    if (!reservationForm.firstName || !reservationForm.lastName || !reservationForm.email) {
      alert("Bitte Vorname, Nachname und E-Mail ausfüllen!");
      return;
    }

    if (!acceptTerms || !acceptNoRefund) {
      alert("Bitte akzeptieren Sie die AGB und die Widerrufsbelehrung!");
      return;
    }

    setIsProcessing(true);

    try {
      const fullName = `${reservationForm.firstName} ${reservationForm.lastName}`;
      const totalPrice = selectedSeats.length * 50; // 50€ pro Sitz
      
      console.log("💳 Sende Payment Request:", {
        seatIds: selectedSeats,
        totalPrice,
        name: fullName
      });
      
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatIds: selectedSeats, // ✅ Array mit allen Sitzen!
          name: fullName,
          email: reservationForm.email,
          phone: reservationForm.phone,
          totalPrice: totalPrice, // ✅ Gesamtpreis!
        }),
      });

      if (!response.ok) throw new Error(`API Fehler: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Keine Checkout-URL");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert("Fehler bei der Zahlung: " + error.message);
      setIsProcessing(false);
    }
  };

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
        color: { dark: "#000000", light: "#ffffff" },
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("QR-Code Error:", error);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `ticket-${currentSeatId}.png`;
    link.click();
  };

  const cancelReservation = () => {
    setShowReservationModal(false);
    setReservationForm({ firstName: "", lastName: "", email: "", phone: "" });
    setCurrentSeatId("");
    setAcceptTerms(false);
    setAcceptNoRefund(false);
  };

  return (
    <div className="space-y-8">
      {/* Info Box */}
      <div className="p-6 bg-gradient-to-r from-[#FFD700]/10 to-[#D4AF37]/10 border border-[#FFD700]/20 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-black" />
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">Kursaal Sitzplan</h3>
            <p className="text-sm text-gray-400">
              Wähle deinen Sitzplatz aus dem interaktiven Plan. Grün = frei, Gelb = ausgewählt, Rot = verkauft.
            </p>
          </div>
        </div>
      </div>

      {/* SVG Sitzplan + Checkout Panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sitzplan */}
        <div className="flex-1">
          {svgContent ? (
            <div className="w-full flex justify-center items-center py-16">
              <div 
                className="w-full max-w-5xl px-4"
                style={{ margin: '0 auto' }}
                dangerouslySetInnerHTML={{
                  __html: svgContent.replace(
                    "<svg",
                    '<svg id="kursaal-svg" width="100%" height="auto" style="display: block;"'
                  ),
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Lade Sitzplan...</p>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Panel */}
        {selectedSeats.length > 0 && (
          <div className="lg:w-96">
            <div className="sticky top-24 bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🛒 Warenkorb
                <span className="text-sm font-normal text-gray-400">({selectedSeats.length})</span>
              </h3>

              {/* Selected Seats List */}
              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                {selectedSeats.map((seatId) => (
                  <div 
                    key={seatId}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-[#FFD700]/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                        {seatId.replace("seat_", "").split("_")[0]}
                      </div>
                      <span className="text-white font-semibold">
                        Platz {seatId.replace("seat_", "").replace("_", " ")}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedSeats(prev => prev.filter(id => id !== seatId))}
                      className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Anzahl Tickets:</span>
                  <span className="text-white font-semibold">{selectedSeats.length}x</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Preis pro Ticket:</span>
                  <span className="text-white font-semibold">50,00 €</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-white font-bold text-lg">Gesamt:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                    {(selectedSeats.length * 50).toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={openCheckout}
                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#FFD700]/30 text-lg"
              >
                Jetzt reservieren
              </button>

              <button
                onClick={() => setSelectedSeats([])}
                className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                Auswahl löschen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <Legend color="#4ade80" label="Frei" />
        <div className="w-px h-6 bg-white/10" />
        <Legend color="#FFD700" label="Ausgewählt" />
        <div className="w-px h-6 bg-white/10" />
        <Legend color="#ef4444" label="Verkauft" />
      </div>

      {/* Modals ... (rest of code) */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-black">Sitzplatz reservieren</h3>
                  <p className="text-black/70 text-sm mt-1">
                    {selectedSeats.length} {selectedSeats.length === 1 ? 'Platz' : 'Plätze'}: {selectedSeats.map(id => id.replace("seat_", "").replace("_", " ")).join(", ")}
                  </p>
                </div>
                <button onClick={cancelReservation} className="p-2 hover:bg-black/20 rounded-lg">
                  <X size={24} className="text-black" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-5 bg-gradient-to-r from-[#FFD700]/10 to-[#D4AF37]/10 border border-[#FFD700]/20 rounded-2xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Anzahl Tickets:</span>
                    <span className="text-white font-semibold">{selectedSeats.length}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Preis pro Ticket:</span>
                    <span className="text-white font-semibold">50,00 €</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-bold text-lg">Gesamt:</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                      {(selectedSeats.length * 50).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reservationForm.firstName}
                    onChange={(e) => setReservationForm({ ...reservationForm, firstName: e.target.value })}
                    placeholder="Vorname *"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 outline-none transition-all"
                    required
                  />
                  <input
                    type="text"
                    value={reservationForm.lastName}
                    onChange={(e) => setReservationForm({ ...reservationForm, lastName: e.target.value })}
                    placeholder="Nachname *"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 outline-none transition-all"
                    required
                  />
                </div>
                <input
                  type="email"
                  value={reservationForm.email}
                  onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                  placeholder="E-Mail *"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 outline-none transition-all"
                  required
                />
                <input
                  type="tel"
                  value={reservationForm.phone}
                  onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                  placeholder="Telefon (optional)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 outline-none transition-all"
                />
              </div>

              {/* Rechtliche Checkboxes */}
              <div className="space-y-3 mt-6 mb-6 border-t border-white/10 pt-6">
                {/* AGB Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Ich habe die{" "}
                    <a
                      href="/agb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] hover:underline font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      AGB
                    </a>
                    {" "}und{" "}
                    <a
                      href="/datenschutz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] hover:underline font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Datenschutzerklärung
                    </a>
                    {" "}gelesen und akzeptiere diese. *
                  </span>
                </label>

                {/* Widerrufsrecht Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptNoRefund}
                    onChange={(e) => setAcceptNoRefund(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Ich nehme zur Kenntnis, dass für Tickets zu Veranstaltungen mit festem Termin 
                    gemäß § 312g Abs. 2 Nr. 9 BGB{" "}
                    <span className="text-[#FFD700] font-semibold">kein Widerrufsrecht</span> besteht. *
                  </span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={cancelReservation} className="flex-1 py-3 bg-white/10 rounded-xl text-white">
                  Abbrechen
                </button>
                <button
                  onClick={confirmReservation}
                  disabled={
                    isProcessing || 
                    !reservationForm.firstName || 
                    !reservationForm.lastName ||
                    !reservationForm.email ||
                    !acceptTerms ||
                    !acceptNoRefund
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-black font-bold hover:from-[#FFA500] hover:to-[#FFD700] transition-all"
                >
                  {isProcessing ? "..." : `Bezahlen (${(selectedSeats.length * 50).toFixed(2)} €)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && qrCodeUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 max-w-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-4">✅ Zahlung erfolgreich!</h3>
            <img src={qrCodeUrl} alt="QR" className="w-64 h-64 mx-auto mb-4" />
            <div className="flex gap-3">
              <button onClick={downloadQRCode} className="flex-1 py-3 bg-blue-600 rounded-xl text-white">Download</button>
              <button onClick={() => setShowSuccessModal(false)} className="flex-1 py-3 bg-white/10 rounded-xl text-white">Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-gray-200">{label}</span>
  </div>
);

export default TicketSales;