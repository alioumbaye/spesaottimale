"use client";

import { useState, KeyboardEvent } from "react";

interface ListaSpesaFormProps {
  onAnalizza: (prodotti: string[], cap: string) => void;
  isLoading: boolean;
}

const PRODOTTI_SUGGERITI = [
  "Latte", "Pasta", "Pane", "Uova", "Pollo",
  "Pomodori", "Mozzarella", "Olio d'oliva", "Riso", "Yogurt",
];

export default function ListaSpesaForm({ onAnalizza, isLoading }: ListaSpesaFormProps) {
  const [prodottiInput, setProdottiInput] = useState("");
  const [cap, setCap] = useState("");
  const [prodotti, setProdotti] = useState<string[]>([]);
  const [inputCorrente, setInputCorrente] = useState("");
  const [capError, setCapError] = useState("");

  const aggiungiProdotto = (nome: string) => {
    const trimmed = nome.trim();
    if (trimmed && !prodotti.includes(trimmed)) {
      setProdotti((p) => [...p, trimmed]);
    }
    setInputCorrente("");
  };

  const rimuoviProdotto = (index: number) => {
    setProdotti((p) => p.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      aggiungiProdotto(inputCorrente);
    }
  };

  const validaCap = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 5);
    if (clean.length === 5 && !/^\d{5}$/.test(clean)) {
      setCapError("Il CAP deve essere composto da 5 cifre");
    } else {
      setCapError("");
    }
    setCap(clean);
  };

  const handleSubmit = () => {
    const listaFinale = inputCorrente.trim()
      ? [...prodotti, inputCorrente.trim()]
      : prodotti;

    if (inputCorrente.trim()) {
      setProdotti(listaFinale);
      setInputCorrente("");
    }

    if (listaFinale.length === 0) return;
    if (cap.length !== 5) {
      setCapError("Inserisci un CAP valido di 5 cifre");
      return;
    }
    onAnalizza(listaFinale, cap);
  };

  const aggiungiSuggerito = (p: string) => {
    if (!prodotti.includes(p)) setProdotti((prev) => [...prev, p]);
  };

  const importaDaLista = () => {
    if (!prodottiInput.trim()) return;
    const nuovi = prodottiInput
      .split(/[\n,;]/)
      .map((p) => p.trim())
      .filter((p) => p && !prodotti.includes(p));
    setProdotti((prev) => [...prev, ...nuovi]);
    setProdottiInput("");
  };

  const pronto = prodotti.length > 0 && cap.length === 5 && !isLoading;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4">
          <h2 className="text-white text-lg sm:text-xl font-bold">Analizza la tua spesa</h2>
          <p className="text-green-100 text-sm mt-0.5">
            Inserisci prodotti e CAP per trovare le offerte migliori
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* CAP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Il tuo CAP
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                📍
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={cap}
                onChange={(e) => validaCap(e.target.value)}
                placeholder="Es. 20121"
                maxLength={5}
                className={`w-full pl-10 pr-10 py-3.5 border rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                  capError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-green-200 focus:border-green-400"
                }`}
              />
              {cap.length === 5 && !capError && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 font-bold">✓</span>
              )}
            </div>
            {capError && <p className="text-red-500 text-xs mt-1">{capError}</p>}
          </div>

          {/* Prodotti */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Lista della spesa
            </label>

            {/* Chips prodotti */}
            {prodotti.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {prodotti.map((prodotto, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-800 text-sm px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <span className="text-green-500 text-xs">•</span>
                    {prodotto}
                    <button
                      onClick={() => rimuoviProdotto(index)}
                      className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 transition-colors rounded-full"
                      aria-label={`Rimuovi ${prodotto}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input + bottone aggiungi */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCorrente}
                onChange={(e) => setInputCorrente(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Es. Latte, Pasta, Uova..."
                className="flex-1 min-w-0 px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all min-h-[44px]"
              />
              <button
                onClick={() => aggiungiProdotto(inputCorrente)}
                disabled={!inputCorrente.trim()}
                className="px-4 py-3.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 active:bg-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold text-sm whitespace-nowrap min-h-[44px]"
              >
                + Aggiungi
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Premi Invio o virgola per aggiungere
            </p>
          </div>

          {/* Import lista */}
          <details className="group">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-green-600 transition-colors select-none flex items-center gap-1.5 min-h-[44px]">
              <span className="group-open:rotate-90 transition-transform inline-block text-xs">▶</span>
              Incolla la lista intera
            </summary>
            <div className="mt-3 space-y-2">
              <textarea
                value={prodottiInput}
                onChange={(e) => setProdottiInput(e.target.value)}
                placeholder={"Latte\nPane, Pasta, Uova\nPollo"}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all resize-none"
              />
              <button
                onClick={importaDaLista}
                disabled={!prodottiInput.trim()}
                className="text-sm px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                Importa prodotti
              </button>
            </div>
          </details>

          {/* Suggerimenti */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Prodotti comuni
            </p>
            <div className="flex flex-wrap gap-2">
              {PRODOTTI_SUGGERITI.map((p) => (
                <button
                  key={p}
                  onClick={() => aggiungiSuggerito(p)}
                  disabled={prodotti.includes(p)}
                  className={`text-sm px-3 py-2 rounded-full border transition-all min-h-[44px] ${
                    prodotti.includes(p)
                      ? "bg-green-50 border-green-200 text-green-600 cursor-default"
                      : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50 active:bg-green-100"
                  }`}
                >
                  {prodotti.includes(p) ? "✓ " : "+ "}{p}
                </button>
              ))}
            </div>
          </div>

          {/* CTA desktop (hidden on mobile — sticky button handles it) */}
          <button
            onClick={handleSubmit}
            disabled={!pronto}
            className="hidden sm:flex w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-base rounded-xl hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-green-200 hover:shadow-xl active:scale-[0.99] items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⟳</span> Analisi in corso...
              </>
            ) : (
              <>
                🔍 Trova le migliori offerte
                {prodotti.length > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                    {prodotti.length} prodott{prodotti.length === 1 ? "o" : "i"}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* CTA sticky mobile (fixed bottom bar, hidden on sm+) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl">
        <button
          onClick={handleSubmit}
          disabled={!pronto}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-base rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 min-h-[56px]"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span> Analisi in corso...
            </>
          ) : (
            <>
              🔍 Trova le migliori offerte
              {prodotti.length > 0 && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {prodotti.length} prodott{prodotti.length === 1 ? "o" : "i"}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
}
