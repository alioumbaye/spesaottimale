"use client";

import { useState } from "react";
import { SUPERMERCATI, SUPERMERCATO_ICON } from "@/lib/supermercati";

export default function SegnalaPrezzo() {
  const [aperto, setAperto] = useState(false);
  const [invio, setInvio] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [form, setForm] = useState({
    nome: "", prezzo: "", supermercato: "Lidl", cap: "",
  });

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const valido =
    form.nome.trim().length >= 2 &&
    parseFloat(form.prezzo) > 0 &&
    /^\d{5}$/.test(form.cap);

  const invia = async () => {
    if (!valido) return;
    setInvio("loading");
    try {
      const res = await fetch("/api/segnala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, prezzo: parseFloat(form.prezzo) }),
      });
      setInvio(res.ok ? "ok" : "err");
    } catch {
      setInvio("err");
    }
  };

  const reset = () => {
    setForm({ nome: "", prezzo: "", supermercato: "Lidl", cap: "" });
    setInvio("idle");
    setAperto(false);
  };

  return (
    <>
      {/* Bottone trigger */}
      <button
        onClick={() => setAperto(true)}
        className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-full hover:bg-green-100 transition-all"
      >
        <span>📣</span> Segnala un prezzo
      </button>

      {/* Modal overlay */}
      {aperto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && reset()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white font-bold text-lg">Segnala un prezzo</h2>
                  <p className="text-green-100 text-sm mt-0.5">
                    Aiuta la community a risparmiare
                  </p>
                </div>
                <button onClick={reset} className="text-white/70 hover:text-white text-2xl leading-none">
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {invio === "ok" ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">🙏</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Grazie per la segnalazione!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Il tuo prezzo è stato aggiunto al database e aiuterà altri utenti a risparmiare.
                  </p>
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all text-sm"
                  >
                    Chiudi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nome prodotto *
                    </label>
                    <input
                      value={form.nome}
                      onChange={set("nome")}
                      placeholder="Es. Latte intero 1L"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Prezzo (€) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={form.prezzo}
                        onChange={set("prezzo")}
                        placeholder="1.29"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        CAP negozio *
                      </label>
                      <input
                        value={form.cap}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            cap: e.target.value.replace(/\D/g, "").slice(0, 5),
                          }))
                        }
                        placeholder="20121"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Supermercato *
                    </label>
                    <select
                      value={form.supermercato}
                      onChange={set("supermercato")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
                    >
                      {SUPERMERCATI.map((s) => (
                        <option key={s} value={s}>
                          {SUPERMERCATO_ICON[s]} {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {invio === "err" && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                      ❌ Errore nell&apos;invio. Controlla i dati e riprova.
                    </p>
                  )}

                  <button
                    onClick={invia}
                    disabled={!valido || invio === "loading"}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-sm"
                  >
                    {invio === "loading" ? "Invio in corso..." : "📤 Invia segnalazione"}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    I prezzi segnalati vengono aggiunti al database community e sono visibili a tutti.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
