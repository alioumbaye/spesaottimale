import { NextRequest, NextResponse } from "next/server";
import { getPrezziDaDB } from "@/lib/prezzi";

/**
 * GET /api/confronto?prodotti=Latte,Pasta,Uova&cap=20121
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const prodottiRaw = searchParams.get("prodotti") || "";
  const cap = searchParams.get("cap") || "";

  const prodotti = prodottiRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (prodotti.length === 0) {
    return NextResponse.json({ error: "Nessun prodotto specificato" }, { status: 400 });
  }
  if (!/^\d{5}$/.test(cap)) {
    return NextResponse.json({ error: "CAP non valido" }, { status: 400 });
  }

  try {
    const risultato = await getPrezziDaDB(prodotti, cap);
    return NextResponse.json(risultato);
  } catch (err) {
    console.error("/api/confronto error:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
