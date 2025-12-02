"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm py-8 mt-auto">
      <div className="container mx-auto px-6">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <div className="text-xl font-bold mb-2">
              <span className="text-white">LYRI</span>
              <span className="text-[#FFD700]">ONA</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Bürgerkapelle Untermais
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Crafted with ❤️ for musicians.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/impressum" 
              className="text-gray-400 hover:text-[#FFD700] transition-colors text-sm font-medium"
            >
              Impressum
            </Link>
            <Link 
              href="/datenschutz" 
              className="text-gray-400 hover:text-[#FFD700] transition-colors text-sm font-medium"
            >
              Datenschutz
            </Link>
            <Link 
              href="/agb" 
              className="text-gray-400 hover:text-[#FFD700] transition-colors text-sm font-medium"
            >
              AGB
            </Link>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">Kontakt</p>
            <a 
              href="mailto:info@bku.it" 
              className="text-[#FFD700] hover:underline text-sm"
            >
              info@bku.it
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}