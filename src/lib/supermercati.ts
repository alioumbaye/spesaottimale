import { Supermercato } from "@/types";

export const SUPERMERCATI: Supermercato[] = [
  "Lidl",
  "Esselunga",
  "Conad",
  "Eurospin",
  "Coop",
  "Carrefour",
  "Penny",
  "Ins",
  "Aldi",
  "Pam",
];

export const SUPERMERCATO_COLORI: Record<Supermercato, string> = {
  Lidl:      "bg-yellow-400 text-blue-900",
  Esselunga: "bg-red-600 text-white",
  Conad:     "bg-red-500 text-white",
  Eurospin:  "bg-orange-500 text-white",
  Coop:      "bg-blue-600 text-white",
  Carrefour: "bg-blue-500 text-white",
  Penny:     "bg-red-700 text-white",
  Ins:       "bg-green-700 text-white",
  Aldi:      "bg-blue-800 text-white",
  Pam:       "bg-orange-600 text-white",
};

export const SUPERMERCATO_BADGE: Record<Supermercato, string> = {
  Lidl:      "border-yellow-400 text-yellow-700 bg-yellow-50",
  Esselunga: "border-red-400 text-red-700 bg-red-50",
  Conad:     "border-red-300 text-red-600 bg-red-50",
  Eurospin:  "border-orange-400 text-orange-700 bg-orange-50",
  Coop:      "border-blue-400 text-blue-700 bg-blue-50",
  Carrefour: "border-blue-300 text-blue-600 bg-blue-50",
  Penny:     "border-red-500 text-red-800 bg-red-50",
  Ins:       "border-green-400 text-green-700 bg-green-50",
  Aldi:      "border-blue-600 text-blue-900 bg-blue-50",
  Pam:       "border-orange-400 text-orange-700 bg-orange-50",
};

export const SUPERMERCATO_ICON: Record<Supermercato, string> = {
  Lidl:      "🟡",
  Esselunga: "🔴",
  Conad:     "🍎",
  Eurospin:  "🟠",
  Coop:      "🔵",
  Carrefour: "🔷",
  Penny:     "🟥",
  Ins:       "🟢",
  Aldi:      "🔹",
  Pam:       "🟧",
};

// ---------------------------------------------------------------------------
// DATABASE PREZZI REALISTICI (€) — medie di mercato italiane 2024
// ---------------------------------------------------------------------------

interface EntryPrezzi {
  alias: string[];
  descrizione: string;
  prezzi: Record<Supermercato, number>;
  promozioni?: Partial<Record<Supermercato, string>>;
}

