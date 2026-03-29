export type Supermercato =
  | "Lidl"
  | "Esselunga"
  | "Conad"
  | "Eurospin"
  | "Coop"
  | "Carrefour"
  | "Penny"
  | "Ins"
  | "Aldi"
  | "Pam";

export type InseritoDa = "admin" | "community";

/** Riga della tabella `prodotti` su Supabase */
export interface ProdottoDB {
  id: number;
  nome: string;
  prezzo: number;
  supermercato: Supermercato;
  categoria: string;
  citta: string;
  cap: string;
  data_rilevazione: string; // ISO date string
  inserito_da: InseritoDa;
  created_at?: string;
}

/** Shape usata dai componenti di confronto */
export interface PrezzoPerSupermercato {
  supermercato: Supermercato;
  prezzo: number;
  promozione?: string;
  data_rilevazione?: string;
  fonte?: InseritoDa;
}

/** Risposta dell'API /api/confronto */
export interface RispostaConfronto {
  prezzi: Record<string, PrezzoPerSupermercato[]>;
  fonte: "database" | "hardcoded";
  cap_usato: string | null; // null = dati nazionali
}
