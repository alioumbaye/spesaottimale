import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Supermercato } from "@/types";

const SUPERMERCATI_VALIDI: Supermercato[] = [
  "Lidl", "Esselunga", "Conad", "Eurospin", "Coop",
  "Carrefour", "Penny", "Ins", "Aldi", "Pam",
];

/**
 * POST /api/segnala
 * Body: { nome, prezzo, supermercato, cap }
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const nome = String(body.nome || "").trim();
  const prezzo = parseFloat(String(body.prezzo || "0"));
  const supermercato = String(body.supermercato || "").trim();
  const cap = String(body.cap || "").trim();

  // Validazione
  if (!nome || nome.length < 2)
    return NextResponse.json({ error: "Nome prodotto non valido" }, { status: 400 });
  if (isNaN(prezzo) || prezzo <= 0 || prezzo > 9999)
    return NextResponse.json({ error: "Prezzo non valido" }, { status: 400 });
  if (!SUPERMERCATI_VALIDI.includes(supermercato as Supermercato))
    return NextResponse.json({ error: "Supermercato non valido" }, { status: 400 });
  if (!/^\d{5}$/.test(cap))
    return NextResponse.json({ error: "CAP non valido" }, { status: 400 });

  const { error } = await supabase.from("prodotti").insert({
    nome,
    prezzo,
    supermercato,
    categoria: "Segnalazione",
    citta: "",
    cap,
    data_rilevazione: new Date().toISOString().split("T")[0],
    inserito_da: "community",
  });

  if (error) {
    console.error("/api/segnala insert error:", error);
    return NextResponse.json({ error: "Errore salvataggio" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