const DATABASE: EntryPrezzi[] = [
  {
    alias: ["latte", "latte intero", "latte parzialmente scremato", "latte scremato", "latte fresco"],
    descrizione: "Latte intero 1L",
    prezzi: { Lidl: 1.09, Esselunga: 1.29, Conad: 1.19, Eurospin: 0.99, Coop: 1.25, Carrefour: 1.15, Penny: 1.05, Ins: 1.09, Aldi: 0.99, Pam: 1.22 },
    promozioni: { Lidl: "3x2", Aldi: "Offerta" },
  },
  {
    alias: ["pasta", "spaghetti", "penne", "rigatoni", "fusilli", "tagliatelle", "farfalle", "linguine"],
    descrizione: "Pasta 500g",
    prezzi: { Lidl: 0.79, Esselunga: 1.09, Conad: 0.89, Eurospin: 0.69, Coop: 0.95, Carrefour: 0.85, Penny: 0.75, Ins: 0.79, Aldi: 0.69, Pam: 0.92 },
  },
  {
    alias: ["pane", "pane bianco", "pane integrale", "pane di casa", "pancarrè", "pane in cassetta"],
    descrizione: "Pane (500g)",
    prezzi: { Lidl: 1.19, Esselunga: 1.49, Conad: 1.35, Eurospin: 0.99, Coop: 1.39, Carrefour: 1.25, Penny: 1.09, Ins: 1.15, Aldi: 0.99, Pam: 1.35 },
  },
  {
    alias: ["uova", "uovo", "uova fresche", "uova biologiche", "uova allevate"],
    descrizione: "Uova fresche (6 pz)",
    prezzi: { Lidl: 1.39, Esselunga: 1.79, Conad: 1.59, Eurospin: 1.19, Coop: 1.69, Carrefour: 1.49, Penny: 1.29, Ins: 1.35, Aldi: 1.19, Pam: 1.59 },
    promozioni: { Eurospin: "Offerta", Aldi: "Offerta" },
  },
  {
    alias: ["pollo", "petto di pollo", "cosce di pollo", "pollo intero", "pollo arrosto"],
    descrizione: "Petto di pollo 1kg",
    prezzi: { Lidl: 4.99, Esselunga: 6.49, Conad: 5.79, Eurospin: 4.59, Coop: 5.99, Carrefour: 5.49, Penny: 4.79, Ins: 4.89, Aldi: 4.59, Pam: 5.69 },
  },
  {
    alias: ["mozzarella", "fior di latte"],
    descrizione: "Mozzarella 125g",
    prezzi: { Lidl: 0.89, Esselunga: 1.19, Conad: 0.99, Eurospin: 0.79, Coop: 1.09, Carrefour: 0.95, Penny: 0.85, Ins: 0.89, Aldi: 0.79, Pam: 1.05 },
    promozioni: { Coop: "2x1.50€" },
  },
  {
    alias: ["parmigiano", "parmigiano reggiano", "grana", "grana padano"],
    descrizione: "Parmigiano Reggiano 200g",
    prezzi: { Lidl: 3.49, Esselunga: 4.29, Conad: 3.79, Eurospin: 3.19, Coop: 3.99, Carrefour: 3.69, Penny: 3.39, Ins: 3.49, Aldi: 3.19, Pam: 3.89 },
  },
  {
    alias: ["olio", "olio oliva", "olio d'oliva", "olio extravergine", "olio evo", "extravergine"],
    descrizione: "Olio EVO 0,75L",
    prezzi: { Lidl: 4.49, Esselunga: 5.99, Conad: 4.99, Eurospin: 3.99, Coop: 5.49, Carrefour: 4.79, Penny: 4.29, Ins: 4.49, Aldi: 3.99, Pam: 5.29 },
    promozioni: { Lidl: "Offerta", Aldi: "Offerta" },
  },
  {
    alias: ["riso", "riso arborio", "riso carnaroli", "riso parboiled", "riso basmati", "riso integrale"],
    descrizione: "Riso 1kg",
    prezzi: { Lidl: 1.19, Esselunga: 1.59, Conad: 1.29, Eurospin: 0.99, Coop: 1.39, Carrefour: 1.25, Penny: 1.09, Ins: 1.15, Aldi: 0.99, Pam: 1.35 },
  },
  {
    alias: ["yogurt", "yogurt bianco", "yogurt greco", "yogurt intero", "yogurt magro"],
    descrizione: "Yogurt bianco 125g",
    prezzi: { Lidl: 0.49, Esselunga: 0.79, Conad: 0.65, Eurospin: 0.39, Coop: 0.69, Carrefour: 0.59, Penny: 0.45, Ins: 0.49, Aldi: 0.39, Pam: 0.65 },
  },
  {
    alias: ["burro", "burro dolce", "burro salato"],
    descrizione: "Burro 250g",
    prezzi: { Lidl: 1.49, Esselunga: 2.19, Conad: 1.79, Eurospin: 1.35, Coop: 1.99, Carrefour: 1.65, Penny: 1.45, Ins: 1.49, Aldi: 1.35, Pam: 1.89 },
  },
  {
    alias: ["pomodori", "pomodoro", "pomodori ciliegini", "pomodori ramati", "datterini"],
    descrizione: "Pomodori 1kg",
    prezzi: { Lidl: 1.49, Esselunga: 2.19, Conad: 1.89, Eurospin: 1.29, Coop: 1.99, Carrefour: 1.69, Penny: 1.39, Ins: 1.45, Aldi: 1.29, Pam: 1.89 },
  },
  {
    alias: ["patate", "patata", "patate novelle", "patate rosse"],
    descrizione: "Patate 1kg",
    prezzi: { Lidl: 0.99, Esselunga: 1.39, Conad: 1.19, Eurospin: 0.89, Coop: 1.25, Carrefour: 1.09, Penny: 0.95, Ins: 0.99, Aldi: 0.89, Pam: 1.19 },
  },
  {
    alias: ["mele", "mela", "mele golden", "mele fuji", "mele granny smith", "mele renette"],
    descrizione: "Mele 1kg",
    prezzi: { Lidl: 1.29, Esselunga: 1.99, Conad: 1.69, Eurospin: 1.09, Coop: 1.79, Carrefour: 1.49, Penny: 1.19, Ins: 1.25, Aldi: 1.09, Pam: 1.69 },
  },
  {
    alias: ["banane", "banana"],
    descrizione: "Banane 1kg",
    prezzi: { Lidl: 1.19, Esselunga: 1.69, Conad: 1.39, Eurospin: 0.99, Coop: 1.49, Carrefour: 1.29, Penny: 1.09, Ins: 1.15, Aldi: 0.99, Pam: 1.39 },
  },
  {
    alias: ["acqua", "acqua minerale", "acqua naturale", "acqua frizzante", "acqua liscia"],
    descrizione: "Acqua minerale 1,5L",
    prezzi: { Lidl: 0.19, Esselunga: 0.29, Conad: 0.25, Eurospin: 0.17, Coop: 0.27, Carrefour: 0.22, Penny: 0.18, Ins: 0.19, Aldi: 0.17, Pam: 0.25 },
    promozioni: { Eurospin: "6x€0.99", Aldi: "6x€0.99" },
  },
  {
    alias: ["biscotti", "biscotto", "frollini", "crackers", "wafer"],
    descrizione: "Biscotti 400g",
    prezzi: { Lidl: 1.29, Esselunga: 1.89, Conad: 1.59, Eurospin: 1.09, Coop: 1.69, Carrefour: 1.45, Penny: 1.19, Ins: 1.25, Aldi: 1.09, Pam: 1.59 },
  },
  {
    alias: ["passata", "passata di pomodoro", "salsa di pomodoro", "sugo"],
    descrizione: "Passata di pomodoro 700g",
    prezzi: { Lidl: 0.79, Esselunga: 1.09, Conad: 0.89, Eurospin: 0.69, Coop: 0.99, Carrefour: 0.85, Penny: 0.75, Ins: 0.79, Aldi: 0.69, Pam: 0.95 },
  },
  {
    alias: ["tonno", "tonno in scatola", "tonno all'olio", "tonno al naturale"],
    descrizione: "Tonno in scatola 3x80g",
    prezzi: { Lidl: 1.99, Esselunga: 2.79, Conad: 2.39, Eurospin: 1.79, Coop: 2.59, Carrefour: 2.19, Penny: 1.89, Ins: 1.99, Aldi: 1.79, Pam: 2.49 },
    promozioni: { Lidl: "3x2", Penny: "Offerta" },
  },
  {
    alias: ["farina", "farina 00", "farina integrale", "farina di frumento"],
    descrizione: "Farina 00 1kg",
    prezzi: { Lidl: 0.59, Esselunga: 0.89, Conad: 0.69, Eurospin: 0.49, Coop: 0.79, Carrefour: 0.65, Penny: 0.55, Ins: 0.59, Aldi: 0.49, Pam: 0.75 },
  },
  {
    alias: ["zucchero", "zucchero semolato", "zucchero bianco", "zucchero di canna"],
    descrizione: "Zucchero 1kg",
    prezzi: { Lidl: 0.89, Esselunga: 1.19, Conad: 0.99, Eurospin: 0.79, Coop: 1.09, Carrefour: 0.95, Penny: 0.85, Ins: 0.89, Aldi: 0.79, Pam: 1.05 },
  },
  {
    alias: ["sale", "sale fino", "sale grosso", "sale marino"],
    descrizione: "Sale 1kg",
    prezzi: { Lidl: 0.39, Esselunga: 0.59, Conad: 0.49, Eurospin: 0.35, Coop: 0.55, Carrefour: 0.45, Penny: 0.38, Ins: 0.39, Aldi: 0.35, Pam: 0.52 },
  },
  {
    alias: ["prosciutto", "prosciutto cotto", "prosciutto crudo", "mortadella", "salumi"],
    descrizione: "Prosciutto cotto 100g",
    prezzi: { Lidl: 1.29, Esselunga: 1.89, Conad: 1.59, Eurospin: 1.09, Coop: 1.69, Carrefour: 1.45, Penny: 1.19, Ins: 1.25, Aldi: 1.09, Pam: 1.59 },
    promozioni: { Conad: "Offerta", Carrefour: "Offerta" },
  },
  {
    alias: ["insalata", "lattuga", "rucola", "radicchio", "cicoria", "spinaci", "verdure"],
    descrizione: "Insalata mista 300g",
    prezzi: { Lidl: 0.99, Esselunga: 1.49, Conad: 1.19, Eurospin: 0.89, Coop: 1.29, Carrefour: 1.09, Penny: 0.95, Ins: 0.99, Aldi: 0.89, Pam: 1.19 },
  },
  {
    alias: ["birra", "birra chiara", "birra scura", "birra artigianale"],
    descrizione: "Birra 33cl",
    prezzi: { Lidl: 0.69, Esselunga: 0.99, Conad: 0.89, Eurospin: 0.59, Coop: 0.89, Carrefour: 0.79, Penny: 0.65, Ins: 0.69, Aldi: 0.59, Pam: 0.85 },
  },
  {
    alias: ["detersivo", "detersivo piatti", "detersivo lavatrice", "ammorbidente", "candeggina"],
    descrizione: "Detersivo piatti 750ml",
    prezzi: { Lidl: 1.49, Esselunga: 2.29, Conad: 1.89, Eurospin: 1.29, Coop: 1.99, Carrefour: 1.69, Penny: 1.39, Ins: 1.45, Aldi: 1.29, Pam: 1.89 },
  },
  {
    alias: ["carta igienica", "carta", "rotoli", "fazzoletti"],
    descrizione: "Carta igienica 8 rotoli",
    prezzi: { Lidl: 2.49, Esselunga: 3.49, Conad: 2.99, Eurospin: 2.19, Coop: 3.19, Carrefour: 2.79, Penny: 2.39, Ins: 2.49, Aldi: 2.19, Pam: 3.09 },
    promozioni: { Esselunga: "Offerta" },
  },
  {
    alias: ["cioccolato", "tavoletta di cioccolato", "cioccolata", "cacao"],
    descrizione: "Cioccolato fondente 100g",
    prezzi: { Lidl: 0.89, Esselunga: 1.29, Conad: 1.09, Eurospin: 0.79, Coop: 1.19, Carrefour: 0.99, Penny: 0.85, Ins: 0.89, Aldi: 0.79, Pam: 1.15 },
  },
  {
    alias: ["vino", "vino rosso", "vino bianco", "vino rosato"],
    descrizione: "Vino rosso 0,75L",
    prezzi: { Lidl: 3.49, Esselunga: 4.99, Conad: 4.29, Eurospin: 2.99, Coop: 4.49, Carrefour: 3.99, Penny: 3.29, Ins: 3.49, Aldi: 2.99, Pam: 4.29 },
  },
  {
    alias: ["caffè", "caffe", "caffè macinato", "caffè in grani", "nespresso", "capsule caffè"],
    descrizione: "Caffè macinato 250g",
    prezzi: { Lidl: 2.49, Esselunga: 3.29, Conad: 2.79, Eurospin: 2.19, Coop: 2.99, Carrefour: 2.65, Penny: 2.39, Ins: 2.49, Aldi: 2.19, Pam: 2.89 },
  },
];

