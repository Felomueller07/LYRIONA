"use client";
import React from "react";

type Props = {
  onSignInClick: () => void;
};

export default function HeroSection({ onSignInClick }: Props) {
  return (
    <section className="relative z-10 text-center px-6 mb-16">
      <h1 className="text-6xl md:text-7xl font-semibold tracking-tight mb-6 drop-shadow-[0_0_40px_rgba(255,200,0,0.45)]">
        LYRIONA
      </h1>
      <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
        Eine neue Art, Musik zu erleben – klar, elegant und modern.
      </p>
      <button
        onClick={onSignInClick}
        className="mt-10 px-8 py-3 rounded-xl bg-black/60 hover:bg-black/80 border border-yellow-500 text-gray-100 backdrop-blur-md transition"
      >
        Sign In
      </button>
    </section>
  );
}
