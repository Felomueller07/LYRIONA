"use client";
import React from "react";

type Props = {
  offsetY?: number;
};

export default function Background({ offsetY = 0 }: Props) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none"
      style={{
        backgroundImage: "url('/images/lyriona-background.png')",
        backgroundPosition: "75% center", // anpassen = weiter rechts (z.B. 80% oder 85%)
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        transform: `translateY(${offsetY * 0.25}px)`, // Parallax Y
        filter: "brightness(0.95) saturate(1.15)",
        zIndex: 0,
      }}
    />
  );
}





