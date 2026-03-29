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
  const totali = Object.fromEntries(SUPERMERCATI.map((s) => [s, 0])) as Record<Supermercato, number>;
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
  const acquisti = Object.fromEntries(SUPERMERCATI.map((s) => [s, []])) as Record<Supermercato, string[]>;
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

  // Quanti prezzi vengono dalla community
  const nCommunity = Object.values(prezzi)
    .flat()
    .filter((p) => p.fonte === "community").length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Banner fonte dati */}
      {fonte && (
        <div className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl border ${
          fonte === "database"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          <span>{fonte === "database" ? "✅" : "📊"}</span>
          {fonte === "database"
            ? cap_usato
              ? `Prezzi dal database per CAP ${cap_usato}`
              : "Prezzi nazionali dal database (nessun dato locale)"
            : "Prezzi indicativi — aggiorna il database per dati reali"}
          {nCommunity > 0 && (
            <span className="ml-auto flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              👥 {nCommunity} prezz{nCommunity === 1 ? "o" : "i"} dalla community
            </span>
          )}
        </div>
      )}

      {/* Banner risparmio */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏆</span>
              <span className="text-green-100 text-sm font-medium uppercase tracking-wide">
                Spesa ottimale — suddivisa tra supermercati
              </span>
            </div>
            <div className="text-4xl font-black">€{totaleOttimale.toFixed(2)}</div>
            <p className="text-green-100 text-sm mt-1">
              Risparmi fino a{" "}
              <span className="font-bold text-white">€{risparmioMax.toFixed(2)}</span>{" "}
              rispetto al supermercato più caro
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-xs text-green-100 mb-1">Zona</div>
            <div className="text-2xl font-black">📍 {cap}</div>
            <div className="text-xs text-green-200 mt-1">
              {prodotti.length} prodott{prodotti.length === 1 ? "o" : "i"} analizzat{prodotti.length === 1 ? "o" : "i"}
            </div>
          </div>
        </div>
      </div>

      {/* Classifica supermercati */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Confronto supermercati</h3>
        <div className="space-y-3">
          {supOrd.map(([sup, totale], index) => {
            const percentuale = ((totale - totaleMigliore) / totaleMigliore) * 100;
            const barWidth = Math.min(100, (totale / totalePeggiore) * 100);
            return (
              <div key={sup}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  index === 0 ? "border-green-300 shadow-md ring-1 ring-green-200" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{SUPERMERCATO_ICON[sup]}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{sup}</span>
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Più economico
                          </span>
                        )}
                      </div>
                      {acquisti[sup].length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Conveniente per: {acquisti[sup].slice(0, 3).join(", ")}
                          {acquisti[sup].length > 3 && ` +${acquisti[sup].length - 3}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-gray-900">€{totale.toFixed(2)}</div>
                    {index > 0 ? (
                      <div className="text-xs text-red-500 font-medium">
                        +€{(totale - totaleMigliore).toFixed(2)} (+{percentuale.toFixed(0)}%)
                      </div>
                    ) : (
                      <div className="text-xs text-green-600 font-medium">Prezzo più basso</div>
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

      {/* Tabella dettaglio */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Dove conviene ogni prodotto</h3>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span>💡</span> Piano spesa ottimale
          </h4>
          <p className="text-amber-800 text-sm mb-4">
            Dividendo gli acquisti tra supermercati risparmi il massimo:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.entries(acquisti) as [Supermercato, string[]][])
              .filter(([, items]) => items.length > 0)
              .map(([sup, items]) => (
                <div key={sup} className={`px-4 py-3 rounded-lg border text-sm ${SUPERMERCATO_BADGE[sup]}`}>
                  <div className="font-bold mb-1">{SUPERMERCATO_ICON[sup]} {sup}</div>
                  {items.map((item) => (
                    <div key={item} className="opacity-80">• {item}</div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        {fonte === "database"
          ? "* Prezzi rilevati dai negozi o segnalati dalla community. Verificare sempre le offerte aggiornate in negozio."
          : "* Prezzi indicativi basati su medie di mercato. Aggiungi dati reali dall'area admin o segnala un prezzo."}
      </p>
    </div>
  );
}
