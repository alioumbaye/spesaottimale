"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ListaSpesaForm from "@/components/ListaSpesaForm";
import RisultatiSpesa from "@/components/RisultatiSpesa";
import ComeFunziona from "@/components/ComeFunziona";
import SegnalaPrezzo from "@/components/SegnalaPrezzo";
import { PrezzoPerSupermercato, RispostaConfronto } from "@/types";

interface StatoRisultati {
  prodotti: string[];
  prezzi: Record<string, PrezzoPerSupermercato[]>;
  cap: string;
  fonte: "database" | "hardcoded";
  cap_usato: string | null;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [risultati, setRisultati] = useState<StatoRisultati | null>(null);

  const handleAnalizza = async (prodotti: string[], cap: string) => {
    setIsLoading(true);
    setRisultati(null);

    try {
      const params = new URLSearchParams({ prodotti: prodotti.join(","), cap });
      const res = await fetch(`/api/confronto?${params}`);

      let data: RispostaConfronto;
      if (res.ok) {
        data = await res.json();
      } else {
        // Fallback client-side se l'API non è raggiungibile
        const { simulaAnalisiSpesa } = await import("@/lib/supermercati");
        data = { prezzi: simulaAnalisiSpesa(prodotti, cap), fonte: "hardcoded", cap_usato: null };
      }

      setRisultati({ prodotti, cap, ...data });
    } catch {
      const { simulaAnalisiSpesa } = await import("@/lib/supermercati");
      setRisultati({
        prodotti, cap,
        prezzi: simulaAnalisiSpesa(prodotti, cap),
        fonte: "hardcoded",
        cap_usato: null,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById("risultati")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-slide-up">
                {/* Badge — compatto su mobile */}
                <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <span className="animate-pulse-slow">🟢</span>
                  Confronta 10 supermercati in tempo reale
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-3 sm:mb-6">
                  Spesa{" "}
                  <span className="text-yellow-300">Ottimale</span>
                </h1>

                <p className="text-green-100 text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6 max-w-lg">
                  Inserisci la lista della spesa e il CAP: ti diciamo dove conviene comprare ogni prodotto per{" "}
                  <strong className="text-white">spendere il meno possibile</strong>.
                </p>

                {/* Badge community + supermercati — nascosti su mobile per compattezza */}
                <div className="hidden sm:flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="bg-purple-500/30 border border-purple-300/40 text-purple-100 text-xs px-3 py-1.5 rounded-full font-medium">
                    👥 Prezzi segnalati dalla community
                  </span>
                </div>

                {/* Pillole supermercati: 5 su mobile, 10 su sm+ */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    "🟡 Lidl", "🟠 Eurospin", "🔹 Aldi", "🟥 Penny", "🍎 Conad",
                  ].map((s) => (
                    <span key={s}
                      className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                  {[
                    "🔷 Carrefour", "🔴 Esselunga", "🔵 Coop", "🟢 In's", "🟧 Pam",
                  ].map((s) => (
                    <span key={s}
                      className="hidden sm:inline bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats grid — nascosta su mobile (troppo spazio) */}
              <div className="hidden sm:grid grid-cols-2 gap-4">
                {[
                  { valore: "10", label: "Supermercati confrontati", icon: "🏪" },
                  { valore: "~30%", label: "Risparmio medio possibile", icon: "💰" },
                  { valore: "100%", label: "Gratuito, sempre", icon: "✅" },
                  { valore: "🇮🇹", label: "Fatto per l'Italia", icon: "📍" },
                ].map((stat) => (
                  <div key={stat.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-5 text-center">
                    <div className="text-2xl sm:text-3xl mb-1">{stat.icon}</div>
                    <div className="text-xl sm:text-2xl font-black">{stat.valore}</div>
                    <div className="text-green-200 text-xs mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form + Risultati */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 sm:pb-12">
          {/* Banner "Segnala un prezzo" */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Conosci il prezzo di un prodotto nel tuo supermercato?
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Segnalalo e aiuta altri utenti a risparmiare sulla spesa
              </p>
            </div>
            <SegnalaPrezzo />
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <ListaSpesaForm onAnalizza={handleAnalizza} isLoading={isLoading} />
            </div>

            <div className="lg:col-span-3" id="risultati">
              {!risultati && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Pronto ad analizzare la tua spesa
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Inserisci i prodotti e il tuo CAP nel modulo a sinistra,
                    poi clicca su &quot;Trova le migliori offerte&quot;.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                    <div className="absolute inset-2 flex items-center justify-center text-2xl">🔍</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Analisi in corso...</h3>
                  <p className="text-gray-400 text-sm">Confronto prezzi tra 10 supermercati</p>
                </div>
              )}

              {risultati && !isLoading && (
                <RisultatiSpesa
                  prodotti={risultati.prodotti}
                  prezzi={risultati.prezzi}
                  cap={risultati.cap}
                  fonte={risultati.fonte}
                  cap_usato={risultati.cap_usato}
                />
              )}
            </div>
          </div>
        </section>

        {/* Come funziona */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ComeFunziona />
          </div>
        </section>

        {/* Supermercati supportati */}
        <section id="supermercati" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Supermercati supportati</h2>
            <p className="text-gray-500 mt-2">Confrontiamo i 10 principali supermercati italiani</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { nome: "Lidl",      icon: "🟡", desc: "Discount tedesco, prezzi bassi garantiti",       colore: "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50" },
              { nome: "Eurospin",  icon: "🟠", desc: "Massimo risparmio su ogni prodotto",             colore: "border-orange-200 hover:border-orange-400 hover:bg-orange-50" },
              { nome: "Aldi",      icon: "🔹", desc: "Discount tedesco con ottimo rapporto qualità",   colore: "border-blue-200 hover:border-blue-500 hover:bg-blue-50" },
              { nome: "Penny",     icon: "🟥", desc: "Prezzi competitivi e offerte settimanali",       colore: "border-red-200 hover:border-red-600 hover:bg-red-50" },
              { nome: "In's",      icon: "🟢", desc: "Discount italiano con prodotti locali",          colore: "border-green-200 hover:border-green-500 hover:bg-green-50" },
              { nome: "Conad",     icon: "🍎", desc: "Cooperativa italiana, territorio e qualità",     colore: "border-red-200 hover:border-red-300 hover:bg-red-50" },
              { nome: "Coop",      icon: "🔵", desc: "Cooperativa storica, sostenibilità e risparmio", colore: "border-blue-200 hover:border-blue-400 hover:bg-blue-50" },
              { nome: "Carrefour", icon: "🔷", desc: "Ipermercato francese, grande assortimento",      colore: "border-blue-200 hover:border-blue-400 hover:bg-blue-50" },
              { nome: "Pam",       icon: "🟧", desc: "Supermercati di prossimità, capillare sul territorio", colore: "border-orange-200 hover:border-orange-500 hover:bg-orange-50" },
              { nome: "Esselunga", icon: "🔴", desc: "Qualità premium, ampia scelta di prodotti",      colore: "border-red-200 hover:border-red-400 hover:bg-red-50" },
            ].map((s) => (
              <div key={s.nome}
                className={`bg-white border-2 rounded-2xl p-5 text-center transition-all cursor-default ${s.colore}`}>
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{s.nome}</div>
                <div className="text-xs text-gray-500 leading-tight">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-white font-bold">
              Spesa<span className="text-green-400">Ottimale</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            I prezzi possono variare. Verificare sempre le offerte aggiornate nei negozi.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            © {new Date().getFullYear()} SpesaOttimale — Fatto con 💚 per risparmiare sulla spesa italiana
          </p>
        </div>
      </footer>
    </div>
  );
}
