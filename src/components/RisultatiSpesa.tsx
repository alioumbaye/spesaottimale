"use client";

import { Supermercato, PrezzoPerSupermercato } from "@/types";
import { SUPERMERCATO_BADGE, SUPERMERCATO_ICON, SUPERMERCATI } from "@/lib/supermercati";

interface RisultatiSpesaProps {
  prodotti: string[];
  prezzi: Record<string, PrezzoPerSupermercato[]>;
  cap: string;
  fonte?: "database" | "hardcoded";
  cap_usato?: string | null;
}

function calcolaRiepilogo(
  prodotti: string[],
  prezzi: Record<string, PrezzoPerSupermercato[]>
): Record<Supermercato, number> {
  const totali = SUPERMERCATI.reduce<Record<Supermercato, number>>(
    (acc, s) => ({ ...acc, [s]: 0 }),
    {} as Record<Supermercato, number>
  );
  for (const prodotto of prodotti) {
    for (const { supermercato, prezzo } of prezzi[prodotto] ?? []) {
      totali[supermercato] = (totali[supermercato] ?? 0) + prezzo;
    }
  }
  return totali;
}

function getMigliore(prezziProdotto: PrezzoPerSupermercato[]) {
  return prezziProdotto.reduce((best, curr) => (curr.prezzo < best.prezzo ? curr : best));
}

function getPeggiore(prezziProdotto: PrezzoPerSupermercato[]) {
  return prezziProdotto.reduce((worst, curr) => (curr.prezzo > worst.prezzo ? curr : worst));
}

function getSpesaOttimale(
  prodotti: string[],
  prezzi: Record<string, PrezzoPerSupermercato[]>
): { totaleOttimale: number; acquisti: Record<Supermercato, string[]> } {
  let totaleOttimale = 0;
  const acquisti = SUPERMERCATI.reduce<Record<Supermercato, string[]>>(
    (acc, s) => ({ ...acc, [s]: [] }),
    {} as Record<Supermercato, string[]>
  );
  for (const prodotto of prodotti) {
    const p = prezzi[prodotto];
    if (!p || p.length === 0) continue;
    const migliore = getMigliore(p);
    totaleOttimale += migliore.prezzo;
    acquisti[migliore.supermercato].push(prodotto);
  }
  return { totaleOttimale, acquisti };
}

function formatData(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  } catch { return iso; }
}

