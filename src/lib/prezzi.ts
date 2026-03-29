/**
 * Logica di confronto prezzi.
 * Interroga Supabase; se non trova dati per il CAP usa quelli nazionali;
 * se non trova nulla affatto cade back sul DATABASE hardcoded.
 */

import { supabase } from "./supabase";
import { PrezzoPerSupermercato, Supermercato } from "@/types";
import { SUPERMERCATI, simulaAnalisiSpesa } from "./supermercati";

// Quanto è "recente" un prezzo (giorni)
const MAX_GIORNI_RECENTI = 30;

function dataMinima(): string {
  const d = new Date();
  d.setDate(d.getDate() - MAX_GIORNI_RECENTI);
  return d.toISOString().split("T")[0];
}

function normalizzaNome(nome: string): string {
  return nome.toLowerCase().trim();
}

/** Recupera i prezzi dal DB per un insieme di prodotti e un CAP. */
export async function getPrezziDaDB(
  prodotti: string[],
  cap: string
): Promise<{
  prezzi: Record<string, PrezzoPerSupermercato[]>;
  fonte: "database" | "hardcoded";
  cap_usato: string | null;
}> {
  const nomiNorm = prodotti.map(normalizzaNome);

  // Query Supabase: prodotti con nome simile a uno dei richiesti, dati recenti
  const { data, error } = await supabase
    .from("prodotti")
    .select("nome, prezzo, supermercato, cap, data_rilevazione, inserito_da")
    .gte("data_rilevazione", dataMinima())
    .order("data_rilevazione", { ascending: false });

  if (error || !data || data.length === 0) {
    // Nessun dato nel DB → hardcoded
    return {
      prezzi: simulaAnalisiSpesa(prodotti, cap),
      fonte: "hardcoded",
      cap_usato: null,
    };
  }

  // Costruiamo la mappa: per ogni prodotto richiesto, cerca corrispondenze nel DB
  const prezziConCapMap = buildPrezziMap(prodotti, nomiNorm, data, cap);
  const trovatiConCap = Object.values(prezziConCapMap).filter((v) => v.length > 0).length;

  if (trovatiConCap > 0) {
    // Completa i prodotti senza match con dati nazionali o hardcoded
    completaConNazionale(prezziConCapMap, prodotti, nomiNorm, data, cap);
    return { prezzi: prezziConCapMap, fonte: "database", cap_usato: cap };
  }

  // Nessun dato locale → prova nazionali (ignora CAP)
  const prezziNazMap = buildPrezziMap(prodotti, nomiNorm, data, null);
  const trovatiNaz = Object.values(prezziNazMap).filter((v) => v.length > 0).length;

  if (trovatiNaz > 0) {
    completaConHardcoded(prezziNazMap, prodotti, cap);
    return { prezzi: prezziNazMap, fonte: "database", cap_usato: null };
  }

  // DB vuoto per questi prodotti → hardcoded
  return {
    prezzi: simulaAnalisiSpesa(prodotti, cap),
    fonte: "hardcoded",
    cap_usato: null,
  };
}

type DBRow = {
  nome: string;
  prezzo: number;
  supermercato: string;
  cap: string;
  data_rilevazione: string;
  inserito_da: string;
};

function buildPrezziMap(
  prodotti: string[],
  nomiNorm: string[],
  data: DBRow[],
  filtroCap: string | null
): Record<string, PrezzoPerSupermercato[]> {
  const mappa: Record<string, PrezzoPerSupermercato[]> = {};

  for (let i = 0; i < prodotti.length; i++) {
    const prodotto = prodotti[i];
    const nomeNorm = nomiNorm[i];
    mappa[prodotto] = [];

    // Filtra righe corrispondenti al prodotto
    const righe = data.filter((row) => {
      const rowNome = normalizzaNome(row.nome);
      const match =
        rowNome === nomeNorm ||
        rowNome.includes(nomeNorm) ||
        nomeNorm.includes(rowNome) ||
        rowNome.split(" ").some((p) => nomeNorm.includes(p) && p.length > 2);
      const capOk = filtroCap === null || row.cap === filtroCap;
      return match && capOk;
    });

    if (righe.length === 0) continue;

    // Per ogni supermercato prendi il prezzo più recente
    for (const sup of SUPERMERCATI) {
      const righeSup = righe
        .filter((r) => r.supermercato === sup)
        .sort((a, b) => b.data_rilevazione.localeCompare(a.data_rilevazione));
      if (righeSup.length > 0) {
        const row = righeSup[0];
        mappa[prodotto].push({
          supermercato: sup,
          prezzo: Number(row.prezzo),
          data_rilevazione: row.data_rilevazione,
          fonte: row.inserito_da as "admin" | "community",
        });
      }
    }
  }

  return mappa;
}

/** Per i prodotti senza dati nel DB aggiunge prezzi nazionali o hardcoded. */
function completaConNazionale(
  mappa: Record<string, PrezzoPerSupermercato[]>,
  prodotti: string[],
  nomiNorm: string[],
  data: DBRow[],
  cap: string
) {
  for (let i = 0; i < prodotti.length; i++) {
    if (mappa[prodotti[i]].length > 0) continue;
    // Prova nazionali
    const nazMap = buildPrezziMap([prodotti[i]], [nomiNorm[i]], data, null);
    if (nazMap[prodotti[i]].length > 0) {
      mappa[prodotti[i]] = nazMap[prodotti[i]];
    } else {
      // Hardcoded per questo prodotto
      const hc = simulaAnalisiSpesa([prodotti[i]], cap);
      mappa[prodotti[i]] = hc[prodotti[i]] || [];
    }
  }
}

function completaConHardcoded(
  mappa: Record<string, PrezzoPerSupermercato[]>,
  prodotti: string[],
  cap: string
) {
  for (const prodotto of prodotti) {
    if (mappa[prodotto].length > 0) continue;
    const hc = simulaAnalisiSpesa([prodotto], cap);
    mappa[prodotto] = hc[prodotto] || [];
  }
}
