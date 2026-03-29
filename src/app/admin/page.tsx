"use client";

import { useState, useEffect, useCallback } from "react";
import { SUPERMERCATI, SUPERMERCATO_ICON } from "@/lib/supermercati";
import { ProdottoDB, Supermercato } from "@/types";

const CATEGORIE = [
  "Latticini", "Carne & Pesce", "Frutta & Verdura",
  "Pasta & Riso", "Pane & Dolci", "Bevande", "Condimenti",
  "Pulizia & Igiene", "Offerte", "Segnalazione", "Altro",
];

const ADMIN_KEY = "spesa2024";

// ---- Form aggiunta/modifica prodotto ----
const formVuoto = {
  nome: "", prezzo: "", supermercato: "Lidl" as Supermercato,
  categoria: "Altro", citta: "", cap: "",
  data_rilevazione: new Date().toISOString().split("T")[0],
};

export default function AdminPage() {
  const [autenticato, setAutenticato] = useState(false);
  const [password, setPassword] = useState("");
  const [erroreAuth, setErroreAuth] = useState("");

  const [prodotti, setProdotti] = useState<ProdottoDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(formVuoto);
  const [modificaId, setModificaId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const [testoimport, setTestoImport] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Controlla sessione
  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAutenticato(true);
  }, []);

  const login = () => {
    if (password === ADMIN_KEY) {
      sessionStorage.setItem("admin_auth", "1");
      setAutenticato(true);
    } else {
      setErroreAuth("Password errata");
    }
  };

  const caricaProdotti = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/prodotti", { headers: { "x-admin-key": ADMIN_KEY } });
      if (res.ok) setProdotti(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autenticato) caricaProdotti();
  }, [autenticato, caricaProdotti]);

  const mostraFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3000);
  };

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const salva = async () => {
    if (!form.nome.trim() || !parseFloat(form.prezzo)) return;
    const payload = {
      ...form,
      prezzo: parseFloat(form.prezzo),
      ...(modificaId !== null ? { id: modificaId } : {}),
    };
    const method = modificaId !== null ? "PUT" : "POST";
    const res = await fetch("/api/prodotti", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      mostraFeedback(modificaId !== null ? "✅ Prodotto aggiornato" : "✅ Prodotto aggiunto");
      setForm(formVuoto);
      setModificaId(null);
      caricaProdotti();
    } else {
      mostraFeedback("❌ Errore nel salvataggio");
    }
  };

  const elimina = async (id: number) => {
    if (!confirm("Eliminare questo prodotto?")) return;
    const res = await fetch(`/api/prodotti?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    if (res.ok) {
      mostraFeedback("🗑️ Prodotto eliminato");
      caricaProdotti();
    }
  };

  const avviaModifica = (p: ProdottoDB) => {
    setForm({
      nome: p.nome, prezzo: String(p.prezzo),
      supermercato: p.supermercato, categoria: p.categoria,
      citta: p.citta, cap: p.cap,
      data_rilevazione: p.data_rilevazione,
    });
    setModificaId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const importa = async () => {
    /* Formato supportato (una riga per prodotto):
       nome, prezzo, supermercato, categoria, città, CAP
       oppure: nome; prezzo; supermercato
    */
    const righe = testoimport.split("\n").map((r) => r.trim()).filter(Boolean);
    const items = [];
    for (const riga of righe) {
      const parti = riga.split(/[,;]/).map((p) => p.trim());
      const [nome, prezzoStr, supermercato, categoria, citta, cap] = parti;
      const prezzo = parseFloat(prezzoStr);
      if (!nome || isNaN(prezzo) || !SUPERMERCATI.includes(supermercato as Supermercato)) continue;
      items.push({
        nome, prezzo, supermercato,
        categoria: categoria || "Offerte",
        citta: citta || "", cap: cap || "",
        data_rilevazione: new Date().toISOString().split("T")[0],
      });
    }
    if (items.length === 0) { mostraFeedback("⚠️ Nessun prodotto valido trovato"); return; }
    const res = await fetch("/api/prodotti", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify(items),
    });
    if (res.ok) {
      const data = await res.json();
      mostraFeedback(`✅ Importati ${data.inseriti} prodotti`);
      setTestoImport("");
      setShowImport(false);
      caricaProdotti();
    } else {
      mostraFeedback("❌ Errore importazione");
    }
  };

  const prodottiFiltrati = prodotti.filter(
    (p) =>
      !filtro ||
      p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      p.supermercato.toLowerCase().includes(filtro.toLowerCase()) ||
      p.cap.includes(filtro)
  );

  // ---- SCHERMATA LOGIN ----
  if (!autenticato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🔐</span>
            </div>
            <h1 className="text-xl font-black text-gray-900">Area Admin</h1>
            <p className="text-gray-400 text-sm mt-1">SpesaOttimale</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            />
            {erroreAuth && <p className="text-red-500 text-sm">{erroreAuth}</p>}
            <button
              onClick={login}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl text-sm hover:from-green-700 hover:to-emerald-600 transition-all"
            >
              Accedi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- DASHBOARD ADMIN ----
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">S</div>
          <div>
            <h1 className="font-black text-lg leading-tight">SpesaOttimale Admin</h1>
            <p className="text-green-200 text-xs">{prodotti.length} prodotti nel database</p>
          </div>
        </div>
        <a href="/" className="text-green-200 hover:text-white text-sm transition-colors">← Torna al sito</a>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Feedback toast */}
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm animate-fade-in">
            {feedback}
          </div>
        )}

        {/* ---- FORM AGGIUNTA/MODIFICA ---- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">
              {modificaId !== null ? "✏️ Modifica prodotto" : "➕ Aggiungi prodotto"}
            </h2>
            {modificaId !== null && (
              <button
                onClick={() => { setForm(formVuoto); setModificaId(null); }}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Annulla modifica
              </button>
            )}
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome prodotto *</label>
              <input value={form.nome} onChange={set("nome")} placeholder="Es. Latte intero 1L"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Prezzo (€) *</label>
              <input type="number" step="0.01" value={form.prezzo} onChange={set("prezzo")} placeholder="1.29"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Supermercato *</label>
              <select value={form.supermercato} onChange={set("supermercato")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200">
                {SUPERMERCATI.map((s) => <option key={s} value={s}>{SUPERMERCATO_ICON[s]} {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Categoria</label>
              <select value={form.categoria} onChange={set("categoria")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200">
                {CATEGORIE.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Data rilevazione</label>
              <input type="date" value={form.data_rilevazione} onChange={set("data_rilevazione")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Città</label>
              <input value={form.citta} onChange={set("citta")} placeholder="Milano"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CAP</label>
              <input value={form.cap} onChange={(e) => setForm((p) => ({ ...p, cap: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
                placeholder="20121" maxLength={5}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
          </div>
          <div className="px-6 pb-6">
            <button onClick={salva}
              disabled={!form.nome.trim() || !parseFloat(form.prezzo)}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl text-sm hover:from-green-700 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
              {modificaId !== null ? "💾 Aggiorna prodotto" : "➕ Aggiungi prodotto"}
            </button>
          </div>
        </div>

        {/* ---- IMPORT OFFERTE ---- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowImport((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div className="text-left">
                <div className="font-bold text-gray-900">Importa offerte settimana</div>
                <div className="text-sm text-gray-400">Incolla la lista in formato CSV semplice</div>
              </div>
            </div>
            <span className="text-gray-400">{showImport ? "▲" : "▼"}</span>
          </button>

          {showImport && (
            <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 font-mono">
                <strong>Formato:</strong> nome, prezzo, supermercato, categoria, città, CAP<br />
                Esempio:<br />
                Latte intero 1L, 1.09, Lidl, Latticini, Milano, 20121<br />
                Pasta Barilla 500g, 0.89, Esselunga, Pasta &amp; Riso, Roma, 00100<br />
                <span className="text-amber-600">Categoria, Città e CAP sono opzionali</span>
              </div>
              <textarea
                value={testoimport}
                onChange={(e) => setTestoImport(e.target.value)}
                rows={8}
                placeholder={"Latte intero 1L, 1.09, Lidl, Latticini, Milano, 20121\nPasta 500g, 0.79, Eurospin"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
              />
              <div className="flex gap-3">
                <button onClick={importa} disabled={!testoimport.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-600 transition-all">
                  📤 Importa
                </button>
                <button onClick={() => { setTestoImport(""); setShowImport(false); }}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-all">
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---- TABELLA PRODOTTI ---- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h2 className="font-bold text-gray-900">Tutti i prodotti</h2>
            <div className="flex gap-2 items-center">
              <input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Filtra per nome, supermercato o CAP..."
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 w-56"
              />
              <button onClick={caricaProdotti}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-all">
                {isLoading ? "⏳" : "🔄"}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Caricamento...</div>
          ) : prodottiFiltrati.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {filtro ? "Nessun risultato per la ricerca." : "Nessun prodotto ancora. Aggiungine uno sopra!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Prodotto</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Supermercato</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Prezzo</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Categoria</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">CAP</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Fonte</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {prodottiFiltrati.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{p.nome}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <span>{SUPERMERCATO_ICON[p.supermercato]} {p.supermercato}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-green-700">
                        €{Number(p.prezzo).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.categoria}</td>
                      <td className="px-4 py-3 text-gray-500">{p.cap || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{p.data_rilevazione}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.inserito_da === "community"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {p.inserito_da === "community" ? "👥 community" : "🔑 admin"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => avviaModifica(p)}
                            className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium">
                            ✏️ Modifica
                          </button>
                          <button onClick={() => elimina(p.id)}
                            className="text-xs px-2.5 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                {prodottiFiltrati.length} prodotti{filtro ? " (filtrati)" : ""} · {prodotti.filter(p => p.inserito_da === "community").length} dalla community
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