export default function RisultatiSpesa({
  prodotti, prezzi, cap, fonte, cap_usato,
}: RisultatiSpesaProps) {
  const totali = calcolaRiepilogo(prodotti, prezzi);
  const { totaleOttimale, acquisti } = getSpesaOttimale(prodotti, prezzi);

  const supOrd = (Object.entries(totali) as [Supermercato, number][])
    .filter(([, t]) => t > 0)
    .sort((a, b) => a[1] - b[1]);

  if (supOrd.length === 0) return null;

  const [supMigliore, totaleMigliore] = supOrd[0];
  const [, totalePeggiore] = supOrd[supOrd.length - 1];
  const risparmioMax = totalePeggiore - totaleMigliore;

  const nCommunity = Object.values(prezzi).flat().filter((p) => p.fonte === "community").length;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Banner fonte dati */}
      {fonte && (
        <div className={`flex flex-wrap items-center gap-2 text-xs px-4 py-2.5 rounded-xl border ${
          fonte === "database"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          <span>{fonte === "database" ? "✅" : "📊"}</span>
          <span className="flex-1">
            {fonte === "database"
              ? cap_usato ? `Prezzi dal database per CAP ${cap_usato}` : "Prezzi nazionali dal database"
              : "Prezzi indicativi — aggiungi dati reali dall'area admin"}
          </span>
          {nCommunity > 0 && (
            <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full whitespace-nowrap">
              👥 {nCommunity} dalla community
            </span>
          )}
        </div>
      )}

      {/* Banner risparmio */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🏆</span>
              <span className="text-green-100 text-xs font-medium uppercase tracking-wide">
                Spesa ottimale
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black">€{totaleOttimale.toFixed(2)}</div>
            <p className="text-green-100 text-xs sm:text-sm mt-1">
              Risparmi fino a <span className="font-bold text-white">€{risparmioMax.toFixed(2)}</span> rispetto al più caro
            </p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2.5 text-center flex-shrink-0">
            <div className="text-xs text-green-200 mb-0.5">CAP</div>
            <div className="text-lg font-black">📍 {cap}</div>
            <div className="text-xs text-green-200 mt-0.5">
              {prodotti.length} prodott{prodotti.length === 1 ? "o" : "i"}
            </div>
          </div>
        </div>
      </div>

      {/* Classifica supermercati — già ottima su mobile */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Confronto supermercati</h3>
        <div className="space-y-2.5">
          {supOrd.map(([sup, totale], index) => {
            const percentuale = ((totale - totaleMigliore) / totaleMigliore) * 100;
            const barWidth = Math.min(100, (totale / totalePeggiore) * 100);
            return (
              <div key={sup}
                className={`bg-white rounded-xl border p-3.5 sm:p-4 transition-all ${
                  index === 0 ? "border-green-300 shadow-md ring-1 ring-green-200" : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{SUPERMERCATO_ICON[sup]}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{sup}</span>
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                            Più economico
                          </span>
                        )}
                      </div>
                      {acquisti[sup].length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px] sm:max-w-none">
                          {acquisti[sup].slice(0, 2).join(", ")}
                          {acquisti[sup].length > 2 && ` +${acquisti[sup].length - 2}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-lg sm:text-xl font-black text-gray-900">€{totale.toFixed(2)}</div>
                    {index > 0 ? (
                      <div className="text-xs text-red-500 font-medium">
                        +{percentuale.toFixed(0)}%
                      </div>
                    ) : (
                      <div className="text-xs text-green-600 font-medium">migliore</div>
                    )}
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${index === 0 ? "bg-green-500" : "bg-gray-300"}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dettaglio prezzi per prodotto */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Dove conviene ogni prodotto</h3>

        {/* ── VISTA MOBILE: card per prodotto (hidden su sm+) ── */}
        <div className="sm:hidden space-y-3">
          {prodotti.map((prodotto) => {
            const p = prezzi[prodotto];
            if (!p || p.length === 0) return null;
            const prezziOrd = [...p].sort((a, b) => a.prezzo - b.prezzo);
            const migliore = prezziOrd[0];

            return (
              <div key={prodotto} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Intestazione prodotto */}
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">{prodotto}</span>
                  <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                    da €{migliore.prezzo.toFixed(2)}
                  </span>
                </div>
                {/* Prezzi ordinati */}
                <div className="divide-y divide-gray-50">
                  {prezziOrd.map((entry, idx) => (
                    <div
                      key={entry.supermercato}
                      className={`flex items-center justify-between px-4 py-3 ${idx === 0 ? "bg-green-50/60" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{SUPERMERCATO_ICON[entry.supermercato]}</span>
                        <div>
                          <span className={`text-sm font-medium ${idx === 0 ? "text-green-800" : "text-gray-700"}`}>
                            {entry.supermercato}
                          </span>
                          {entry.data_rilevazione && (
                            <div className="text-[10px] text-gray-400">
                              {formatData(entry.data_rilevazione)}
                              {entry.fonte === "community" && " 👥"}
                            </div>
                          )}
                        </div>
                        {idx === 0 && (
                          <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full font-semibold">
                            migliore
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm ${idx === 0 ? "text-green-700" : "text-gray-600"}`}>
                          €{entry.prezzo.toFixed(2)}
                        </span>
                        {idx > 0 && (
                          <div className="text-[10px] text-red-400 font-medium">
                            +€{(entry.prezzo - migliore.prezzo).toFixed(2)}
                          </div>
                        )}
                        {entry.promozione && (
                          <div className="text-[10px] text-orange-600">{entry.promozione}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── VISTA DESKTOP: tabella (hidden su mobile) ── */}
        <div className="hidden sm:block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-3 py-3 font-semibold text-gray-600 w-32 sticky left-0 bg-gray-50 z-10">
                    Prodotto
                  </th>
                  {SUPERMERCATI.map((sup) => (
                    <th key={sup} className="text-center px-2 py-3 font-semibold text-gray-600 whitespace-nowrap">
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{SUPERMERCATO_ICON[sup]}</span>
                        <span className="text-xs">{sup}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prodotti.map((prodotto, i) => {
                  const p = prezzi[prodotto];
                  if (!p || p.length === 0) return null;
                  const migliore = getMigliore(p);
                  const peggiore = getPeggiore(p);
                  return (
                    <tr key={prodotto}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-3 py-2.5 font-medium text-gray-900 sticky left-0 bg-inherit z-10 max-w-[120px] truncate">
                        {prodotto}
                      </td>
                      {SUPERMERCATI.map((sup) => {
                        const entry = p.find((x) => x.supermercato === sup);
                        if (!entry) return <td key={sup} className="text-center px-2 py-2.5 text-gray-300">—</td>;
                        const isMigliore = entry.supermercato === migliore.supermercato;
                        const isPeggiore = entry.supermercato === peggiore.supermercato;
                        return (
                          <td key={sup}
                            className={`text-center px-2 py-2.5 font-mono font-semibold ${
                              isMigliore ? "text-green-700" : isPeggiore ? "text-red-400" : "text-gray-700"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={isMigliore ? "bg-green-100 px-1.5 py-0.5 rounded-lg ring-1 ring-green-200" : ""}>
                                {isMigliore && "✓ "}€{entry.prezzo.toFixed(2)}
                              </span>
                              {entry.data_rilevazione && (
                                <span className="text-gray-300 font-sans font-normal text-[10px]">
                                  {formatData(entry.data_rilevazione)}
                                  {entry.fonte === "community" && " 👥"}
                                </span>
                              )}
                              {entry.promozione && (
                                <span className="text-orange-600 font-sans text-[10px]">{entry.promozione}</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="px-3 py-3 font-bold text-gray-700 sticky left-0 bg-gray-50 z-10">Totale</td>
                  {SUPERMERCATI.map((sup) => (
                    <td key={sup}
                      className={`text-center px-2 py-3 font-black font-mono text-sm ${
                        sup === supMigliore ? "text-green-700" : totali[sup] === 0 ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {totali[sup] > 0 ? `€${totali[sup].toFixed(2)}` : "—"}
                      {sup === supMigliore && <div className="text-xs font-sans text-green-600 font-semibold">🏆</div>}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Piano spesa ottimale */}
      {Object.values(acquisti).some((a) => a.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
          <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <span>💡</span> Piano spesa ottimale
          </h4>
          <p className="text-amber-800 text-xs sm:text-sm mb-3">
            Dividendo gli acquisti tra supermercati risparmi il massimo:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.entries(acquisti) as [Supermercato, string[]][])
              .filter(([, items]) => items.length > 0)
              .map(([sup, items]) => (
                <div key={sup} className={`px-3.5 py-3 rounded-lg border text-sm ${SUPERMERCATO_BADGE[sup]}`}>
                  <div className="font-bold mb-1 text-sm">{SUPERMERCATO_ICON[sup]} {sup}</div>
                  {items.map((item) => (
                    <div key={item} className="opacity-80 text-xs">• {item}</div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center px-2">
        {fonte === "database"
          ? "* Prezzi rilevati dai negozi o segnalati dalla community. Verifica sempre in negozio."
          : "* Prezzi indicativi. Aggiungi dati reali dall'area admin o segnala un prezzo."}
      </p>
    </div>
  );
}
