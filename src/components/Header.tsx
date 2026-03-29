"use client";

import { useState } from "react";

export default function Header() {
  const [menuAperto, setMenuAperto] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            Spesa<span className="text-green-600">Ottimale</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#come-funziona" className="hover:text-green-600 transition-colors">
            Come funziona
          </a>
          <a href="#supermercati" className="hover:text-green-600 transition-colors">
            Supermercati
          </a>
        </nav>

        {/* Desktop: badge Italia */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            🇮🇹 Italia
          </span>
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMenuAperto((v) => !v)}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          {menuAperto ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuAperto && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            <a
              href="#come-funziona"
              onClick={() => setMenuAperto(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
            >
              <span>❓</span> Come funziona
            </a>
            <a
              href="#supermercati"
              onClick={() => setMenuAperto(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
            >
              <span>🏪</span> Supermercati
            </a>
            <a
              href="/admin"
              onClick={() => setMenuAperto(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors text-sm"
            >
              <span>🔐</span> Area admin
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
