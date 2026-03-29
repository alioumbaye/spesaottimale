import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { Supermercato } from "@/types";

const SUPERMERCATI_VALIDI: Supermercato[] = [
  "Lidl", "Esselunga", "Conad", "Eurospin", "Coop",
  "Carrefour", "Penny", "Ins", "Aldi", "Pam",
];

function checkAdmin(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  return key === (process.env.ADMIN_PASSWORD || "spesa2024");
}

/** GET /api/prodotti — lista tutti i prodotti (solo admin) */
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const db = getServiceClient();
  const { data, error } = await db
    .from("prodotti")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/prodotti — inserisce uno o più prodotti (solo admin) */
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON non valido" }, { status: 400 }); }

  const items = Array.isArray(body) ? body : [body];
  const oggi = new Date().toISOString().split("T")[0];

  const righe = [];
  for (const item of items as Record<string, unknown>[]) {
    const nome = String(item.nome || "").trim();
    const prezzo = parseFloat(String(item.prezzo || "0"));
    const supermercato = String(item.supermercato || "").trim();
    const categoria = String(item.categoria || "Altro").trim();
    const citta = String(item.citta || "").trim();
    const cap = String(item.cap || "").trim();
    const data_rilevazione = String(item.data_rilevazione || oggi).trim();

    if (!nome || isNaN(prezzo) || prezzo <= 0) continue;
    if (!SUPERMERCATI_VALIDI.includes(supermercato as Supermercato)) continue;

    righe.push({ nome, prezzo, supermercato, categoria, citta, cap, data_rilevazione, inserito_da: "admin" });
  }

  if (righe.length === 0) return NextResponse.json({ error: "Nessun prodotto valido" }, { status: 400 });

  const db = getServiceClient();
  const { data, error } = await db.from("prodotti").insert(righe).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inseriti: data?.length ?? 0 });
}

/** PUT /api/prodotti — modifica un prodotto (solo admin) */
export async function PUT(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON non valido" }, { status: 400 }); }

  const { id, ...campi } = body;
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });

  const db = getServiceClient();
  const { error } = await db.from("prodotti").update(campi).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/prodotti?id=123 — elimina un prodotto (solo admin) */
export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });

  const db = getServiceClient();
  const { error } = await db.from("prodotti").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
