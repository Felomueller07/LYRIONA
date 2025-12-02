"use client";

import React, { useState, useEffect } from "react";

interface SeatStatus {
  [id: string]: "available" | "selected" | "sold";
}

interface SeatMapProps {
  seats: SeatStatus;
  role: string;
  onSeatClick: (id: string) => void;
  modalOpen: boolean;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, role, onSeatClick, modalOpen }) => {
  const [svgContent, setSvgContent] = useState<string>("");

  // Load SVG from public folder
  useEffect(() => {
    fetch("/ZeichnungKursaal_Ebene 1.svg")
      .then((res) => res.text())
      .then((data) => setSvgContent(data))
      .catch((err) => console.error("SVG Ladefehler:", err));
  }, []);

  // Update seat colors based on status
  const updateSeatColor = (el: SVGElement, status: SeatStatus[string]) => {
    let color = "#4ade80"; // Green (available)
    
    switch (status) {
      case "selected":
        color = "#FFD700"; // Gold
        break;
      case "sold":
        color = "#ef4444"; // Red
        break;
      default:
        color = "#4ade80"; // Green
        break;
    }
    
    el.setAttribute("fill", color);
    el.style.fill = color;
    el.setAttribute("opacity", "1");
  };

  // Bind events to seats
  useEffect(() => {
    if (!svgContent) return;

    setTimeout(() => {
      const svgEl = document.getElementById("kursaal-svg");
      if (!svgEl) return;

      const seatElements = svgEl.querySelectorAll('[id^="seat_"]');

      seatElements.forEach((el) => {
        const id = el.id;
        const status = seats[id] || "available";
        
        // Set initial color
        updateSeatColor(el as SVGElement, status);

        // Click Handler
        const clickHandler = () => onSeatClick(id);
        (el as any)._clickHandler && el.removeEventListener("click", (el as any)._clickHandler);
        el.addEventListener("click", clickHandler);
        (el as any)._clickHandler = clickHandler;

        // Cursor
        (el as HTMLElement).style.cursor = role === "admin" ? "pointer" : "default";
        
        // Mouse Enter - RIPPLE + COLOR ONLY!
        const mouseEnterHandler = function(this: SVGElement) {
          if (role === "admin" && seats[id] !== "sold") {
            const rect = this as unknown as SVGGraphicsElement;
            
            try {
              // Get center of seat
              const bbox = rect.getBBox();
              const centerX = bbox.x + bbox.width / 2;
              const centerY = bbox.y + bbox.height / 2;
              
              // Create ripple circles
              const svg = document.getElementById("kursaal-svg");
              if (svg) {
                // Create 3 ripples with different delays
                for (let i = 0; i < 3; i++) {
                  setTimeout(() => {
                    const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    ripple.setAttribute("cx", centerX.toString());
                    ripple.setAttribute("cy", centerY.toString());
                    ripple.setAttribute("r", "5");
                    ripple.setAttribute("fill", "none");
                    ripple.setAttribute("stroke", "#FFD700");
                    ripple.setAttribute("stroke-width", "3");
                    ripple.setAttribute("opacity", "1");
                    ripple.style.pointerEvents = "none";
                    
                    svg.appendChild(ripple);
                    
                    // Animate ripple
                    let radius = 5;
                    let opacity = 1;
                    const animate = () => {
                      radius += 2;
                      opacity -= 0.03;
                      
                      ripple.setAttribute("r", radius.toString());
                      ripple.setAttribute("opacity", opacity.toString());
                      ripple.setAttribute("stroke-width", Math.max(1, 3 - radius / 15).toString());
                      
                      if (opacity > 0 && radius < 60) {
                        requestAnimationFrame(animate);
                      } else {
                        ripple.remove();
                      }
                    };
                    
                    requestAnimationFrame(animate);
                  }, i * 200);
                }
              }
              
              // ONLY change color and add glow - NO SIZE CHANGE!
              this.style.fill = "#FFD700"; // Gold
              this.style.filter = "drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))";
              this.style.stroke = "#FFA500";
              this.style.strokeWidth = "2";
              
            } catch (error) {
              console.error("Ripple effect error:", error);
            }
          }
        };

        // Mouse Leave - RESET!
        const mouseLeaveHandler = function(this: SVGElement) {
          // Remove all hover effects
          this.style.filter = "none";
          this.style.stroke = "";
          this.style.strokeWidth = "";
          
          // Restore original color based on status
          const currentStatus = seats[id] || "available";
          updateSeatColor(this, currentStatus);
        };

        // Remove old listeners
        (el as any)._mouseEnterHandler && el.removeEventListener("mouseenter", (el as any)._mouseEnterHandler);
        (el as any)._mouseLeaveHandler && el.removeEventListener("mouseleave", (el as any)._mouseLeaveHandler);
        
        // Add new listeners
        el.addEventListener("mouseenter", mouseEnterHandler);
        el.addEventListener("mouseleave", mouseLeaveHandler);
        
        (el as any)._mouseEnterHandler = mouseEnterHandler;
        (el as any)._mouseLeaveHandler = mouseLeaveHandler;
      });
    }, 100);

    // Cleanup
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
  }, [svgContent, seats, role, modalOpen]);

  if (!svgContent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Lade Sitzplan...</p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default SeatMap;