// ---------------------------------------------------------------------------
// Matching fuzzy: trova l'entry nel database che corrisponde al prodotto
// ---------------------------------------------------------------------------

function trovaProdotto(nomeProdotto: string): EntryPrezzi | null {
  const nome = nomeProdotto.toLowerCase().trim();

  for (const entry of DATABASE) {
    if (entry.alias.some((a) => a === nome)) return entry;
  }
  for (const entry of DATABASE) {
    if (entry.alias.some((a) => a.includes(nome) || nome.includes(a))) return entry;
  }
  const parole = nome.split(/\s+/);
  for (const entry of DATABASE) {
    for (const alias of entry.alias) {
      const paroleAlias = alias.split(/\s+/);
      if (parole.some((p) => paroleAlias.includes(p) && p.length > 2)) return entry;
    }
  }
  return null;
}

function prezzoDeterministico(nome: string, sup: Supermercato): number {
  const fattori: Record<Supermercato, number> = {
    Eurospin: 0.79, Aldi: 0.80, Ins: 0.82, Lidl: 0.83, Penny: 0.86,
    Conad: 1.00, Pam: 1.02, Carrefour: 1.03, Coop: 1.05, Esselunga: 1.10,
  };
  const hash = nome.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = 1.5 + (hash % 30) * 0.15;
  return Math.round(base * fattori[sup] * 100) / 100;
}

// ---------------------------------------------------------------------------
// Funzione pubblica chiamata dalla pagina
// ---------------------------------------------------------------------------

export function simulaAnalisiSpesa(
  prodotti: string[],
  _cap: string
): Record<
  string,
  { supermercato: Supermercato; prezzo: number; promozione?: string }[]
> {
  const risultati: Record<
    string,
    { supermercato: Supermercato; prezzo: number; promozione?: string }[]
  > = {};

  for (const prodotto of prodotti) {
    const trimmed = prodotto.trim();
    if (!trimmed) continue;

    const entry = trovaProdotto(trimmed);

    risultati[trimmed] = SUPERMERCATI.map((sup) => ({
      supermercato: sup,
      prezzo: entry ? entry.prezzi[sup] : prezzoDeterministico(trimmed, sup),
      promozione: entry?.promozioni?.[sup],
    }));
  }

  return risultati;
}
