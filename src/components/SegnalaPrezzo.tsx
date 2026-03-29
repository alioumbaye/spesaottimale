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
        className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-full hover:bg-green-100 active:scale-95 transition-all min-h-[44px]"
      >
        <span>📣</span>
        <span className="hidden xs:inline sm:hidden md:inline">Segnala un prezzo</span>
        <span className="xs:hidden sm:inline md:hidden">Segnala</span>
      </button>

      {/* Modal — full-screen su mobile, centered su sm+ */}
      {aperto && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && reset()}
        >
          {/* Sheet che sale dal basso su mobile, modal centrata su sm+ */}
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white font-bold text-lg">Segnala un prezzo</h2>
                  <p className="text-green-100 text-sm mt-0.5">
                    Aiuta la community a risparmiare
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="text-white/70 hover:text-white w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Chiudi"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {invio === "ok" ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🙏</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Grazie!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Il tuo prezzo è stato aggiunto al database e aiuterà altri utenti a risparmiare.
                  </p>
                  <button
                    onClick={reset}
                    className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all min-h-[44px]"
                  >
                    Chiudi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nome prodotto *
                    </label>
                    <input
                      value={form.nome}
                      onChange={set("nome")}
                      placeholder="Es. Latte intero 1L"
                      autoComplete="off"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Prezzo (€) *
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0.01"
                        value={form.prezzo}
                        onChange={set("prezzo")}
                        placeholder="1.29"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                        inputMode="numeric"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Supermercato *
                    </label>
                    <select
                      value={form.supermercato}
                      onChange={set("supermercato")}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all min-h-[44px]"
                    >
                      {SUPERMERCATI.map((s) => (
                        <option key={s} value={s}>
                          {SUPERMERCATO_ICON[s]} {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {invio === "err" && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      ❌ Errore nell&apos;invio. Controlla i dati e riprova.
                    </p>
                  )}

                  <button
                    onClick={invia}
                    disabled={!valido || invio === "loading"}
                    className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-md min-h-[44px]"
                  >
                    {invio === "loading" ? "Invio in corso..." : "📤 Invia segnalazione"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
