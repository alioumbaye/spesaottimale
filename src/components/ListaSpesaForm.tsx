"use client";

import { useState, KeyboardEvent } from "react";

interface ListaSpesaFormProps {
  onAnalizza: (prodotti: string[], cap: string) => void;
  isLoading: boolean;
}

const PRODOTTI_SUGGERITI = [
  "Latte",
  "Pasta",
  "Pane",
  "Uova",
  "Pollo",
  "Pomodori",
  "Mozzarella",
  "Olio d'oliva",
  "Riso",
  "Yogurt",
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
      setProdotti([...prodotti, trimmed]);
    }
    setInputCorrente("");
  };

  const rimuoviProdotto = (index: number) => {
    setProdotti(prodotti.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      aggiungiProdotto(inputCorrente);
    }
  };

  const validaCap = (value: string) => {
    if (value.length === 5 && !/^\d{5}$/.test(value)) {
      setCapError("Il CAP deve essere composto da 5 cifre");
    } else {
      setCapError("");
    }
    setCap(value.replace(/\D/g, "").slice(0, 5));
  };

  const handleSubmit = () => {
    if (inputCorrente.trim()) {
      const nuoviProdotti = [...prodotti, inputCorrente.trim()];
      setProdotti(nuoviProdotti);
      setInputCorrente("");
      if (cap.length === 5 && nuoviProdotti.length > 0) {
        onAnalizza(nuoviProdotti, cap);
      }
      return;
    }
    if (prodotti.length === 0) return;
    if (cap.length !== 5) {
      setCapError("Inserisci un CAP valido di 5 cifre");
      return;
    }
    onAnalizza(prodotti, cap);
  };

  const aggiungiSuggerito = (prodotto: string) => {
    if (!prodotti.includes(prodotto)) {
      setProdotti([...prodotti, prodotto]);
    }
  };

  const importaDaLista = () => {
    if (!prodottiInput.trim()) return;
    const nuovi = prodottiInput
      .split(/[\n,;]/)
      .map((p) => p.trim())
      .filter((p) => p && !prodotti.includes(p));
    setProdotti([...prodotti, ...nuovi]);
    setProdottiInput("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header form */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-5">
        <h2 className="text-white text-xl font-bold">Analizza la tua spesa</h2>
        <p className="text-green-100 text-sm mt-1">
          Inserisci i prodotti e il tuo CAP per trovare le offerte migliori
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* CAP input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Il tuo CAP
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              📍
            </span>
            <input
              type="text"
              value={cap}
              onChange={(e) => validaCap(e.target.value)}
              placeholder="Es. 20121"
              maxLength={5}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                capError
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-200 focus:ring-green-200 focus:border-green-400"
              }`}
            />
            {cap.length === 5 && !capError && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">
                ✓
              </span>
            )}
          </div>
          {capError && (
            <p className="text-red-500 text-xs mt-1">{capError}</p>
          )}
        </div>

        {/* Prodotti input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lista della spesa
          </label>

          {/* Tag dei prodotti */}
          {prodotti.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {prodotti.map((prodotto, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 bg-white border border-green-200 text-green-800 text-sm px-3 py-1.5 rounded-full shadow-sm"
                >
                  <span className="text-green-500">•</span>
                  {prodotto}
                  <button
                    onClick={() => rimuoviProdotto(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-0.5 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input singolo prodotto */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCorrente}
              onChange={(e) => setInputCorrente(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scrivi un prodotto e premi Invio..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
            />
            <button
              onClick={() => aggiungiProdotto(inputCorrente)}
              disabled={!inputCorrente.trim()}
              className="px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
            >
              + Aggiungi
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Premi Invio o virgola per aggiungere ogni prodotto
          </p>
        </div>

        {/* Import da lista */}
        <div>
          <details className="group">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-green-600 transition-colors select-none flex items-center gap-1">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Incolla la lista intera
            </summary>
            <div className="mt-3 space-y-2">
              <textarea
                value={prodottiInput}
                onChange={(e) => setProdottiInput(e.target.value)}
                placeholder="Es:&#10;Latte&#10;Pane, Pasta, Uova&#10;Pollo"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all text-sm resize-none"
              />
              <button
                onClick={importaDaLista}
                disabled={!prodottiInput.trim()}
                className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Importa prodotti
              </button>
            </div>
          </details>
        </div>

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
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  prodotti.includes(p)
                    ? "bg-green-50 border-green-200 text-green-600 cursor-default"
                    : "bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                {prodotti.includes(p) ? "✓ " : "+ "}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || prodotti.length === 0 || cap.length !== 5}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-base rounded-xl hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-green-200 hover:shadow-xl active:scale-[0.99]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Analisi in corso...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🔍 Trova le migliori offerte
              {prodotti.length > 0 && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {prodotti.length} prodott{prodotti.length === 1 ? "o" : "i"}
                </span>
              )}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
