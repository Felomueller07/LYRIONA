"use client";

import React from "react";

interface LegendProps {
  color: string;
  label: string;
}

const Legend: React.FC<LegendProps> = ({ color, label }) => (
  <div className="flex items-center gap-3 group cursor-default">
    <div className="relative">
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />
      {/* Main dot */}
      <div
        className="relative w-5 h-5 rounded-full border-2 border-white/30 group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: color }}
      />
    </div>
    <span className="text-base text-gray-200 font-medium group-hover:text-white transition-colors duration-300">
      {label}
    </span>
  </div>
);

export default Legend;