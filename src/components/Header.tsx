"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            Spesa<span className="text-green-600">Ottimale</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#come-funziona" className="hover:text-green-600 transition-colors">
            Come funziona
          </a>
          <a href="#supermercati" className="hover:text-green-600 transition-colors">
            Supermercati
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            🇮🇹 Italia
          </span>
        </div>
      </div>
    </header>
  );
}
